// The `value` strings are permanent: they are simultaneously the Postgres enum
// values and the public URL segments (/{category}/{slug}), inherited from the
// live Webflow site. After launch, change only the `label` — never the `value`.
// Standalone module (no Payload imports) so nav/routing client code can import it.
export const VENDOR_CATEGORIES = [
  { label: 'Custom Cabinetry', value: 'custom-cabinetry' },
  { label: 'Windows & Doors', value: 'windows-doors' },
  { label: 'Outdoor Living', value: 'outdoor-living' },
  { label: 'Appliances', value: 'appliances' },
  { label: 'Architectural Elements & Furniture', value: 'architectural-elements-furniture' },
] as const

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number]['value']

export const isVendorCategory = (value: string): value is VendorCategory =>
  VENDOR_CATEGORIES.some((category) => category.value === value)

export const categoryLabel = (value: VendorCategory): string =>
  VENDOR_CATEGORIES.find((category) => category.value === value)?.label ?? value

/** Canonical vendor URL. `categories` controls listings; `primaryCategory` controls the URL. */
export const vendorHref = (vendor: { primaryCategory: VendorCategory; slug: string }): string =>
  `/${vendor.primaryCategory}/${vendor.slug}`
