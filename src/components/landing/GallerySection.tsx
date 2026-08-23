import React from 'react'

import { MeasureRule, SectionRule } from './Blueprint'
import { Carousel } from './Carousel'
import { SHOWROOM_SLIDES } from './content'

const SHOWROOM_SERVICES = [
  'Private tours',
  'Product library',
  'Meeting rooms',
  'Client presentations',
  'Industry events',
]

export function GallerySection() {
  return (
    <>
      <div className="flex w-full flex-col items-start">
        <MeasureRule label="What we do" />
        <div className="flex w-full items-center justify-center px-gutter-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="TBS Design Gallery"
            src="/landing/tbs-union.svg"
            className="h-[144px] w-[131.884px] shrink-0 dark:invert"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-[16px] px-4 pt-[48px] pb-[32px] text-center">
        <h2 className="max-w-[384px] font-display text-[36px] leading-[46px] font-bold text-ink">
          More than a showroom
        </h2>
        <p className="max-w-[384px] text-[14px] leading-[18px] text-ink-50">
          Curated products, technical expertise, installation, and service - all brought together in
          one destination.
        </p>
      </div>

      <SectionRule number="01" />

      <div className="flex w-full flex-col gap-[48px] px-gutter-sm pt-[32px] pb-[18px] lg:flex-row lg:items-stretch lg:px-gutter">
        <div className="flex flex-1 flex-col justify-between gap-[48px] pt-[16px] lg:pb-[54px]">
          <div className="flex flex-col gap-[8px]">
            <p className="text-[16px] leading-normal text-ink">Showroom &amp; Product Library</p>
            <p className="max-w-[300px] text-[14px] leading-[18px] text-ink-50">
              Experience full-scale installations, working products, materials, and finishes across
              three distinct pavilions in our 8,000-square-foot gallery in Santa Clara.
            </p>
          </div>
          <div className="font-hanken text-[20px] leading-[26px] text-ink">
            {SHOWROOM_SERVICES.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[712px]">
          <Carousel
            slides={SHOWROOM_SLIDES.map((slide) => (
              <div
                key={slide.image + slide.caption}
                className="relative flex h-[320px] w-full flex-col items-start overflow-hidden rounded-[24px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.3)] sm:h-[440px]"
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
            ))}
          />
        </div>
      </div>
    </>
  )
}
