'use client'

import React from 'react'

import { useCarouselTimer } from './useCarouselTimer'

export function CarouselDots({
  count,
  active,
  progress,
  onSelect,
}: {
  count: number
  active: number
  progress: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-[4px]">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === active}
          onClick={() => onSelect(i)}
          className="group flex h-[16px] items-center justify-center px-[2px]"
        >
          {i === active ? (
            <span className="relative block h-[6px] w-[32px] overflow-hidden rounded-[30px] bg-[#d1cecb]">
              <span
                className="absolute inset-y-0 left-0 rounded-[30px] bg-black/60 transition-[width] duration-150 ease-linear"
                style={{ width: `${Math.min(progress, 1) * 100}%` }}
              />
            </span>
          ) : (
            <span className="block size-[6px] rounded-[30px] bg-black/15 transition-colors duration-300 group-hover:bg-black/30" />
          )}
        </button>
      ))}
    </div>
  )
}

/**
 * Auto-advancing crossfade carousel. The active slide sizes the container;
 * the rest are stacked underneath and faded out. The cycle only runs while
 * the carousel is in view, and the active dot fills up as progress.
 */
export function Carousel({
  slides,
  intervalMs = 5000,
  className,
}: {
  slides: React.ReactNode[]
  intervalMs?: number
  className?: string
}) {
  const count = slides.length
  const { index, setIndex, progress, containerRef } = useCarouselTimer(count, intervalMs)

  return (
    <div ref={containerRef} className={`flex w-full flex-col items-center gap-[24px] ${className ?? ''}`}>
      <div className="relative w-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${
              i === index ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
            }`}
            aria-hidden={i !== index}
          >
            {slide}
          </div>
        ))}
      </div>
      {count > 1 && <CarouselDots count={count} active={index} progress={progress} onSelect={setIndex} />}
    </div>
  )
}
