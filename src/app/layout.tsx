import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mowlo.vercel.app'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Mowlo — Your hustle deserves to look this good.',
    template: '%s | Mowlo',
  },
  description:
    'Get a full brand kit — logo, colours, business cards, flyers, stickers — in minutes. AI-powered design, printed in Nigeria & Ghana, delivered to your door in 24 hours.',
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
    'one-tap print approval',
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
      'Logo, colours, business cards, flyers, stickers — built by AI, printed locally, delivered to your door in 24 hours. The brand-in-a-box for small businesses in Nigeria & Ghana.',
    locale: 'en_NG',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'A happy small business owner holding her Mowlo print order — branded bags, stickers and flyers.',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mowlohq',
    creator: '@mowlohq',
    title: 'Mowlo — Your hustle deserves to look this good.',
    description:
      'AI brand kits, business cards, flyers & stickers — printed in Nigeria & Ghana, delivered in 24 hrs. Look like a million naira from day one.',
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
      <body>
        <WaitlistProvider>{children}</WaitlistProvider>
      </body>
    </html>
  )
}
