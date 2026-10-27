'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { useMotionValue } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/type/Type'
import { PhoneScreen } from '@/components/sections/mobile-app/MobileApp'
import { DropScreen } from '@/components/sections/creators/DropScreen'
import { WaitlistCTA } from '@/components/WaitlistForm'
import { APPLY_URL } from '@/lib/links'
import { button } from '@/components/ui/button'
import { Handset } from '@/components/ui/Handset'
import { PillPattern } from '@/components/ui/PillPattern'
import { Stamp } from '@/components/ui/Stamp'

interface Service {
  name: string
  note: string
  icon: string
  tint: string
}

/** What Mowlo actually does, in the order a customer meets it. */
const PRINT_SERVICES: Service[] = [
  { name: 'Quality prints', note: 'Cards, stickers, flyers, tees, cut and finished the way you chose.', icon: 'lucide:printer', tint: 'bg-amber text-ink' },
  { name: 'AI designer', note: 'Answer five questions; get a logo, palette and print-ready layouts.', icon: 'lucide:sparkles', tint: 'bg-teal text-ink' },
  { name: 'Creator store', note: 'Sell the merch you print, from a page of your own.', icon: 'lucide:store', tint: 'bg-pink text-ink' },
  { name: 'Tracked delivery', note: '24hrs in Lagos, 2–3 days elsewhere, tracked the whole way.', icon: 'lucide:truck', tint: 'bg-sky text-ink' },
  { name: 'Repeat orders', note: 'Reorder in one tap, or set it to repeat.', icon: 'lucide:repeat-2', tint: 'bg-lime text-ink' },
]

/** What a creator hands over: everything between posting the link and the parcel. */
const MERCH_SERVICES: Service[] = [
  { name: 'Sample review', note: 'Your call: see and touch every piece before it goes live.', icon: 'lucide:scan-eye', tint: 'bg-lime text-ink' },
  { name: 'Your drop shop', note: 'One link for your bio, with a countdown to close.', icon: 'lucide:link', tint: 'bg-amber text-ink' },
  { name: 'Checkout', note: 'Your people pay on the page. Stock is held while they do.', icon: 'lucide:credit-card', tint: 'bg-teal text-ink' },
  { name: 'Printing', note: 'Exactly what sold, by our print partners, once the drop closes.', icon: 'lucide:printer', tint: 'bg-pink text-ink' },
  { name: 'Packing', note: 'By us, or pack and hand it out yourself if that’s your thing.', icon: 'lucide:package', tint: 'bg-purple text-white' },
  { name: 'Delivery', note: 'To every buyer, tracked the whole way.', icon: 'lucide:truck', tint: 'bg-sky text-ink' },
]

/** What an artist hands over: everything between the upload and the wall. */
const ART_SERVICES: Service[] = [
  { name: 'Proof first', note: 'Your call: we print one and send it to you before the drop opens.', icon: 'lucide:scan-eye', tint: 'bg-lime text-ink' },
  { name: 'Your edition', note: 'You set how many exist. When they’re gone, they’re gone.', icon: 'lucide:hash', tint: 'bg-amber text-ink' },
  { name: 'Checkout', note: 'Collectors pay on your drop page. Their print is held while they do.', icon: 'lucide:credit-card', tint: 'bg-teal text-ink' },
  { name: 'Printing & framing', note: 'Exactly what sold, once the drop closes. Nothing printed on spec.', icon: 'lucide:frame', tint: 'bg-pink text-ink' },
  { name: 'Packing', note: 'Packed to travel, so it arrives the way it left.', icon: 'lucide:package', tint: 'bg-purple text-white' },
  { name: 'Delivery', note: 'To every collector, tracked the whole way.', icon: 'lucide:truck', tint: 'bg-sky text-ink' },
]

/**
 * The print site sells the ordering; the Creators site sells the drop. Same
 * grid, same promise, each in its own voice and with its own phone screen.
 */
const COPY = {
  print: {
    lede: 'Cut to the line you drew, finished the way you chose, and packed the way it should arrive. It is your name on it, not ours.',
    card: { lead: 'Build the brand.', rest: 'Keep running the business.' },
    cardBody: 'Choose what you need and get back to work. We print it and bring it to your door. No brief to write, no press to chase, nothing to collect.',
    list: { lead: 'Everything we do.', rest: 'One place.' },
    services: PRINT_SERVICES,
    photo: { src: '/assets/quality-shop-owner.jpg', alt: 'A smiling shop owner holding up a bottle of their own product in store', focus: 'object-[38%_30%]' },
  },
  merch: {
    lede: 'Prints that look sharp and feel right, finished properly and packed the way they should arrive. Your name’s on it, so we treat it like ours.',
    card: { lead: 'Hold it first.', rest: 'Then drop it.' },
    cardBody: 'Switch on sample review and we print one of every piece and send it to you before the drop goes live. Check the print, the colour, the feel. You only open it when you’re happy.',
    list: { lead: 'Everything we handle.', rest: 'All of it.' },
    services: MERCH_SERVICES,
    photo: { src: '/assets/side-hustle.jpg', alt: 'Two people looking over clothes on a rail in a store', focus: 'object-[40%_40%]' },
  },
  art: {
    lede: 'Colour that matches what you made, paper that feels like it should, and a frame that does the work justice. Your name’s on the wall, so we treat it like ours.',
    card: { lead: 'See the proof.', rest: 'Then drop it.' },
    cardBody: 'Switch on proofing and we print and frame one before the drop opens, then send it to you. Check the colour, the paper, the frame. You only go live when it’s right.',
    list: { lead: 'Everything we handle.', rest: 'All of it.' },
    services: ART_SERVICES,
    photo: { src: '/assets/artists-thumbs-up.jpg', alt: 'A smiling artist in a wheelchair giving two thumbs up beside his easel', focus: 'object-[48%_30%]' },
  },
}

