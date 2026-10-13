import type { Metadata } from 'next'

import type { Post } from '@/payload-types'

import { mediaUrl } from '@/components/vendor/media'

import type { VendorCategory } from './categories'

// Vendor page metadata, preserved verbatim from the Webflow collection
// templates' SEO settings. These strings carry the live site's ranking
// history — don't reword them casually. Per-vendor seoTitle/seoDescription
// fields in Payload override these patterns when set.

/**
 * Site-wide share image. Pages without their own `openGraph` inherit it from
 * `(frontend)/opengraph-image.jpg`, but a page-level `openGraph` object
 * replaces that inheritance wholesale, so pages that set one must fall back
 * to this explicitly.
 */
export const DEFAULT_SHARE_IMAGE = {
  url: '/og-image.jpg',
  width: 1024,
  height: 537,
  alt: 'TBS Design Gallery showroom in Santa Clara',
}

export const vendorMetaTitle = (name: string): string => `${name} at TBS Design Gallery`

// The trailing phrase varies per Webflow collection. The
// architectural-elements-furniture collection never had SEO settings in
// Webflow; its phrase follows the same template as the others.
const CATEGORY_META_PHRASES: Record<VendorCategory, string> = {
  'windows-doors': 'for your next windows & doors project',
  appliances: 'for your home appliances',
  'outdoor-living': 'for your next outdoor project',
  'custom-cabinetry': 'for your next custom cabinetry project',
  'architectural-elements-furniture': 'for your next architectural elements or furniture project',
}

export const vendorMetaDescription = (name: string, category: VendorCategory): string =>
  `Browse ${name} and other TBS Design Gallery partners ${CATEGORY_META_PHRASES[category]}`

/**
 * Post metadata resolution, mirroring the live Webflow template. Note that
 * og:description falls back to the excerpt rather than seo.description — that
 * matches Webflow's "same as SEO meta description" box being left unchecked
 * on purpose, and it reads like a bug otherwise. Twitter mirrors Open Graph.
 */
export const postMetadata = (post: Post): Metadata => {
  const title = post.seo?.title ?? post.title
  const description = post.seo?.description ?? post.excerpt
  const ogTitle = post.seo?.ogTitle ?? post.seo?.title ?? post.title
  const ogDescription = post.seo?.ogDescription ?? post.excerpt
  const ogImage = mediaUrl(post.seo?.ogImage, 'hero') ?? mediaUrl(post.coverImage, 'hero')

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: [ogImage ? { url: ogImage } : DEFAULT_SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage ? { url: ogImage } : DEFAULT_SHARE_IMAGE],
    },
  }
}
