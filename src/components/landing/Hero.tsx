'use client'

import React, { useEffect, useRef } from 'react'

import { JoineryTee } from '@/components/landing/Blueprint'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const heightProbeRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const topRuleRef = useRef<HTMLDivElement>(null)
  const bottomRuleRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const heightProbe = heightProbeRef.current
    const frame = frameRef.current
    const topRule = topRuleRef.current
    const bottomRule = bottomRuleRef.current
    const media = mediaRef.current
    const heading = headingRef.current

    if (
      !section ||
      !viewport ||
      !heightProbe ||
      !frame ||
      !topRule ||
      !bottomRule ||
      !media ||
      !heading
    )
      return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0
    let headerCompact: boolean | undefined
    let geometry:
      | {
          viewportWidth: number
          viewportHeight: number
          targetX: number
          targetY: number
          targetWidth: number
          targetHeight: number
          targetBottom: number
          scrollDistance: number
          staticLayout: boolean
        }
      | undefined

    const render = () => {
      animationFrame = 0
      if (!geometry) return

      const {
        viewportWidth,
        viewportHeight,
        targetX,
        targetY,
        targetWidth,
        targetHeight,
        scrollDistance,
        staticLayout,
      } = geometry

      const progress = staticLayout
        ? 1
        : Math.min(Math.max(-section.getBoundingClientRect().top / scrollDistance, 0), 1)
      const frameProgress = Math.min(Math.max((progress - 0.42) / 0.58, 0), 1)
      const easedProgress = progress * progress * (3 - 2 * progress)
      const nextHeaderCompact = staticLayout || progress > 0.12

      if (nextHeaderCompact !== headerCompact) {
        headerCompact = nextHeaderCompact
        document.documentElement.dataset.landingHeroCompact = String(nextHeaderCompact)
        window.dispatchEvent(
          new CustomEvent('landing-hero-compact-change', { detail: nextHeaderCompact }),
        )
      }

      const x = targetX * progress
      const y = targetY * progress
      const width = viewportWidth + (targetWidth - viewportWidth) * progress
      const height = viewportHeight + (targetHeight - viewportHeight) * progress

      media.style.transform = `translate3d(${x}px, ${y}px, 0)`
      media.style.width = `${width}px`
      media.style.height = `${height}px`
      media.style.borderRadius = `${24 * easedProgress}px`
      frame.style.opacity = `${frameProgress}`
      topRule.style.opacity = `${frameProgress}`
      bottomRule.style.opacity = `${frameProgress}`
      heading.style.transform = `scale(${1 - easedProgress * 0.08})`
    }

    const measure = () => {
      // `innerHeight` and `dvh` change as mobile browser chrome opens and
      // closes. Measuring `svh` keeps scroll geometry stable through that UI.
      const viewportWidth = document.documentElement.clientWidth
      const viewportHeight = heightProbe.offsetHeight
      const outerGutter = viewportWidth >= 1024 ? 24 : viewportWidth >= 640 ? 32 : 16
      const innerPadding = viewportWidth >= 640 ? 24 : 16
      const targetX = outerGutter + innerPadding + 1
      const targetY = 60 + innerPadding + 1
      const targetWidth = viewportWidth - targetX * 2
      const preferredTargetHeight = Math.max(targetWidth / 2, 480)
      // Preserve the preferred composition whenever it fits. Very wide,
      // short viewports cap the final height so fullscreen always has enough
      // runway to animate instead of falling into the instant handoff.
      const minimumScrollDistance = 96
      const availableTargetHeight = Math.max(
        viewportHeight - targetY - innerPadding - 1 - minimumScrollDistance,
        1,
      )
      const targetHeight = Math.min(preferredTargetHeight, availableTargetHeight)
      const targetBottom = targetY + targetHeight + innerPadding + 1
      const staticLayout = reducedMotion.matches
      const pinnedLayout = !staticLayout && targetBottom < viewportHeight
      const scrollDistance = pinnedLayout ? viewportHeight - targetBottom : 1

      geometry = {
        viewportWidth,
        viewportHeight,
        targetX,
        targetY,
        targetWidth,
        targetHeight,
        targetBottom,
        scrollDistance,
        staticLayout,
      }

      frame.style.top = '60px'
      frame.style.left = `${outerGutter}px`
      frame.style.width = `${viewportWidth - outerGutter * 2}px`
      frame.style.height = `${targetHeight + innerPadding * 2 + 2}px`
      bottomRule.style.top = `${targetBottom}px`

      if (staticLayout) {
        section.style.height = `${targetBottom}px`
        viewport.style.position = 'relative'
        viewport.style.height = `${targetBottom}px`
      } else if (pinnedLayout) {
        section.style.height = `${viewportHeight}px`
        viewport.style.position = ''
        viewport.style.height = `${targetBottom}px`
      } else {
        // Extremely short landscape viewports cannot contain the completed
        // frame and a sticky runway simultaneously. Preserve the fullscreen
        // opening, then hand off quickly to the taller in-flow frame.
        section.style.height = `${targetBottom}px`
        viewport.style.position = 'relative'
        viewport.style.height = `${targetBottom}px`
      }

      render()
    }

    const requestRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render)
    }

    const requestMeasure = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestMeasure)
    reducedMotion.addEventListener('change', requestMeasure)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      delete document.documentElement.dataset.landingHeroCompact
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestMeasure)
      reducedMotion.removeEventListener('change', requestMeasure)
    }
  }, [])

  return (
    /*
     * The sticky viewport starts behind the header, then the video settles
     * into the drafting frame from Figma 677:6932. The difference between
     * the stable viewport and final frame heights becomes the scroll runway,
     * keeping the following section attached to the frame throughout.
     */
    <section ref={sectionRef} className="relative -mt-[60px] h-svh w-full">
      <div ref={heightProbeRef} aria-hidden className="pointer-events-none absolute h-svh w-px" />
      <div ref={viewportRef} className="sticky top-0 h-svh w-full">
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
          className="absolute top-0 left-0 z-10 h-svh w-screen overflow-hidden [contain:layout_paint] will-change-[transform,width,height,border-radius]"
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
              src="https://media.tbsdesigngallery.com/renson-showcase-hd-1.mp4"
              type="video/mp4"
            />
          </video>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[16px]">
            <h1
              ref={headingRef}
              className="flex flex-col items-center text-center text-[clamp(2rem,1.25rem+2.5vw,3rem)] leading-[1.042] tracking-[0.015em] text-white will-change-transform"
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
