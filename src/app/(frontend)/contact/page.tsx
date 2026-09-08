import type { Metadata } from 'next'

import React from 'react'

import { ContactForm } from '@/components/contact/ContactForm'
import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { TickRule } from '@/components/vendor/TickRule'

// Photos live in the public Supabase media bucket, same pattern as the
// category gallery pages.
const MEDIA = 'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media'

const DESCRIPTION =
  "If you're a homeowner, designer, architect or builder interested in working together, send us a message to let us know how we can help you."

export const metadata: Metadata = {
  // Title pattern inherited from the Webflow site — carries its ranking history.
  title: 'Santa Clara Custom Home Design | Contact Us',
  description: DESCRIPTION,
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      <SectionBand>
        <BlueprintColumn corner="tee">
          <div className="flex w-full items-center px-gutter-sm pt-[96px] pb-[24px] lg:px-gutter">
            <div className="flex w-full max-w-[384px] flex-col gap-[16px]">
              <h1 className="font-display text-[36px] leading-[46px] font-semibold text-ink">
                Get in touch
              </h1>
              <p className="text-[14px] leading-[18px] text-ink-50">{DESCRIPTION}</p>
            </div>
          </div>

          <TickRule label="Contact us" />

          <div className="flex w-full flex-col gap-[32px] px-gutter-sm py-[24px] lg:flex-row lg:gap-[48px] lg:px-gutter">
            <div className="hidden flex-1 overflow-hidden rounded-[24px] lg:block lg:self-stretch">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Material and finish samples arranged in the TBS Design Gallery showroom"
                src={`${MEDIA}/tbs-design-gallery-installation-02.jpg`}
                className="size-full rounded-[24px] object-cover"
              />
            </div>
            <div className="w-full shrink-0 lg:w-[692px]">
              <ContactForm />
            </div>
          </div>

          <TickRule label="Gallery" />

          <div className="flex w-full flex-col gap-[32px] px-gutter-sm pt-[32px] pb-[48px] lg:flex-row lg:items-center lg:gap-[48px] lg:px-gutter">
            <div className="flex w-full flex-col justify-center gap-[48px] lg:w-[400px] lg:shrink-0 lg:self-stretch">
              <div className="flex flex-col gap-[24px]">
                <div className="flex max-w-[305px] flex-col gap-[8px]">
                  <p className="text-[16px] text-ink">Phone</p>
                  <p className="text-[14px] text-ink-50">(650) 416-8888</p>
                </div>
                <div className="flex max-w-[305px] flex-col gap-[8px]">
                  <p className="text-[16px] text-ink">Address</p>
                  <p className="text-[14px] text-ink-50">
                    3283 De La Cruz Blvd, Suite A
                    <br />
                    Santa Clara, CA 95054
                  </p>
                </div>
                <div className="flex max-w-[305px] flex-col gap-[8px]">
                  <p className="text-[16px] text-ink">Hours</p>
                  <p className="text-[14px] text-ink-50">Monday - Friday: 10am-3pm</p>
                </div>
              </div>
              <p className="max-w-[305px] text-[14px] text-ink-50">
                In order to guarantee a unique experience for your visit, we operate on an
                appointment-only basis.
              </p>
              {/* TODO: point at the Calendly tour page once it exists. */}
              <a
                href="#"
                className="flex h-[40px] w-fit items-center justify-center rounded-[44px] border border-brand-glow bg-brand px-[24px] py-[10px] font-figtree text-[14px] leading-[24px] text-white"
              >
                Request a Tour
              </a>
            </div>
            <div className="h-[280px] w-full overflow-hidden rounded-[24px] lg:h-[440px] lg:min-w-px lg:flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Consultation table inside the TBS Design Gallery showroom"
                src={`${MEDIA}/tbs-design-gallery-installation-01.jpg`}
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
