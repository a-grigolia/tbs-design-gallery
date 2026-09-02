import Link from 'next/link'
import React from 'react'

import type { Media, Vendor } from '@/payload-types'

import { vendorHref } from '@/lib/categories'

function logoUrl(logo: Vendor['logo']): string | null {
  if (!logo || typeof logo === 'number') return null
  const media = logo as Media
  return media.sizes?.card?.url ?? media.url ?? null
}

export function PartnersSection({ vendors }: { vendors: Vendor[] }) {
  return (
    <>
      <div className="flex w-full flex-col items-start gap-[32px] px-gutter-sm pt-section pb-heading-gap lg:px-gutter">
        <div className="flex flex-col gap-[16px]">
          <h2 className="max-w-[384px] font-display text-[36px] leading-[44px] font-bold text-ink">
            Exceptional products Trusted partners
          </h2>
          <p className="max-w-[624px] text-[14px] leading-[18px] text-ink-50">
            We are proud to represent and offer you the highest quality products in the industry
            from the well-known manufacturers across the United States and worldwide. From custom
            cabinetry, windows, doors, hardwood flooring and hard surfaces to the most amazing
            accessories for any design-build project, TBS DesignGallery has everything for your
            building and remodeling needs.
          </p>
        </div>
        <Link
          href="/contact"
          className="flex items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[24px] py-[10px] font-figtree text-[14px] leading-[24px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90"
        >
          Request a tour of our showroom
        </Link>
      </div>
      {vendors.length > 0 && (
        <div className="@container w-full">
          {/* 6-col at 1100px, not 1200: the column's own hairlines leave the container ~1198px.
              Hairlines live on the cells (box-shadow) so a short last row stays canvas, not grey. */}
          <div className="grid w-full grid-cols-3 overflow-hidden border-y border-hairline @min-[800px]:grid-cols-4 @min-[1000px]:grid-cols-5 @min-[1100px]:grid-cols-6">
            {vendors.map((vendor) => {
              const url = logoUrl(vendor.logo)
              return (
                <Link
                  key={vendor.id}
                  href={vendorHref(vendor)}
                  className="flex h-[129px] min-w-0 items-center justify-center px-[24px] shadow-[1px_0_0_0_var(--palette-hairline),0_1px_0_0_var(--palette-hairline)] transition-colors hover:bg-ink/[0.02] sm:px-[48px]"
                >
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={vendor.name}
                      src={url}
                      className="max-h-[48px] w-full object-contain"
                    />
                  ) : (
                    <p className="text-center text-[14px] leading-[18px] text-ink-40">{vendor.name}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
