import Link from 'next/link'
import React from 'react'

export function Hero() {
  return (
    <section className="flex w-full flex-col items-center pt-[24px] pb-[48px]">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="relative min-h-[480px] w-full overflow-hidden rounded-[32px] lg:aspect-[1632/858] lg:min-h-0">
          {/*
           * Placeholder source — drop the real showcase video at
           * public/landing/hero-video.mp4. The Figma frame renders as the
           * poster until then.
           */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/landing/hero-poster.png"
            className="absolute inset-0 size-full object-cover"
          >
            <source src="/landing/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[28px] px-[16px] sm:gap-[36px] lg:gap-[48px]">
            <h1 className="flex flex-col items-center text-center font-display text-[32px] leading-[1.333] font-bold tracking-[0.48px] text-white sm:text-[48px]">
              <span>Custom solutions</span>
              <span>for every space</span>
            </h1>
            <Link
              href="/contact"
              className="flex items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[20px] py-[10px] font-figtree text-[13px] leading-[24px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:px-[24px] sm:text-[14px]"
            >
              Request a tour of our showroom
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
