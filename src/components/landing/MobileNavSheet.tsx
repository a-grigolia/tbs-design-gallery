'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { NavCategoryPhoto } from '@/components/landing/CategoryMegaMenu'
import { VENDOR_CATEGORIES } from '@/lib/categories'

const SHEET_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const OPEN_EASE = 'cubic-bezier(0.32,0.72,0,1)'
const CLOSE_MS = 280

/**
 * Mobile menu bottom sheet (Figma 1061:1554). A modal <dialog> puts it in the
 * top layer above the sticky header and keeps focus inside; the dialog stays
 * open through the slide-down so closing animates instead of vanishing.
 */
export function MobileNavSheet({
  id,
  open,
  onClose,
  returnFocusRef,
}: {
  id: string
  open: boolean
  onClose: () => void
  returnFocusRef: React.RefObject<HTMLElement | null>
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  // `entered` flips on a frame after showModal() and off once the dialog has
  // actually closed, so `shown` drops the instant `open` does (animating out).
  const [entered, setEntered] = useState(false)
  const [categoriesExpanded, setCategoriesExpanded] = useState(true)
  const shown = open && entered

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
      // Two frames so the closed transform is committed before the open one,
      // otherwise the first open would jump straight to the end state.
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setEntered(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    if (!dialog.open) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(
      () => {
        dialog.close()
        setEntered(false)
        document.documentElement.style.overflow = ''
        returnFocusRef.current?.focus()
      },
      reducedMotion ? 0 : CLOSE_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [open, returnFocusRef])

  useEffect(() => () => void (document.documentElement.style.overflow = ''), [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    // Esc fires `cancel`; take it over so the sheet animates out. Chrome can
    // still force-close on a repeated Esc, which `close` catches.
    const onCancel = (event: Event) => {
      event.preventDefault()
      onCloseRef.current()
    }
    const onForcedClose = () => {
      setEntered(false)
      document.documentElement.style.overflow = ''
      onCloseRef.current()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('close', onForcedClose)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('close', onForcedClose)
    }
  }, [])

  // Swipe to dismiss. Touch events rather than pointer events: the browser
  // cancels pointer streams once it starts panning, and only a non-passive
  // touchmove can claim the downward pull while the sheet is scrolled to top.
  useEffect(() => {
    const panel = panelRef.current
    const sheet = sheetRef.current
    const backdrop = backdropRef.current
    if (!panel || !sheet || !backdrop) return

    let startY = 0
    let lastY = 0
    let lastTime = 0
    let velocity = 0
    let tracking = false
    let dragging = false

    const reset = () => {
      panel.style.transform = ''
      panel.style.transitionDuration = ''
      backdrop.style.opacity = ''
      backdrop.style.transitionDuration = ''
    }

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      startY = lastY = event.touches[0].clientY
      lastTime = event.timeStamp
      velocity = 0
      tracking = sheet.scrollTop <= 0
      dragging = false
    }

    const onTouchMove = (event: TouchEvent) => {
      if (!tracking) return
      const y = event.touches[0].clientY
      const offset = y - startY

      if (!dragging) {
        // Claim the gesture on its first downward move: once the browser has
        // started its own pan, touchmove is no longer cancelable.
        if (offset < 0) {
          tracking = false
          return
        }
        if (offset === 0) return
        dragging = true
        panel.style.transitionDuration = '0s'
        backdrop.style.transitionDuration = '0s'
      }

      event.preventDefault()
      const dt = Math.max(event.timeStamp - lastTime, 1)
      velocity = (y - lastY) / dt
      lastY = y
      lastTime = event.timeStamp

      const drag = Math.max(offset, 0)
      panel.style.transform = `translate3d(0, ${drag}px, 0)`
      backdrop.style.opacity = `${Math.max(1 - drag / panel.offsetHeight, 0)}`
    }

    const onTouchEnd = () => {
      if (!dragging) {
        tracking = false
        return
      }
      const dismiss = lastY - startY > panel.offsetHeight * 0.25 || velocity > 0.5
      tracking = dragging = false
      // Clearing the inline styles hands the transform back to the class, so
      // the sheet animates from where the finger let go (out or back up).
      reset()
      if (dismiss) onCloseRef.current()
    }

    panel.addEventListener('touchstart', onTouchStart, { passive: true })
    panel.addEventListener('touchmove', onTouchMove, { passive: false })
    panel.addEventListener('touchend', onTouchEnd)
    panel.addEventListener('touchcancel', onTouchEnd)
    return () => {
      panel.removeEventListener('touchstart', onTouchStart)
      panel.removeEventListener('touchmove', onTouchMove)
      panel.removeEventListener('touchend', onTouchEnd)
      panel.removeEventListener('touchcancel', onTouchEnd)
      reset()
    }
  }, [])

  return (
    /*
     * overflow-clip, not -hidden: showModal() focuses the close button while
     * the sheet is still translated off-screen, and an overflow:hidden box is
     * still programmatically scrollable — the dialog would scroll to reveal
     * it, then snap back as the sheet slides in.
     */
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Site menu"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-clip border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      <div
        ref={backdropRef}
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-black/25 transition-opacity motion-reduce:transition-none ${
          shown ? 'opacity-100 duration-[450ms]' : 'opacity-0 duration-[280ms]'
        }`}
      />
      <div
        ref={panelRef}
        style={{ transitionTimingFunction: shown ? OPEN_EASE : 'ease-in' }}
        className={`absolute inset-x-0 bottom-0 transition-transform motion-reduce:transition-none ${
          shown
            ? 'translate-y-0 duration-[450ms]'
            : 'translate-y-[calc(100%+52px)] duration-[280ms]'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={`absolute right-[8px] bottom-[calc(100%+8px)] flex size-[36px] items-center justify-center rounded-full bg-cream shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] transition-[opacity,translate] ease-out motion-reduce:transition-none ${
            shown
              ? 'translate-y-0 opacity-100 delay-[80ms] duration-300'
              : 'translate-y-[8px] opacity-0 duration-150'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src="/landing/nav-close.svg"
            className="block h-[12.3745px] w-[12.435px] max-w-none dark:invert"
          />
        </button>
        <div
          ref={sheetRef}
          className="max-h-[calc(100dvh-60px)] overflow-y-auto overscroll-contain rounded-t-[24px] bg-canvas pb-[calc(24px+env(safe-area-inset-bottom))] shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_32px_-4px_rgba(12,12,13,0.1)]"
        >
          <div className="border-b border-hairline/50 px-[12px] py-[16px]">
            <button
              type="button"
              aria-expanded={categoriesExpanded}
              aria-controls={`${id}-categories`}
              onClick={() => setCategoriesExpanded((expanded) => !expanded)}
              className="flex w-full items-center justify-between px-[12px] font-figtree text-[14px] leading-[22px] text-ink"
            >
              Product Categories
              <span
                aria-hidden
                className={`flex size-[7px] items-center justify-center transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  categoriesExpanded ? 'rotate-90' : 'rotate-0'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src="/landing/nav-chevron.svg"
                  className="block h-[7px] w-[4.2px] max-w-none dark:invert"
                />
              </span>
            </button>
            <div
              id={`${id}-categories`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                categoriesExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="min-h-0 overflow-hidden" inert={!categoriesExpanded}>
                <div className="grid h-[339px] grid-cols-2 grid-rows-3 gap-[8px] pt-[12px]">
                  {VENDOR_CATEGORIES.map((category, index) => (
                    <Link
                      key={category.value}
                      href={`/${category.value}`}
                      onClick={onClose}
                      className={`relative flex items-end overflow-hidden rounded-[12px] p-[12px] ${
                        index === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      {/*
                       * Full-tile scrim per Figma 1061:1561 — these tiles are too
                       * short for the cards' half-height fade to reach the label.
                       * The soft shadow keeps it legible over near-white patches.
                       */}
                      <NavCategoryPhoto
                        category={category.value}
                        scrimClassName="bg-[linear-gradient(to_bottom,rgba(0,0,0,0.23),rgba(0,0,0,0.75))]"
                      />
                      <span className="relative text-[14px] leading-[18px] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                        {category.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {SHEET_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between border-b border-hairline/50 px-[24px] py-[16px] text-[14px] leading-[18px] text-ink"
            >
              {link.label}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src="/landing/nav-arrow.svg"
                className="block h-[7px] w-[9.65px] max-w-none dark:invert"
              />
            </Link>
          ))}
        </div>
      </div>
    </dialog>
  )
}
