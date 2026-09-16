import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/sections/hero/Hero'
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
      <Hero />
      <TrustBar />
      <HowItWorks />
      <ProductsSection />
      <BrandPacks />
      <MobileApp />
      <FinalCTA />
      <Footer />
    </ImmersiveRoot>
  )
}
