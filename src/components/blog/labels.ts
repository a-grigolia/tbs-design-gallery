import type { Post } from '@/payload-types'

import { categoryLabel } from '@/lib/categories'

export const TYPE_LABELS = {
  project: 'Project',
  guide: 'Guide',
  news: 'News',
} as const

export type PostType = keyof typeof TYPE_LABELS

/** Hero / detail: "August 2026". */
export function publishedMonthYear(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(iso))
}

/** Index list: "Aug 2026". */
export function publishedShortMonthYear(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(iso))
}

/** First vendor category, or the type label when the post has none. */
export function postListTag(post: Pick<Post, 'type' | 'categories'>): string {
  const first = post.categories?.[0]
  return first ? categoryLabel(first) : TYPE_LABELS[post.type]
}
