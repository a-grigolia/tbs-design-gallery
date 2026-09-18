import React from 'react'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './styles.css'

// The site is single-family: every token in styles.css resolves to Geist.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
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
      className={geist.variable}
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
