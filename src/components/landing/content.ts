/**
 * Hardcoded landing page content. Copy comes from the Figma frame and is final.
 * Images are placeholders. Brand lists for categories other than Custom
 * Cabinetry were not in the frame — swap them here when final lists exist.
 */

export type ShowcaseSlide = {
  image: string
  caption: string
  cta: string
}

export type Category = {
  id: string
  label: string
  icon: string
  brands: string[]
  slides: ShowcaseSlide[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'custom-cabinetry',
    label: 'Custom Cabinetry',
    icon: '/landing/icon-cabinetry.svg',
    brands: ['Laurameroni', 'Premier', 'Crystal Cabinets'],
    slides: [
      {
        image: '/landing/showcase-cabinetry.png',
        caption: 'TBS Design Gallery & The Douglas Friedman Project',
        cta: 'Custom Cabinetry Selection',
      },
      {
        image: '/landing/install-1.png',
        caption: 'TBS Design Gallery & The Douglas Friedman Project',
        cta: 'Custom Cabinetry Selection',
      },
      {
        image: '/landing/install-3.png',
        caption: 'TBS Design Gallery & The Douglas Friedman Project',
        cta: 'Custom Cabinetry Selection',
      },
      {
        image: '/landing/event-1.png',
        caption: 'TBS Design Gallery & The Douglas Friedman Project',
        cta: 'Custom Cabinetry Selection',
      },
    ],
  },
  {
    id: 'windows-doors',
    label: 'Windows & Doors',
    icon: '/landing/icon-windows.svg',
    brands: ['Marvin', 'Renson', 'Panda'],
    slides: [
      {
        image: '/landing/install-2.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Windows & Doors Selection',
      },
      {
        image: '/landing/install-4.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Windows & Doors Selection',
      },
      {
        image: '/landing/showcase-cabinetry.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Windows & Doors Selection',
      },
      {
        image: '/landing/install-1.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Windows & Doors Selection',
      },
    ],
  },
  {
    id: 'appliances',
    label: 'Appliances',
    icon: '/landing/icon-appliances.svg',
    brands: ['Gaggenau', 'Sub-Zero', 'Wolf'],
    slides: [
      {
        image: '/landing/install-3.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Appliances Selection',
      },
      {
        image: '/landing/install-2.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Appliances Selection',
      },
      {
        image: '/landing/event-1.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Appliances Selection',
      },
      {
        image: '/landing/install-4.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Appliances Selection',
      },
    ],
  },
  {
    id: 'outdoor-living',
    label: 'Outdoor Living',
    icon: '/landing/icon-outdoor.svg',
    brands: ['Renson', 'Roll-A-Cover', 'Struxure'],
    slides: [
      {
        image: '/landing/install-1.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Outdoor Living Selection',
      },
      {
        image: '/landing/showcase-cabinetry.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Outdoor Living Selection',
      },
      {
        image: '/landing/install-2.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Outdoor Living Selection',
      },
      {
        image: '/landing/install-3.png',
        caption: 'TBS Design Gallery Showroom, Santa Clara',
        cta: 'Outdoor Living Selection',
      },
    ],
  },
]

export const SHOWROOM_SLIDES: { image: string; caption: string }[] = [
  { image: '/landing/event-1.png', caption: 'Belgian Design Panel, 2025' },
  { image: '/landing/install-3.png', caption: 'Belgian Design Panel, 2025' },
  { image: '/landing/showcase-cabinetry.png', caption: 'Belgian Design Panel, 2025' },
  { image: '/landing/install-1.png', caption: 'Belgian Design Panel, 2025' },
]

/**
 * Installation accordion cards: the expanded card shows its caption pill.
 * Captions are placeholders — swap when final copy exists.
 */
export const INSTALLATION_CARDS: { image: string; caption: string }[] = [
  { image: '/landing/install-1.png', caption: 'Outdoor Living Build' },
  { image: '/landing/install-2.png', caption: 'Custom Millwork Installation' },
  { image: '/landing/install-3.png', caption: 'Window & Door Fitting' },
  { image: '/landing/install-4.png', caption: 'Warranty & Service' },
]

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Pre-proposal',
    body: 'Before anything else, we get clear on what your project actually needs. We review the plans, identify the products and services involved, and put a realistic budget in front of you.',
    image: '/landing/process-1.png',
  },
  {
    number: '02',
    title: 'Discovery',
    body: 'We bring your architect, contractor, and designer into the same conversation. Together we set the strategy, the scope, and a timeline everyone can commit to.',
  },
  {
    number: '03',
    title: 'Design',
    body: "We turn the plan into documentation: drawings, specifications, and firm costs. Nothing moves forward until the scope is finalized and you've signed off.",
  },
  {
    number: '04',
    title: 'Implementation',
    body: "We handle logistics, quality, and schedule so the right things arrive at the right time. Our job isn't done until the space is genuinely ready to move into.",
  },
  {
    number: '05',
    title: 'Post-completion',
    body: 'We stay accountable after the last delivery. Warranties are honored, loose ends get closed, and we remain a resource for as long as you own the home.',
  },
]

export const TESTIMONIALS = [
  {
    quote:
      '"A year ago I decided to replace all of the windows and doors in my old house as salt air had caused a lot of damage. After comparing a number of options I hired TBS Design Gallery to install Marvin fiber glass products. Removal of the old windows revealed significant amounts of dry rot. TBS\u2019s crew did an outstanding job dealing with unwelcome surprises and resolving issues. After a year in place, I am very happy that everything works perfectly - no sticky sliders, nothing out of alignment. Very pleased customer."',
    author: 'Carey Peabody',
    source: 'google' as const,
  },
  {
    quote:
      '"TBS has been a great support for my new house doors/windows and cabinetry work. They are always available and have many product selections. I\'d highly recommend them to anyone who is looking for a reasonably priced/good customer service combo."',
    author: 'Efe S.',
    source: 'yelp' as const,
  },
  {
    quote:
      '"TBS has been a great support for my new house doors/windows and cabinetry work. They are always available and have many product selections. I\'d highly recommend them to anyone who is looking for a reasonably priced/good customer service combo."',
    author: 'Efe S.',
    source: 'yelp' as const,
  },
]
