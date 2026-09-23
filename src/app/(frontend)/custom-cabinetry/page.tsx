import type { Metadata } from 'next'

import React from 'react'

import { CategoryPage } from '@/components/vendor/CategoryPage'

export const revalidate = 300

// Title and description preserved verbatim from the live Webflow page — they
// carry the site's ranking history, don't reword casually.
export const metadata: Metadata = {
  title: 'Santa Clara Custom Cabinetry - TBS Design Gallery | Luxury Design',
  description:
    'TBS Design Gallery offers custom cabinetry and millwork solutions for residential kitchens, bathrooms, outdoor kitchens, and other areas of the home.',
}

export default function CustomCabinetryPage() {
  return (
    <CategoryPage
      category="custom-cabinetry"
      title="Custom Cabinetry"
      video={{
        src: 'https://media.tbsdesigngallery.com/custom-cabinetry-hero.mp4',
        poster: 'https://media.tbsdesigngallery.com/custom-cabinetry-hero-poster.jpg',
      }}
      heading="Custom is Personal"
      body={
        <>
          Your home should mirror your distinctive style and preferences. For this reason, TBS
          collaborates with leading manufacturers of custom cabinetry and millwork, including
          Premier Custom Built and Laurameroni, among others. These brands are renowned for their
          exceptional quality, durability, and craftsmanship, ensuring your cabinetry is a
          testament to superior design. With unlimited choices in color, finish, materials, style,
          shape, and size, &ldquo;custom&rdquo; becomes a personal expression uniquely tailored to
          you.
        </>
      }
      gridLabel="All custom cabinetry"
    />
  )
}
