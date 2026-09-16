import Image from 'next/image'
import { Reveal } from './Reveal'
import { WaitlistCTA } from './WaitlistForm'

/**
 * One card, one message: printing together costs less than printing one thing
 * at a time. No tier names and no figures — pricing isn't set yet.
 */
const BUNDLE = {
  eyebrow: 'Curated bundle',
  name: 'Order it all together, pay less.',
  note: 'We put the things every small business actually prints into one curated bundle. Order them together and the whole run costs less than buying each piece on its own.',
  items: [
    'Business cards',
    'Product stickers',
    'A5 flyers',
    'Packaging inserts',
    'Full AI brand identity',
    '24hr Lagos delivery',
  ],
  photo: {
    src: '/assets/happy-mowlo.jpg',
    alt: 'Customer holding a completed Mowlo print order',
  },
}

export function BrandPacks() {
  return (
    <section id="packs" className="packs-bg">
      <div className="packs-inner">
        <Reveal>
          <span className="sec-label">Brand Packs</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="sec-title">
            Bundle it.
            <br />
            Pay less.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="sec-sub">
            Printing in bulk is cheaper than printing one thing at a time. Our bundles do that for
            you.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="pack-show">
            <div className="pack-show-media">
              <Image
                src={BUNDLE.photo.src}
                alt={BUNDLE.photo.alt}
                fill
                sizes="(max-width: 880px) 100vw, 44vw"
                className="pack-show-img"
              />
            </div>

            <div className="pack-show-body">
              <div className="pack-tier">{BUNDLE.eyebrow}</div>
              <h3 className="pack-name">{BUNDLE.name}</h3>
              <p className="pack-note">{BUNDLE.note}</p>

              <ul className="pack-list">
                {BUNDLE.items.map(i => (
                  <li key={i}>{i}</li>
                ))}
              </ul>

              <WaitlistCTA className="pack-btn" label="Join waitlist for bundles →" source="brand-packs" />

              <p className="pack-alt">
                Three sizes — the bigger the bundle, the bigger the saving.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