/**
 * The shell every panel here shares. No shadow and no border: the card is told
 * apart from the ground by tone alone — white on cream — which is what keeps
 * the section flat and quiet.
 */
const CARD = 'rounded-[2rem] bg-white'

/**
 * Chapter — the quality promise, as a grid: the app you order from, the
 * person whose name is on the work, and the finishes it can take.
 *
 * Type here is deliberately plain — body font, moderate size, one dark tone
 * with secondary lines in grey. The display face this site uses elsewhere is
 * condensed and shouts; this section is meant to read as calm and exact.
 *
 * Every claim already appears elsewhere on the site (finishes, die-cut shapes,
 * delivery windows). Nothing here implies a proofing step, a reprint or a refund
 * policy: proofing is not a product Mowlo offers, and the rest is the founder's
 * to set.
 */
export function Quality({ variant = 'print' }: { variant?: keyof typeof COPY }) {
  const copy = COPY[variant]
  // Creators and Artist's Corner share the drop: the apply link, the pattern card and the drop screen.
  const drop = variant !== 'print'
  // The phone mock animates its toast off scroll in the Mobile app chapter.
  // Here it is a still: held at the end, so the toast is simply in place.
  const settled = useMotionValue(1)

  return (
    <Chapter ground="cream" pattern="grain" id="quality" className="py-section">
      <Container>
        <header className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal className="md:col-span-7">
            <Eyebrow className={clsx('mb-5', drop ? 'text-ink/55' : 'text-amber-deep')}>Quality</Eyebrow>
            {/* Set like Getting paid's "Your price. Your earnings.": two lines, the second in grey. */}
            <h2 className="text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
              <span className="block">Premium quality.</span> <span className="block text-muted-on-light">Guaranteed.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <p className="mb-6 max-w-[34rem] text-base leading-relaxed text-muted-on-light">{copy.lede}</p>
            {drop ? (
              <a href={APPLY_URL} className={button.ink}>
                Apply to sell →
              </a>
            ) : (
              <WaitlistCTA className={button.ink} label="Download the app →" source="quality" />
            )}
          </Reveal>
        </header>

        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {/* The app you order from, cropped by the card the way a screenshot sits on a page. */}
          <Reveal className="md:row-span-2">
            <div
              className={clsx(
                'relative h-full min-h-[26rem] overflow-hidden rounded-[2rem] md:min-h-[36rem]',
                // Drops get the capsule pattern behind the phone; print keeps the plain card.
                drop ? 'bg-teal text-ink/70' : 'bg-white',
              )}
            >
              {drop && <PillPattern />}
              {/* The phone's bottom corner sits in the card and the rest runs off
                  the top and the right, so the device reads as a real object the
                  card is cropping rather than a picture of a phone. */}
              <div aria-hidden="true" className="absolute right-[-12%] bottom-12 md:right-[-18%] md:bottom-14">
                <div className="origin-bottom scale-[1.25] md:scale-[1.55]">
                  <Handset>
                    {drop ? <DropScreen variant={variant} /> : <PhoneScreen progress={settled} />}
                  </Handset>
                </div>
              </div>
              {/* Straddling the phone's left edge: half on the device, half on the
                  card, the way a sticker lands on something. Inside the screen it
                  read as app UI. */}
              <Stamp
                text="Quality guaranteed ·"
                disc={drop ? 'fill-amber' : undefined}
                className="absolute bottom-16 left-5 size-32 md:bottom-20 md:left-8 md:size-40"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <article className={clsx(CARD, 'h-full p-7')}>
              <h3 className="mb-3 text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                {copy.card.lead} <span className="text-muted-on-light">{copy.card.rest}</span>
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-on-light">{copy.cardBody}</p>
            </article>
          </Reveal>

          {/* The finishes, as colour. */}
          <Reveal delay={0.12} className="md:row-span-2">
            <article className={clsx(CARD, 'flex h-full flex-col p-7')}>
              <h3 className="mb-6 text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                {copy.list.lead} <span className="text-muted-on-light">{copy.list.rest}</span>
              </h3>
              <ul className="flex flex-1 flex-col justify-between gap-5">
                {copy.services.map(service => (
                  <li key={service.name} className="flex items-start gap-3.5">
                    <span className={clsx('flex size-10 shrink-0 items-center justify-center rounded-[0.9rem]', service.tint)}>
                      <Icon icon={service.icon} width={19} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-ink">{service.name}</span>
                      <span className="block text-[14px] leading-snug text-muted-on-light">{service.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          {/* The person whose name is on the work. */}
          <Reveal delay={0.18}>
            <figure className={clsx(CARD, 'relative h-full min-h-[18rem] overflow-hidden md:min-h-[16rem]')}>
              <Image
                src={copy.photo.src}
                alt={copy.photo.alt}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1320px) 33vw, 420px"
                className={clsx('object-cover', copy.photo.focus)}
              />
            </figure>
          </Reveal>

        </div>
      </Container>
    </Chapter>
  )
}
