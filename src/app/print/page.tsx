import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Landing } from '@/components/sections/landing/Landing'
import { Audience } from '@/components/sections/audience/Audience'
import { Parade } from '@/components/sections/parade/Parade'
import { Quality } from '@/components/sections/quality/Quality'
import { TrustBar } from '@/components/TrustBar'
import { HowItWorks } from '@/components/sections/how-it-works/HowItWorks'
import { ProductsSection } from '@/components/ProductsSection'
import { BrandPacks } from '@/components/BrandPacks'
import { MobileApp } from '@/components/sections/mobile-app/MobileApp'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'
import { ImmersiveRoot } from '@/components/three/ImmersiveRoot'
import { SmoothScroll } from '@/lib/scroll/SmoothScroll'

const TITLE = 'Print for small businesses — cards, stickers, flyers'
const DESCRIPTION =
  'Get a full brand kit — logo, colours, business cards, flyers, stickers — in minutes. AI-powered design, printed in Nigeria & Ghana, delivered to your door in 24 hours.'

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
    'AI brand design',
    'print shop Nigeria',
    'reorder print online',
  ],
  alternates: { canonical: '/print' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/print' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

/** The small-business print site, as the homepage was before Creators led. */
export default function PrintPage() {
  return (
    <ImmersiveRoot>
      <SmoothScroll />
      <Nav variant="print" />
      {/* The landing names the brand; the audience cards ask who is printing;
          then the parade shows what comes out, and the product list names it all. */}
      <Landing
        variant="print"
        title="Mowlo — print and branding for small businesses in Nigeria and Ghana"
        lede="Business cards, stickers, flyers and tees — designed in minutes, printed locally, delivered to your door."
        cta={{ label: 'Download the app', waitlist: 'landing' }}
        secondary={{ label: 'See what we print', href: '#products' }}
      />
      <Audience />
      <Parade variant="print" />
      <ProductsSection />
      {/* Then the promise about how it comes out. */}
      <Quality />
      <HowItWorks />
      <TrustBar />
      <BrandPacks />
      <MobileApp />
      <FinalCTA />
      <Footer />
    </ImmersiveRoot>
  )
}
