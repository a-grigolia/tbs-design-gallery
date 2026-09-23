import type { Metadata } from 'next'

import React from 'react'

import { CategoryPage } from '@/components/vendor/CategoryPage'

export const revalidate = 300

// Title and description preserved verbatim from the live Webflow page — they
// carry the site's ranking history, don't reword casually.
export const metadata: Metadata = {
  title: 'Santa Clara Windows and Doors | Luxury Brands',
  description:
    'TBS Design Gallery offers steel, aluminum, and wood window and door installation solutions for luxury homes throughout the San Francisco Bay Area.',
}

export default function WindowsDoorsPage() {
  return (
    <CategoryPage
      category="windows-doors"
      title="Windows & Doors"
      video={{
        src: 'https://media.tbsdesigngallery.com/windows-doors-hero.mp4',
        poster: 'https://media.tbsdesigngallery.com/windows-doors-hero-poster.jpg',
      }}
      heading="Surround yourself with natural beauty"
      body={
        <>
          In line with the biophilic method of architecture, in which spaces are designed to blend
          indoors and outdoors seamlessly, TBS has partnered with product manufacturers that are on
          the cutting edge of producing windows and doors that are bigger, stronger, and more
          durable. Companies like Reynaers, Euroline, and TruStile integrate technology to allow
          for ever-thinner frames while still maintaining a level of style and elegance that
          enhances the beauty of any home. So no need to feel boxed in; at TBS you&rsquo;ll find
          windows and doors that will set your spirit free.
        </>
      }
      gridLabel="All windows & doors"
    />
  )
}
