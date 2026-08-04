'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { Reveal } from './Reveal'
import { MOWLO_BODY_PATH } from './MowloLogo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'

/**
 * The mascot, silhouetted into a product card. Six hand-drawn variants used to
 * live here — they are one component now, driven by the card's face colour,
 * and they reuse the real logo silhouette so the mark never drifts.
 */
function Blob({ face, deco }: { face: string; deco?: React.ReactNode }) {
  return (
    <svg className="card-blob-c" viewBox="0 0 80 80" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d={MOWLO_BODY_PATH} fill="rgba(0,0,0,0.2)" />
      {deco}
      <circle cx="25.92" cy="35.86" r="11.63" fill="#FFFFFF" opacity="0.95" />
      <circle cx="52.07" cy="35.86" r="11.63" fill="#FFFFFF" opacity="0.95" />
      <circle cx="26.09" cy="36.05" r="6.18" fill={face} />
      <circle cx="52.13" cy="36.05" r="6.18" fill={face} />
      <circle cx="28.74" cy="33.30" r="1.39" fill="#FFFFFF" />
      <circle cx="54.78" cy="33.30" r="1.39" fill="#FFFFFF" />
      <path d="M26.48 54.58Q38.61 65.26 50.74 54.58" stroke={face} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

const sparkle = (
  <>
    <path d="M18 12L14 3L26 7" stroke="rgba(255,255,255,0.6)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M62 10L70 1L59 6" stroke="rgba(255,255,255,0.6)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
)
const antenna = <path d="M63 12C71 3 82 4 80 13" stroke="rgba(255,255,255,0.5)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
const heart = <path d="M36 26C32 21 25 23 25 29C25 34 31 38 36 43C41 38 47 34 47 29C47 23 40 21 36 26Z" fill="rgba(255,255,255,0.35)" />

const PRODUCTS = [
  { name: 'Stickers',        spec: 'Round · Square · Die-cut',   price: 'From ₦8,500',  bg: '#F5A623', face: '#0E0E0F' },
  { name: 'Business Cards',  spec: '85×55mm · Matte or Gloss',   price: 'From ₦12,800', bg: '#1FB89E', face: '#0a5248', deco: antenna },
  { name: 'Flyers',          spec: 'A5 · A4 · DL',               price: 'From ₦6,000',  bg: '#E8527A', face: '#6b1530' },
  { name: 'Tee Shirts',      spec: 'S–XXL · DTF print',          price: 'From ₦14,500', bg: '#7C5CBF', face: '#2d1b69', deco: sparkle, light: true },
  { name: 'Thank-You Cards', spec: 'A6 · custom size',           price: 'From ₦5,000',  bg: '#2A9FD6', face: '#0b4a6b', deco: heart },
  { name: 'Branded Bags',    spec: 'Paper & shopping',           price: 'Coming soon',  bg: '#8DB82B', face: '#3d5c0a', soon: true },
]

/** Middle of the deck — the card the fan opens around. */
const MID = (PRODUCTS.length - 1) / 2
/** Widest gap between neighbouring cards, as a share of one card's width. */
const MAX_SPREAD = 62

interface FanPose {
  i: number
  /** Gap between neighbours, % of card width. Shrinks to fit narrow screens. */
  spread: number
  /** When set, the hand is simply already open — no travel. */
  reduce: boolean
}

/**
 * Two poses, both measured in percentages of a card so the fan stays in
 * proportion at every width: a squared deck, and the same deck fanned open
 * like a hand of cards. Both sit behind the headline.
 */
const card: Variants = {
  stacked: ({ i }: FanPose) => ({
    x: '0%',
    y: '0%',
    rotate: (i - MID) * 1.8,
  }),
  fanned: ({ i, spread, reduce }: FanPose) => ({
    x: `${(i - MID) * spread}%`,
    // Squared term lifts the middle of the hand and drops the outer cards.
    y: `${(i - MID) ** 2 * spread * 0.045}%`,
    rotate: (i - MID) * spread * 0.16,
    transition: reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 22, mass: 0.8 },
  }),
}

export function ProductsSection() {
  const fanRef = useRef<HTMLDivElement>(null)
  const [spread, setSpread] = useState(MAX_SPREAD)
  const reduce = !!useReducedMotion()
  const inView = useInView(fanRef, { once: true, margin: '-120px' })

  // Open the hand only as wide as the section allows, so the outer cards never
  // run off a phone screen. Re-fits whenever the stage resizes.
  useLayoutEffect(() => {
    const fan = fanRef.current
    const slot = fan?.firstElementChild as HTMLElement | null
    if (!fan || !slot) return

    const fit = () => {
      const slotWidth = slot.offsetWidth
      if (!slotWidth) return
      // The 0.92 leaves room for the tilt of the outermost cards.
      const roomPerStep = (fan.offsetWidth * 0.92 - slotWidth) / 2 / MID
      setSpread(Math.max(16, Math.min(MAX_SPREAD, (roomPerStep / slotWidth) * 100)))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(fan)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="products" className="section deck-stage">
      <Reveal className="deck-head">
        <span className="sec-label">Products</span>
      </Reveal>

      <div className="deck-wrap">
        <motion.div
          className="deck-fan"
          ref={fanRef}
          initial="stacked"
          animate={inView || reduce ? 'fanned' : 'stacked'}
          variants={{ fanned: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
        >
          {PRODUCTS.map((p, i) => (
            // The slot centres every card on one point; the motion layer
            // inside it owns the deck-to-fan transform.
            // Resting depth is a custom property, not an inline z-index, so
            // the hover rule can lift the card over its neighbours.
            <div key={p.name} className="deck-slot" style={{ ['--z' as string]: String(i) }}>
              <motion.div className="deck-card" custom={{ i, spread, reduce }} variants={card}>
                <a
                  href={p.soon ? '/partners' : `${APP_URL}/auth/register`}
                  className="prod-card"
                  style={{
                    ['--bg' as string]: p.bg,
                    ...(p.light ? { ['--fg' as string]: 'rgba(255,255,255,0.92)' } : {}),
                  }}
                >
                  <div>
                    <div className="card-name">{p.name}</div>
                    <div className="card-spec">{p.spec}</div>
                    <div className={`card-p${p.soon ? ' cs' : ''}`}>{p.price}</div>
                  </div>
                  <Blob face={p.face} deco={p.deco} />
                </a>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      <Reveal delay={0.05} className="deck-head">
        <h2 className="sec-title sec-title-xl">
          Show up
          <br />
          properly.
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="deck-head">
        <p className="sec-sub">
          Designed, printed and delivered — for every hustle in Nigeria{' '}
          <Icon icon="circle-flags:ng" className="sub-flag" aria-hidden="true" /> and Ghana{' '}
          <Icon icon="circle-flags:gh" className="sub-flag" aria-hidden="true" />.
        </p>
      </Reveal>
    </section>
  )
}
