import React from 'react'

import { PROCESS_STEPS } from './content'

export function ProcessSection() {
  const [first, ...rest] = PROCESS_STEPS

  return (
    <>
      <div className="flex w-full flex-col items-start gap-[16px] px-gutter-sm pt-section pb-heading-gap text-ink lg:px-gutter">
        <h2 className="max-w-[384px] font-display text-[36px] leading-[44px] font-bold">
          Our proven process
        </h2>
        <p className="max-w-[360px] text-[14px] leading-[18px] text-ink-50">
          A clear, collaborative process designed to keep every decision, detail, and stage of your
          project moving forward.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-gutter-sm pb-section lg:px-gutter">
        <div className="grid w-full grid-cols-1 gap-[12px] md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-[24px] rounded-[16px] bg-ink/[0.03] p-[8px] sm:flex-row sm:items-start lg:col-span-2 lg:h-[320px]">
            <div className="flex min-w-px flex-1 flex-col p-[16px]">
              <div className="flex flex-col gap-[10px]">
                <p className="text-[20px] leading-[22px] text-ink">{first.number}</p>
                <p className="text-[20px] leading-[22px] text-ink">{first.title}</p>
                <p className="text-[14px] leading-[20px] text-gray-body">{first.body}</p>
              </div>
            </div>
            <div className="relative h-[200px] w-full overflow-hidden rounded-[12px] sm:h-auto sm:min-w-px sm:flex-1 sm:self-stretch">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src={first.image}
                className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[12px] object-cover"
              />
            </div>
          </div>
          {rest.map((step) => (
            <div
              key={step.number}
              className="flex flex-col rounded-[16px] bg-ink/[0.03] p-[8px] lg:h-[320px]"
            >
              <div className="flex min-h-px w-full flex-1 flex-col gap-[10px] p-[16px]">
                <p className="text-[20px] leading-[22px] text-ink">{step.number}</p>
                <p className="text-[20px] leading-[22px] text-ink">{step.title}</p>
                <p className="text-[14px] leading-[20px] text-gray-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
