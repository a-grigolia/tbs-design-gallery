import React from 'react'

import { JoineryTee } from '@/components/landing/Blueprint'
import { SiteHeader } from '@/components/landing/SiteHeader'

export function Hero() {
  return (
    /*
     * Drafting frame from Figma 624:5561: full-bleed top hairline, a
     * side-bordered column that starts at the page top (nav + video, no gap
     * between them), and T-joinery marks on the four border intersections.
     * The bottom hairline is the next SectionBand's border-t (bands share
     * hairlines), so only border-t is drawn here.
     */
    <section className="w-full border-t border-hairline px-4 sm:px-8 lg:px-[24px]">
      <div className="relative flex w-full flex-col border-r border-l border-hairline px-[16px] pb-[16px] sm:px-[24px] sm:pb-[24px]">
        <JoineryTee className="-top-[0.5px] -left-[5.5px] rotate-180" />
        <JoineryTee className="-top-[0.5px] -right-[5.5px] rotate-180" />
        <JoineryTee className="-bottom-[0.5px] -left-[5.5px]" />
        <JoineryTee className="-bottom-[0.5px] -right-[5.5px]" />
        <SiteHeader embedded />
        <div className="relative min-h-[480px] w-full overflow-hidden rounded-[24px] lg:aspect-[1632/888] lg:min-h-0">
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
