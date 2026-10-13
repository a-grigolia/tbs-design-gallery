import type { Metadata } from 'next'
import React from 'react'

import type { SpecificationVendor } from '@/components/landing/SpecificationSection'

import { BlueprintColumn, SectionBand, SectionRule } from '@/components/landing/Blueprint'
import { GallerySection } from '@/components/landing/GallerySection'
import { Hero } from '@/components/landing/Hero'
import { InstallationSection } from '@/components/landing/InstallationSection'
import { PartnersSection } from '@/components/landing/PartnersSection'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { SpecificationSection } from '@/components/landing/SpecificationSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { vendorHeroData } from '@/components/vendor/VendorHero'
import { getPayload } from '@/lib/payload'

export const revalidate = 300

const TITLE = 'Bay Area Home Design Studio | TBS Design Gallery'
const DESCRIPTION =
  'Bay area home design firm, TBS Design Gallery is a multi-line showroom in Santa Clara featuring kitchen cabinetry, windows, doors, luxury appliances, and outdoor structures.'

// The share image comes from opengraph-image.jpg / twitter-image.jpg in this folder.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default async function HomePage() {
  const payload = await getPayload()
  const { docs: vendors } = await payload.find({
    collection: 'vendors',
    where: {
      and: [{ active: { equals: true } }, { _status: { equals: 'published' } }],
    },
    depth: 1,
    limit: 100,
    sort: 'name',
  })
  const specificationVendors: SpecificationVendor[] = vendors.map((vendor) => ({
    id: vendor.id,
    slug: vendor.slug,
    primaryCategory: vendor.primaryCategory,
    categories: vendor.categories,
    ...vendorHeroData(vendor),
  }))

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader overlayAtTop />
      <Hero />

      <SectionBand>
        {/* 72px bottom per the Services Figma (990:1090), not the usual pb-section. */}
        <BlueprintColumn corner="tee" className="pb-[72px]">
          <GallerySection />
          <SectionRule number="02 Products" />
          <SpecificationSection vendors={specificationVendors} />
          <SectionRule number="03 Services" />
          <InstallationSection />
        </BlueprintColumn>
      </SectionBand>

      <SectionBand>
        <BlueprintColumn>
          <ProcessSection />
        </BlueprintColumn>
      </SectionBand>

      <SectionBand>
        <BlueprintColumn>
          <TestimonialsSection />
        </BlueprintColumn>
      </SectionBand>

      <SectionBand>
        <BlueprintColumn className="pb-section">
          <PartnersSection vendors={vendors} />
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
