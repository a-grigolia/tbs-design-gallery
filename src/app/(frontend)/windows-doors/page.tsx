import type { Metadata } from 'next'

import React from 'react'

import {
  BlueprintColumn,
  JoineryTee,
  MeasureRule,
  SectionBand,
} from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { CategoryVendorGrid } from '@/components/vendor/CategoryVendorGrid'
import { TickRule } from '@/components/vendor/TickRule'
import { VendorCta } from '@/components/vendor/VendorCta'
import { getPayload } from '@/lib/payload'

export const revalidate = 300

// Title and description preserved verbatim from the live Webflow page — they
// carry the site's ranking history, don't reword casually.
export const metadata: Metadata = {
  title: 'Santa Clara Windows and Doors | Luxury Brands',
  description:
    'TBS Design Gallery offers steel, aluminum, and wood window and door installation solutions for luxury homes throughout the San Francisco Bay Area.',
}

// Gallery images live in the public Supabase media bucket (names from the
// Figma canvas 677:6065); aspect ratios are the files' real dimensions.
const MEDIA = 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media'

const GALLERY_COLUMNS: { src: string; alt: string; aspect: string }[][] = [
  [
    { src: `${MEDIA}/oikos-caldi-oro.jpg`, alt: 'Oikos Caldi Oro entry door', aspect: 'aspect-[2048/1367]' },
    { src: `${MEDIA}/oikos-Immagine-pagina-pubblicitaria.jpg`, alt: 'Oikos pivot entry door', aspect: 'aspect-[1843/2048]' },
    { src: `${MEDIA}/LaCantina-lakeview.jpg`, alt: 'LaCantina folding doors with lake view', aspect: 'aspect-[1440/825]' },
  ],
  [
    { src: `${MEDIA}/marvin-outdoor-house.jpg`, alt: 'Marvin windows on a modern house', aspect: 'aspect-[2048/1365]' },
    { src: `${MEDIA}/oikos-londra-01.jpg`, alt: 'Oikos Londra facade', aspect: 'aspect-[2048/1330]' },
    { src: `${MEDIA}/trustile-med-arched-doorway.jpg`, alt: 'TruStile arched doorway', aspect: 'aspect-[1250/1280]' },
  ],
]

export default async function WindowsDoorsPage() {
  const payload = await getPayload()
  const { docs: vendors } = await payload.find({
    collection: 'vendors',
    where: {
      and: [
        { categories: { contains: 'windows-doors' } },
        { active: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    depth: 1,
    limit: 100,
    sort: 'name',
  })

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      {/*
       * Hero from Figma 677:6065: same drafting frame as the homepage hero,
       * but the hairline column is ((100vw-1200px)/2)+1200px wide so its
       * hairlines sit midway between the viewport edge and the 1200px content
       * column. The min() keeps homepage-style gutters once that formula
       * outgrows the viewport. border-b closes the band — the intro section
       * below has no band hairline of its own.
       */}
      <section className="w-full border-t border-b border-hairline px-4 sm:px-8">
        <div className="relative mx-auto w-full border-r border-l border-hairline p-[16px] sm:p-[24px] lg:w-[min(100%,50vw+600px)]">
          <JoineryTee className="-top-[1px] -left-[6.5px] rotate-180" />
          <JoineryTee className="-top-[1px] -right-[6.5px] rotate-180" />
          <JoineryTee className="-bottom-[1px] -left-[6.5px]" />
          <JoineryTee className="-bottom-[1px] -right-[6.5px]" />
          <div className="relative min-h-[480px] w-full overflow-hidden rounded-[24px] lg:aspect-[2/1] lg:min-h-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/landing/hero-poster.png"
              className="absolute inset-0 size-full object-cover"
            >
              <source
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/renson-showcase-hd-1.mp4`}
                type="video/mp4"
              />
            </video>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-black/20 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),transparent_46%)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[16px]">
              <h1 className="text-center font-display text-[clamp(2rem,1.25rem+2.5vw,3.5rem)] leading-none font-semibold text-white">
                Windows &amp; Doors
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* SectionBand's layout without its border-t: the hero band above already drew this hairline. */}
      <div className="flex w-full flex-col items-center px-4 sm:px-8 lg:px-12">
        <BlueprintColumn corner="tee" showMeasureMark>
          <MeasureRule label="Product Category" />

          <div className="flex w-full flex-col items-center px-gutter-sm py-[24px] lg:px-gutter">
            <div className="flex w-full max-w-[384px] flex-col gap-[16px]">
              <h2 className="font-display text-[36px] leading-[46px] font-bold text-ink">
                Surround yourself with natural beauty
              </h2>
              <p className="text-[14px] leading-[18px] text-ink-50">
                In line with the biophilic method of architecture, in which spaces are designed to
                blend indoors and outdoors seamlessly, TBS has partnered with product manufacturers
                that are on the cutting edge of producing windows and doors that are bigger,
                stronger, and more durable. Companies like Reynaers, Euroline, and TruStile
                integrate technology to allow for ever-thinner frames while still maintaining a
                level of style and elegance that enhances the beauty of any home. So no need to
                feel boxed in; at TBS you&rsquo;ll find windows and doors that will set your spirit
                free.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-[8px] p-[16px] sm:p-[24px] md:flex-row md:items-start">
            {GALLERY_COLUMNS.map((column, index) => (
              <div key={index} className="flex min-w-0 flex-1 flex-col gap-[8px]">
                {column.map((image) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={image.src}
                    alt={image.alt}
                    src={image.src}
                    loading="lazy"
                    className={`w-full rounded-[16px] object-cover ${image.aspect}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </BlueprintColumn>
      </div>

      <SectionBand>
        <BlueprintColumn className="pb-section">
          <VendorCta category="windows-doors" />
          <TickRule label="All windows & doors" />
          <CategoryVendorGrid vendors={vendors} />
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
