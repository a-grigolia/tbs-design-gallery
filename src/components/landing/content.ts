export const SHOWROOM_SLIDES: { image: string; caption: string }[] = [
  {
    image:
      'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/tbs-design-gallery-event-01.jpg',
    caption: 'Belgian Design Panel at TBS',
  },
  {
    image:
      'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/tbs-design-gallery-installation-03.jpg',
    caption: 'Materials installation',
  },
  {
    image:
      'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/tbs-design-gallery-installation-01.jpg',
    caption: 'Office installation',
  },
  {
    image:
      'https://nbdugymkxxwohotyzwhw.supabase.co/storage/v1/object/public/media/tbs-design-gallery-event-02.jpg',
    caption: 'TBS Design Gallery Event',
  },
]

export const INSTALLATION_CARDS: { poster: string; video: string; label: string }[] = [
  {
    poster: 'https://media.tbsdesigngallery.com/installation-poster.jpg',
    video: 'https://media.tbsdesigngallery.com/installation.mp4',
    label: 'Installation',
  },
  {
    poster: 'https://media.tbsdesigngallery.com/people-poster.jpg',
    video: 'https://media.tbsdesigngallery.com/people.mp4',
    label: 'People',
  },
  {
    poster: 'https://media.tbsdesigngallery.com/windows-doors-install-poster.jpg',
    video: 'https://media.tbsdesigngallery.com/windows-doors-install.mp4',
    label: 'Windows & Doors Installation',
  },
  {
    poster: 'https://media.tbsdesigngallery.com/uriel-walking-in-poster.jpg',
    video: 'https://media.tbsdesigngallery.com/uriel-walking-in.mp4',
    label: 'Uriel Walking In',
  },
]

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Pre-proposal',
    body: 'We review your plans, define the initial scope, and establish a realistic project budget.',
    image: '/landing/process-1.png',
  },
  {
    number: '02',
    title: 'Discovery',
    body: 'We align the client, architect, designer, and contractor around priorities, scope, and schedule.',
  },
  {
    number: '03',
    title: 'Design',
    body: 'We translate decisions into drawings, specifications, material schedules, and confirmed costs.',
  },
  {
    number: '04',
    title: 'Implementation',
    body: 'We coordinate ordering, logistics, quality, delivery, and installation through completion.',
  },
  {
    number: '05',
    title: 'Post-completion',
    body: 'We remain accountable through warranty, maintenance, and ongoing service.',
  },
]

export type FooterLink = { label: string; href: string }

/**
 * Footer columns from the Figma frame. Social hrefs are placeholders — swap
 * them for the real profile URLs when available.
 */
export const FOOTER_COLUMNS: { number: string; label: string; links: FooterLink[] }[] = [
  {
    number: '01',
    label: 'Product Specification',
    links: [
      { label: 'Custom Cabinetry', href: '/custom-cabinetry' },
      { label: 'Windows & doors', href: '/windows-doors' },
      { label: 'Appliances', href: '/appliances' },
      { label: 'Outdoor living', href: '/outdoor-living' },
      { label: 'Architectural elements', href: '/architectural-elements-furniture' },
    ],
  },
  {
    number: '02',
    label: 'About us',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Team', href: '/contact' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    number: '03',
    label: 'Socials',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'Yelp', href: '#' },
      { label: 'Houzz', href: '#' },
      { label: 'Vimeo', href: '#' },
      { label: 'Youtube', href: '#' },
    ],
  },
]

export const FOOTER_ADDRESS = {
  name: 'TBS Design Gallery',
  address: '3283 De La Cruz Boulevard, Suite A, Santa Clara, CA 95054',
  hours: 'Monday-Friday: 10am-3pm',
}

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
