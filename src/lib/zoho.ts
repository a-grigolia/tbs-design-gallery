import type { ContactSubmission } from '@/payload-types'

import { I_AM_A_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/components/contact/options'
import { getPayload } from '@/lib/payload'

const REQUEST_TIMEOUT_MS = 8_000

export type ZohoLeadPayload = {
  submissionId: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  contactType: string
  projectType: string
  address: string
  street: string
  city: string
  state: string
  zipcode: string
  description: string
}

function optionLabel(options: readonly { label: string; value: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}

export function zohoLeadPayload(submission: ContactSubmission): ZohoLeadPayload {
  return {
    submissionId: submission.id,
    firstName: submission.firstName,
    lastName: submission.lastName,
    fullName: `${submission.firstName} ${submission.lastName}`,
    email: submission.email,
    phone: submission.phone,
    contactType: optionLabel(I_AM_A_OPTIONS, submission.iAmA),
    projectType: optionLabel(PROJECT_TYPE_OPTIONS, submission.projectType),
    address: submission.address,
    street: submission.street,
    city: submission.city,
    state: submission.state === 'CA' ? 'California' : submission.state,
    zipcode: submission.zipcode,
    description: submission.message,
  }
}

export async function deliverContactToZoho(submissionId: number): Promise<boolean> {
  const payload = await getPayload()
  const submission = await payload.findByID({
    collection: 'contact-submissions',
    id: submissionId,
    overrideAccess: true,
  })

  if (submission.zohoStatus === 'delivered') return true

  const attemptedAt = new Date().toISOString()
  const attempts = submission.zohoAttempts + 1
  const webhookUrl = process.env.ZOHO_FLOW_WEBHOOK_URL

  await payload.update({
    collection: 'contact-submissions',
    id: submissionId,
    overrideAccess: true,
    data: {
      zohoStatus: 'pending',
      zohoAttempts: attempts,
      zohoLastAttemptAt: attemptedAt,
      zohoLastError: null,
    },
  })

  try {
    if (!webhookUrl) throw new Error('Zoho Flow webhook is not configured.')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(zohoLeadPayload(submission)),
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      throw new Error(`Zoho Flow returned HTTP ${response.status}.`)
    }

    await payload.update({
      collection: 'contact-submissions',
      id: submissionId,
      overrideAccess: true,
      data: {
        zohoStatus: 'delivered',
        zohoLastError: null,
      },
    })
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Zoho Flow delivery error.'
    await payload.update({
      collection: 'contact-submissions',
      id: submissionId,
      overrideAccess: true,
      data: {
        zohoStatus: 'failed',
        zohoLastError: message.slice(0, 500),
      },
    })
    console.error(`Zoho Flow delivery failed for contact submission ${submissionId}:`, message)
    return false
  }
}
