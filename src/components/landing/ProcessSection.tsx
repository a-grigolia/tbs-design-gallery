import React from 'react'

import { PROCESS_STEPS } from './content'

export function ProcessSection() {
  const [first, ...rest] = PROCESS_STEPS

  return (
    <>
      <div className="flex w-full flex-col items-start gap-[24px] px-[24px] pt-[96px] pb-[64px] text-black lg:px-[48px]">
        <h2 className="max-w-[384px] font-display text-[36px] leading-[44px] font-bold">
          Our proven process
        </h2>
        <p className="max-w-[656px] text-[16px] leading-[22px]">
          We take the trust our customers place in us very seriously and we are committed to deliver
          the results which guarantee a project&apos;s success.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-[24px] pb-[48px] lg:px-[48px]">
        <div className="grid w-full grid-cols-1 gap-[12px] md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-[24px] rounded-[16px] bg-black/[0.03] p-[8px] sm:flex-row sm:items-start lg:col-span-2 lg:h-[320px]">
            <div className="flex min-w-px flex-1 flex-col p-[16px]">
              <div className="flex flex-col gap-[10px]">
                <p className="text-[20px] leading-[22px] text-black">{first.number}</p>
                <p className="text-[20px] leading-[22px] text-black">{first.title}</p>
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
              className="flex flex-col rounded-[16px] bg-black/[0.03] p-[8px] lg:h-[320px]"
            >
              <div className="flex min-h-px w-full flex-1 flex-col gap-[10px] p-[16px]">
                <p className="text-[20px] leading-[22px] text-black">{step.number}</p>
                <p className="text-[20px] leading-[22px] text-black">{step.title}</p>
                <p className="text-[14px] leading-[20px] text-gray-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
