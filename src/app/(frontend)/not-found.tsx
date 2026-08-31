import Link from 'next/link'
import React from 'react'

import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteHeader } from '@/components/landing/SiteHeader'

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />
      <SectionBand className="flex-1 border-b">
        <BlueprintColumn className="min-h-[480px] flex-1 items-center justify-center gap-[24px] py-section">
          <p className="font-figtree text-[10px] leading-[13px] text-ink-50">404</p>
          <h1 className="text-center font-display text-[36px] leading-[44px] font-bold text-ink">
            Page not found
          </h1>
          <p className="max-w-[444px] text-center text-[14px] leading-[18px] text-ink-50">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <Link
            href="/"
            className="flex items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[24px] py-[10px] font-figtree text-[14px] leading-[24px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90"
          >
            Back to the showroom
          </Link>
        </BlueprintColumn>
      </SectionBand>
    </div>
  )
}
