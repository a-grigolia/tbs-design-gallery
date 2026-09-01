import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { CategoryVendorGrid } from '@/components/vendor/CategoryVendorGrid'
import { mediaUrl } from '@/components/vendor/media'
import { TickRule } from '@/components/vendor/TickRule'
import { VendorAbout } from '@/components/vendor/VendorAbout'
import { VendorCta } from '@/components/vendor/VendorCta'
import { VendorGallery } from '@/components/vendor/VendorGallery'
import { VendorHero } from '@/components/vendor/VendorHero'
import { categoryLabel, isVendorCategory } from '@/lib/categories'
import { getPayload } from '@/lib/payload'
import { vendorMetaDescription, vendorMetaTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Params = Promise<{ category: string; slug: string }>

// Not filtered on `active`: inactive vendors stay resolvable at their URL,
// they are only excluded from listings (grid below, homepage, indexes).
const fetchVendor = cache(async (slug: string) => {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'vendors',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export function generateStaticParams() {
  // Do not open Postgres during `next build`. The session pooler is shared
  // with live lambdas; a prerender here is what starved deploys. Pages
  // resolve on first request via dynamicParams.
  return []
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params
  if (!isVendorCategory(category)) return {}
  const vendor = await fetchVendor(slug)
  if (!vendor || vendor.primaryCategory !== category) return {}

  const title = vendor.seoTitle ?? vendorMetaTitle(vendor.name)
  const description = vendor.seoDescription ?? vendorMetaDescription(vendor.name, category)
  const ogImage = mediaUrl(vendor.heroImage, 'hero')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

export default async function VendorPage({ params }: { params: Params }) {
  const { category, slug } = await params
  if (!isVendorCategory(category)) notFound()

  const vendor = await fetchVendor(slug)
  // One page, one URL: a vendor listed in several categories only resolves
  // under its primaryCategory.
  if (!vendor || vendor.primaryCategory !== category) notFound()

  const payload = await getPayload()
  const { docs: categoryVendors } = await payload.find({
    collection: 'vendors',
    where: {
      and: [
        { categories: { contains: category } },
        { active: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    depth: 1,
    limit: 100,
    sort: 'name',
  })

  const label = categoryLabel(category)

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      <SectionBand>
        <BlueprintColumn>
          <VendorHero vendor={vendor} />
          <TickRule label={`About ${vendor.name}`} />
          <VendorAbout vendor={vendor} />
          <VendorGallery vendor={vendor} />
        </BlueprintColumn>
      </SectionBand>

      <SectionBand>
        <BlueprintColumn className="pb-section">
          <VendorCta category={category} />
          <TickRule label={`All ${label.toLowerCase()}`} />
          <CategoryVendorGrid vendors={categoryVendors} currentId={vendor.id} />
        </BlueprintColumn>
      </SectionBand>

      <SectionBand className="border-b">
        <BlueprintColumn>
          <SiteFooter />
        </BlueprintColumn>
      </SectionBand>
    </div>
  )
}
