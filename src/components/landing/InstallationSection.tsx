'use client'

import React from 'react'

import { CarouselDots } from './Carousel'
import { INSTALLATION_CARDS } from './content'
import { useCarouselTimer } from './useCarouselTimer'

const SERVICES = [
  'Concept development',
  'Shop drawings',
  'Material schedules',
  'Budget estimates',
  'Standalone installation',
  'Warranty & service',
]

export function InstallationSection() {
  const { index, setIndex, progress, containerRef } = useCarouselTimer(INSTALLATION_CARDS.length)

  return (
    <div className="flex w-full flex-col gap-[4px] px-[24px] lg:px-[48px]">
      <div className="flex w-full flex-col gap-[32px] py-[32px] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-0">
        <div className="flex flex-col gap-[8px] lg:w-[330px] lg:py-[64px]">
          <p className="text-[16px] leading-normal text-black">
            Product Design, Installation &amp; Maintenance
          </p>
          <p className="text-[14px] leading-[20px] text-ink-50">
            In-house consultants take your architectural plans through to documented specification —
            then our own crews install it. Available alongside what you buy from us, or on its own
            when you already have a contractor. We stay on file long after move-in.
          </p>
        </div>
        <div className="flex flex-col justify-center lg:w-[305px] lg:items-end lg:py-[64px]">
          <div className="text-[20px] leading-normal text-black lg:text-right">
            {SERVICES.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex w-full flex-col items-center gap-[24px]">
        <div className="flex h-[520px] w-full flex-col gap-[8px] lg:h-[440px] lg:flex-row lg:items-stretch">
          {INSTALLATION_CARDS.map((card, i) => {
            const isOpen = i === index
            return (
              <button
                key={card.image}
                type="button"
                aria-expanded={isOpen}
                aria-label={isOpen ? card.caption : `Expand: ${card.caption}`}
                onClick={() => setIndex(i)}
                className={`relative flex min-h-0 min-w-0 items-end justify-end overflow-hidden rounded-[24px] p-[8px] text-left transition-[flex-grow] duration-700 ease-in-out ${
                  isOpen ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{ flex: `${isOpen ? 5.6 : 1} 1 0%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={card.image}
                  className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[24px] object-cover"
                />
                <span
                  className={`relative flex h-[24px] items-center justify-center rounded-[30px] bg-[rgba(246,242,239,0.1)] px-[16px] py-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] backdrop-blur-[7px] transition-opacity duration-500 ${
                    isOpen ? 'opacity-100 delay-300' : 'opacity-0'
                  }`}
                >
                  <span className="font-figtree text-[12px] leading-[20px] font-semibold whitespace-nowrap text-white">
                    {card.caption}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <CarouselDots
          count={INSTALLATION_CARDS.length}
          active={index}
          progress={progress}
          onSelect={setIndex}
        />
      </div>
    </div>
  )
}
