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
      <div className="flex flex-col items-center gap-[24px] px-4 pt-[96px] pb-[64px] text-center text-black">
        <h2 className="max-w-[384px] font-display text-[36px] leading-[44px] font-bold">Partners</h2>
        <p className="max-w-[656px] text-[16px] leading-[22px]">
          We work with the best names in the United States and Worldwide
        </p>
      </div>
      {vendors.length > 0 && (
        <div className="grid w-full grid-cols-2 border-t border-l border-hairline md:grid-cols-4">
          {vendors.map((vendor) => {
            const url = logoUrl(vendor.logo)
            return (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.slug}`}
                className="flex flex-col items-center justify-center border-r border-b border-hairline p-[24px] transition-colors hover:bg-black/[0.02] sm:p-[48px]"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={vendor.name}
                    src={url}
                    className="aspect-[499/75] w-full object-contain"
                  />
                ) : (
                  <p className="text-center text-[20px] leading-[26px] text-ink-40">{vendor.name}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
