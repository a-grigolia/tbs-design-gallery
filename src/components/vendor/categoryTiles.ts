import type { Media, Vendor } from '@/payload-types'

import { asMedia, mediaUrl } from './media'

export type CategoryTile = { media: Media; vendor: Vendor }

/** Hero first, then gallery in admin order; duplicates and unrenderable uploads dropped. */
function imagePool(vendor: Vendor): Media[] {
  const seen = new Set<number>()
  const pool: Media[] = []
  for (const value of [vendor.heroImage, ...(vendor.gallery ?? [])]) {
    const media = asMedia(value)
    if (!media || seen.has(media.id) || !mediaUrl(media, 'card')) continue
    seen.add(media.id)
    pool.push(media)
  }
  return pool
}

/**
 * Picks the category gallery: every vendor's hero, topped up from vendor
 * galleries to `target` photos when there are fewer vendors than that. Extra
 * slots split evenly, with any remainder (and any slot a vendor can't fill)
 * going to vendors in `vendors` order, which is alphabetical. Output is
 * interleaved by round so one vendor doesn't cluster in a masonry column.
 */
export function buildCategoryTiles(vendors: Vendor[], target = 6): CategoryTile[] {
  const pools = vendors
    .map((vendor) => ({ vendor, images: imagePool(vendor) }))
    .filter((pool) => pool.images.length > 0)
  if (pools.length === 0) return []

  const count = pools.length
  let shortfall = 0
  const quotas = pools.map((pool, index) => {
    const quota =
      count >= target ? 1 : Math.floor(target / count) + (index < target % count ? 1 : 0)
    const filled = Math.min(quota, pool.images.length)
    shortfall += quota - filled
    return filled
  })

  while (shortfall > 0) {
    let placed = false
    for (let index = 0; index < count && shortfall > 0; index++) {
      if (quotas[index] < pools[index].images.length) {
        quotas[index]++
        shortfall--
        placed = true
      }
    }
    if (!placed) break
  }

  const tiles: CategoryTile[] = []
  const rounds = Math.max(...quotas)
  for (let round = 0; round < rounds; round++) {
    // Snake order (A B, B A, ...): the masonry roughly alternates columns, so
    // a plain A B A B sequence would stack every A in one column.
    const order = pools.map((_, index) => index)
    if (round % 2 === 1) order.reverse()
    for (const index of order) {
      if (round < quotas[index]) {
        tiles.push({ media: pools[index].images[round], vendor: pools[index].vendor })
      }
    }
  }
  return tiles
}
