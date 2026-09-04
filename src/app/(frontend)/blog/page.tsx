import type { Metadata } from 'next'

import React from 'react'

import { JournalFeatured } from '@/components/blog/JournalFeatured'
import { JournalFeed } from '@/components/blog/JournalFeed'
import { postListTag } from '@/components/blog/labels'
import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { getPayload } from '@/lib/payload'

export const revalidate = 300

const DESCRIPTION =
  'Projects we have worked on, guides to specifying, and what is happening in the showroom.'

export const metadata: Metadata = {
  title: 'TBS Journal',
  description: DESCRIPTION,
}

export default async function BlogIndexPage() {
  const payload = await getPayload()
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    depth: 1,
    limit: 200,
    sort: '-publishedAt',
  })

  const featured = posts[0]
  const list = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    publishedAt: post.publishedAt,
    type: post.type,
    tag: postListTag(post),
  }))

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      <SectionBand>
        <BlueprintColumn corner="tee">
          <div className="flex w-full items-center px-gutter-sm pt-[96px] pb-[24px] lg:px-gutter">
            <div className="flex w-full max-w-[384px] flex-col gap-[16px]">
              <h1 className="font-display text-[36px] leading-[46px] font-semibold text-ink">
                TBS Journal
              </h1>
              <p className="text-[14px] leading-[18px] text-ink-50">{DESCRIPTION}</p>
            </div>
          </div>

          {featured ? <JournalFeatured post={featured} /> : null}

          <JournalFeed posts={list} />
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
