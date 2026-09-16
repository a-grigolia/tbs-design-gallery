import type { Metadata } from 'next'

import React from 'react'

import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for TBS Design Gallery.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      <SectionBand>
        <BlueprintColumn corner="tee">
          <div className="flex w-full flex-col px-gutter-sm pt-[96px] pb-[96px] lg:px-gutter">
            <div className="mx-auto flex w-full max-w-[692px] flex-col gap-[48px]">
              <div className="flex flex-col gap-[16px]">
                <p className="font-sans text-[10px] leading-[13px] text-ink-50">
                  Effective and last updated September 11, 2026
                </p>
                <h1 className="font-display text-[36px] leading-[46px] font-semibold text-ink">
                  TBS Design Gallery Privacy Policy
                </h1>
              </div>

              <article className="flex flex-col gap-[24px]">
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  TBS Design Gallery (&quot;TBS,&quot; &quot;we,&quot; &quot;us,&quot; or
                  &quot;our&quot;) respects your privacy. This policy explains how we collect, use,
                  disclose, and protect personal information through tbsdesigngallery.com and our
                  related inquiry, appointment, and project communications. It also explains your
                  choices and how to contact us.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Information we collect
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  The information we collect depends on how you interact with us:
                </p>
                <ul className="list-disc pl-[20px] font-sans text-[16px] leading-[24px] text-ink-75">
                  <li>
                    <strong>Contact and inquiry information:</strong> Your name, email address,
                    telephone number, city, ZIP code, company or professional role, how you heard
                    about us, and the information you provide when contacting us, requesting a
                    visit, or subscribing to updates.
                  </li>
                  <li>
                    <strong>Project and transaction information:</strong> Project addresses, plans,
                    drawings, photographs, measurements, product selections, estimates, order and
                    billing records, delivery details, and communications about your project,
                    installation, or warranty service.
                  </li>
                  <li>
                    <strong>Website and communication activity:</strong> IP address, browser and
                    device information, pages visited, referring websites, dates and times of
                    visits, cookie or similar identifiers, and interactions with website features or
                    marketing communications. Tracking tools may also collect approximate location
                    derived from an IP address and information about email opens or link clicks.
                  </li>
                </ul>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We collect information directly from you, automatically through website
                  technologies, and from people coordinating a project or inquiry, such as your
                  architect, designer, builder, installer, or manufacturer. Please provide
                  information about another person only when you are authorized to do so. Please do
                  not send passwords, Social Security numbers, or full payment-card details through
                  general website forms.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  How we use information
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We use personal information to respond to inquiries; review project needs;
                  schedule and prepare for gallery visits; prepare estimates and orders; coordinate
                  manufacturing, delivery, installation, and warranty support; and maintain project
                  and business records.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We also use information to operate and secure our website, prevent spam and fraud,
                  understand website and campaign performance, improve our services, communicate
                  about products and events, and support relevant advertising. Marketing
                  communications are subject to the choices described below. We may also use
                  information to comply with legal obligations and resolve disputes.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  When we disclose information
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We disclose relevant information to the following categories of recipients when
                  needed for the purposes described in this policy:
                </p>
                <ul className="list-disc pl-[20px] font-sans text-[16px] leading-[24px] text-ink-75">
                  <li>
                    <strong>Project participants:</strong> Manufacturers, suppliers, architects,
                    designers, builders, installers, delivery providers, and other people involved
                    in your requested project or service.
                  </li>
                  <li>
                    <strong>Business service providers:</strong> Companies providing website
                    hosting, forms, scheduling, email, customer-management software, payment
                    processing, accounting, storage, and technical support.
                  </li>
                  <li>
                    <strong>Website and marketing providers:</strong> Companies providing
                    advertising, measurement, marketing, security, and embedded content, as
                    described below.
                  </li>
                  <li>
                    <strong>Professional and legal recipients:</strong> Advisers, insurers,
                    authorities, or other parties where disclosure is required by law or reasonably
                    necessary to address fraud, protect safety or legal rights, or handle a dispute.
                  </li>
                </ul>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We may also disclose information at your direction or with your permission. If TBS
                  is involved in a merger, financing, acquisition, or sale of business assets,
                  relevant information may be disclosed to participants and transferred as part of
                  that transaction, subject to appropriate confidentiality protections.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Project privacy and photographs
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We use project materials to evaluate, coordinate, supply, and support your
                  project. These materials may need to be shared with relevant project participants.
                  We will obtain appropriate permission before using identifiable client names,
                  private project photographs, or testimonials in TBS advertising or public project
                  features. Any separate confidentiality or nondisclosure agreement continues to
                  apply according to its terms.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Cookies and website technologies
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  Our website uses cookies, pixels, scripts, and similar technologies to support
                  website functions, security, marketing, and measurement. Cookies are small files
                  stored on your device; pixels and scripts can transmit information about a visit
                  or interaction.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                Our website includes Meta Pixel, Google Tag Manager, Klaviyo marketing tools, Google Places address suggestions, and embedded YouTube and Vimeo content. We may also direct visitors to external appointment services such as Calendly. The tools you encounter depend on the pages and features you use.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  These providers may receive identifiers, IP addresses, browser information, page
                  visits, and interactions. Advertising and content providers may collect
                  information about your activities over time and across different websites or
                  services, combine it with information they already hold, and use it for
                  measurement or personalized advertising under their own policies and your
                  settings.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  For details, see Meta&apos;s Privacy Policy, Google&apos;s explanation of
                  partner-site data, and Klaviyo&apos;s Privacy Center. Our use of reCAPTCHA is
                  subject to Google&apos;s Privacy Policy and Terms of Service.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Your tracking choices
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  You can use your browser settings to block or delete cookies and restrict certain
                  tracking technologies. Some website features may not function properly if you do
                  so. You can also adjust advertising preferences through your Meta and Google
                  account settings. These choices may apply only to a particular browser, device, or
                  account; disabling personalized advertising does not necessarily stop all data
                  collection or advertising.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  Our website does not currently change its tracking practices in response to
                  browser Do Not Track signals. The browser and provider controls described above
                  offer other ways to manage tracking.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Marketing communications
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  You can unsubscribe from marketing emails using the unsubscribe link in a message
                  or by contacting us at info@tbsdesigngallery.com. We honor marketing-email opt-out
                  requests within 10 business days. We may retain a limited record of your
                  preference to help prevent further marketing messages.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  An unsubscribe request does not stop necessary communications about an
                  appointment, order, active project, payment, or warranty. Providing a phone number
                  for a project inquiry is not, by itself, consent to automated promotional calls or
                  texts. If we offer a program requiring that consent, we will request it
                  separately.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  How long we retain information
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We retain personal information for as long as reasonably needed for the purposes
                  described in this policy. We consider the nature of the information, our
                  relationship with you, and applicable legal requirements.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  Inquiry records support responses and reasonable follow-up. Project and
                  transaction records support performance, accounting, product and installation
                  history, warranties, and legal obligations or claims. Marketing records support
                  communications and the honoring of opt-outs. Retention of website activity data
                  also depends on the tools used and their settings. When information is no longer
                  needed, we delete it or remove identifying details, subject to necessary backup
                  retention and legal holds.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Security
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We use reasonable administrative, technical, and physical safeguards designed to
                  protect personal information against unauthorized access, use, disclosure,
                  alteration, or loss. No internet transmission or storage system can be guaranteed
                  completely secure.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Requests about your information
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  You may contact us to request access to, correction of, or deletion of personal
                  information you have provided. We will review your request and explain our
                  response, taking into account applicable law and any records we need to retain for
                  ongoing services, warranties, accounting, legal obligations, or disputes.
                </p>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  Before disclosing, changing, or deleting personal information, we may need
                  information sufficient to confirm your identity or authority. Marketing-email
                  opt-outs do not require that verification. Where applicable law provides
                  additional privacy rights, we will handle requests in accordance with that law.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Outside services and processing locations
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  External websites, appointment platforms, social networks, and embedded services
                  have their own privacy practices. Please review their policies when using them.
                  TBS operates in the United States; information may also be processed in other
                  countries where our service providers or project manufacturers operate, whose
                  privacy laws may differ from those where you live.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Privacy of children
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  Our website and services are intended for adults and are not directed to children
                  under 13. We do not knowingly collect personal information from children under 13.
                  If you believe a child has provided personal information to us, please contact us
                  so we can investigate and delete it as appropriate.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Changes to this policy
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  We may update this policy as our services, practices, or legal obligations change.
                  We will post the revised policy here and update the date above. For material
                  changes, we will also provide a prominent website notice or notify affected
                  individuals directly, as appropriate. Where required, we will obtain consent
                  before using previously collected information for a new purpose.
                </p>

                <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                  Contact us
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-ink-75">
                  For privacy questions, requests, or an accessible copy of this policy, contact:
                </p>
                <address className="font-sans text-[16px] leading-[24px] text-ink-75 not-italic">
                  TBS Design Gallery
                  <br />
                  3283 De La Cruz Blvd, Suite A
                  <br />
                  Santa Clara, CA 95054
                  <br />
                  Email:{' '}
                  <a
                    href="mailto:info@tbsdesigngallery.com"
                    className="underline underline-offset-2"
                  >
                    info@tbsdesigngallery.com
                  </a>
                  <br />
                  Phone:{' '}
                  <a href="tel:+16504168888" className="underline underline-offset-2">
                    650-416-8888
                  </a>
                </address>
              </article>
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
