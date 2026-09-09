'use client'

import type { VendorHeroData } from '@/components/vendor/VendorHero'
import type { VendorCategory } from '@/lib/categories'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { VendorHeroCard } from '@/components/vendor/VendorHero'
import { vendorHref, VENDOR_CATEGORIES } from '@/lib/categories'
import { CarouselDots } from './Carousel'
import { useCarouselTimer } from './useCarouselTimer'

export type SpecificationVendor = VendorHeroData & {
  id: number
  slug: string
  primaryCategory: VendorCategory
  categories: VendorCategory[]
}

const CATEGORY_ICONS: Record<VendorCategory, string> = {
  'custom-cabinetry': '/landing/category-cabinetry.svg',
  'windows-doors': '/landing/category-windows.svg',
  appliances: '/landing/category-appliances.svg',
  'outdoor-living': '/landing/category-outdoor.svg',
  'architectural-elements-furniture': '/landing/category-outdoor.svg',
}

function BrandList({
  vendors,
  activeIndex,
  onPreview,
  onPausedChange,
}: {
  vendors: SpecificationVendor[]
  activeIndex: number
  onPreview: (index: number) => void
  onPausedChange: (paused: boolean) => void
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const split = Math.ceil(vendors.length / 2)
  const columns = vendors.length > 4 ? [vendors.slice(0, split), vendors.slice(split)] : [vendors]

  return (
    <div
      className={`grid w-full gap-x-[24px] lg:w-[360px] ${
        columns.length > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
      }`}
      onMouseLeave={() => {
        setHoveredId(null)
        onPausedChange(false)
      }}
      onFocus={() => onPausedChange(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onPausedChange(false)
        }
      }}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={column[0]?.id ?? columnIndex}
          className="flex flex-col items-start justify-center lg:items-end"
        >
          {column.map((vendor) => {
            const index = vendors.findIndex(({ id }) => id === vendor.id)
            const isActive = index === activeIndex
            const isHovered = vendor.id === hoveredId

            return (
              <Link
                key={vendor.id}
                href={vendorHref(vendor)}
                onMouseEnter={() => {
                  setHoveredId(vendor.id)
                  onPausedChange(true)
                  onPreview(index)
                }}
                onFocus={() => onPreview(index)}
                className="relative flex items-center justify-end focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {/* The arrow appears on direct hover without following the timed active state. */}
                <span
                  className={`text-[20px] leading-[26px] text-right whitespace-nowrap transition-[translate,color] duration-250 ease-out ${
                    isActive ? 'font-medium text-ink' : 'text-ink-40'
                  } ${isHovered ? 'pr-[26px] lg:-translate-x-[26px] lg:pr-0' : ''}`}
                >
                  {vendor.name}
                </span>
                <span
                  className={`absolute right-0 h-[10px] w-[14px] transition-opacity duration-250 ${
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
      ))}
    </div>
  )
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
  const [activeId, setActiveId] = useState<VendorCategory | null>(categories[0]?.value ?? null)
  const [paused, setPaused] = useState(false)
  const active = categories.find((category) => category.value === activeId) ?? categories[0]
  const { index, setIndex, progress, containerRef } = useCarouselTimer(
    active?.vendors.length ?? 0,
    5000,
    paused,
  )

  if (!active) return null

  return (
    <div className="flex w-full flex-col px-gutter-sm lg:px-gutter">
      <div className="max-w-full self-center overflow-x-auto p-px">
        <div className="flex h-[40px] w-max items-center justify-center gap-[8px] rounded-[44px] border border-hairline">
          {categories.map((category) => {
            const isActive = category.value === active.value
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => {
                  setIndex(0)
                  setPaused(false)
                  setActiveId(category.value)
                }}
                aria-pressed={isActive}
                className="group relative flex h-[40px] shrink-0 items-center justify-center gap-[10px] px-[24px]"
              >
                {/* The inset layer changes state without moving the tab's footprint. */}
                <span
                  aria-hidden
                  className={`absolute rounded-[44px] border transition-[inset,background-color,border-color] duration-200 ease-out ${
                    isActive
                      ? '-inset-x-px inset-y-0 border-hairline bg-cream'
                      : 'inset-[3px] border-transparent group-hover:border-ink/[0.03] group-hover:bg-ink/[0.03]'
                  }`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={CATEGORY_ICONS[category.value]}
                  className="relative h-[16px] w-auto shrink-0 dark:invert"
                />
                <span className="relative text-[14px] leading-[18px] whitespace-nowrap text-ink">
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex w-full flex-col gap-[32px] py-[48px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex flex-col gap-[8px] lg:w-[305px]">
          <p className="text-[16px] leading-normal text-ink">Product Specification</p>
          <p className="text-[14px] leading-normal text-ink-50">
            Explore curated American and European windows, doors, cabinetry, appliances, and outdoor
            living and architectural solutions, selected and specified for your project.
          </p>
        </div>
        <BrandList
          vendors={active.vendors}
          activeIndex={index}
          onPreview={setIndex}
          onPausedChange={setPaused}
        />
      </div>

      <div
        ref={containerRef}
        className="flex w-full flex-col items-center justify-center gap-[24px]"
      >
        <div className="relative w-full">
          {active.vendors.map((vendor, vendorIndex) => (
            <div
              key={vendor.id}
              className={`transition-opacity duration-700 ${
                vendorIndex === index
                  ? 'relative opacity-100'
                  : 'pointer-events-none absolute inset-0 opacity-0'
              }`}
              aria-hidden={vendorIndex !== index}
            >
              <Link
                href={vendorHref(vendor)}
                aria-label={`View ${vendor.name}`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                className="block rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <VendorHeroCard vendor={vendor} category={active.label} headingLevel="h3" />
              </Link>
            </div>
          ))}
        </div>
        {active.vendors.length > 1 && (
          <CarouselDots
            count={active.vendors.length}
            active={index}
            progress={progress}
            onSelect={setIndex}
          />
        )}
      </div>
    </div>
  )
}
