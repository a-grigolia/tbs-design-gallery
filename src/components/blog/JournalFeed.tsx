'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import type { PostType } from './labels'
import { publishedShortMonthYear } from './labels'

export type JournalListItem = {
  slug: string
  title: string
  publishedAt: string
  type: PostType
  tag: string
}

const FILTERS = [
  { id: 'everything', label: 'Everything' },
  { id: 'guide', label: 'Guides' },
  { id: 'project', label: 'Projects' },
  { id: 'news', label: 'News' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

function TagWithArrow({ tag }: { tag: string }) {
  return (
    <span className="flex shrink-0 items-center">
      <span className="text-[10px] leading-[13px] text-ink-50">{tag}</span>
      <span
        aria-hidden
        className="ml-0 h-[6px] w-0 overflow-hidden opacity-0 transition-[width,margin,opacity] duration-200 group-hover:ml-[12px] group-hover:w-[8.4px] group-hover:opacity-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src="/landing/journal-arrow-right.svg"
          className="h-[6px] w-[8.4px] max-w-none dark:invert"
        />
      </span>
    </span>
  )
}

export function JournalFeed({ posts }: { posts: JournalListItem[] }) {
  const [filter, setFilter] = useState<FilterId>('everything')
  const visible =
    filter === 'everything' ? posts : posts.filter((post) => post.type === filter)

  return (
    <div className="flex w-full flex-col pb-[96px]">
      <div className="flex p-[24px]">
        <div className="max-w-full overflow-x-auto p-px">
          <div
            role="tablist"
            aria-label="Filter journal entries"
            className="flex h-[40px] items-center justify-center gap-[8px] rounded-[44px] border border-hairline"
          >
            {FILTERS.map((option) => {
              const isActive = option.id === filter
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(option.id)}
                  className="group relative flex h-[40px] shrink-0 items-center justify-center px-[24px] py-[10px]"
                >
                  <span
                    aria-hidden
                    className={`absolute rounded-[44px] border transition-[inset,background-color,border-color] duration-200 ease-out ${
                      isActive
                        ? '-inset-x-px inset-y-0 border-hairline bg-cream'
                        : 'inset-[3px] border-transparent group-hover:border-ink/[0.03] group-hover:bg-ink/[0.03]'
                    }`}
                  />
                  <span className="relative text-[14px] leading-[18px] whitespace-nowrap text-ink">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="group/feed flex w-full flex-col">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex w-full flex-col gap-[8px] border-t border-hairline p-[24px] last:border-b lg:flex-row lg:items-center lg:justify-between lg:gap-[24px]"
          >
            <div className="flex min-w-0 items-center justify-between gap-[24px] lg:justify-start">
              <time
                dateTime={post.publishedAt}
                className="w-[64px] shrink-0 text-[10px] leading-[13px] text-ink-50"
              >
                {publishedShortMonthYear(post.publishedAt)}
              </time>
              <span className="hidden min-w-0 text-[16px] leading-normal text-ink transition-[color,translate] duration-200 group-hover/feed:text-ink-40 group-hover:translate-x-[8px] group-hover:!text-ink lg:block">
                {post.title}
              </span>
              <span className="lg:hidden">
                <TagWithArrow tag={post.tag} />
              </span>
            </div>
            <span className="min-w-0 text-[16px] leading-normal text-ink transition-[color,translate] duration-200 group-hover/feed:text-ink-40 group-hover:translate-x-[8px] group-hover:!text-ink lg:hidden">
              {post.title}
            </span>
            <span className="hidden lg:block">
              <TagWithArrow tag={post.tag} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
