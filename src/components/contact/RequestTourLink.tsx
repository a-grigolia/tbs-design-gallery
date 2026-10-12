'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'

import { trackTourBooked } from '@/lib/tracking'

const CALENDLY_ORIGIN = 'https://calendly.com'
const CALENDLY_URL = `${CALENDLY_ORIGIN}/tbsgallery/45min`
const WIDGET_JS = 'https://assets.calendly.com/assets/external/widget.js'
const WIDGET_CSS = 'https://assets.calendly.com/assets/external/widget.css'

// Calendly takes hex without the '#'. Background/text mirror the canvas and ink
// palette in styles.css; primary is the brand red from the original Webflow embed.
const COLORS = {
  light: { background_color: 'f6f2ef', text_color: '000000' },
  dark: { background_color: '0b0908', text_color: 'f6f2ef' },
}
const PRIMARY_COLOR = 'da5d5d'

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
      closePopupWidget: () => void
    }
  }
}

let widgetPromise: Promise<void> | null = null
let opening = false

function inject(element: HTMLLinkElement | HTMLScriptElement) {
  return new Promise<void>((resolve, reject) => {
    element.onload = () => resolve()
    element.onerror = () => {
      element.remove()
      reject(new Error(`Failed to load ${'src' in element ? element.src : element.href}`))
    }
    document.head.appendChild(element)
  })
}

/** Loads Calendly's popup script + stylesheet once, on first intent rather than page load. */
function loadWidget(): Promise<void> {
  if (window.Calendly) return Promise.resolve()
  widgetPromise ??= (() => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = WIDGET_CSS
    const script = document.createElement('script')
    script.src = WIDGET_JS
    script.async = true
    return Promise.all([inject(css), inject(script)]).then(
      () => {
        // Calendly's popup has no Esc handling. Keys pressed inside its
        // cross-origin iframe never reach us, so this only covers focus on the page.
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && document.querySelector('.calendly-overlay')) {
            window.Calendly?.closePopupWidget()
          }
        })
        window.addEventListener('message', (event) => {
          if (event.origin !== CALENDLY_ORIGIN) return
          if (event.data?.event === 'calendly.event_scheduled') trackTourBooked()
        })
      },
      (error) => {
        widgetPromise = null
        throw error
      },
    )
  })()
  return widgetPromise
}

function calendlyUrl(theme: string | undefined) {
  const params = new URLSearchParams({
    hide_gdpr_banner: '1',
    primary_color: PRIMARY_COLOR,
    ...COLORS[theme === 'dark' ? 'dark' : 'light'],
  })
  return `${CALENDLY_URL}?${params}`
}

/**
 * "Request a Tour" CTA. A real link to /book so modified clicks, crawlers, and
 * no-JS visitors still get the booking page; a plain click opens Calendly's popup
 * over the current page instead. If the script is blocked, falls back to
 * Calendly's own page.
 */
export function RequestTourLink({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { resolvedTheme } = useTheme()

  function preload() {
    loadWidget().catch(() => {})
  }

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    if (opening) return
    opening = true
    const url = calendlyUrl(resolvedTheme)
    loadWidget()
      .then(() => window.Calendly?.initPopupWidget({ url }))
      .catch(() => window.location.assign(url))
      .finally(() => {
        opening = false
      })
  }

  return (
    <Link
      href="/book"
      className={className}
      onClick={onClick}
      onPointerEnter={preload}
      onFocus={preload}
    >
      {children}
    </Link>
  )
}
