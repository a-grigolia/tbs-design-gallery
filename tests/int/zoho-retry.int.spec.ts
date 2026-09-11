import { NextRequest } from 'next/server'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  deliver: vi.fn(),
  find: vi.fn(),
}))

vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn(async () => ({ find: mocks.find })),
}))

vi.mock('@/lib/zoho', () => ({
  deliverContactToZoho: mocks.deliver,
}))

import { GET } from '@/app/(payload)/api/zoho/retry/route'

describe('Zoho retry endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CRON_SECRET = 'test-cron-secret'
    mocks.deliver.mockResolvedValue(true)
  })

  afterEach(() => {
    delete process.env.CRON_SECRET
  })

  it('rejects requests without the cron secret', async () => {
    const response = await GET(new NextRequest('http://localhost/api/zoho/retry'))

    expect(response.status).toBe(401)
    expect(mocks.deliver).not.toHaveBeenCalled()
  })

  it('manually retries one requested submission', async () => {
    const response = await GET(
      new NextRequest('http://localhost/api/zoho/retry?id=42', {
        headers: { authorization: 'Bearer test-cron-secret' },
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      processed: 1,
      delivered: 1,
      failed: 0,
    })
    expect(mocks.deliver).toHaveBeenCalledWith(42)
  })

  it('retries pending and failed submissions in a batch', async () => {
    mocks.find.mockResolvedValue({ docs: [{ id: 7 }, { id: 8 }] })
    mocks.deliver.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    const response = await GET(
      new NextRequest('http://localhost/api/zoho/retry', {
        headers: { authorization: 'Bearer test-cron-secret' },
      }),
    )

    await expect(response.json()).resolves.toEqual({
      processed: 2,
      delivered: 1,
      failed: 1,
    })
    expect(mocks.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { zohoStatus: { in: ['pending', 'failed'] } },
      }),
    )
  })
})
