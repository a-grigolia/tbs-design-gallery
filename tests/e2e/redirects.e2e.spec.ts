import { expect, test } from '@playwright/test'

import { VENDOR_CATEGORIES } from '../../src/lib/categories'
import { REDIRECT_SAMPLES, redirects } from '../../src/redirects'

// Point at a preview deploy with REDIRECT_BASE_URL=https://... to check before cutover.
const BASE_URL = process.env.REDIRECT_BASE_URL ?? 'http://localhost:3000'

const isWildcard = (source: string) => source.includes(':')

const cases = redirects.flatMap(({ source, destination }) =>
  (isWildcard(source) ? (REDIRECT_SAMPLES[source] ?? []) : [source]).map((url) => ({
    url,
    destination,
  })),
)

const destinations = [...new Set(redirects.map((r) => r.destination))]

test.describe('Redirect map', () => {
  test('sources are unique', () => {
    const sources = redirects.map((r) => r.source)
    expect(sources.filter((s, i) => sources.indexOf(s) !== i)).toEqual([])
  })

  test('no destination is also a source', () => {
    const sources = new Set(redirects.map((r) => r.source))
    expect(destinations.filter((d) => sources.has(d))).toEqual([])
  })

  test('no wildcard sits under an active category', () => {
    const categories = VENDOR_CATEGORIES.map((c) => c.value)
    const offending = redirects
      .map((r) => r.source)
      .filter((s) => isWildcard(s) && categories.some((c) => s.startsWith(`/${c}/`)))
    expect(offending).toEqual([])
  })

  test('every wildcard has a sample URL', () => {
    const missing = redirects
      .map((r) => r.source)
      .filter((s) => isWildcard(s) && !REDIRECT_SAMPLES[s]?.length)
    expect(missing).toEqual([])
  })
})

test.describe('Redirect responses', () => {
  // Serial keeps the dev server from opening more DB connections than the pooler allows.
  test.describe.configure({ mode: 'serial', timeout: 120_000 })

  test('every source answers 308 with the expected Location', async ({ request }) => {
    const failures: string[] = []
    for (const { url, destination } of cases) {
      const res = await request.get(`${BASE_URL}${url}`, { maxRedirects: 0 })
      const location = res.headers()['location']
      const path = location ? new URL(location, BASE_URL).pathname : null
      if (res.status() !== 308 || path !== destination) {
        failures.push(
          `${url} → ${res.status()} ${location ?? '(no location)'}, want ${destination}`,
        )
      }
    }
    expect(failures).toEqual([])
  })

  test('every destination answers 200', async ({ request }) => {
    const failures: string[] = []
    for (const destination of destinations) {
      const res = await request.get(`${BASE_URL}${destination}`, { maxRedirects: 0 })
      if (res.status() !== 200) failures.push(`${destination} → ${res.status()}`)
    }
    expect(failures).toEqual([])
  })
})
