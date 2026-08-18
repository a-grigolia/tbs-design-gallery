'use client'

import Link from 'next/link'
import React, { useState } from 'react'

const NAV_LINKS = [
  { label: 'Product Categories', href: '/vendors' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="pointer-events-none sticky top-0 z-50 flex w-full flex-col items-center px-4 pt-[8px]">
      <div className="pointer-events-auto flex items-center gap-[24px] rounded-[64px] border border-hairline bg-[rgba(246,242,239,0.5)] py-[6px] pr-[6px] pl-[24px] backdrop-blur-[24px] lg:gap-[96px] lg:pl-[32px]">
        <Link href="/" aria-label="TBS Design Gallery home" className="block h-[37px] w-[39px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="TBS Design Gallery" src="/landing/logo-mark.svg" className="block size-full max-w-none" />
        </Link>
        <div className="flex items-center gap-[8px]">
          <nav className="hidden items-center gap-[8px] md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[44px] px-[24px] py-[10px] font-figtree text-[14px] leading-[22px] whitespace-nowrap text-black transition-colors hover:bg-black/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-[44px] flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-black/5 md:hidden"
          >
            <span className={`h-px w-[18px] bg-black transition-transform ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`h-px w-[18px] bg-black transition-transform ${menuOpen ? '-translate-y-[2px] -rotate-45' : ''}`} />
          </button>
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[24px] py-[10px] font-figtree text-[14px] leading-[24px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90"
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
              className="rounded-[16px] px-[24px] py-[10px] font-figtree text-[14px] leading-[22px] text-black hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
