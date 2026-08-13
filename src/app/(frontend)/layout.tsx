import React from 'react'
import { Figtree, Geist, Hanken_Grotesk, Source_Serif_4 } from 'next/font/google'
import './styles.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree-var',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-var',
})

export const metadata = {
  title: 'TBS Design Gallery — Custom solutions for every space',
  description:
    'TBS Design Gallery pairs curated American and European solutions in windows, doors, custom millwork, and outdoor living with the expertise to support every project from specification through installation and service.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${geist.variable} ${figtree.variable} ${hankenGrotesk.variable}`}
    >
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
