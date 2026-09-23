import Link from 'next/link'
import React from 'react'

import { SectionRule, VerticalRule } from './Blueprint'
import { ThemeSwitcher } from './ThemeSwitcher'
import { FOOTER_ADDRESS, FOOTER_COLUMNS } from './content'

export function SiteFooter() {
  return (
    <footer className="flex w-full flex-col">
      <div className="flex w-full flex-col pb-[24px] lg:h-[588px] lg:flex-row lg:pb-0">
        <div className="flex flex-col gap-[24px] px-[16px] pt-[120px] pb-[48px] lg:flex-1 lg:justify-between lg:gap-[48px] lg:p-gutter">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="TBS Design Gallery"
            src="/landing/tbs-union.svg"
            className="h-[144px] w-[131.884px] shrink-0 dark:invert"
          />
          <div className="flex flex-col gap-[8px] pr-[24px] text-[14px] leading-[18px]">
            <p className="text-ink">{FOOTER_ADDRESS.name}</p>
            <div className="flex flex-col gap-[8px] text-ink-50">
              <p className="lg:max-w-[252px]">{FOOTER_ADDRESS.address}</p>
              <p>{FOOTER_ADDRESS.hours}</p>
            </div>
          </div>
        </div>
        {/* Desktop: hovering any column link dims the rest across all three columns. */}
        <div className="group/links flex flex-col lg:flex-[3] lg:flex-row">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.number} className="flex flex-col lg:min-w-0 lg:flex-1 lg:flex-row">
              <div className="lg:hidden">
                <SectionRule number={`${column.number} ${column.label}`} />
              </div>
              <div className="hidden lg:flex">
                <VerticalRule number={column.number} />
              </div>
              <div className="flex min-w-px flex-1 flex-col px-[16px] lg:gap-[24px] lg:px-[8px] lg:py-[56px]">
                <p className="hidden text-[10px] leading-[13px] text-ink-50 lg:block">
                  {column.label}
                </p>
                <div className="flex flex-col items-start text-[14px] leading-[22px]">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-ink-50 transition-colors hover:text-ink lg:group-has-[a:hover]/links:text-ink-30 lg:hover:text-ink!"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[24px] border-t border-hairline px-[16px] py-[24px] lg:flex-row lg:items-end lg:justify-between lg:gap-[16px] lg:px-gutter">
        <div className="flex flex-col gap-[8px] text-[14px] leading-[18px] text-ink-50 lg:flex-row lg:gap-[48px]">
          <p>© 2026 TBS Design Gallery</p>
          <Link href="/privacy-policy" className="transition-colors hover:text-ink">
            Privacy policy
          </Link>
        </div>
        <div className="self-end lg:self-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
