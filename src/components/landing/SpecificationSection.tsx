'use client'

import type { VendorCategory } from '@/lib/categories'

import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { VENDOR_CATEGORIES } from '@/lib/categories'
import { CarouselDots } from './Carousel'
import { useCarouselTimer } from './useCarouselTimer'

export type SpecificationVendor = {
  id: number
  name: string
  categories: VendorCategory[]
}

const CATEGORY_IMAGES: Record<VendorCategory, string | null> = {
  // TODO: Add the Custom Cabinetry Supabase image URL.
  'custom-cabinetry': 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/premier-AD_352.BDR_433.jpg',
  // TODO: Add the Windows & Doors Supabase image URL.
  'windows-doors': 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/reynaers-hillside-1920x1163.webp',
  // TODO: Add the Outdoor Living Supabase image URL.
  'outdoor-living': 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/Ubmrosa-5-1920x1200.webp',
  // TODO: Add the Appliances Supabase image URL.
  'appliances': 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/la-cornue-chateau-supreme-01-1920x1280.webp',
  // TODO: Add the Architectural Elements & Furniture Supabase image URL.
  'architectural-elements-furniture': 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/laurameroni-architecture-catalogue-hd-images-088-1920x1358.webp',
}

export function SpecificationSection({ vendors }: { vendors: SpecificationVendor[] }) {
  const categories = useMemo(
    () =>
      VENDOR_CATEGORIES.map((category) => ({
        ...category,
        vendors: vendors
          .filter((vendor) => vendor.categories.includes(category.value))
          .sort((a, b) => a.name.localeCompare(b.name)),
      })).filter((category) => category.vendors.length > 0),
    [vendors],
  )
  const [interactionPaused, setInteractionPaused] = useState(false)
  const [manuallyPaused, setManuallyPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<VendorCategory | null>(null)
  const lastPointerType = useRef<string | null>(null)
  const paused = interactionPaused || manuallyPaused || reducedMotion
  const { index, setIndex, progress, containerRef } = useCarouselTimer(
    categories.length,
    5000,
    paused,
  )
  const active = categories[index] ?? categories[0]

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(query.matches)
    updatePreference()
    query.addEventListener('change', updatePreference)
    return () => query.removeEventListener('change', updatePreference)
  }, [])

  if (!active) return null

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setInteractionPaused(false)
        }
      }}
    >
      <div className="flex w-full flex-col gap-[48px] px-[16px] pt-[24px] pb-[48px] lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:px-[48px] lg:py-[48px]">
        <div className="flex flex-col gap-[8px] lg:w-[305px]">
          <h2 className="text-[20px] leading-[26px] text-ink">Products</h2>
          <p className="text-[14px] leading-normal text-ink-50">
            Explore curated American and European windows, doors, cabinetry, appliances, and outdoor
            living and architectural solutions, selected and specified for your project.
          </p>
        </div>

        <div className="flex max-w-full flex-col items-start justify-center lg:items-end">
          {categories.map((category, categoryIndex) => {
            const isActive = categoryIndex === index
            const isHovered = category.value === hoveredCategory

            return (
              <Link
                key={category.value}
                href={`/${category.value}`}
                aria-current={isActive ? 'true' : undefined}
                onMouseEnter={() => {
                  setHoveredCategory(category.value)
                  setIndex(categoryIndex)
                }}
                onMouseLeave={() => setHoveredCategory(null)}
                onFocus={() => setIndex(categoryIndex)}
                onKeyDown={() => {
                  lastPointerType.current = null
                }}
                onPointerDown={(event) => {
                  lastPointerType.current = event.pointerType
                }}
                onClick={(event) => {
                  const isTouchInput =
                    event.detail > 0 &&
                    (lastPointerType.current === 'touch' || lastPointerType.current === 'pen')
                  lastPointerType.current = null
                  if (!isTouchInput) return
                  event.preventDefault()
                  setIndex(categoryIndex)
                }}
                className={`relative flex max-w-full items-center justify-start text-left text-[18px] leading-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:justify-end lg:text-right ${
                  isActive ? 'text-ink' : 'text-ink-40 hover:text-ink'
                }`}
              >
                <span
                  className={`min-w-0 transition-[translate,color] duration-250 ease-out lg:whitespace-nowrap ${
                    isHovered ? 'lg:-translate-x-[26px]' : ''
                  }`}
                >
                  {category.label}
                </span>
                <span
                  className={`absolute right-0 hidden h-[10px] w-[14px] transition-opacity duration-250 lg:block ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src="/landing/arrows-updown.svg"
                    className="block size-full max-w-none dark:invert"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-[24px] px-[12px] lg:px-[24px]">
        <div className="relative h-[clamp(384px,80vw,480px)] w-full overflow-hidden rounded-[24px] lg:h-[600px]">
          {categories.map((category, categoryIndex) => {
            const image = CATEGORY_IMAGES[category.value]
            const isActive = categoryIndex === index
            const brandCount = category.vendors.length

            return (
              <div
                key={category.value}
                className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
                  isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={!isActive}
              >
                {image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${category.label} products`}
                      className="absolute inset-0 size-full object-cover"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-cream px-[24px] text-center">
                    <p className="font-display text-[clamp(28px,4vw,48px)] leading-[1.05] text-ink-30">
                      {category.label}
                    </p>
                  </div>
                )}
                <div
                  className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.6)_0%,rgba(102,102,102,0)_46.154%),linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%)]"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-[16px] p-[16px] lg:gap-[20px] lg:p-[32px]">
                  <div className="flex min-w-0 flex-col items-start gap-[4px] text-white lg:gap-[8px]">
                    <div className="flex flex-col items-start">
                      <p className="text-[10px] leading-[13px] tracking-[0.1px] text-white/80">
                        {brandCount} {brandCount === 1 ? 'brand' : 'brands'}
                      </p>
                      <h3 className="text-[20px] leading-[26px] tracking-[0.2px] text-white lg:text-[24px] lg:leading-[32px] lg:tracking-[0.24px]">
                        {category.label}
                      </h3>
                    </div>
                    <p className="text-[12px] leading-[16px] tracking-[0.12px] text-white/80 lg:text-[14px] lg:leading-[14px] lg:tracking-[0.14px]">
                      {category.vendors.map((vendor) => vendor.name).join(', ')}
                    </p>
                  </div>
                  <Link
                    href={`/${category.value}`}
                    aria-label={`Explore ${category.label}`}
                    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[44px] border border-black/30 bg-white text-[14px] leading-[18px] text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:w-auto lg:gap-[8px] lg:px-[16px]"
                  >
                    <span className="hidden lg:inline">Explore</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src="/landing/arrows-updown.svg" className="h-[6px] w-[8.4px]" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
        {categories.length > 1 && (
          <div className="flex items-center justify-center gap-[8px]">
            <CarouselDots
              count={categories.length}
              active={index}
              progress={progress}
              onSelect={setIndex}
            />
            <button
              type="button"
              disabled={reducedMotion}
              aria-pressed={manuallyPaused || reducedMotion}
              aria-label={
                reducedMotion
                  ? 'Automatic category cycling disabled by reduced motion preference'
                  : manuallyPaused
                    ? 'Play category carousel'
                    : 'Pause category carousel'
              }
              onClick={() => setManuallyPaused((current) => !current)}
              className="flex size-[24px] items-center justify-center rounded-full text-ink-50 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {manuallyPaused || reducedMotion ? (
                <span
                  aria-hidden
                  className="ml-[1px] size-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current"
                />
              ) : (
                <span aria-hidden className="flex gap-[2px]">
                  <span className="h-[8px] w-[2px] rounded-full bg-current" />
                  <span className="h-[8px] w-[2px] rounded-full bg-current" />
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
