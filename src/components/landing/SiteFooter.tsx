import Link from 'next/link'
import React from 'react'

import { VerticalRule } from './Blueprint'
import { ThemeSwitcher } from './ThemeSwitcher'
import { FOOTER_ADDRESS, FOOTER_COLUMNS } from './content'

export function SiteFooter() {
  return (
    <footer className="flex w-full flex-col">
      <div className="flex w-full flex-col lg:h-[588px] lg:flex-row">
        <div className="flex flex-1 flex-col justify-between gap-[48px] p-gutter-sm lg:p-gutter">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="TBS Design Gallery"
            src="/landing/tbs-union.svg"
            className="h-[144px] w-[131.884px] shrink-0 dark:invert"
          />
          <div className="flex flex-col gap-[8px] pr-[24px] text-[14px] leading-[18px]">
            <p className="text-ink">{FOOTER_ADDRESS.name}</p>
            <div className="flex flex-col gap-[8px] text-ink-50">
              <p className="max-w-[252px]">{FOOTER_ADDRESS.address}</p>
              <p>{FOOTER_ADDRESS.hours}</p>
            </div>
          </div>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.number} className="flex flex-1 items-stretch">
            <VerticalRule number={column.number} />
            <div className="flex min-w-px flex-1 flex-col gap-[24px] px-[8px] py-[24px] lg:py-[56px]">
              <p className="text-[10px] leading-[13px] text-ink-50">{column.label}</p>
              <div className="flex flex-col items-start text-[14px] leading-[18px]">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-ink-50 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-[16px] border-t border-hairline px-gutter-sm py-[24px] lg:px-gutter">
        <div className="flex flex-wrap items-center gap-[48px] text-[14px] leading-[18px] text-ink-50">
          <p>© 2026 TBS Design Gallery</p>
          <Link href="#" className="transition-colors hover:text-ink">
            Privacy policy
          </Link>
        </div>
        <ThemeSwitcher />
      </div>
    </footer>
  )
}
