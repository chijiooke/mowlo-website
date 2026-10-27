import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Landing } from '@/components/sections/landing/Landing'
import { DropSteps } from '@/components/sections/creators/DropSteps'
import { Parade } from '@/components/sections/parade/Parade'
import { Earnings } from '@/components/sections/creators/Earnings'
import { Quality } from '@/components/sections/quality/Quality'
import { WhoFor } from '@/components/sections/creators/WhoFor'
import { Community } from '@/components/sections/creators/Community'
import { DropBadges } from '@/components/sections/creators/DropBadges'
import { Faq } from '@/components/sections/creators/Faq'
import { MerchLine } from '@/components/sections/creators/MerchLine'
import { TrustBar } from '@/components/TrustBar'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'
import { ImmersiveRoot } from '@/components/three/ImmersiveRoot'
import { APPLY_URL } from '@/lib/links'
import { SmoothScroll } from '@/lib/scroll/SmoothScroll'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/** Creators leads the site; small-business print lives at /print. */
export default function HomePage() {
  return (
    <ImmersiveRoot>
      <SmoothScroll />
      <Nav />
      {/* The landing says what a drop is; the steps show the window; the
          parade shows what goes in it; then the quality promise and the work we
          take off your hands, the money, the community it builds, and the way
          into the rest of Mowlo.
          Grounds alternate cream and ink all the way down. */}
      <Landing
        variant="merch"
        title={
          <>
            Drop <span className="text-amber">merch</span> to your <span className="text-amber">audience.</span>
          </>
        }
        showTitle
        lede="No stock, nothing upfront. You set the timer, your people order, and we print, pack and deliver every piece."
        cta={{ label: 'Apply to sell', href: APPLY_URL }}
        secondary={{ label: 'How drops work', href: '#drops' }}
      />
      <DropSteps />
      <Parade variant="merch" id="merch" />
      <MerchLine />
      <Quality variant="merch" />
      <TrustBar variant="merch" />
      <Earnings />
      <Community />
      <WhoFor />
      <Faq />
      <FinalCTA
        lines={['Your audience.', 'Your merch.']}
        body="Apply with your socials. We review every application, then you can open your first drop."
        cta={{ label: 'Apply to sell →', href: APPLY_URL }}
        panel={<DropBadges />}
      />
      <Footer />
    </ImmersiveRoot>
  )
}
