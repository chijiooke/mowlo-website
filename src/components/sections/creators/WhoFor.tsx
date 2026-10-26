'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, useInView } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/type/Type'
import { APPLY_URL } from '@/lib/links'
import { useReduce } from '@/lib/motion'

interface WayCard {
  id: string
  name: string
  body: string
  icon: string
  tint: string
  href: string
  /** Leaves the site for the web app, so it skips next/link. */
  external?: boolean
  photo: string
  alt: string
  /** How the photo is cropped, so the subject survives the card's box. */
  focus: string
}

/** The three sides of Mowlo. Creators leads; the other two are a click away. */
const WAYS: WayCard[] = [
  {
    id: 'creators',
    name: 'Creators',
    body: 'Drop merch to your people in windows — no stock, no money down. Your clout, your cut.',
    icon: 'lucide:sparkles',
    tint: 'bg-pink text-ink',
    href: APPLY_URL,
    external: true,
    photo: '/assets/creators-heart-hands.jpg',
    alt: 'A young woman in headphones making a heart with her hands against a bright yellow wall',
    focus: 'object-[50%_38%]',
  },
  {
    id: 'artists',
    name: 'Artists',
    body: 'Sell your art as prints and stickers in Artist’s Corner. Upload once — we print, deliver and pay you.',
    icon: 'lucide:palette',
    tint: 'bg-purple text-white',
    href: '/gallery',
    photo: '/assets/man-working-animation-studio.jpg',
    alt: 'An artist drawing on a pen tablet at his desk',
    focus: 'object-[55%_55%]',
  },
  {
    id: 'business',
    name: 'Businesses',
    body: 'Cards, flyers, stickers and bags for your shop or start-up, printed together so they finally match.',
    icon: 'lucide:store',
    tint: 'bg-teal text-ink',
    href: '/print',
    photo: '/assets/who-small-business.jpg',
    alt: 'A shop owner showing clothes to a customer in a small boutique',
    focus: 'object-[50%_45%]',
  },
]

/**
 * Chapter — who Mowlo is for, and the way into the rest of the site. Each card
 * has the name at the top, a photo filling the rest and running to the card's
 * edges, and the pitch in an inset panel over the photo's foot. Cards rise in
 * one after another; each photo settles from a slight zoom as its card lands.
 */
export function WhoFor() {
  return (
    <Chapter ground="cream" pattern="grain" id="who" className="py-section">
      <Container>
        <header className="mb-12 md:mb-16">
          <Reveal>
            <Eyebrow className="mb-5 text-ink/55">Who it’s for</Eyebrow>
            <h2 className="text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
              <span className="block">One account.</span> <span className="block text-muted-on-light">Three ways in.</span>
            </h2>
          </Reveal>
        </header>

        <ul className="grid gap-6 md:grid-cols-3 md:gap-7">
          {WAYS.map((way, i) => (
            <WayTile key={way.id} way={way} index={i} />
          ))}
        </ul>
      </Container>
    </Chapter>
  )
}

function WayTile({ way, index }: { way: WayCard; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useReduce()
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const delay = index * 0.14

  const body = (
    <>
      <span className="relative z-10 flex items-center gap-2 p-7 text-[1.6rem] leading-none font-semibold tracking-[-0.02em] text-ink">
        {way.name}
        <Icon
          icon="lucide:arrow-right"
          width={24}
          aria-hidden="true"
          className="transition-transform duration-150 ease-out-expo group-hover:translate-x-1"
        />
      </span>

      <span className="absolute inset-x-0 top-[5.25rem] bottom-0 overflow-hidden rounded-t-[1.5rem]">
        <motion.span
          className="absolute inset-0 block"
          initial={reduce ? false : { scale: 1.12 }}
          animate={inView || reduce ? { scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: delay + 0.1 }}
        >
          <Image
            src={way.photo}
            alt={way.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1320px) 33vw, 420px"
            className={clsx('object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]', way.focus)}
          />
        </motion.span>
      </span>

      <span className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-3.5 rounded-[1.5rem] bg-white p-4 shadow-[0_8px_24px_rgba(10,10,11,0.12)] md:inset-x-4 md:bottom-4">
        <span className={clsx('flex size-10 shrink-0 items-center justify-center rounded-full', way.tint)}>
          <Icon icon={way.icon} width={18} aria-hidden="true" />
        </span>
        <span className="text-[14px] leading-snug text-muted-on-light">{way.body}</span>
      </span>
    </>
  )
  const tile = 'group relative block aspect-[3/4] overflow-hidden rounded-[2rem] bg-white'

  return (
    <motion.li
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {way.external ? (
        <a href={way.href} className={tile}>
          {body}
        </a>
      ) : (
        <Link href={way.href} className={tile}>
          {body}
        </Link>
      )}
    </motion.li>
  )
}
