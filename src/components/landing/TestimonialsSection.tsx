import React from 'react'

import { TESTIMONIALS } from './content'

const SOURCE_ICONS = {
  google: '/landing/google.svg',
  yelp: '/landing/yelp.svg',
}

export function TestimonialsSection() {
  return (
    <>
      <div className="flex w-full flex-col items-start px-[24px] pt-[96px] pb-[64px] lg:px-[48px]">
        <h2 className="max-w-[494px] font-display text-[36px] leading-[44px] font-bold text-black">
          What our clients are saying about us on Google and Yelp
        </h2>
      </div>
      <div className="flex w-full items-start gap-[16px] overflow-x-auto px-[24px] pb-[96px] lg:px-[48px]">
        {TESTIMONIALS.map((testimonial, index) => (
          <div
            key={index}
            className="flex h-[392px] w-[320px] shrink-0 flex-col items-end justify-between rounded-[16px] bg-black/[0.03] p-[8px] sm:w-[544px]"
          >
            <div className="flex min-h-px w-full flex-1 flex-col gap-[8px] overflow-hidden p-[16px]">
              <p className="text-[20px] leading-[22px] text-ink-30">★★★★★</p>
              <div className="flex flex-col gap-[16px] text-[14px] leading-[20px]">
                <p className="text-ink-50">{testimonial.quote}</p>
                <p className="text-black">{testimonial.author}</p>
              </div>
            </div>
            <div className="size-[24px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={testimonial.source === 'google' ? 'Google review' : 'Yelp review'}
                src={SOURCE_ICONS[testimonial.source]}
                className="block size-full max-w-none"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
