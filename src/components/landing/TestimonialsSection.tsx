'use client'

import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback } from 'react'

import { TESTIMONIALS } from './content'

const SOURCE_ICONS = {
  google: '/landing/google.svg',
  yelp: '/landing/yelp.svg',
}

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
    // At rest the first card sits at the section gutter (48px desktop, 24px
    // mobile) like the Figma frame; every other snap centers its card. Slides
    // carry a 16px leading gap, hence the subtraction.
    align: (viewSize, snapSize, index) =>
      index === 0 ? (viewSize >= 700 ? 48 : 24) - 16 : (viewSize - snapSize) / 2,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <>
      <div className="flex w-full items-end justify-between gap-[24px] px-gutter-sm pt-section pb-heading-gap lg:px-gutter">
        <h2 className="max-w-[517px] font-display text-[36px] leading-[44px] font-bold text-ink">
          What our clients are saying about us
        </h2>
        <div className="flex shrink-0 items-center gap-[12px]">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="h-[24px] w-[32px] shrink-0 transition-opacity hover:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src="/landing/carousel-arrow-left.svg"
              className="block size-full max-w-none dark:invert"
            />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="h-[24px] w-[32px] shrink-0 transition-opacity hover:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src="/landing/carousel-arrow-right.svg"
              className="block size-full max-w-none dark:invert"
            />
          </button>
        </div>
      </div>
      <div className="w-full overflow-hidden pb-section" ref={emblaRef}>
        <div className="-ml-[16px] flex touch-pan-y items-start">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="min-w-0 shrink-0 pl-[16px]">
              <div className="flex h-[400px] w-[320px] flex-col items-end justify-between rounded-[16px] bg-ink/[0.03] p-[8px] sm:w-[488px]">
                <div className="flex min-h-px w-full flex-1 flex-col gap-[8px] overflow-hidden p-[16px]">
                  <p className="text-[20px] leading-[22px] text-ink-30">★★★★★</p>
                  <div className="flex flex-col gap-[16px] text-[14px] leading-[20px]">
                    <p className="text-ink-50">{testimonial.quote}</p>
                    <p className="text-ink">{testimonial.author}</p>
                  </div>
                </div>
                <div className="size-[24px] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={testimonial.source === 'google' ? 'Google review' : 'Yelp review'}
                    src={SOURCE_ICONS[testimonial.source]}
                    className="block size-full max-w-none dark:invert"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
