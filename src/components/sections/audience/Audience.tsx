'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { PopLetters } from '@/components/type/PopLetters'
import { Eyebrow } from '@/components/type/Type'
import { WaitlistCTA } from '@/components/WaitlistForm'
import { button } from '@/components/ui/button'

interface Tier {
  id: string
  name: string
  body: string
  soon?: boolean
  icon: string
  /** The card's own colour, on the icon tile. */
  tint: string
  photo: string
  alt: string
  /** How the photo is cropped, so the subject survives the card's narrow box. */
  focus: string
}

/**
 * Who we print for: a young team's launch kit, a shop with a customer in it,
 * and a floor of staff who all need the same thing — real work, photographed.
 */
const TIERS: Tier[] = [
  {
    id: 'startups',
    name: 'Start-ups',
    body: 'Show up like a company from day one: swag for the tech event, onboarding kits for new hires, flyers and stickers for the pop-up table, cards for the first pitch. One brand across all of it, in the quantities a young team actually needs.',
    icon: 'lucide:rocket',
    tint: 'bg-amber text-ink',
    photo: '/assets/who-startup-kit.jpg',
    alt: 'A branded staff kit — tote bag, bottle, hoodie and socks packed in a box',
    focus: 'object-[50%_52%]',
  },
  {
    id: 'small-business',
    name: 'Small business',
    body: 'Cards, flyers, stickers and bags — the pieces your customers carry home, printed together so they finally match.',
    icon: 'lucide:store',
    tint: 'bg-teal text-ink',
    photo: '/assets/who-small-business.jpg',
    alt: 'A shop owner showing clothes to a customer in a small boutique',
    focus: 'object-[50%_45%]',
  },
  {
    id: 'corporation',
    name: 'Big corporation',
    soon: true,
    body: 'Bulk runs across branches, staff kits and managed accounts. We are building it — tell us what you need and it shapes what we ship.',
    icon: 'lucide:building-2',
    tint: 'bg-purple text-white',
    photo: '/assets/who-corporate-office.jpg',
    alt: 'Two colleagues going over reports together at a desk in an office',
    focus: 'object-[46%_42%]',
  },
]

/**
 * The same card the Quality chapter uses: white on cream, told apart by tone
 * alone — no border, no shadow — which is what keeps both sections flat.
 */
const CARD = 'rounded-[2rem] bg-white'

export function Audience() {
  return (
    <Chapter ground="cream" pattern="grain" id="who" className="py-section">
      <Container>
        <header className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-5 text-amber-deep">Who we print for</Eyebrow>
            {/* The Products headline's treatment: the same type classes and the same
                letter-by-letter entrance, rather than a copy of its values.
                `.sec-title` hard-codes the dark ground's text colour and is unlayered
                CSS, which a Tailwind utility cannot override — hence the inline ink.
                The space between the lines keeps the heading reading as a sentence:
                PopLetters carries a hidden plain-text copy of each line. */}
            <h2 className="sec-title sec-title-xl" style={{ color: 'var(--ink)' }}>
              <PopLetters text="Branding you can hold." />{' '}
              <br />
              <PopLetters text="Ordered in minutes." delay={0.25} />
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <p className="mb-6 max-w-[34rem] text-base leading-relaxed text-muted-on-light md:text-lg">
              A new company, a growing shop, or a name with branches — the run size changes, the work does not.
            </p>
            <WaitlistCTA className={button.ink} label="Download the app →" source="audience" />
          </Reveal>
        </header>

        <ul className="grid gap-6 md:grid-cols-3 md:gap-7">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.id} delay={0.06 * i} className="h-full">
              <li className={clsx(CARD, 'flex h-full flex-col overflow-hidden')}>
                <div className="relative aspect-[5/4] w-full">
                  <Image
                    src={tier.photo}
                    alt={tier.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1320px) 33vw, 420px"
                    className={clsx('object-cover', tier.focus)}
                  />
                </div>

                <div className="flex flex-1 flex-col p-7 pt-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className={clsx('flex size-10 shrink-0 items-center justify-center rounded-[0.9rem]', tier.tint)}>
                      <Icon icon={tier.icon} width={19} aria-hidden="true" />
                    </span>
                    <h3 className="text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">{tier.name}</h3>
                    {tier.soon && (
                      <span className="rounded-full bg-teal/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-teal-deep uppercase">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted-on-light">{tier.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Chapter>
  )
}
