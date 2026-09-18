'use client'

import React, { useEffect, useRef, useState } from 'react'

import { PROCESS_STEPS } from './content'

export function ProcessSection() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeRows, setActiveRows] = useState<boolean[]>(() => PROCESS_STEPS.map(() => false))

  // Below lg there is no hover, so a row's number darkens while the row passes
  // through the middle band of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveRows((prev) => {
          const next = [...prev]
          for (const entry of entries) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            next[index] = entry.isIntersecting
          }
          return next
        })
      },
      { rootMargin: '-40% 0px -40% 0px' },
    )
    for (const row of rowRefs.current) {
      if (row) observer.observe(row)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="flex w-full flex-col items-start gap-[16px] px-gutter-sm pt-section-top pb-heading-gap text-ink lg:px-gutter">
        <h2 className="max-w-[384px] text-[28px] leading-[36px] sm:text-[36px] sm:leading-[44px]">
          How we work
        </h2>
        <p className="max-w-[360px] text-[14px] leading-[18px] text-ink-50">
          A clear, collaborative process designed to keep every decision, detail, and stage of your
          project moving forward.
        </p>
      </div>

      <div className="w-full pb-section">
        {/* Desktop: 5 columns, numbers peek down from the top edge and reveal on hover */}
        <div className="hidden h-[368px] w-full border-y border-hairline lg:flex">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative flex h-full min-w-px flex-1 flex-col justify-end overflow-clip border-l border-hairline px-[24px] pb-[48px] first:border-l-0"
            >
              <p
                aria-hidden
                className="pointer-events-none absolute top-[32px] left-1/2 -translate-x-1/2 -translate-y-[72px] text-[160px] leading-[120px] whitespace-nowrap text-ink-20 transition-[translate,color] duration-400 ease-out group-hover:translate-y-0 group-hover:text-ink-50"
              >
                {step.number}
              </p>
              <div className="flex w-full flex-col gap-[10px]">
                <p className="text-[18px] leading-[24px] text-ink">{step.title}</p>
                <p className="text-[14px] leading-[18px] text-gray-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/tablet: stacked rows, numbers darken as rows scroll into view */}
        <div className="flex w-full flex-col border-y border-hairline lg:hidden">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => {
                rowRefs.current[index] = el
              }}
              data-index={index}
              className="flex w-full items-center justify-start gap-[24px] border-t border-hairline px-[16px] py-[32px] first:border-t-0"
            >
              <p
                aria-hidden
                className={`w-[96px] shrink-0 text-[72px] leading-[72px] transition-colors duration-400 ease-out ${
                  activeRows[index] ? 'text-ink-50' : 'text-ink-20'
                }`}
              >
                {step.number}
              </p>
              <div className="flex max-w-[258px] min-w-px flex-1 flex-col gap-[8px]">
                <p className="text-[18px] leading-[24px] text-ink">{step.title}</p>
                <p className="text-[14px] leading-[18px] text-gray-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
