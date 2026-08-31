import Link from 'next/link'
import React from 'react'

import type { VendorCategory } from '@/lib/categories'

// The windows-doors line is verbatim from the Figma/Webflow template; the
// others follow its pattern per category.
const CTA_HEADINGS: Record<VendorCategory, string> = {
  'windows-doors': "Let's find the right windows & doors for you",
  'custom-cabinetry': "Let's find the right custom cabinetry for you",
  appliances: "Let's find the right appliances for you",
  'outdoor-living': "Let's find the right outdoor living solutions for you",
  'architectural-elements-furniture':
    "Let's find the right architectural elements & furniture for you",
}

export function VendorCta({ category }: { category: VendorCategory }) {
  return (
    <div className="flex w-full flex-col items-start gap-[32px] px-gutter-sm pt-section pb-[24px] lg:px-gutter">
      <div className="flex flex-col gap-[16px]">
        <h2 className="max-w-[444px] font-display text-[36px] leading-[44px] font-bold text-ink">
          {CTA_HEADINGS[category]}
        </h2>
        <p className="max-w-[624px] text-[14px] leading-[18px] text-ink-50">
          If you&apos;re a homeowner working on your dream project or a trade professional looking
          for top quality products, we&apos;re here to help you every step of the way.
        </p>
      </div>
      <Link
        href="/contact"
        className="flex items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[24px] py-[10px] font-figtree text-[14px] leading-[24px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90"
      >
        Contact us
      </Link>
    </div>
  )
}
