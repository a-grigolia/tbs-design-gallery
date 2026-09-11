import type { ContactSubmission } from '@/payload-types'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { californiaAddressFromPlace } from '@/lib/address'

const payloadMocks = vi.hoisted(() => ({
  findByID: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn(async () => payloadMocks),
}))

import { deliverContactToZoho, zohoLeadPayload } from '@/lib/zoho'

const submission = {
  id: 42,
  iAmA: 'interior-designer',
  projectType: 'residential',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '650-555-0100',
  address: '3283 De La Cruz Blvd, Santa Clara, CA 95054, USA',
  street: '3283 De La Cruz Blvd',
  city: 'Santa Clara',
  state: 'CA',
  zipcode: '95054',
  googlePlaceId: 'test-place-id',
  message: 'Showroom consultation',
  zohoStatus: 'pending',
  zohoAttempts: 0,
  updatedAt: '2026-09-11T00:00:00.000Z',
  createdAt: '2026-09-11T00:00:00.000Z',
} satisfies ContactSubmission

describe('contact address and Zoho delivery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    payloadMocks.findByID.mockResolvedValue(submission)
    payloadMocks.update.mockResolvedValue(submission)
    process.env.ZOHO_FLOW_WEBHOOK_URL = 'https://example.com/zoho-webhook'
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.ZOHO_FLOW_WEBHOOK_URL
  })

  it('extracts a complete California address from Google components', () => {
    expect(
      californiaAddressFromPlace({
        id: 'test-place-id',
        formattedAddress: submission.address,
        addressComponents: [
          { longText: '3283', shortText: '3283', types: ['street_number'] },
          {
            longText: 'De La Cruz Boulevard',
            shortText: 'De La Cruz Blvd',
            types: ['route'],
          },
          { longText: 'Santa Clara', shortText: 'Santa Clara', types: ['locality'] },
          {
            longText: 'California',
            shortText: 'CA',
            types: ['administrative_area_level_1'],
          },
          { longText: '95054', shortText: '95054', types: ['postal_code'] },
        ],
      }),
    ).toEqual({
      address: submission.address,
      street: '3283 De La Cruz Boulevard',
      city: 'Santa Clara',
      state: 'CA',
      zipcode: '95054',
      googlePlaceId: 'test-place-id',
    })
  })

  it('rejects a selected address outside California', () => {
    expect(
      californiaAddressFromPlace({
        id: 'test-place-id',
        formattedAddress: '123 Main St, Reno, NV 89501, USA',
        addressComponents: [
          { longText: '123', shortText: '123', types: ['street_number'] },
          { longText: 'Main Street', shortText: 'Main St', types: ['route'] },
          { longText: 'Reno', shortText: 'Reno', types: ['locality'] },
          {
            longText: 'Nevada',
            shortText: 'NV',
            types: ['administrative_area_level_1'],
          },
          { longText: '89501', shortText: '89501', types: ['postal_code'] },
        ],
      }),
    ).toBeNull()
  })

  it('maps internal select values to Zoho display labels', () => {
    expect(zohoLeadPayload(submission)).toEqual({
      submissionId: 42,
      firstName: 'Ada',
      lastName: 'Lovelace',
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '650-555-0100',
      contactType: 'Interior Designer',
      projectType: 'Residential',
      address: submission.address,
      street: submission.street,
      city: submission.city,
      state: 'California',
      zipcode: submission.zipcode,
      description: submission.message,
    })
  })

  it('marks an acknowledged Flow webhook as delivered', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 200 }))

    await expect(deliverContactToZoho(submission.id)).resolves.toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(payloadMocks.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ zohoStatus: 'delivered', zohoLastError: null }),
      }),
    )
  })

  it('retains the local row and marks a rejected webhook as failed', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    await expect(deliverContactToZoho(submission.id)).resolves.toBe(false)
    expect(payloadMocks.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          zohoStatus: 'failed',
          zohoLastError: 'Zoho Flow returned HTTP 500.',
        }),
      }),
    )
  })
})
