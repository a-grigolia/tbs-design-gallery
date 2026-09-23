import React from 'react'

import type { Media, Vendor } from '@/payload-types'

import { LightboxGallery, type GalleryImage } from './LightboxGallery'
import { asMedia, mediaUrl } from './media'

/**
 * Greedy masonry: each image goes to whichever column is currently shorter
 * (by cumulative aspect ratio), so mixed portrait/landscape shots offset
 * Pinterest-style while admin ordering still reads roughly top-to-bottom.
 * With `groupOf`, an image skips a column that already ends in its own group
 * (when the other doesn't), so the same vendor never stacks vertically.
 */
export function splitColumns<T extends { width?: number | null; height?: number | null }>(
  images: T[],
  groupOf?: (image: T) => string,
): [T[], T[]] {
  const columns: [T[], T[]] = [[], []]
  const heights = [0, 0]
  const endsWith = (column: T[], group: string) =>
    column.length > 0 && groupOf?.(column[column.length - 1]) === group
  for (const image of images) {
    const ratio = image.width && image.height ? image.height / image.width : 1
    let target = heights[0] <= heights[1] ? 0 : 1
    const group = groupOf?.(image)
    if (
      group !== undefined &&
      endsWith(columns[target], group) &&
      !endsWith(columns[1 - target], group)
    ) {
      target = 1 - target
    }
    columns[target].push(image)
    heights[target] += ratio
  }
  return columns
}

export function toGalleryImage(image: Media): GalleryImage | null {
  const src = mediaUrl(image, 'card')
  if (!src) return null
  return {
    src,
    full: mediaUrl(image, 'hero') ?? undefined,
    alt: image.alt,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  }
}

export function VendorGallery({ vendor }: { vendor: Vendor }) {
  const images = (vendor.gallery ?? [])
    .map(asMedia)
    .filter((media): media is Media => media !== null)

  const hasGallery = images.length > 0
  if (!hasGallery && !vendor.externalUrl) return null

  const [left, right] = splitColumns(images)

  return (
    <>
      {hasGallery && (
        <LightboxGallery
          className="px-[12px] lg:px-[24px]"
          columns={[left, right]
            .map((column) =>
              column.map(toGalleryImage).filter((image): image is GalleryImage => image !== null),
            )
            .filter((column) => column.length > 0)}
        />
      )}
      {vendor.externalUrl && (
        <div className="flex flex-col items-center py-[48px]">
          <a
            href={vendor.externalUrl}
            target="_blank"
            rel="noopener"
            className="flex h-[40px] items-center justify-center rounded-[44px] border border-hairline px-[24px] py-[10px] text-[14px] leading-[18px] text-ink transition-colors hover:bg-ink/[0.04]"
          >
            Visit {vendor.name}
          </a>
        </div>
      )}
    </>
  )
}
