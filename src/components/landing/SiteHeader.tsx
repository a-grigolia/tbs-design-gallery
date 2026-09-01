'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { VENDOR_CATEGORIES } from '@/lib/categories'

const NAV_LINKS = [
  { label: 'Product Categories', href: '/vendors' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Two-state nav from the Figma frame: at rest (624:5561) a 1216px bar with
 * 32/8/8/8 padding; once the user scrolls it shrinks, drops, and gains a
 * hairline border and heavier blur. `embedded` sits the bar in the landing
 * hero column: a spacer holds the in-flow slot and the header is `fixed` so
 * it isn't trapped by the hero's sticky containing block. Size, offset, and
 * border live on the wrapper so they CSS-transition; the frost is a sibling
 * so it doesn't nest with the categories dropdown's own backdrop-filter.
 */
export function SiteHeader({ embedded = false }: { embedded?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {embedded && <div className="h-[60px] w-full shrink-0" aria-hidden />}
      <header
        className={`pointer-events-none top-0 z-50 flex h-[60px] w-full flex-col items-center ${
          embedded ? 'fixed inset-x-0 px-4 sm:px-8 lg:px-[24px]' : 'sticky px-4'
        }`}
      >
        <div
          className={`flex h-full w-full flex-col items-center ${embedded ? 'px-[16px] sm:px-[24px]' : ''}`}
        >
          <div
            className={`pointer-events-auto relative flex w-full items-center justify-between rounded-[64px] border pl-[24px] transition-all duration-300 ease-out lg:pl-[32px] ${
              scrolled
                ? 'max-w-[1184px] translate-y-[8px] border-hairline py-[6px] pr-[6px]'
                : 'max-w-[1216px] translate-y-0 border-transparent py-[8px] pr-[8px]'
            }`}
          >
        {/*
         * Frost lives on a sibling, not this wrapper. A parent backdrop-filter
         * becomes the dropdown's backdrop root, so the menu's own blur stops
         * sampling the page the moment the bar scrolls into the frosted state.
         */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-[64px] transition-[background-color,backdrop-filter] duration-300 ease-out ${
            scrolled ? 'bg-canvas/90 backdrop-blur-[40px]' : 'bg-transparent'
          }`}
        />
        <Link href="/" aria-label="TBS Design Gallery home" className="relative block h-[37px] w-[39px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="TBS Design Gallery" src="/landing/logo-mark.svg" className="block size-full max-w-none dark:invert" />
        </Link>
        <nav className="relative hidden items-center gap-[8px] md:flex">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
            onFocus={() => setCategoriesOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setCategoriesOpen(false)
            }}
          >
            <button
              type="button"
              aria-expanded={categoriesOpen}
              aria-haspopup="menu"
              className={`flex items-center gap-[8px] rounded-[44px] px-[16px] py-[9px] font-figtree text-[14px] leading-[22px] whitespace-nowrap text-ink transition-colors hover:bg-ink/5 ${
                categoriesOpen ? 'bg-ink/5' : ''
              }`}
            >
              Product Categories
              <span
                className={`flex h-[10px] w-[11px] items-center justify-center transition-transform duration-300 ${
                  categoriesOpen ? 'rotate-[270deg]' : 'rotate-90'
                }`}
                aria-hidden
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src="/landing/nav-chevron.svg" className="block h-[11px] w-[4px] max-w-none dark:invert" />
              </span>
            </button>
            {/* 1px overlap with the trigger so hover never falls in a gap */}
            <div
              className={`absolute top-[calc(100%-1px)] left-0 flex w-max flex-col gap-[4px] rounded-[12px] border border-hairline bg-canvas/90 p-[8px] backdrop-blur-[40px] transition-opacity duration-200 ${
                categoriesOpen ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              {VENDOR_CATEGORIES.map((category) => (
                <Link
                  key={category.value}
                  href={`/${category.value}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="rounded-[6px] px-[6px] py-[4px] font-figtree text-[14px] leading-[22px] whitespace-nowrap text-ink transition-colors hover:bg-ink/5"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[44px] px-[16px] py-[9px] font-figtree text-[14px] leading-[22px] whitespace-nowrap text-ink transition-colors hover:bg-ink/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="relative flex items-center gap-[8px]">
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-[44px] flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-ink/5 md:hidden"
          >
            <span className={`h-px w-[18px] bg-ink transition-transform ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`h-px w-[18px] bg-ink transition-transform ${menuOpen ? '-translate-y-[2px] -rotate-45' : ''}`} />
          </button>
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[16px] py-[8px] font-figtree text-[14px] leading-[24px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90"
          >
            Request a Tour
          </Link>
          </div>
          </div>
          {menuOpen && (
            <nav className="pointer-events-auto mt-[8px] flex w-full max-w-[360px] flex-col gap-[4px] rounded-[24px] border border-hairline bg-canvas p-[8px] md:hidden">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[16px] px-[24px] py-[10px] font-figtree text-[14px] leading-[22px] text-ink hover:bg-ink/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
