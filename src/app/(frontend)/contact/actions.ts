'use server'

import { I_AM_A_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/components/contact/options'
import { getPayload } from '@/lib/payload'

export type ContactFormData = {
  iAmA: string
  projectType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  zipcode: string
  message: string
  /** Honeypot — hidden from humans; any value means a bot filled it. */
  company: string
}

export type ContactFormResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REQUIRED_TEXT = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'city',
  'zipcode',
  'message',
] as const

/**
 * Writes a contact-form submission through the local API (bypasses the
 * collection's admin-only access control). The Zoho CRM push will slot in
 * here after the create, once that integration is built.
 */
export async function submitContact(data: ContactFormData): Promise<ContactFormResult> {
  // Bots that fill the hidden field get a silent "success" — no record, no signal.
  if (data.company) return { ok: true }

  const iAmA = I_AM_A_OPTIONS.find((option) => option.value === data.iAmA)?.value
  const projectType = PROJECT_TYPE_OPTIONS.find((option) => option.value === data.projectType)?.value
  const allTextPresent = REQUIRED_TEXT.every((field) => data[field]?.trim())

  if (!iAmA || !projectType || !allTextPresent) {
    return { ok: false, error: 'Please fill out every field.' }
  }
  if (!EMAIL_RE.test(data.email.trim())) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        iAmA,
        projectType,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        zipcode: data.zipcode.trim(),
        message: data.message.trim(),
      },
    })
  } catch (error) {
    console.error('Contact submission failed:', error)
    return { ok: false, error: 'Something went wrong while sending your message. Please try again.' }
  }

  return { ok: true }
}
