import React from 'react'

import type { Media, Vendor } from '@/payload-types'

import { asMedia, mediaUrl } from './media'

/**
 * Greedy masonry: each image goes to whichever column is currently shorter
 * (by cumulative aspect ratio), so mixed portrait/landscape shots offset
 * Pinterest-style while admin ordering still reads roughly top-to-bottom.
 */
function splitColumns(images: Media[]): [Media[], Media[]] {
  const columns: [Media[], Media[]] = [[], []]
  const heights = [0, 0]
  for (const image of images) {
    const ratio = image.width && image.height ? image.height / image.width : 1
    const target = heights[0] <= heights[1] ? 0 : 1
    columns[target].push(image)
    heights[target] += ratio
  }
  return columns
}

function GalleryImage({ image }: { image: Media }) {
  const url = mediaUrl(image, 'card')
  if (!url) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={image.alt}
      src={url}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      loading="lazy"
      className="h-auto w-full rounded-[16px] object-cover"
    />
  )
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
        <div className="flex w-full flex-col gap-[8px] px-gutter-sm md:flex-row md:items-start">
          <div className="flex min-w-px flex-1 flex-col gap-[8px]">
            {left.map((image) => (
              <GalleryImage key={image.id} image={image} />
            ))}
          </div>
          {right.length > 0 && (
            <div className="flex min-w-px flex-1 flex-col gap-[8px]">
              {right.map((image) => (
                <GalleryImage key={image.id} image={image} />
              ))}
            </div>
          )}
        </div>
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
