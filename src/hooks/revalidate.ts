import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

const safeRevalidate = (path: string): void => {
  try {
    revalidatePath(path)
  } catch {
    // revalidatePath throws outside a Next.js request context
    // (payload CLI, scripts) — safe to ignore there.
  }
}

/**
 * Revalidates the index page and the document's detail page whenever a
 * published document changes, so edits go live without a redeploy.
 * Draft saves are ignored.
 */
export const revalidateAfterChange =
  (basePath: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc }) => {
    const wasPublished = previousDoc?._status === 'published'
    const isPublished = doc?._status === 'published'

    if (isPublished || wasPublished) {
      safeRevalidate(basePath)
    }
    if (isPublished && doc?.slug) {
      safeRevalidate(`${basePath}/${doc.slug}`)
    }
    // Covers unpublishing and slug changes: clear the previously live URL.
    if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      safeRevalidate(`${basePath}/${previousDoc.slug}`)
    }
    if (wasPublished && !isPublished && previousDoc?.slug) {
      safeRevalidate(`${basePath}/${previousDoc.slug}`)
    }

    return doc
  }

export const revalidateAfterDelete =
  (basePath: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    safeRevalidate(basePath)
    if (doc?.slug) {
      safeRevalidate(`${basePath}/${doc.slug}`)
    }
    return doc
  }
