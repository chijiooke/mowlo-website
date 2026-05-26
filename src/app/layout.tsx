import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mowlo.co'
const OG_IMAGE = `${SITE_URL}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Mowlo — Your hustle deserves to look this good.',
    template: '%s | Mowlo',
  },
  description:
    'Print on demand for small businesses in Nigeria & Ghana. AI brand kits, stickers, business cards, flyers and more — designed fast, delivered to your door in 24 hours.',
  keywords: [
    'print on demand Nigeria',
    'brand kit Nigeria',
    'stickers Nigeria',
    'business cards Lagos',
    'flyers Lagos',
    'small business branding Nigeria',
    'brand packs Ghana',
    'AI brand design',
    'print shop Nigeria',
    'WhatsApp print approval',
  ],
  authors: [{ name: 'Mowlo' }],
  creator: 'Mowlo',
  publisher: 'Mowlo',

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Mowlo',
    title: 'Mowlo — Your hustle deserves to look this good.',
    description:
      'AI brand kits, stickers, cards, flyers — designed in seconds, printed fast, delivered to your door. The print-on-demand partner for small businesses in Nigeria & Ghana.',
    locale: 'en_NG',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Mowlo — Print on demand for Nigerian & Ghanaian small businesses',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mowlohq',
    creator: '@mowlohq',
    title: 'Mowlo — Your hustle deserves to look this good.',
    description:
      'AI brand kits, stickers, cards & flyers — printed fast, delivered to your door. Made for hustlers in Nigeria & Ghana.',
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
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
