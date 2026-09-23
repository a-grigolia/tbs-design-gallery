import type { Metadata } from 'next'

import React from 'react'

import { CategoryPage } from '@/components/vendor/CategoryPage'

export const revalidate = 300

// Title and description preserved verbatim from the live Webflow page — they
// carry the site's ranking history, don't reword casually (yes, including the
// trailing ">>").
export const metadata: Metadata = {
  title: 'Santa Clara Appliance Store',
  description:
    'Get high-end kitchen appliances to elevate your home design with the luxury appliance brands available at TBS Design Gallery in Santa Clara. Schedule your appointment now.>>',
}

export default function AppliancesPage() {
  return (
    <CategoryPage
      category="appliances"
      title="Appliances"
      video={{
        src: 'https://media.tbsdesigngallery.com/architectural-elements-hero.mp4',
        poster: 'https://media.tbsdesigngallery.com/architectural-elements-hero-poster.jpg',
      }}
      heading="Luxury Appliances for Refined Tastes"
      body={
        <>
          TBS Design Gallery represents only a select few product lines when it comes to home
          appliances. So far, only two names have earned our absolute loyalty and admiration: La
          Cornue and Miele.
        </>
      }
      gridLabel="All appliances"
    />
  )
}
