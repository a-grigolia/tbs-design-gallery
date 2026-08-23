'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { Carousel } from './Carousel'
import { CATEGORIES } from './content'

function BrandList({ brands }: { brands: string[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      className="flex w-full flex-col items-start justify-center lg:w-[305px] lg:items-end"
      onMouseLeave={() => setHovered(null)}
    >
      {brands.map((brand) => {
        const isHovered = hovered === brand
        const isDimmed = hovered !== null && !isHovered
        return (
          <div
            key={brand}
            onMouseEnter={() => setHovered(brand)}
            className="relative flex cursor-default items-center justify-end"
          >
            {/* Arrow stays pinned to the right edge; the text slides left of it (14px arrow + 12px gap). */}
            <p
              className={`text-[20px] leading-[26px] text-right whitespace-nowrap transition-[translate,color] duration-250 ease-out ${
                isHovered
                  ? '-translate-x-[26px] font-medium text-ink'
                  : isDimmed
                    ? 'text-ink-40'
                    : 'text-ink'
              }`}
            >
              {brand}
            </p>
            <span
              className={`absolute right-0 h-[10px] w-[14px] transition-opacity duration-250 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src="/landing/arrows-updown.svg" className="block size-full max-w-none dark:invert" />
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function SpecificationSection() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id)
  const active = CATEGORIES.find((category) => category.id === activeId) ?? CATEGORIES[0]

  return (
    <div className="flex w-full flex-col gap-[24px] px-gutter-sm lg:px-gutter">
      <div className="flex w-full flex-col gap-[32px] py-[48px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex flex-col gap-[8px] lg:w-[305px]">
          <p className="text-[16px] leading-normal text-ink">Product Specification</p>
          <p className="text-[14px] leading-normal text-ink-50">
            Explore curated American and European windows, doors, cabinetry, appliances, and outdoor
            living and architectural solutions, selected and specified for your project.
          </p>
        </div>
        <BrandList key={active.id} brands={active.brands} />
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-[24px]">
        <div className="max-w-full overflow-x-auto p-px">
          <div className="flex h-[40px] items-center justify-center gap-[8px] rounded-[44px] border border-hairline">
            {CATEGORIES.map((category) => {
              const isActive = category.id === activeId
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  aria-pressed={isActive}
                  className="group relative flex h-[40px] shrink-0 items-center justify-center gap-[10px] px-[16px] sm:px-[24px]"
                >
                  {/* Pill visual lives on its own layer so the button's footprint never changes. */}
                  <span
                    aria-hidden
                    className={`absolute rounded-[44px] border transition-[inset,background-color,border-color] duration-200 ease-out ${
                      isActive
                        ? 'inset-0 border-hairline bg-cream'
                        : 'inset-[3px] border-transparent group-hover:border-ink/[0.03] group-hover:bg-ink/[0.03]'
                    }`}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={category.icon} className="relative h-[16px] w-auto shrink-0 dark:invert" />
                  <p className="relative text-[14px] leading-[18px] whitespace-nowrap text-ink">
                    {category.label}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        <Carousel
          key={active.id}
          slides={active.slides.map((slide) => (
            <div
              key={slide.image + slide.cta}
              className="relative flex h-[420px] w-full flex-col items-start justify-between overflow-hidden rounded-[16px] p-[16px] sm:p-[24px] lg:h-[651px]"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={slide.image}
                  className="absolute size-full max-w-none rounded-[16px] object-cover"
                />
                <div
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(102, 102, 102, 0) 46.635%), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)',
                  }}
                />
              </div>
              <div className="relative flex w-full items-start justify-between">
                <div className="flex h-[24px] items-center justify-center rounded-[30px] bg-[rgba(246,242,239,0.1)] px-[16px] py-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] backdrop-blur-[7px]">
                  <p className="font-figtree text-[12px] leading-[20px] font-semibold whitespace-nowrap text-white">
                    {slide.caption}
                  </p>
                </div>
              </div>
              <div className="relative flex w-full items-end justify-end">
                <Link
                  href="/vendors"
                  className="flex items-center justify-center gap-[10px] rounded-[44px] border border-[rgba(255,151,153,0.3)] bg-brand px-[24px] py-[10px] transition-opacity hover:opacity-90"
                >
                  <p className="font-figtree text-[14px] leading-[24px] font-semibold whitespace-nowrap text-white">
                    {slide.cta}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src="/landing/arrow-right.svg" className="h-[6px] w-[10.281px] shrink-0" />
                </Link>
              </div>
            </div>
          ))}
        />
      </div>
    </div>
  )
}
