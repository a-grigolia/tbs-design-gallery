import React from 'react'

import type { Vendor } from '@/payload-types'

import { categoryLabel } from '@/lib/categories'
import { mediaUrl } from './media'

/**
 * Full-width rounded hero inside the blueprint column: hero image (or an
 * autoplaying video when heroVideoUrl is set) with the vendor's logo card,
 * category eyebrow, name, and location clustered bottom-left over a gradient.
 */
export function VendorHero({ vendor }: { vendor: Vendor }) {
  const heroUrl = mediaUrl(vendor.heroImage, 'hero')
  const logo = mediaUrl(vendor.logo, 'card')
  const hasMedia = Boolean(vendor.heroVideoUrl || heroUrl)

  return (
    <div className="w-full p-gutter-sm">
      <div
        className={`relative flex min-h-[420px] w-full flex-col items-start justify-end overflow-hidden rounded-[24px] lg:h-[651px] ${
          hasMedia ? '' : 'border border-hairline bg-cream'
        }`}
      >
        {hasMedia && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {vendor.heroVideoUrl ? (
              <video
                className="absolute inset-0 size-full object-cover"
                src={vendor.heroVideoUrl}
                poster={heroUrl ?? undefined}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                src={heroUrl ?? undefined}
                className="absolute inset-0 size-full max-w-none object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(102, 102, 102, 0) 46%), linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
              }}
            />
          </div>
        )}

        <div className="relative flex items-start gap-[16px] px-[24px] pt-[48px] pb-[24px] lg:px-[32px] lg:pb-[32px]">
          {logo && (
            // Light-mode canvas: vendor logos sit on this fill in both themes.
            <div className="flex h-[96px] w-[120px] shrink-0 items-center justify-center rounded-[12px] border border-hairline bg-[#f6f2ef] p-[16px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`${vendor.name} logo`} src={logo} className="size-full object-contain" />
            </div>
          )}
          <div
            className={`flex flex-col justify-between gap-[12px] self-stretch py-[8px] ${
              hasMedia ? 'text-white' : 'text-ink'
            }`}
          >
            <div className="flex flex-col">
              <p className="text-[10px] leading-[13px] tracking-[0.1px]">
                {categoryLabel(vendor.primaryCategory)}
              </p>
              <h1 className="text-[32px] leading-[32px] font-medium tracking-[0.32px]">
                {vendor.name}
              </h1>
            </div>
            {vendor.location && (
              <p className="text-[14px] leading-[14px] tracking-[0.14px]">{vendor.location}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
