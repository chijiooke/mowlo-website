import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { ArtistsLanding } from '@/components/sections/artists/ArtistsLanding'
import { ArtistFeatures } from '@/components/sections/artists/ArtistFeatures'
import { ArtistMerch } from '@/components/sections/artists/ArtistMerch'
import { Quality } from '@/components/sections/quality/Quality'
import { Community } from '@/components/sections/creators/Community'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'
import { APPLY_URL } from '@/lib/links'
import { SmoothScroll } from '@/lib/scroll/SmoothScroll'

const TITLE = "Artist's Corner: framed prints in limited drops"
const DESCRIPTION =
  'Fast, free art shops for digital artists. Sell your work as framed prints in timed, limited-edition drops, plus stickers, key holders and more. Your wallet stays out of it: Mowlo handles orders, printing, packing and delivery.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'sell art prints Nigeria',
    'framed prints Nigeria',
    'limited edition art prints',
    'art drops',
    'online art shop for artists',
    'digital artists Nigeria',
    'print on demand art Ghana',
  ],
  alternates: { canonical: '/artists' },
  // Shot from /dev/og?v=artists by scripts/og/shoot.sh.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/artists',
    images: [{ url: '/og-artists.jpg', width: 1200, height: 630, alt: "For living artists. Mowlo's Artist's Corner: fast, free art shops for digital artists.", type: 'image/jpeg' }],
  },
  twitter: { title: TITLE, description: DESCRIPTION, images: ['/og-artists.jpg'] },
}

/** Artist's Corner: what it is, what you get, the merch you can add, the quality promise, the collectors it builds, the way in. */
export default function ArtistsPage() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <ArtistsLanding />
        <ArtistFeatures />
        <ArtistMerch />
        <Quality variant="art" />
        <Community variant="art" />
        <FinalCTA
          lines={['Your art.', 'Their walls.']}
          body="Apply with your portfolio. We review every application, then you can open your first drop."
          cta={{ label: 'Apply to sell →', href: APPLY_URL }}
        />
      </main>
      <Footer />
    </>
  )
}
