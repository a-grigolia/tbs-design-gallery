import React from 'react'

/**
 * Drafting-style decorations from the Figma frame: hairline-bordered content
 * column, corner cross marks, tick rules with section numbers, and the
 * labelled vertical measure. These are intentional page elements, not redlines.
 */

export function CornerCross({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute size-[12px] rotate-180 ${className ?? ''}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src="/landing/corner-cross.svg" className="block size-full max-w-none dark:invert" />
    </div>
  )
}

/**
 * T-shaped joinery mark centered on a hairline intersection: the bar lies on
 * the horizontal rule, the stem runs up along the vertical rule. Callers add
 * `rotate-180` when the stem should point down instead.
 */
export function JoineryTee({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute h-[6.5px] w-[12px] ${className ?? ''}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src="/landing/joinery-tee.svg" className="block size-full max-w-none dark:invert" />
    </div>
  )
}

/**
 * Full-width band with a top hairline, wrapping a centered column. The last
 * band on the page adds `border-b` via className so adjacent bands share a
 * single hairline.
 */
export function SectionBand({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex w-full flex-col items-center border-t border-hairline px-4 sm:px-8 lg:px-12 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

/** The 1200px content column, optionally with hairline side borders and corner marks. */
export function BlueprintColumn({
  children,
  sideBorders = true,
  showMeasureMark = false,
  corner = 'cross',
  className,
}: {
  children: React.ReactNode
  sideBorders?: boolean
  showMeasureMark?: boolean
  corner?: 'cross' | 'tee'
  className?: string
}) {
  return (
    <div
      className={`relative flex w-full max-w-[1200px] flex-col items-center ${
        sideBorders ? 'border-l border-r border-hairline' : ''
      } ${className ?? ''}`}
    >
      {corner === 'tee' ? (
        <>
          <JoineryTee className="-top-[0.5px] -left-[5.5px] rotate-180" />
          <JoineryTee className="-top-[0.5px] -right-[5.5px] rotate-180" />
        </>
      ) : (
        <>
          <CornerCross className="-top-[6px] -left-[6.5px]" />
          <CornerCross className="-top-[6px] -right-[6.5px]" />
        </>
      )}
      {showMeasureMark && (
        <div className="pointer-events-none absolute -top-[12px] left-[23.5px] h-[24px] w-[12px]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/landing/measure-mark.svg" className="block size-full max-w-none dark:invert" />
        </div>
      )}
      {children}
    </div>
  )
}

/** Horizontal tick rule with a section number, e.g. "01". */
export function SectionRule({ number }: { number: string }) {
  return (
    <div className="flex w-full items-center justify-center gap-[8px] p-[24px]" aria-hidden>
      <div className="flex w-[16px] items-center">
        <div className="h-[16px] w-px shrink-0 bg-hairline" />
        <div className="h-px min-w-px flex-1 bg-hairline" />
      </div>
      <p className="shrink-0 text-center font-figtree text-[10px] leading-[13px] whitespace-nowrap text-ink-50">
        {number}
      </p>
      <div className="flex min-w-px flex-1 items-center">
        <div className="h-px min-w-px flex-1 bg-hairline" />
        <div className="h-[16px] w-px shrink-0 bg-hairline" />
      </div>
    </div>
  )
}

/** Vertical tick rule with a column number, e.g. "01" — the footer's upright SectionRule. */
export function VerticalRule({ number }: { number: string }) {
  return (
    <div className="flex h-full min-h-[160px] w-[16px] flex-col items-center gap-[4px] self-stretch py-[12px]" aria-hidden>
      <div className="flex h-[40px] w-full flex-col items-center">
        <div className="h-px w-[16px] shrink-0 bg-hairline" />
        <div className="min-h-px w-px flex-1 bg-hairline" />
      </div>
      <p className="shrink-0 text-center font-figtree text-[10px] leading-[13px] whitespace-nowrap text-ink-50">
        {number}
      </p>
      <div className="flex min-h-px w-full flex-1 flex-col items-center">
        <div className="min-h-px w-px flex-1 bg-hairline" />
        <div className="h-px w-[16px] shrink-0 bg-hairline" />
      </div>
    </div>
  )
}

/** Vertical measure with tick ends and a centered label, e.g. "What we do". */
export function MeasureRule({ label = 'What we do' }: { label?: string }) {
  return (
    <div className="flex h-[144px] w-full flex-col items-center justify-center gap-[4px] py-[12px]">
      <div className="flex min-h-px flex-1 flex-col items-center" aria-hidden>
        <div className="h-px w-[16px] shrink-0 bg-hairline" />
        <div className="min-h-px w-px flex-1 bg-hairline" />
      </div>
      <p className="shrink-0 text-center font-figtree text-[8px] leading-[10px] whitespace-nowrap text-ink-50">
        {label}
      </p>
      <div className="flex min-h-px flex-1 flex-col items-center" aria-hidden>
        <div className="min-h-px w-px flex-1 bg-hairline" />
        <div className="h-px w-[16px] shrink-0 bg-hairline" />
      </div>
    </div>
  )
}
