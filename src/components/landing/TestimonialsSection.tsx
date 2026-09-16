'use client'

import useEmblaCarousel from 'embla-carousel-react'
import React from 'react'

import { TESTIMONIALS } from './content'

const [carey, jeff, efe, ginny] = TESTIMONIALS

function Quote({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="flex w-full flex-col gap-[16px]">
      <p className="font-display text-[20px] leading-[26px] text-ink">{testimonial.lead}</p>
      <p className="text-[14px] leading-[20px] whitespace-pre-line text-ink-50">
        {testimonial.body}
      </p>
      <p className="text-[14px] leading-[20px] text-ink">{testimonial.author}</p>
    </div>
  )
}

export function TestimonialsSection() {
  // Embla only drives the mobile carousel; at the two- and three-column
  // breakpoints the carousel markup is hidden and embla deactivates.
  const [emblaRef] = useEmblaCarousel({
    duration: 30,
    align: 'center',
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 640px)': { active: false },
    },
  })

  return (
    <>
      <div className="flex w-full flex-col items-start gap-[24px] px-[16px] py-[48px] sm:flex-row sm:items-end sm:justify-between sm:px-gutter-sm sm:pt-section sm:pb-heading-gap lg:px-gutter">
        <h2 className="max-w-[391px] font-display text-[32px] leading-[38px] font-semibold text-ink sm:text-[36px] sm:leading-[44px]">
          What our clients are saying about us
        </h2>
        <div className="flex shrink-0 items-end gap-[16px] whitespace-nowrap">
          <p className="text-[12px] leading-[20px] text-ink-75">★★★★★</p>
          <p className="text-[14px] leading-[20px] text-ink-50">Five stars on Google &amp; Yelp</p>
        </div>
      </div>

      {/* Three columns (desktop): Carey | Jeff | Efe + Ginny */}
      <div className="hidden w-full items-start pb-section lg:flex">
        <div className="flex min-w-px flex-1 flex-col border-r border-hairline pr-[32px] pl-gutter">
          <Quote testimonial={carey} />
        </div>
        <div className="flex min-w-px flex-1 flex-col border-r border-hairline px-[32px]">
          <Quote testimonial={jeff} />
        </div>
        <div className="flex min-w-px flex-1 flex-col gap-[24px] pr-gutter pl-[32px]">
          <Quote testimonial={efe} />
          <Quote testimonial={ginny} />
        </div>
      </div>

      {/* Two columns (tablet): Carey + Efe | Jeff + Ginny */}
      <div className="hidden w-full items-start pb-section sm:flex lg:hidden">
        <div className="flex min-w-px flex-1 flex-col gap-[24px] border-r border-hairline pr-[32px] pl-gutter-sm">
          <Quote testimonial={carey} />
          <Quote testimonial={efe} />
        </div>
        <div className="flex min-w-px flex-1 flex-col gap-[24px] pr-gutter-sm pl-[32px]">
          <Quote testimonial={jeff} />
          <Quote testimonial={ginny} />
        </div>
      </div>

      {/* Carousel (mobile): swipe only, first/last clamp, middle cards center */}
      <div className="w-full overflow-hidden pb-[64px] sm:hidden" ref={emblaRef}>
        <div className="flex touch-pan-y items-start">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="flex shrink-0 flex-col border-r border-hairline px-[16px]"
            >
              <div className="w-[320px]">
                <Quote testimonial={testimonial} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
