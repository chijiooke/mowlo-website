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
import { WaitlistCTA } from '@/components/WaitlistForm'
import { button } from '@/components/ui/button'
import { Handset } from '@/components/ui/Handset'
import { Stamp } from '@/components/ui/Stamp'

/** What Mowlo actually does, in the order a customer meets it. */
const SERVICES = [
  { name: 'Quality prints', note: 'Cards, stickers, flyers, tees — cut and finished the way you chose.', icon: 'lucide:printer', tint: 'bg-amber text-ink' },
  { name: 'AI designer', note: 'Answer five questions; get a logo, palette and print-ready layouts.', icon: 'lucide:sparkles', tint: 'bg-teal text-ink' },
  { name: 'Creator store', note: 'Sell the merch you print, from a page of your own.', icon: 'lucide:store', tint: 'bg-pink text-ink' },
  { name: 'Tracked delivery', note: '24hrs in Lagos, 2–3 days elsewhere — tracked the whole way.', icon: 'lucide:truck', tint: 'bg-sky text-ink' },
  { name: 'Repeat orders', note: 'Reorder in one tap, or set it to repeat.', icon: 'lucide:repeat-2', tint: 'bg-lime text-ink' },
]

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
export function Quality() {
  // The phone mock animates its toast off scroll in the Mobile app chapter.
  // Here it is a still: held at the end, so the toast is simply in place.
  const settled = useMotionValue(1)

  return (
    <Chapter ground="cream" pattern="grain" id="quality" className="py-section">
      <Container>
        <header className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-5 text-amber-deep">Quality</Eyebrow>
            <h2 className="max-w-[18ch] text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
              Premium quality. <span className="text-muted-on-light">Guaranteed.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <p className="mb-6 max-w-[34rem] text-base leading-relaxed text-muted-on-light">
              Cut to the line you drew, finished the way you chose, and packed the way it should arrive. It is your name
              on it, not ours.
            </p>
            <WaitlistCTA className={button.ink} label="Download the app →" source="quality" />
          </Reveal>
        </header>

        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {/* The app you order from, cropped by the card the way a screenshot sits on a page. */}
          <Reveal className="md:row-span-2">
            <div className={clsx(CARD, 'relative h-full min-h-[26rem] overflow-hidden md:min-h-[36rem]')}>
              {/* The phone's bottom corner sits in the card and the rest runs off
                  the top and the right, so the device reads as a real object the
                  card is cropping rather than a picture of a phone. */}
              <div aria-hidden="true" className="absolute right-[-12%] bottom-12 md:right-[-18%] md:bottom-14">
                <div className="origin-bottom scale-[1.25] md:scale-[1.55]">
                  <Handset>
                    <PhoneScreen progress={settled} />
                  </Handset>
                </div>
              </div>
              {/* Straddling the phone's left edge: half on the device, half on the
                  card, the way a sticker lands on something. Inside the screen it
                  read as app UI. */}
              <Stamp text="Quality guaranteed ·" className="absolute bottom-16 left-5 size-32 md:bottom-20 md:left-8 md:size-40" />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <article className={clsx(CARD, 'h-full p-7')}>
              <h3 className="mb-3 text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                Build the brand. <span className="text-muted-on-light">Keep running the business.</span>
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-on-light">
                Choose what you need and get back to work. We print it and bring it to your door — no brief to write, no
                press to chase, nothing to collect.
              </p>
            </article>
          </Reveal>

          {/* The finishes, as colour. */}
          <Reveal delay={0.12} className="md:row-span-2">
            <article className={clsx(CARD, 'flex h-full flex-col p-7')}>
              <h3 className="mb-6 text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                Everything we do. <span className="text-muted-on-light">One place.</span>
              </h3>
              <ul className="flex flex-1 flex-col justify-between gap-5">
                {SERVICES.map(service => (
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
                src="/assets/quality-shop-owner.jpg"
                alt="A smiling shop owner holding up a bottle of their own product in store"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1320px) 33vw, 420px"
                className="object-cover object-[38%_30%]"
              />
            </figure>
          </Reveal>

        </div>
      </Container>
    </Chapter>
  )
}
