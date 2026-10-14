import { expect, test } from '@playwright/test'

import { redirects } from '../../src/redirects'
import { SITE_URL } from '../../src/lib/site'

// Local only: the live-host branch is exercised by overriding the Host header.
const BASE_URL = 'http://localhost:3000'

const sourcePatterns = redirects.map(
  ({ source }) => new RegExp(`^${source.replace(/:\w+/g, '[^/]+')}$`),
)

test.describe('robots.txt', () => {
  test('blocks everything on a non-live host', async ({ request }) => {
    const body = await (await request.get(`${BASE_URL}/robots.txt`)).text()
    expect(body).toMatch(/^Disallow: \/$/m)
    expect(body).not.toContain('Sitemap:')
  })

  test('allows the site but not /admin or /api on the live host', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/robots.txt`, {
      headers: { host: 'www.tbsdesigngallery.com' },
    })
    const body = await res.text()
    expect(body).not.toMatch(/^Disallow: \/$/m)
    expect(body).toMatch(/^Disallow: \/admin$/m)
    expect(body).toMatch(/^Disallow: \/api$/m)
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
  })
})

test.describe('sitemap.xml', () => {
  test.describe.configure({ mode: 'serial', timeout: 300_000 })

  test('lists only canonical, live, non-redirected URLs', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/sitemap.xml`)
    expect(res.status()).toBe(200)

    const urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(urls.length).toBeGreaterThan(0)
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls.filter((url) => !url.startsWith(SITE_URL))).toEqual([])

    const paths = urls.map((url) => url.slice(SITE_URL.length) || '/')
    expect(paths.filter((path) => sourcePatterns.some((re) => re.test(path)))).toEqual([])

    // Serial to stay inside the database pooler's connection limit.
    const failures: string[] = []
    for (const path of paths) {
      const page = await request.get(`${BASE_URL}${path}`, { maxRedirects: 0 })
      if (page.status() !== 200) failures.push(`${path} → ${page.status()}`)
    }
    expect(failures).toEqual([])
  })
})
