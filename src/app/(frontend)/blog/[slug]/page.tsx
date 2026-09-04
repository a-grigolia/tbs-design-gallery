import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { PostBody } from '@/components/blog/PostBody'
import { BlueprintColumn, SectionBand } from '@/components/landing/Blueprint'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { SiteHeader } from '@/components/landing/SiteHeader'
import { mediaUrl } from '@/components/vendor/media'
import { categoryLabel } from '@/lib/categories'
import { getPayload } from '@/lib/payload'
import { postMetadata } from '@/lib/seo'

export const revalidate = 300

type Params = Promise<{ slug: string }>

const TYPE_LABELS = {
  project: 'Project',
  guide: 'Guide',
  news: 'News',
} as const

const fetchPost = cache(async (slug: string) => {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export async function generateStaticParams() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    depth: 0,
    limit: 200,
  })
  return docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) return {}
  return postMetadata(post)
}

function publishedMonthYear(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(iso))
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) notFound()

  const coverSrc = mediaUrl(post.coverImage, 'hero')
  const firstCategory = post.categories?.[0]

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-canvas">
      <SiteHeader />

      {/*
       * No SectionBand of its own: the header already sits above this column,
       * and the footer band's border-t closes the bottom. Tees join the
       * column sides the same way category intro sections do.
       */}
      <div className="flex w-full flex-col items-center px-4 sm:px-8 lg:px-12">
        <BlueprintColumn corner="tee">
          <div className="flex w-full flex-col gap-[24px] px-gutter-sm pt-[96px] pb-[48px] lg:px-gutter">
            <div className="mx-auto flex w-full max-w-[692px] flex-col gap-[24px]">
              <div className="flex gap-[16px] font-sans text-[10px] leading-[13px] text-ink-50">
                <time dateTime={post.publishedAt}>{publishedMonthYear(post.publishedAt)}</time>
                <span>{TYPE_LABELS[post.type]}</span>
                {firstCategory ? <span>{categoryLabel(firstCategory)}</span> : null}
              </div>
              <h1 className="font-display text-[36px] leading-[46px] font-bold text-ink">
                {post.title}
              </h1>
              <p className="text-[14px] leading-[18px] text-ink-50">{post.excerpt}</p>
            </div>

            {coverSrc ? (
              <div className="w-full py-[24px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={typeof post.coverImage === 'object' ? post.coverImage.alt : post.title}
                  src={coverSrc}
                  className="aspect-video w-full rounded-[24px] object-cover"
                />
              </div>
            ) : null}

            <div className="mx-auto w-full max-w-[692px]">
              <PostBody content={post.content} />
            </div>
          </div>
        </BlueprintColumn>
      </div>

      <SectionBand className="border-b">
        <BlueprintColumn>
          <SiteFooter />
        </BlueprintColumn>
      </SectionBand>
    </div>
  )
}
