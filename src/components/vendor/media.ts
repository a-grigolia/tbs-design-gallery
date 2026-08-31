import type { Media } from '@/payload-types'

type MediaSize = 'thumbnail' | 'card' | 'hero'

/** Narrows Payload's `number | Media` relation shape (numbers mean depth wasn't populated). */
export function asMedia(value: number | Media | null | undefined): Media | null {
  if (!value || typeof value === 'number') return null
  return value
}

export function mediaUrl(
  value: number | Media | null | undefined,
  size?: MediaSize,
): string | null {
  const media = asMedia(value)
  if (!media) return null
  const sized = size ? media.sizes?.[size]?.url : null
  return sized ?? media.url ?? null
}
