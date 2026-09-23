import type { VendorCategory } from '@/lib/categories'

import React from 'react'

import { BlueprintColumn, JoineryTee, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { vendorHref } from '@/lib/categories'
import { getPayload } from '@/lib/payload'
import { buildCategoryTiles } from './categoryTiles'
import { CategoryVendorGrid } from './CategoryVendorGrid'
import { LightboxGallery, type GalleryImage } from './LightboxGallery'
import { TickRule } from './TickRule'
import { VendorCta } from './VendorCta'
import { splitColumns, toGalleryImage } from './VendorGallery'

/** Shared layout for the five `/{category}` landing pages (Figma 677:6066). */
export async function CategoryPage({
  category,
  title,
  video,
  heading,
  body,
  gridLabel,
}: {
  category: VendorCategory
  title: string
  video: { src: string; poster: string }
  heading: string
  body: React.ReactNode
  gridLabel: string
}) {
  const payload = await getPayload()
  const { docs: vendors } = await payload.find({
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

  const images = buildCategoryTiles(vendors).flatMap(({ media, vendor }) => {
    const image = toGalleryImage(media)
    return image ? [{ ...image, caption: { label: vendor.name, href: vendorHref(vendor) } }] : []
  })
  const columns = splitColumns<GalleryImage>(images, (image) => image.caption?.href ?? '').filter(
    (column) => column.length > 0,
  )

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      {/*
       * Static stand-in for the homepage hero's settled frame: the same
       * gutters (8/32/24) and inner padding (12/24), and the same media
       * height rule as Hero's measure() — 2:1, at least 480px, but capped so
       * the frame plus a 96px runway fits under the 60px header. 50cqw is
       * half the frame's content width, i.e. half the media width.
       * border-b closes the band — the intro section has no hairline of its own.
       */}
      <section className="w-full border-t border-b border-hairline px-2 sm:px-8 lg:px-6">
        <div className="@container relative w-full border-r border-l border-hairline p-[12px] sm:p-[24px]">
          <JoineryTee className="-top-[1px] -left-[6.5px] rotate-180" />
          <JoineryTee className="-top-[1px] -right-[6.5px] rotate-180" />
          <JoineryTee className="-bottom-[1px] -left-[6.5px]" />
          <JoineryTee className="-bottom-[1px] -right-[6.5px]" />
          <div className="relative h-[min(max(50cqw,480px),calc(100svh_-_182px))] w-full overflow-hidden rounded-[24px] sm:h-[min(max(50cqw,480px),calc(100svh_-_206px))]">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={video.poster}
              className="absolute inset-0 size-full object-cover"
            >
              <source src={video.src} type="video/mp4" />
            </video>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[16px]">
              <h1 className="type-hero-heading text-center text-white">{title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* SectionBand's layout without its border-t: the hero band above already drew this hairline. */}
      <div className="flex w-full flex-col items-center px-2 sm:px-8 lg:px-12">
        <BlueprintColumn corner="tee">
          <div className="flex w-full flex-col items-center px-gutter-sm py-[120px] lg:px-gutter">
            <div className="flex w-full max-w-[384px] flex-col gap-[16px]">
              <h2 className="type-section-heading text-ink">{heading}</h2>
              <p className="text-[14px] leading-[18px] text-ink-50">{body}</p>
            </div>
          </div>

          {columns.length > 0 && (
            <LightboxGallery className="p-[12px] sm:p-[24px]" columns={columns} />
          )}
        </BlueprintColumn>
      </div>

      <SectionBand>
        <BlueprintColumn className="pb-section">
          <VendorCta category={category} />
          <TickRule label={gridLabel} />
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
