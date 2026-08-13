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
          <h1 className="absolute inset-0 flex flex-col items-center justify-center text-center font-display text-[36px] leading-[1] font-extrabold tracking-[0.64px] text-white sm:text-[48px] lg:text-[64px]">
            <span>Custom solutions</span>
            <span>for every space</span>
          </h1>
        </div>
      </div>
    </section>
  )
}
