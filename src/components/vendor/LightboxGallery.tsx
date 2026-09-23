'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

export type GalleryImage = {
  /** Grid thumbnail source. */
  src: string
  /** Higher-resolution source for the fullscreen view; falls back to `src`. */
  full?: string
  alt: string
  width?: number
  height?: number
  /** Tailwind aspect class for hardcoded galleries without stored dimensions. */
  aspect?: string
  /** Linked label over the tile and in the lightbox (category pages: the vendor). */
  caption?: { label: string; href: string }
}

/**
 * The vendor/category masonry grid with a click-to-expand lightbox: images
 * open fullscreen and cycle with the on-screen arrows or arrow keys, in
 * column order (left column top-to-bottom, then right).
 */
export function LightboxGallery({
  columns,
  className,
}: {
  columns: GalleryImage[][]
  className?: string
}) {
  const images = columns.flat()
  const [active, setActive] = useState<number | null>(null)
  const open = active !== null

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (delta: number) =>
      setActive((current) =>
        current === null ? current : (current + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKeyDown)
    // Lock page scroll behind the overlay.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close, step])

  const columnNodes = columns.map((column, columnIndex) => {
    const start = columns
      .slice(0, columnIndex)
      .reduce((total, previous) => total + previous.length, 0)
    return (
      <div key={columnIndex} className="flex min-w-px flex-1 flex-col gap-[8px]">
        {column.map((image, imageIndex) => (
          <div key={image.src} className="relative">
            <button
              type="button"
              onClick={() => setActive(start + imageIndex)}
              className="relative block w-full cursor-zoom-in overflow-hidden rounded-[16px]"
              aria-label={`View ${image.alt} full screen`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.alt}
                src={image.src}
                width={image.width}
                height={image.height}
                loading="lazy"
                className={`block w-full object-cover ${image.aspect ?? 'h-auto'}`}
              />
              {image.caption && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(64,64,64,0)_50%,rgba(0,0,0,0.4))]"
                />
              )}
            </button>
            {/* A sibling, not a child: links can't nest inside the zoom button. */}
            {image.caption && (
              <Link
                href={image.caption.href}
                className="group/name absolute right-[16px] bottom-[16px] flex items-center text-right text-[14px] leading-[18px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="transition-[translate] duration-250 ease-out group-hover/name:-translate-x-[26px] group-focus-visible/name:-translate-x-[26px]">
                  {image.caption.label}
                </span>
                <span
                  aria-hidden
                  className="absolute right-0 h-[10px] w-[14px] opacity-0 transition-opacity duration-250 group-hover/name:opacity-100 group-focus-visible/name:opacity-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src="/landing/arrows-updown.svg"
                    className="block size-full max-w-none invert"
                  />
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>
    )
  })

  const current = active !== null ? images[active] : null

  return (
    <>
      <div
        className={`flex w-full flex-col gap-[8px] md:flex-row md:items-start ${className ?? ''}`}
      >
        {columnNodes}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-[16px] backdrop-blur-[8px] sm:p-[64px]"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={current.alt}
            src={current.full ?? current.src}
            className="max-h-full max-w-full rounded-[16px] object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute top-[16px] right-[16px] flex size-[40px] items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-white/10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 2l10 10M12 2 2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  step(-1)
                }}
                aria-label="Previous image"
                className="absolute top-1/2 left-[8px] flex size-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-white/10 sm:left-[16px]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M10 3 5 8l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  step(1)
                }}
                aria-label="Next image"
                className="absolute top-1/2 right-[8px] flex size-[40px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-white/10 sm:right-[16px]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="m6 3 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {(current.caption || images.length > 1) && (
            <div className="absolute bottom-[20px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[4px]">
              {current.caption && (
                <Link
                  href={current.caption.href}
                  onClick={(event) => event.stopPropagation()}
                  className="text-[14px] leading-[18px] whitespace-nowrap text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {current.caption.label}
                </Link>
              )}
              {images.length > 1 && (
                <p className="font-figtree text-[12px] leading-[16px] text-white/70">
                  {(active ?? 0) + 1} / {images.length}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
