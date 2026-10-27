import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Sans, Satisfy } from 'next/font/google'
import { WaitlistProvider } from '@/components/WaitlistForm'
import './globals.css'

// Variable, not fixed weights: the width axis is what sets the condensed poster
// type (font-condensed), and one file covers every weight.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-bricolage',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// The accent face: a brush script, for the odd word in a section headline
// that should feel written rather than set. One weight is all it has.
const satisfy = Satisfy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-satisfy',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mowlo.vercel.app'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Mowlo | Drop merch to your audience',
    template: '%s | Mowlo',
  },
  description:
    'Merch drops for creators and framed print drops for artists in Nigeria and Ghana. No stock, nothing upfront: set your price and drop duration, your people order, and Mowlo prints, packs and delivers every piece.',
  keywords: [
    'creator merch Nigeria',
    'merch drops',
    'sell merch Nigeria',
    'influencer merch Nigeria',
    'merch without stock',
    'print on demand merch Lagos',
    'custom tees Nigeria',
    'creator store Ghana',
    'sell art prints Nigeria',
    'framed prints Nigeria',
    'limited edition art prints',
    'online art shop for artists',
  ],
  authors: [{ name: 'Mowlo' }],
  creator: 'Mowlo',
  publisher: 'Mowlo',

  // og-image.jpg is shot from /dev/og by scripts/og/shoot.sh.
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Mowlo',
    title: 'Drop merch to your audience | Mowlo',
    description:
      'No stock, nothing upfront. Set the timer, your people order, and we print, pack and deliver every piece. Merch for creators, framed prints for artists.',
    locale: 'en_NG',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Drop merch to your audience. Mowlo: a creator hugging a basket of bread beside a naira money-bag sticker.',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mowlohq',
    creator: '@mowlohq',
    title: 'Drop merch to your audience | Mowlo',
    description:
      'Merch drops for creators, framed print drops for artists. No stock, nothing upfront. You set the timer; we print, pack and deliver.',
    images: [OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },

  alternates: { canonical: SITE_URL },

  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F5A623',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${satisfy.variable}`}>
      <body>
        <WaitlistProvider>{children}</WaitlistProvider>
      </body>
    </html>
  )
}
