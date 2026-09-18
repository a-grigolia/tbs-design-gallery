'use client'

import useEmblaCarousel from 'embla-carousel-react'
import React, { useEffect, useState } from 'react'

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

/**
 * Auto-advancing horizontal card carousel (the mobile counterpart of the
 * crossfade Carousel): fixed-size slides scroll sideways, every card snaps to
 * the leading 12px gutter except the last, which clamps so no empty space
 * shows. The shared timer advances it and pauses during drag; deactivates at
 * `lg` where sections switch to their desktop layouts.
 */
export function CardCarousel({
  slides,
  intervalMs = 5000,
  className,
}: {
  slides: React.ReactNode[]
  intervalMs?: number
  className?: string
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    duration: 30,
    align: 'start',
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 1024px)': { active: false },
    },
  })

  // trimSnaps merges the trailing snaps that would overscroll, so on wider
  // viewports there can be fewer snap positions than slides — the timer and
  // dots run off the real snap count.
  const [snapCount, setSnapCount] = useState(slides.length)
  const [dragging, setDragging] = useState(false)
  const { index, setIndex, progress, containerRef } = useCarouselTimer(
    snapCount,
    intervalMs,
    dragging,
  )

  useEffect(() => {
    emblaApi?.scrollTo(index)
  }, [emblaApi, index])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap())
    const onReInit = () => setSnapCount(emblaApi.scrollSnapList().length)
    const onPointerDown = () => setDragging(true)
    const onPointerUp = () => setDragging(false)
    onReInit()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onReInit)
    emblaApi.on('pointerDown', onPointerDown)
    emblaApi.on('pointerUp', onPointerUp)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onReInit)
      emblaApi.off('pointerDown', onPointerDown)
      emblaApi.off('pointerUp', onPointerUp)
    }
  }, [emblaApi, setIndex])

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-col items-center gap-[24px] ${className ?? ''}`}
    >
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="-ml-[12px] flex touch-pan-y items-start pr-[12px]">
          {slides.map((slide, i) => (
            <div key={i} className="min-w-0 shrink-0 pl-[12px]">
              {slide}
            </div>
          ))}
        </div>
      </div>
      {snapCount > 1 && (
        <CarouselDots count={snapCount} active={index} progress={progress} onSelect={setIndex} />
      )}
    </div>
  )
}
