import React from 'react'

import { JoineryTee } from '@/components/landing/Blueprint'

export function Hero() {
  return (
    /*
     * Drafting frame from Figma 677:6932: full-bleed top hairline, a
     * side-bordered column around the video, and T-joinery marks on the
     * four border intersections. The nav sits above this section. The
     * bottom hairline is the next SectionBand's border-t (bands share
     * hairlines), so only border-t is drawn here.
     */
    <section className="w-full border-t border-hairline px-4 sm:px-8 lg:px-[24px]">
      <div className="relative w-full border-r border-l border-hairline p-[16px] sm:p-[24px]">
        <JoineryTee className="-top-[1px] -left-[6.5px] rotate-180" />
        <JoineryTee className="-top-[1px] -right-[6.5px] rotate-180" />
        <JoineryTee className="-bottom-[1px] -left-[6.5px]" />
        <JoineryTee className="-bottom-[1px] -right-[6.5px]" />
        <div className="relative min-h-[480px] w-full overflow-hidden rounded-[24px] lg:aspect-[2/1] lg:min-h-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/landing/hero-poster.png"
            className="absolute inset-0 size-full object-cover"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/renson-showcase-hd-1.mp4`}
              type="video/mp4"
            />
          </video>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[16px]">
            <h1 className="flex flex-col items-center text-center font-display text-[clamp(2rem,1.25rem+2.5vw,3.25rem)] leading-none font-semibold tracking-[0.015em] text-white">
              <span>Custom solutions</span>
              <span>for every space</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
