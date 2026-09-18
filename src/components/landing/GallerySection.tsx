import React from 'react'

import { SectionRule } from './Blueprint'
import { CardCarousel, Carousel } from './Carousel'
import { SHOWROOM_SLIDES } from './content'

const SHOWROOM_SERVICES = [
  'Private tours',
  'Product library',
  'Meeting rooms',
  'Client presentations',
  'Industry events',
]

/** One showroom media card; sizing differs between crossfade and card modes. */
function showroomCard(slide: (typeof SHOWROOM_SLIDES)[number], sizeClasses: string) {
  return (
    <div
      key={slide.image + slide.caption}
      className={`relative flex flex-col items-start overflow-hidden rounded-[24px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.3),0px_2px_3px_rgba(0,0,0,0.15)] ${sizeClasses}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={slide.caption}
        src={slide.image}
        className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[24px] object-cover"
      />
      <div className="relative flex h-[24px] items-center justify-center rounded-[30px] bg-[rgba(246,242,239,0.1)] px-[16px] py-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] backdrop-blur-[7px]">
        <p className="font-figtree text-[12px] leading-[20px] font-semibold whitespace-nowrap text-white">
          {slide.caption}
        </p>
      </div>
    </div>
  )
}

export function GallerySection() {
  return (
    <>
      {/* Intro (Figma 990:986): logo mark over a two-tone paragraph. The
          block centers while the paragraph text stays left-aligned. */}
      <div className="flex w-full flex-col items-center justify-center gap-[48px] px-[24px] py-[120px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="TBS Design Gallery"
          src="/landing/tbs-union.svg"
          className="h-[144px] w-[131.884px] shrink-0 dark:invert"
        />
        <p className="max-w-[554px] text-[20px] leading-[26px] text-ink">
          TBS Design Gallery is your partner from the first showroom visit to the last service
          call.{' '}
          <span className="text-ink-50">
            Architects, builders, interior designers, and homeowners come here for curated
            products, technical expertise, installation, and service.
          </span>
        </p>
      </div>

      <SectionRule number="01 Gallery" />

      {/* Showroom row: fixed 305px text column, flexible media column that
          shrinks with the page. Text keeps the 48px gutter while the media
          side sits at 24px — image gutters are tighter than text site-wide.
          Below lg the row stacks and the crossfade becomes a card carousel. */}
      <div className="flex w-full flex-col gap-[48px] py-[24px] lg:flex-row lg:items-center lg:gap-[48px] lg:pl-gutter lg:pr-[24px]">
        <div className="flex flex-col gap-[48px] px-gutter-sm pt-[16px] lg:w-[305px] lg:shrink-0 lg:justify-between lg:gap-0 lg:self-stretch lg:px-0 lg:pb-[54px]">
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[20px] leading-[26px] text-ink">Showroom</h2>
            <p className="max-w-[300px] text-[14px] leading-[18px] text-ink-50">
              Experience full-scale installations, working products, materials, and finishes across
              three distinct pavilions in our 8,000-square-foot gallery in Santa Clara.
            </p>
          </div>
          <div className="text-[18px] leading-[24px] text-ink">
            {SHOWROOM_SERVICES.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>

        <div className="hidden min-w-px flex-1 lg:block">
          <Carousel slides={SHOWROOM_SLIDES.map((slide) => showroomCard(slide, 'h-[440px] w-full'))} />
        </div>
        <CardCarousel
          className="lg:hidden"
          slides={SHOWROOM_SLIDES.map((slide) => showroomCard(slide, 'h-[384px] w-[320px]'))}
        />
      </div>
    </>
  )
}
