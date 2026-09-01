import React from 'react'
import { Figtree, Geist, Hanken_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import './styles.css'

// LT Superior Serif (LyonsType, OFL) — self-hosted; not available on Google Fonts.
const superiorSerif = localFont({
  src: [
    { path: '../../fonts/LTSuperiorSerif-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../fonts/LTSuperiorSerif-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../fonts/LTSuperiorSerif-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../../fonts/LTSuperiorSerif-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-superior-serif',
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
      className={`${superiorSerif.variable} ${geist.variable} ${figtree.variable} ${hankenGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
