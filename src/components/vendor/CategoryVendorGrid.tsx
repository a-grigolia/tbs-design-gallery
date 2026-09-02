import Link from 'next/link'
import React from 'react'

import type { Vendor } from '@/payload-types'

import { vendorHref } from '@/lib/categories'
import { mediaUrl } from './media'

function CellContent({ vendor }: { vendor: Vendor }) {
  const logo = mediaUrl(vendor.logo, 'card')
  if (!logo) {
    return <p className="text-center text-[14px] leading-[18px] text-ink-40">{vendor.name}</p>
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={vendor.name} src={logo} className="max-h-[48px] w-full object-contain" />
  )
}

/** Logo grid of every vendor listed in the current category; the current vendor is highlighted and unlinked. */
export function CategoryVendorGrid({
  vendors,
  currentId,
}: {
  vendors: Vendor[]
  currentId: number
}) {
  if (vendors.length === 0) return null

  const cellClasses =
    'flex h-[129px] min-w-0 items-center justify-center px-[24px] shadow-[1px_0_0_0_var(--palette-hairline),0_1px_0_0_var(--palette-hairline)] sm:px-[48px]'

  return (
    <div className="@container w-full">
      <div className="grid w-full grid-cols-3 overflow-hidden border-y border-hairline @min-[800px]:grid-cols-4 @min-[1000px]:grid-cols-5 @min-[1100px]:grid-cols-6">
        {vendors.map((vendor) =>
          vendor.id === currentId ? (
            <div key={vendor.id} aria-current="page" className={`${cellClasses} bg-cream`}>
              <CellContent vendor={vendor} />
            </div>
          ) : (
            <Link
              key={vendor.id}
              href={vendorHref(vendor)}
              className={`${cellClasses} transition-colors hover:bg-ink/[0.02]`}
            >
              <CellContent vendor={vendor} />
            </Link>
          ),
        )}
      </div>
    </div>
  )
}
