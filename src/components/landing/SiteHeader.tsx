'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { CategoryMegaMenu } from '@/components/landing/CategoryMegaMenu'
import { MobileNavSheet } from '@/components/landing/MobileNavSheet'

const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const HOVER_OPEN_MS = 100
const HOVER_CLOSE_MS = 150

/**
 * Full-width nav (Figma 1052:412 desktop, 1061:1438 mobile). The content row
 * never moves; scrolling (or opening the mega menu) crossfades in a frosted
 * full-bleed layer with a bottom hairline. The frost stays on a sibling layer
 * whose opacity animates — animating the blur radius itself janks on phones.
 */
export function SiteHeader({ overlayAtTop = false }: { overlayAtTop?: boolean }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<number | undefined>(undefined)
  // A click "pins" the menu open so leaving it with the mouse doesn't close it.
  const pinned = useRef(false)
  const frosted = scrolled || categoriesOpen
  const isOverlay = overlayAtTop && !frosted

  useEffect(() => {
    if (overlayAtTop) {
      const onHeroCompactChange = (event: Event) => {
        setScrolled((event as CustomEvent<boolean>).detail)
      }

      window.addEventListener('landing-hero-compact-change', onHeroCompactChange)
      return () => window.removeEventListener('landing-hero-compact-change', onHeroCompactChange)
    }

    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlayAtTop])

  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
    setCategoriesOpen(false)
  }

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (desktop.matches) setMenuOpen(false)
      else setCategoriesOpen(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  // Document-level so Esc also closes a hover-opened menu that never had focus.
  useEffect(() => {
    if (!categoriesOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!categoriesRef.current?.contains(event.target as Node)) closeCategories()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const hadFocus = categoriesRef.current?.contains(document.activeElement)
      closeCategories()
      if (hadFocus) triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [categoriesOpen])

  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  function closeCategories() {
    window.clearTimeout(hoverTimer.current)
    pinned.current = false
    setCategoriesOpen(false)
  }

  function scheduleCategories(open: boolean) {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(
      () => setCategoriesOpen(open),
      open ? HOVER_OPEN_MS : HOVER_CLOSE_MS,
    )
  }

  function toggleCategories() {
    window.clearTimeout(hoverTimer.current)
    if (categoriesOpen && pinned.current) {
      closeCategories()
      return
    }
    pinned.current = true
    setCategoriesOpen(true)
  }

  const linkTone = isOverlay ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] w-full">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 border-b border-hairline bg-canvas/90 backdrop-blur-[15px] transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          frosted ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/*
       * Symmetric 8px padding plus the logo's 24px margin reproduces Figma's
       * 32/8 inset while keeping the grid's middle column (the links) centred
       * on the full 1216px frame, as in Figma, rather than on the content box.
       */}
      <div className="relative mx-auto grid h-full w-full max-w-[1216px] grid-cols-[1fr_auto_1fr] items-center px-[12px] py-[6px] md:p-[8px]">
        <Link
          href="/"
          aria-label="TBS Design Gallery home"
          className="block h-[37px] w-[39px] shrink-0 justify-self-start md:ml-[24px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="TBS Design Gallery"
            src="/landing/logo-mark.svg"
            className={`block size-full max-w-none transition-[filter] duration-300 ${
              isOverlay ? 'invert' : 'dark:invert'
            }`}
          />
        </Link>
        <nav className="hidden items-center gap-[8px] md:flex">
          <div
            ref={categoriesRef}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') return
              if (!categoriesOpen) pinned.current = false
              scheduleCategories(true)
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse' && !pinned.current) scheduleCategories(false)
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) closeCategories()
            }}
          >
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={categoriesOpen}
              aria-controls="nav-categories"
              onClick={toggleCategories}
              className={`flex h-[40px] items-center gap-[8px] rounded-[44px] px-[16px] font-figtree text-[14px] leading-[22px] whitespace-nowrap transition-colors ${linkTone} ${
                categoriesOpen ? 'bg-ink/5' : ''
              }`}
            >
              Product Categories
              <span
                aria-hidden
                className={`flex size-[7px] items-center justify-center transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  categoriesOpen ? '-rotate-90' : 'rotate-90'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src="/landing/nav-chevron.svg"
                  className={`block h-[7px] w-[4.2px] max-w-none ${
                    isOverlay ? 'invert' : 'dark:invert'
                  }`}
                />
              </span>
            </button>
            <CategoryMegaMenu id="nav-categories" open={categoriesOpen} onNavigate={closeCategories} />
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex h-[40px] items-center rounded-[44px] px-[16px] font-figtree text-[14px] leading-[22px] whitespace-nowrap transition-colors ${linkTone}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center gap-[12px] justify-self-end">
          <Link
            href="/contact"
            className="flex h-[36px] items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[16px] font-figtree text-[14px] leading-[24px] whitespace-nowrap text-white transition-opacity hover:opacity-90 md:h-[40px]"
          >
            Request a Tour
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-menu"
            onClick={() => setMenuOpen(true)}
            className={`flex size-[36px] items-center justify-center rounded-[44px] transition-colors md:hidden ${
              isOverlay ? 'hover:bg-white/10' : 'hover:bg-ink/5'
            }`}
          >
            <span aria-hidden className="flex h-[8px] w-[16px] flex-col justify-between">
              {[0, 1].map((line) => (
                <span
                  key={line}
                  className={`h-[1.5px] w-full rounded-[2px] transition-colors duration-300 ${
                    isOverlay ? 'bg-white' : 'bg-ink'
                  }`}
                />
              ))}
            </span>
          </button>
        </div>
      </div>
      <MobileNavSheet
        id="nav-mobile-menu"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusRef={menuButtonRef}
      />
    </header>
  )
}
