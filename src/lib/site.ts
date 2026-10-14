// Apex → www is a Vercel domain redirect, so www is the one canonical origin.
export const SITE_URL = 'https://www.tbsdesigngallery.com'

// Every other host — localhost, previews, and the tbs-design-gallery.vercel.app
// production alias (where VERCEL_ENV is still 'production') — is treated as non-live.
export const LIVE_HOSTS = ['tbsdesigngallery.com', 'www.tbsdesigngallery.com']

export const isLiveHost = (host: string | null | undefined): boolean =>
  !!host && LIVE_HOSTS.includes(host.split(':')[0].toLowerCase())
