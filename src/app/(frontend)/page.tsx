import React from 'react'

import type { Vendor } from '@/payload-types'

import { BlueprintColumn, SectionBand, SectionRule } from '@/components/landing/Blueprint'
import { GallerySection } from '@/components/landing/GallerySection'
import { Hero } from '@/components/landing/Hero'
import { InstallationSection } from '@/components/landing/InstallationSection'
import { PartnersSection } from '@/components/landing/PartnersSection'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SpecificationSection } from '@/components/landing/SpecificationSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { getPayload } from '@/lib/payload'

export const revalidate = 300

export default async function HomePage() {
  // Fail-soft like generateStaticParams: the pooler is shared and tiny, and
  // this page prerenders at build time. A missed connection should cost the
  // partner grid for one ISR window (5 min), not the whole deploy.
  let vendors: Vendor[] = []
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'vendors',
      where: {
        and: [{ active: { equals: true } }, { _status: { equals: 'published' } }],
      },
      depth: 1,
      limit: 100,
      sort: 'name',
    })
    vendors = result.docs
  } catch (error) {
    console.error('HomePage: rendering without vendors', error)
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <Hero />

      <SectionBand>
        <BlueprintColumn showMeasureMark corner="tee" className="pb-section">
          <GallerySection />
          <SectionRule number="02" />
          <SpecificationSection />
          <SectionRule number="03" />
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
