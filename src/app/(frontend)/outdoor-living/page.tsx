import type { Metadata } from 'next'

import React from 'react'

import { CategoryPage } from '@/components/vendor/CategoryPage'

export const revalidate = 300

// Title and description preserved verbatim from the live Webflow page — they
// carry the site's ranking history, don't reword casually (yes, including the
// trailing ">").
export const metadata: Metadata = {
  title: 'Santa Clara Outdoor Living Design | Luxury Brands',
  description:
    'Shop high-end custom outdoor design structures for your outdoor entertaining needs. Custom options from top brands like Renson Pergolas. Shop the gallery now.>',
}

export default function OutdoorLivingPage() {
  return (
    <CategoryPage
      category="outdoor-living"
      title="Outdoor Living"
      video={{
        src: 'https://media.tbsdesigngallery.com/outdoor-living-hero.mp4',
        poster: 'https://media.tbsdesigngallery.com/outdoor-living-hero-poster.jpg',
      }}
      heading="Designed to bring the outside in"
      body={
        <>
          TBS Design Gallery has chosen to work with two companies in line with our standards of
          excellence and our firm belief in the importance of biophilic living &mdash; otherwise
          known as &ldquo;design with the intention of connecting human beings with their natural
          surroundings.&rdquo; Those companies are Renson and Premier Outdoor Cabinetry.
        </>
      }
      gridLabel="All outdoor living"
    />
  )
}
