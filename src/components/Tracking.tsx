'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import React, { useEffect, useRef, useSyncExternalStore } from 'react'

import {
  GTM_ID,
  KLAVIYO_COMPANY_ID,
  META_PIXEL_ID,
  applyTrackingSwitch,
  isTrackingEnabled,
} from '@/lib/tracking'

const emptySubscribe = () => () => {}

function getEnabled() {
  applyTrackingSwitch()
  return isTrackingEnabled()
}

const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

const META_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`

/**
 * GTM, Meta Pixel, and Klaviyo, gated to the live domain (or the `?tracking=on`
 * test switch) and decided after hydration, since ISR pages can't know the host.
 */
export function Tracking() {
  const enabled = useSyncExternalStore(emptySubscribe, getEnabled, () => false)
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  // The Pixel snippet only sends the initial PageView; client-side navigations
  // never reload it. GA4 covers these itself via history-change measurement.
  useEffect(() => {
    if (!enabled) return
    if (lastPathname.current !== null && lastPathname.current !== pathname) {
      window.fbq?.('track', 'PageView')
    }
    lastPathname.current = pathname
  }, [enabled, pathname])

  if (!enabled) return null

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {GTM_SNIPPET}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {META_PIXEL_SNIPPET}
      </Script>
      <Script
        id="klaviyo"
        src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
        strategy="lazyOnload"
      />
    </>
  )
}
