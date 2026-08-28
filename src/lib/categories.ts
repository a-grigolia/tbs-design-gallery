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
