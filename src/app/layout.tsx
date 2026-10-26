import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Sans, Dancing_Script } from 'next/font/google'
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

// The accent face: a flowing script, for the odd word in a headline that
// should feel written rather than set. Variable: the bold end carries it.
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mowlo.vercel.app'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Mowlo — Drop merch to your audience.',
    template: '%s | Mowlo',
  },
  description:
    'Creator merch drops with no stock and nothing up front. Pick tees, mugs, stickers and more, set your price and window — when orders close, Mowlo prints and delivers to every buyer in Nigeria & Ghana.',
  keywords: [
    'creator merch Nigeria',
    'merch drops',
    'sell merch Nigeria',
    'print on demand merch Lagos',
    'influencer merch Nigeria',
    'custom tees Nigeria',
    'creator store Ghana',
    'merch without stock',
    'print on demand Nigeria',
    'small business printing Nigeria',
  ],
  authors: [{ name: 'Mowlo' }],
  creator: 'Mowlo',
  publisher: 'Mowlo',

  // TODO(creators): og-image.jpg still shows a print order; swap for a
  // merch render exported from the landing scene.
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Mowlo',
    title: 'Mowlo — Drop merch to your audience.',
    description:
      'No stock. Nothing up front. Set your price and window — when orders close, Mowlo prints and delivers to every buyer.',
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
    title: 'Mowlo — Drop merch to your audience.',
    description:
      'Merch drops for creators in Nigeria & Ghana. No stock, no money down — you set the timer, we print and deliver.',
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
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${dancingScript.variable}`}>
      <body>
        <WaitlistProvider>{children}</WaitlistProvider>
      </body>
    </html>
  )
}
