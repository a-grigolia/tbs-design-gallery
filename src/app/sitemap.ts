import type { MetadataRoute } from 'next'

import { VENDOR_CATEGORIES, vendorHref } from '@/lib/categories'
import { getPayload } from '@/lib/payload'
import { SITE_URL } from '@/lib/site'

export const revalidate = 300

const STATIC_PATHS = [
  '/',
  ...VENDOR_CATEGORIES.map((category) => `/${category.value}`),
  '/blog',
  '/book',
  '/contact',
  '/privacy-policy',
]

// URLs are always the canonical origin, whichever host served the request.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()
  const [vendors, posts] = await Promise.all([
    payload.find({
      collection: 'vendors',
      where: {
        and: [{ active: { equals: true } }, { _status: { equals: 'published' } }],
      },
      select: { slug: true, primaryCategory: true, updatedAt: true },
      depth: 0,
      pagination: false,
      sort: 'name',
    }),
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
      depth: 0,
      pagination: false,
      sort: '-publishedAt',
    }),
  ])

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path === '/' ? '' : path}` })),
    ...vendors.docs.map((vendor) => ({
      url: `${SITE_URL}${vendorHref(vendor)}`,
      lastModified: vendor.updatedAt,
    })),
    ...posts.docs.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ]
}
