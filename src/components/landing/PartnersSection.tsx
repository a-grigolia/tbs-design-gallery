import Link from 'next/link'
import React from 'react'

import type { Media, Vendor } from '@/payload-types'

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
            Partners
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
        <div className="flex w-full flex-wrap items-center justify-center border border-hairline">
          {vendors.map((vendor) => {
            const url = logoUrl(vendor.logo)
            return (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.slug}`}
                className="-mt-px -ml-px flex h-[129px] w-1/2 items-center justify-center border border-hairline px-[24px] transition-colors hover:bg-ink/[0.02] sm:w-[200px] sm:px-[48px]"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={vendor.name}
                    src={url}
                    className="aspect-[499/75] w-full object-contain dark:invert"
                  />
                ) : (
                  <p className="text-center text-[14px] leading-[18px] text-ink-40">{vendor.name}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
