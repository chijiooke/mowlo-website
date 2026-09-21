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

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <ImmersiveRoot>
      <SmoothScroll />
      <Nav />
      {/* The landing names the brand; the audience cards ask who is printing;
          then the parade shows what comes out, and the product list names it all. */}
      <Landing />
      <Audience />
      <Parade />
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
