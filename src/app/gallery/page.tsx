import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { GalleryGrid } from '@/components/GalleryGrid'
import { getGalleryPage } from '@/lib/gallery'
import { APPLY_URL } from '@/lib/links'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mowlo.co'

export const metadata: Metadata = {
  title: "Artist's Corner — work printed by Mowlo",
  description:
    'Stickers, cards, flyers, labels and packaging designed by artists across Nigeria and Ghana — printed and delivered by Mowlo.',
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Artist's Corner — work printed by Mowlo",
    description: 'Browse work from artists across Nigeria and Ghana, printed and delivered by Mowlo.',
    url: `${SITE_URL}/gallery`,
  },
}

export default function GalleryPage() {
  // First page is rendered on the server so the grid is crawlable and paints instantly.
  const initial = getGalleryPage(1)

  return (
    <>
      <Nav />

      <header className="gal-head">
        <Reveal>
          <span className="sec-label">Artist&apos;s Corner</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="gal-title">
            Made here.
            <br />
            <span>Printed here.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="gal-sub">
            Work from artists across Nigeria and Ghana — turned into stickers, cards, flyers and
            packaging on the same rails that print for every hustle on Mowlo.
          </p>
        </Reveal>
      </header>

      <GalleryGrid initial={initial} />

      <div className="final">
        <div className="final-glow" />
        <Reveal>
          <h2>
            You can draw.
            <br />
            Now you can sell.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p>No capital, no stock. Upload once — we print, deliver, and pay you out.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <a className="btn-hp" href={APPLY_URL}>
            Apply to sell →
          </a>
        </Reveal>
      </div>

      <Footer />
    </>
  )
}
