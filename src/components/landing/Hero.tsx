'use client'

import React, { useEffect, useRef } from 'react'

import { JoineryTee } from '@/components/landing/Blueprint'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const topRuleRef = useRef<HTMLDivElement>(null)
  const bottomRuleRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const frame = frameRef.current
    const topRule = topRuleRef.current
    const bottomRule = bottomRuleRef.current
    const media = mediaRef.current
    const heading = headingRef.current

    if (!section || !viewport || !frame || !topRule || !bottomRule || !media || !heading) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const render = () => {
      animationFrame = 0

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const outerGutter = viewportWidth >= 1024 ? 24 : viewportWidth >= 640 ? 32 : 16
      const innerPadding = viewportWidth >= 640 ? 24 : 16
      const targetX = outerGutter + innerPadding + 1
      const targetY = 60 + innerPadding + 1
      const targetWidth = viewportWidth - targetX * 2
      const targetHeight =
        viewportWidth >= 1024 ? targetWidth / 2 : Math.max(480, viewportHeight * 0.68)
      const targetBottom = targetY + targetHeight + innerPadding + 1
      const staticLayout = reducedMotion.matches || targetBottom >= viewportHeight - 48
      const scrollDistance = Math.max(viewportHeight - targetBottom, 1)

      const progress = staticLayout
        ? 1
        : Math.min(Math.max(-section.getBoundingClientRect().top / scrollDistance, 0), 1)
      const frameProgress = Math.min(Math.max((progress - 0.42) / 0.58, 0), 1)
      const easedProgress = progress * progress * (3 - 2 * progress)

      const x = targetX * progress
      const y = targetY * progress
      const width = viewportWidth + (targetWidth - viewportWidth) * progress
      const height = viewportHeight + (targetHeight - viewportHeight) * progress

      media.style.transform = `translate3d(${x}px, ${y}px, 0)`
      media.style.width = `${width}px`
      media.style.height = `${height}px`
      media.style.borderRadius = `${24 * progress}px`
      frame.style.opacity = `${frameProgress}`
      topRule.style.opacity = `${frameProgress}`
      bottomRule.style.opacity = `${frameProgress}`
      heading.style.transform = `scale(${1 - easedProgress * 0.08})`

      frame.style.top = '60px'
      frame.style.left = `${outerGutter}px`
      frame.style.width = `${viewportWidth - outerGutter * 2}px`
      frame.style.height = `${targetHeight + innerPadding * 2 + 2}px`
      bottomRule.style.top = `${targetBottom}px`

      if (staticLayout) {
        section.style.height = `${targetBottom}px`
        viewport.style.position = 'relative'
        viewport.style.height = `${targetBottom}px`
      } else {
        section.style.height = `${viewportHeight}px`
        viewport.style.position = ''
        viewport.style.height = `${targetBottom}px`
      }
    }

    const requestRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    reducedMotion.addEventListener('change', requestRender)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      reducedMotion.removeEventListener('change', requestRender)
    }
  }, [])

  return (
    /*
     * The sticky viewport starts behind the header, then the video settles
     * into the drafting frame from Figma 677:6932. The extra section height
     * is the scroll runway; once it ends, the completed frame moves with the
     * rest of the page.
     */
    <section ref={sectionRef} className="relative -mt-[60px] h-dvh w-full">
      <div ref={viewportRef} className="sticky top-0 h-dvh w-full">
        <div
          ref={topRuleRef}
          aria-hidden
          className="pointer-events-none absolute top-[60px] right-0 left-0 border-t border-hairline opacity-0"
        />
        <div
          ref={bottomRuleRef}
          aria-hidden
          className="pointer-events-none absolute right-0 left-0 border-t border-hairline opacity-0"
        />
        <div
          ref={frameRef}
          aria-hidden
          className="pointer-events-none absolute border-r border-l border-hairline opacity-0"
        >
          <JoineryTee className="-top-[1px] -left-[6.5px] rotate-180" />
          <JoineryTee className="-top-[1px] -right-[6.5px] rotate-180" />
          <JoineryTee className="-bottom-[1px] -left-[6.5px]" />
          <JoineryTee className="-bottom-[1px] -right-[6.5px]" />
        </div>
        <div
          ref={mediaRef}
          className="absolute top-0 left-0 z-10 h-dvh w-screen overflow-hidden will-change-transform"
        >
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
            <h1
              ref={headingRef}
              className="flex flex-col items-center text-center font-display text-[clamp(2rem,1.25rem+2.5vw,3.25rem)] leading-none font-semibold tracking-[0.015em] text-white will-change-transform"
            >
              <span>Custom solutions</span>
              <span>for every space</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
