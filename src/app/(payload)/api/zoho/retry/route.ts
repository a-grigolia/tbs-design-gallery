import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'
import { deliverContactToZoho } from '@/lib/zoho'

const BATCH_SIZE = 25

// Vercel Cron sends CRON_SECRET as a bearer token. The same protected route
// accepts an optional submission ID for deliberate manual retries.
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`)
}

async function retryZohoDeliveries(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Retry endpoint is not configured.' }, { status: 503 })
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const requestedId = request.nextUrl.searchParams.get('id')
  const parsedId = requestedId ? Number(requestedId) : null
  if (requestedId && (!Number.isInteger(parsedId) || (parsedId ?? 0) <= 0)) {
    return NextResponse.json({ error: 'Invalid submission ID.' }, { status: 400 })
  }

  const payload = await getPayload()
  // The Hobby plan runs this recovery pass daily; normal delivery still
  // happens immediately after submission through Next's after() callback.
  const ids = parsedId
    ? [parsedId]
    : (
        await payload.find({
          collection: 'contact-submissions',
          overrideAccess: true,
          limit: BATCH_SIZE,
          sort: 'createdAt',
          where: {
            zohoStatus: {
              in: ['pending', 'failed'],
            },
          },
        })
      ).docs.map((submission) => submission.id)

  let delivered = 0
  let failed = 0
  for (const id of ids) {
    try {
      if (await deliverContactToZoho(id)) delivered += 1
      else failed += 1
    } catch (error) {
      failed += 1
      console.error(`Zoho retry failed for contact submission ${id}:`, error)
    }
  }

  return NextResponse.json({ processed: ids.length, delivered, failed })
}

export const GET = retryZohoDeliveries
export const POST = retryZohoDeliveries
