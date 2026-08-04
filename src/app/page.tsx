import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { HowItWorks } from '@/components/HowItWorks'
import { ProductsSection } from '@/components/ProductsSection'
import { BrandPacks } from '@/components/BrandPacks'
import { MobileApp } from '@/components/MobileApp'
import { Testimonials } from '@/components/Testimonials'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <ProductsSection />
      <BrandPacks />
      <MobileApp />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  )
}
