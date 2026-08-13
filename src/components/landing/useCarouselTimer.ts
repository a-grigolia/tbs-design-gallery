'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Drives auto-advancing carousels: tracks the active index and a 0–1 progress
 * value for the current cycle. The timer only runs while the attached
 * container is in the viewport (pauses off-screen, resumes in view), and
 * manually selecting an index resets the cycle.
 */
export function useCarouselTimer(count: number, intervalMs = 5000) {
  const [index, setIndexState] = useState(0)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inViewRef = useRef(false)
  const elapsedRef = useRef(0)
  const indexRef = useRef(0)

  const setIndex = useCallback((i: number) => {
    indexRef.current = i
    elapsedRef.current = 0
    setIndexState(i)
    setProgress(0)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (count < 2) return
    let raf: number
    let last = performance.now()
    let lastRendered = 0

    const tick = (now: number) => {
      const delta = now - last
      last = now
      if (inViewRef.current) {
        elapsedRef.current += delta
        if (elapsedRef.current >= intervalMs) {
          elapsedRef.current = 0
          lastRendered = 0
          const next = (indexRef.current + 1) % count
          indexRef.current = next
          setIndexState(next)
          setProgress(0)
        } else {
          const value = elapsedRef.current / intervalMs
          // Throttle re-renders; the fill smooths steps with a linear width transition.
          if (value - lastRendered >= 0.02) {
            lastRendered = value
            setProgress(value)
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, intervalMs])

  return { index, setIndex, progress, containerRef }
}
