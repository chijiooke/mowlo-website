import Image from 'next/image'
import { Reveal } from './Reveal'
import { SavingsPig } from './SavingsPig'
import { PRINT_URL } from '@/lib/links'
import { Stamp } from './ui/Stamp'

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
      <div className="packs-inner relative">
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
          {/* The stamp is pressed onto the card's top corner, half on and half
              off it, the way the Quality chapter's sits on the phone. The card
              clips its own contents, so the stamp hangs outside it. */}
          <div className="relative">
            <Stamp
              text="Spend less · Get more ·"
              className="absolute -top-12 -right-8 z-10 size-28 md:-top-14 md:-right-14 md:size-36"
              center={<SavingsPig />}
            />
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

                <a className="pack-btn" href={PRINT_URL}>
                  Start printing →
                </a>

                <p className="pack-alt">
                  Three sizes: the bigger the bundle, the bigger the saving.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
