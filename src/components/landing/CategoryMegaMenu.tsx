'use client'

import type { VendorCategory } from '@/lib/categories'

import Link from 'next/link'
import React from 'react'

import { NAV_CATEGORY_IMAGES } from '@/components/landing/content'
import { VENDOR_CATEGORIES } from '@/lib/categories'

/** Category photo + bottom scrim shared by the mega menu cards and mobile sheet tiles. */
export function NavCategoryPhoto({
  category,
  className,
}: {
  category: VendorCategory
  className?: string
}) {
  const src = NAV_CATEGORY_IMAGES[category]

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-ink/10">
      {src && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img alt="" src={src} className={`absolute inset-0 size-full object-cover ${className ?? ''}`} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.8))]" />
    </div>
  )
}

/**
 * Product Categories mega menu (Figma 1054:631). The panel fades and drops in
 * first, then the cards fade up one after another; closing drops the stagger
 * so everything leaves together. Top 50px overlaps the 56px bar per Figma.
 */
export function CategoryMegaMenu({
  id,
  open,
  onNavigate,
}: {
  id: string
  open: boolean
  onNavigate: () => void
}) {
  return (
    <div
      id={id}
      className={`absolute top-[50px] right-0 left-0 mx-auto flex w-[min(1200px,calc(100vw-32px))] gap-[12px] rounded-[24px] border border-hairline/50 bg-canvas p-[12px] shadow-[0_16px_32px_-4px_rgba(12,12,13,0.1)] transition-[opacity,translate,visibility] ease-out before:absolute before:inset-x-0 before:-top-[8px] before:h-[8px] motion-reduce:translate-y-0 motion-reduce:transition-none ${
        open
          ? 'visible translate-y-0 opacity-100 duration-[220ms]'
          : 'pointer-events-none invisible -translate-y-[8px] opacity-0 duration-150'
      }`}
    >
      {VENDOR_CATEGORIES.map((category, index) => (
        <Link
          key={category.value}
          href={`/${category.value}`}
          onClick={onNavigate}
          style={{ transitionDelay: open ? `${140 + index * 40}ms` : '0ms' }}
          className={`group relative flex h-[240px] min-w-0 flex-1 items-end overflow-hidden rounded-[16px] p-[12px] transition-[opacity,translate] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
            open ? 'translate-y-0 opacity-100 duration-300' : 'translate-y-[6px] opacity-0 duration-150'
          }`}
        >
          <NavCategoryPhoto
            category={category.value}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none"
          />
          <span className="relative flex min-w-0 flex-1 items-end justify-between gap-[8px]">
            <span className="min-w-0 text-[14px] leading-[18px] text-white">{category.label}</span>
            {/*
             * The two Figma states share one arrow: at rest it sits at the
             * frame's right edge, hovered it's centred in a 20% circle. Both
             * layers slide 4.17px together while crossfading, so the arrow
             * appears to glide into the circle.
             */}
            <span aria-hidden className="relative size-[18px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src="/landing/nav-card-arrow.svg"
                className="absolute inset-0 block size-[18px] max-w-none transition-[opacity,translate] duration-300 ease-out group-hover:-translate-x-[4.17px] group-hover:opacity-0 group-focus-visible:-translate-x-[4.17px] group-focus-visible:opacity-0"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src="/landing/nav-card-arrow-circle.svg"
                className="absolute inset-0 block size-[18px] max-w-none translate-x-[4.17px] opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              />
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}
