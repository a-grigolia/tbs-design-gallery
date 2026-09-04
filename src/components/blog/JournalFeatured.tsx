import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { mediaUrl } from '@/components/vendor/media'

import { TYPE_LABELS, publishedMonthYear } from './labels'

export function JournalFeatured({ post }: { post: Post }) {
  const coverSrc = mediaUrl(post.coverImage, 'hero')
  const href = `/blog/${post.slug}`
  const coverAlt = typeof post.coverImage === 'object' ? post.coverImage.alt : post.title

  return (
    <div className="flex w-full flex-col gap-[32px] px-gutter-sm pt-[32px] pb-[48px] lg:flex-row lg:items-center lg:gap-[48px] lg:px-[24px]">
      {coverSrc ? (
        <Link href={href} className="block w-full shrink-0 lg:w-[693px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={coverAlt}
            src={coverSrc}
            className="aspect-[693/440] w-full rounded-[24px] object-cover"
          />
        </Link>
      ) : null}

      <div className="flex w-full flex-col gap-[48px] lg:w-[400px] lg:shrink-0">
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[16px] font-sans text-[10px] leading-[13px] text-ink-50">
            <time dateTime={post.publishedAt}>{publishedMonthYear(post.publishedAt)}</time>
            <span>{TYPE_LABELS[post.type]}</span>
          </div>
          <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
            <Link href={href}>{post.title}</Link>
          </h2>
          <p className="text-[14px] leading-[18px] text-ink-50">{post.excerpt}</p>
        </div>
        <Link
          href={href}
          className="flex h-[40px] w-fit items-center justify-center rounded-[44px] border border-hairline px-[24px] py-[10px] text-[14px] leading-[18px] text-ink transition-colors hover:bg-ink/[0.04]"
        >
          Read entry
        </Link>
      </div>
    </div>
  )
}
