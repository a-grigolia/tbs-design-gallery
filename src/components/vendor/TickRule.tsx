import React from 'react'

/** The landing page's SectionRule shape, but carrying a text label ("About Oikos") instead of a section number. */
export function TickRule({ label }: { label: string }) {
  return (
    <div
      className="flex w-full items-center justify-center gap-[2px] px-[8px] py-[24px] sm:gap-[8px] sm:p-[24px]"
      aria-hidden
    >
      <div className="flex w-[6px] items-center sm:w-[16px]">
        <div className="h-[10px] w-px shrink-0 bg-hairline sm:h-[12px]" />
        <div className="h-px min-w-px flex-1 bg-hairline" />
      </div>
      <p className="shrink-0 text-center font-figtree text-[10px] leading-[13px] whitespace-nowrap text-ink-50">
        {label}
      </p>
      <div className="flex min-w-px flex-1 items-center">
        <div className="h-px min-w-px flex-1 bg-hairline" />
        <div className="h-[10px] w-px shrink-0 bg-hairline sm:h-[12px]" />
      </div>
    </div>
  )
}
