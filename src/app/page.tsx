import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { ValueSection } from '@/components/ValueSection'
import { ProductsSection } from '@/components/ProductsSection'
import { PhotoStrip } from '@/components/PhotoStrip'
import { BrandPacks } from '@/components/BrandPacks'
import { HowItWorks } from '@/components/HowItWorks'
import { WhatsAppSection } from '@/components/WhatsAppSection'
import { Testimonials } from '@/components/Testimonials'
import { PopupSection } from '@/components/PopupSection'
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
      <ValueSection />
      <ProductsSection />
      <PhotoStrip />
      <BrandPacks />
      <HowItWorks />
      <WhatsAppSection />
      <Testimonials />
      <PopupSection />
      <FinalCTA />
      <Footer />
    </>
  )
}
