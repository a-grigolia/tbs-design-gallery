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
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active
        return (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={isActive}
            onClick={() => onSelect(i)}
            className="group flex h-[16px] items-center justify-center px-[2px]"
          >
            {/* One element per dot whose width animates, so the outgoing pill
                shrinks while the incoming one grows (accordion) instead of
                the two swapping instantly. */}
            <span
              className={`relative block h-[6px] overflow-hidden rounded-[30px] bg-ink/15 transition-[width] duration-400 ease-out ${
                isActive ? 'w-[32px]' : 'w-[6px] group-hover:bg-ink/30'
              }`}
            >
              <span
                className={`absolute inset-y-0 left-0 rounded-[30px] bg-ink/60 ${
                  isActive
                    ? 'opacity-100 transition-[width] duration-150 ease-linear'
                    : 'opacity-0 transition-opacity duration-400'
                }`}
                style={{ width: isActive ? `${Math.min(progress, 1) * 100}%` : '100%' }}
              />
            </span>
          </button>
        )
      })}
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
