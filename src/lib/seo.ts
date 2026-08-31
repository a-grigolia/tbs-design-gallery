import type { VendorCategory } from './categories'

// Vendor page metadata, preserved verbatim from the Webflow collection
// templates' SEO settings. These strings carry the live site's ranking
// history — don't reword them casually. Per-vendor seoTitle/seoDescription
// fields in Payload override these patterns when set.

export const vendorMetaTitle = (name: string): string => `${name} at TBS Design Gallery`

// The trailing phrase varies per Webflow collection. The
// architectural-elements-furniture collection never had SEO settings in
// Webflow; its phrase follows the same template as the others.
const CATEGORY_META_PHRASES: Record<VendorCategory, string> = {
  'windows-doors': 'for your next windows & doors project',
  appliances: 'for your home appliances',
  'outdoor-living': 'for your next outdoor project',
  'custom-cabinetry': 'for your next custom cabinetry project',
  'architectural-elements-furniture': 'for your next architectural elements or furniture project',
}

export const vendorMetaDescription = (name: string, category: VendorCategory): string =>
  `Browse ${name} and other TBS Design Gallery partners ${CATEGORY_META_PHRASES[category]}`
