import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { BusinessLanding } from '@/components/sections/business/BusinessLanding'
import { ProductsSection } from '@/components/ProductsSection'
import { Quality } from '@/components/sections/quality/Quality'
import { BrandPacks } from '@/components/BrandPacks'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'
import { SmoothScroll } from '@/lib/scroll/SmoothScroll'

const TITLE = 'Print for small businesses: cards, stickers, flyers'
const DESCRIPTION =
  'Business cards, stickers, flyers, labels and brand packs for small businesses in Nigeria and Ghana. Printed to a premium standard and delivered to your door.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'print on demand Nigeria',
    'brand kit Nigeria',
    'stickers Nigeria',
    'business cards Lagos',
    'flyers Lagos',
    'small business branding Nigeria',
    'brand packs Ghana',
    'print shop Nigeria',
  ],
  alternates: { canonical: '/print' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/print' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

/**
 * For business: the landing (with what we brand drifting beside it), then what we print, the quality promise, the
 * bundles and the closing line. Kept short; Creators is the main site.
 */
export default function PrintPage() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <BusinessLanding />
        <ProductsSection />
        <Quality />
        <BrandPacks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
