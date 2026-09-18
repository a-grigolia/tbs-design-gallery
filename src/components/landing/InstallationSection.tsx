'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { CarouselDots } from './Carousel'
import { INSTALLATION_CARDS } from './content'

const SERVICES = [
  'Shop drawings',
  'Material schedules',
  'Budget estimates',
  'Installation',
  'Warranty & service',
]

export function InstallationSection() {
  const [index, setIndexState] = useState(0)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const inViewRef = useRef(false)

  const setIndex = useCallback((nextIndex: number) => {
    setProgress(0)
    setIndexState(nextIndex)
  }, [])

  const playIfVisible = useCallback(() => {
    if (inViewRef.current && document.visibilityState === 'visible') {
      void videoRef.current?.play().catch(() => {
        // The poster remains visible if a browser blocks muted autoplay.
      })
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        if (entry.isIntersecting && document.visibilityState === 'visible') {
          playIfVisible()
        } else {
          videoRef.current?.pause()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [playIfVisible])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playIfVisible()
      } else {
        videoRef.current?.pause()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [playIfVisible])

  useEffect(() => {
    playIfVisible()
  }, [index, playIfVisible])

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime, duration } = event.currentTarget
    setProgress(Number.isFinite(duration) && duration > 0 ? currentTime / duration : 0)
  }

  const handleEnded = () => {
    setIndex((index + 1) % INSTALLATION_CARDS.length)
  }

  const enterFullscreen = async () => {
    const video = videoRef.current as
      (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!video) return

    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen()
      } else {
        video.webkitEnterFullscreen?.()
      }
    } catch {
      // Some browsers deny fullscreen when system policy or settings disallow it.
    }
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-[48px] px-[16px] pt-[24px] pb-[48px] lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:px-[48px] lg:py-[48px]">
        <div className="flex flex-col gap-[8px] lg:w-[330px]">
          <h2 className="text-[20px] leading-[26px] text-ink">Services</h2>
          <p className="text-[14px] leading-[20px] text-ink-50">
            From technical product design and documentation through installation, warranty, and
            ongoing service, our team manages the details and stands behind the result.
          </p>
        </div>
        <div className="flex flex-col justify-center lg:w-[305px] lg:items-end">
          <div className="text-[18px] leading-[24px] text-ink lg:text-right">
            {SERVICES.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex w-full flex-col items-center gap-[24px] px-[12px] lg:px-[24px]"
      >
        <div className="flex w-full flex-col gap-[8px] lg:h-[600px] lg:flex-row lg:items-stretch">
          {INSTALLATION_CARDS.map((card, i) => {
            const isOpen = i === index
            return (
              <div
                key={card.video}
                className={`relative flex min-h-0 min-w-0 overflow-hidden transition-[height,flex,width,border-radius] duration-700 ease-in-out ${
                  isOpen
                    ? 'h-[384px] rounded-[24px] lg:h-full lg:flex-[1_1_0%]'
                    : 'h-[40px] rounded-[20px] lg:h-full lg:w-[72px] lg:flex-none lg:rounded-[24px]'
                }`}
              >
                {isOpen ? (
                  <>
                    <video
                      ref={videoRef}
                      key={card.video}
                      muted
                      playsInline
                      poster={card.poster}
                      preload="metadata"
                      src={card.video}
                      aria-label={card.label}
                      onCanPlay={playIfVisible}
                      onEnded={handleEnded}
                      onTimeUpdate={handleTimeUpdate}
                      className="absolute inset-0 size-full max-w-none rounded-[24px] object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`View ${card.label} video fullscreen`}
                      onClick={() => void enterFullscreen()}
                      className="absolute top-[8px] right-[8px] flex size-[32px] items-center justify-center rounded-full text-white transition-colors hover:bg-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 32 32"
                        fill="none"
                        className="size-[32px]"
                      >
                        <path
                          d="M12 8H8v4M20 8h4v4M12 24H8v-4M20 24h4v-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      src={card.poster}
                      className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[24px] object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Play ${card.label} video`}
                      onClick={() => setIndex(i)}
                      className="absolute inset-0 cursor-pointer rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
                    />
                  </>
                )}
              </div>
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
