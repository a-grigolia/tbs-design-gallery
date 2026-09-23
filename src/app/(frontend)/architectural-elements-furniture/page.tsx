import type { Metadata } from 'next'

import React from 'react'

import { CategoryPage } from '@/components/vendor/CategoryPage'

export const revalidate = 300

// Title and description preserved verbatim from the live Webflow page — they
// carry the site's ranking history, don't reword casually. (The live site
// reuses the windows-doors description here; kept as-is on purpose.)
export const metadata: Metadata = {
  title: 'Architectural Elements',
  description:
    'TBS Design Gallery offers steel, aluminum, and wood window and door installation solutions for luxury homes throughout the San Francisco Bay Area.',
}

export default function ArchitecturalElementsFurniturePage() {
  return (
    <CategoryPage
      category="architectural-elements-furniture"
      title="Architectural Elements & Furniture"
      video={{
        src: 'https://media.tbsdesigngallery.com/architectural-elements-hero.mp4',
        poster: 'https://media.tbsdesigngallery.com/architectural-elements-hero-poster.jpg',
      }}
      heading="Transform Your Space with Timeless Elegance"
      body={
        <>
          Discover the perfect blend of expert craftsmanship and innovative design with TBS Design
          Gallery&rsquo;s exclusive collection of architectural elements and furniture. As a proud
          partner of Italian luxury brand Laura Meroni, we offer a hand-picked selection of
          custom-made pieces that exceed the highest standards of quality and style. Each piece is
          meticulously crafted to elevate your space. With our collection, you can effortlessly add
          sophistication to your home or create a statement piece that will impress for years to
          come. Find your perfect match and elevate your space today.
        </>
      }
      gridLabel="All architectural elements & furniture"
    />
  )
}
