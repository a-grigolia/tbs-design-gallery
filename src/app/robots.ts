import type { MetadataRoute } from 'next'

import { headers } from 'next/headers'

import { isLiveHost, SITE_URL } from '@/lib/site'

// Decided per request from the Host header: VERCEL_ENV can't tell the live domain
// from the tbs-design-gallery.vercel.app alias, which serves the same deployment.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')

  if (!isLiveHost(host)) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
