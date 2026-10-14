import { isLiveHost } from '@/lib/site'

export const GTM_ID = 'GTM-NR7TD5Q'
export const META_PIXEL_ID = '344524082707566'
export const KLAVIYO_COMPANY_ID = 'X6j4PF'

const SWITCH_PARAM = 'tracking'
const SWITCH_KEY = 'tbsTracking'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: (...args: unknown[]) => void
  }
}

/** Persists `?tracking=on|off` so the choice survives client-side navigation. */
export function applyTrackingSwitch() {
  const value = new URLSearchParams(window.location.search).get(SWITCH_PARAM)
  try {
    if (value === 'on') localStorage.setItem(SWITCH_KEY, 'on')
    else if (value === 'off') localStorage.removeItem(SWITCH_KEY)
  } catch {
    // Storage can throw in locked-down private modes; the switch just won't stick.
  }
}

// The Webflow site shares these accounts until launch, so anything else
// (localhost, Vercel URLs) stays silent unless the test switch is on.
export function isTrackingEnabled() {
  if (typeof window === 'undefined') return false
  if (isLiveHost(window.location.hostname)) return true
  try {
    return localStorage.getItem(SWITCH_KEY) === 'on'
  } catch {
    return false
  }
}

function pushDataLayer(event: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

export function trackContactLead() {
  if (!isTrackingEnabled()) return
  window.fbq?.('track', 'Lead')
  pushDataLayer({ event: 'generate_lead', form: 'contact' })
}

export function trackTourBooked() {
  if (!isTrackingEnabled()) return
  window.fbq?.('track', 'Schedule')
  pushDataLayer({ event: 'tour_booked' })
}
