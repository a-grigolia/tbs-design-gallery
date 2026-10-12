import type { Metadata } from 'next'

import Link from 'next/link'
import React from 'react'

import { RequestTourLink } from '@/components/contact/RequestTourLink'
import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { TickRule } from '@/components/vendor/TickRule'

const MEDIA = 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media'

export const metadata: Metadata = {
  // Title and description inherited verbatim from the Webflow /book page — they
  // carry its ranking history.
  title: 'Book Your Custom Home Design Appointment Today',
  description:
    'Book your custom home design appointment with TBS Design Gallery to find the custom finishes you want for your new custom home. Learn more>',
}

const DETAILS = [
  { label: 'Duration', lines: ['45 minutes'] },
  { label: 'Address', lines: ['3283 De La Cruz Blvd, Suite A', 'Santa Clara, CA 95054'] },
  { label: 'Hours', lines: ['Monday - Friday: 10am-3pm'] },
  { label: 'Phone', lines: ['(650) 416-8888'] },
]

export default function BookPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      <SectionBand>
        <BlueprintColumn corner="tee">
          <div className="flex w-full items-center px-gutter-sm pt-[96px] pb-[24px] lg:px-gutter">
            <div className="flex w-full max-w-[420px] flex-col gap-[16px]">
              <h1 className="font-display text-[36px] leading-[46px] font-semibold text-ink">
                Request your design gallery visit
              </h1>
              <p className="text-[14px] leading-[18px] text-ink-50">
                We are open strictly by appointment, so every visit is a private, personal
                consultation. Pick a time that suits you; all requests are subject to review and
                confirmation by our office.
              </p>
            </div>
          </div>

          <TickRule label="Book a visit" />

          <div className="flex w-full flex-col gap-[32px] px-gutter-sm pt-[32px] pb-[48px] lg:flex-row lg:items-center lg:gap-[48px] lg:px-gutter">
            <div className="flex w-full flex-col justify-center gap-[48px] lg:w-[400px] lg:shrink-0 lg:self-stretch">
              <div className="flex flex-col gap-[24px]">
                {DETAILS.map((detail) => (
                  <div key={detail.label} className="flex max-w-[305px] flex-col gap-[8px]">
                    <p className="text-[16px] text-ink">{detail.label}</p>
                    <p className="text-[14px] text-ink-50">
                      {detail.lines.map((line, index) => (
                        <React.Fragment key={line}>
                          {index > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-[16px]">
                <RequestTourLink className="flex h-[40px] w-fit items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[24px] py-[10px] font-figtree text-[14px] leading-[24px] text-white transition-opacity hover:opacity-90">
                  Pick a time
                </RequestTourLink>
                <p className="max-w-[305px] text-[14px] text-ink-50">
                  Not ready to book?{' '}
                  <Link
                    href="/contact"
                    className="underline underline-offset-2 transition-colors hover:text-ink"
                  >
                    Send us a message
                  </Link>{' '}
                  instead.
                </p>
              </div>
            </div>
            <div className="h-[280px] w-full overflow-hidden rounded-[24px] lg:h-[480px] lg:min-w-px lg:flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Material and finish installation inside the TBS Design Gallery showroom"
                src={`${MEDIA}/tbs-design-gallery-installation-03.jpg`}
                className="size-full rounded-[24px] object-cover"
              />
            </div>
          </div>
        </BlueprintColumn>
      </SectionBand>

      <SectionBand className="border-b">
        <BlueprintColumn>
          <SiteFooter />
        </BlueprintColumn>
      </SectionBand>
    </div>
  )
}
