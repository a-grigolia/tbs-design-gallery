// Webflow → Next URL migration map, built by diffing the live Webflow sitemap
// (pulled 2026-10-13) against what this site serves. Destinations are final pages, never
// another source. Next runs these before the filesystem and dynamic routes, so a row
// shadows any page at the same path: when an old blog post is migrated into Payload,
// delete its row here. Wildcards (`:slug`) are only for retired prefixes — never wildcard
// an active category, or it would swallow live vendor pages.

type Redirect = {
  source: string
  destination: string
  permanent: boolean
}

const map: [source: string, destination: string][] = [
  // Retired pages
  ['/brands', '/'],
  ['/gallery', '/'],
  ['/process', '/'],
  ['/homeowners', '/contact'],
  ['/trade-professionals', '/contact'],
  ['/custom-millwork-furniture', '/custom-cabinetry'],
  ['/terms-conditions', '/privacy-policy'],

  // Old lead-gen landing pages
  ['/outdoor-structure-discovery-organic-gen', '/outdoor-living/renson'],
  ['/outdoor-structure-discovery-renson-gen', '/outdoor-living/renson'],
  ['/outdoor-structure-quiz-social-gen', '/outdoor-living/renson'],

  // Dropped categories
  ['/hard-surfaces', '/'],
  ['/hard-surfaces/:slug', '/'],
  ['/hardware-accessories', '/'],
  ['/hardware-accessories/:slug', '/'],
  ['/hardwood-flooring', '/'],
  ['/hardwood-flooring/:slug', '/'],
  ['/lighting', '/'],
  ['/lighting/:slug', '/'],

  // Vendor sub-collections
  ['/renson-collections', '/outdoor-living/renson'],
  ['/renson-collections/:slug', '/outdoor-living/renson'],
  ['/laura-meroni-collection', '/architectural-elements-furniture/laurameroni'],
  ['/laura-meroni-collection/:slug', '/architectural-elements-furniture/laurameroni'],
  ['/laura-meroni', '/architectural-elements-furniture/laurameroni'],
  ['/laura-meroni/:slug', '/architectural-elements-furniture/laurameroni'],

  // Moved or dropped vendors
  ['/outdoor-living/premier-outdoor-cabinetry', '/custom-cabinetry/premier'],
  ['/windows-doors/euroline', '/windows-doors'],
  ['/windows-doors/adl-santa-clara', '/windows-doors'],
  ['/appliances/miele', '/appliances'],
  // Carried over from Webflow's own 301 list, which the sitemap doesn't show
  [
    '/architectural-elements-furniture/laura-meroni',
    '/architectural-elements-furniture/laurameroni',
  ],

  // Unmigrated blog posts
  ['/blog/6-new-design-styles-from-renson', '/outdoor-living/renson'],
  ['/blog/8-cabinet-styles-to-consider-for-your-custom-cabinetry', '/custom-cabinetry'],
  ['/blog/a-day-to-remember', '/blog'],
  ['/blog/camargue-outdoor-aluminum-pergola-structure-by-renson', '/outdoor-living/renson'],
  ['/blog/cosentino-launches-the-ethereal-collection', '/blog'],
  ['/blog/covid-19-announcement', '/blog'],
  ['/blog/custom-interior-doors-that-matter', '/windows-doors'],
  ['/blog/custom-wine-storage-solutions', '/custom-cabinetry'],
  ['/blog/design-your-dream-kitchen-with-premier-custom-cabinetry', '/custom-cabinetry/premier'],
  ['/blog/designing-outdoor-kitchen', '/outdoor-living'],
  ['/blog/euroline-steel-windows-doors', '/windows-doors'],
  ['/blog/event-luxe-magazine-panel-the-art-of-luxury-homes', '/blog'],
  ['/blog/fostering-collaboration-innovation', '/blog'],
  ['/blog/high-end-kitchen-cabinetry', '/custom-cabinetry'],
  ['/blog/how-we-can-help-with-design-build-projects', '/'],
  ['/blog/ibs-kbis-2020', '/blog'],
  ['/blog/impact-of-cabinet-to-custom-kitchen-design', '/custom-cabinetry'],
  ['/blog/inset-vs-overlay-cabinets', '/custom-cabinetry'],
  ['/blog/interior-door-design-how-it-impacts-your-home', '/windows-doors'],
  ['/blog/join-us-at-pcbc-san-francisco-in-june', '/blog'],
  ['/blog/kitchen-dining-room-inspiration', '/custom-cabinetry'],
  ['/blog/la-cornue-premier-kitchen-cabinetry', '/appliances/la-cornue'],
  ['/blog/la-cornue-ranges', '/appliances/la-cornue'],
  ['/blog/lacantina-doors-that-open-spaces', '/windows-doors/lacantina-doors'],
  [
    '/blog/laurameroni-design-collection-hand-crafted-italian-luxury',
    '/architectural-elements-furniture/laurameroni',
  ],
  ['/blog/luxe-sf-magazine-california-dreamin-of-design', '/blog'],
  ['/blog/luxury-finishes', '/blog'],
  ['/blog/luxury-kitchen-appliances', '/appliances'],
  ['/blog/march-madness-event-at-spin', '/blog'],
  [
    '/blog/martyn-lawrence-bullard-launches-the-color-collection-for-la-cornues-chateau-series',
    '/appliances/la-cornue',
  ],
  ['/blog/marvin', '/windows-doors/marvin'],
  ['/blog/modern-minimal-skylights-glazing-vision', '/windows-doors/glazing-vision'],
  ['/blog/outdoor-california-room', '/outdoor-living'],
  ['/blog/pantone-color-of-the-year', '/blog'],
  ['/blog/partners-in-excellence', '/blog'],
  ['/blog/patio-overhang', '/outdoor-living'],
  ['/blog/premier', '/custom-cabinetry/premier'],
  ['/blog/process-makes-perfect', '/'],
  [
    '/blog/progeny-winery-in-napa-features-reynaers-aluminum-windows-doors',
    '/windows-doors/reynaers',
  ],
  ['/blog/renson', '/outdoor-living/renson'],
  ['/blog/renson-outdoor-structures', '/outdoor-living/renson'],
  ['/blog/reynaers', '/windows-doors/reynaers'],
  ['/blog/reynaers-hi-finity-doors', '/windows-doors/reynaers'],
  ['/blog/sherwin-williams-2021-color-of-the-year-urbane-bronze', '/blog'],
  ['/blog/showroom-visit', '/book'],
  ['/blog/smart-outdoor-pergola-structures-at-pcbc', '/outdoor-living/renson'],
  ['/blog/spa-bath-remodel', '/custom-cabinetry'],
  ['/blog/superior-steel', '/windows-doors'],
  ['/blog/tbs-design-gallery-where-creativity-meets-business', '/'],
  ['/blog/the-biophilic-way-of-living', '/blog'],
  ['/blog/the-galley', '/blog'],
  ['/blog/the-world-of-reynaers-debuts-in-tbs-design-gallery', '/windows-doors/reynaers'],
  ['/blog/timeless-kitchen-cabinet-colors', '/custom-cabinetry'],
  ['/blog/we-are-open-by-appointment-only', '/book'],
  ['/blog/what-defines-custom-cabinetry', '/custom-cabinetry'],
  ['/blog/what-to-look-for-quality-kitchen-cabinets', '/custom-cabinetry'],
  ['/blog/why-ventilation', '/appliances'],
  ['/blog/window-and-door-tax-credit', '/windows-doors'],
  ['/blog/zero-net-carbon-home-design', '/blog'],
]

export const redirects: Redirect[] = map.map(([source, destination]) => ({
  source,
  destination,
  permanent: true,
}))

/** Real old Webflow URLs behind each wildcard source, for the redirect e2e spec. */
export const REDIRECT_SAMPLES: Record<string, string[]> = {
  '/hard-surfaces/:slug': ['/hard-surfaces/cambria', '/hard-surfaces/silestone'],
  '/hardware-accessories/:slug': ['/hardware-accessories/hafele'],
  '/hardwood-flooring/:slug': ['/hardwood-flooring/kahrs'],
  '/lighting/:slug': ['/lighting/no-8-lighting'],
  '/renson-collections/:slug': ['/renson-collections/tech-cocoon'],
  '/laura-meroni-collection/:slug': ['/laura-meroni-collection/sofas'],
  '/laura-meroni/:slug': ['/laura-meroni/doors-wall-panels'],
}
