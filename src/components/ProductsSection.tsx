'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { motion, useInView, type Variants } from 'framer-motion'
import { SETTLE, t, useReduce } from '@/lib/motion'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { Reveal } from './Reveal'
import { ProductCard } from './ProductCard'
import { ProductDeck } from './ProductDeck'
import { PRODUCTS, productSource, type Product } from './products'
import { useWaitlist } from './WaitlistForm'

/** Middle of the deck — the card the fan opens around. */
const MID = (PRODUCTS.length - 1) / 2
/** Widest gap between neighbouring cards, as a share of one card's width. */
const MAX_SPREAD = 62
/** Tilt on each card while the deck is still squared up, in degrees per step. */
const STACK_TILT = 1.8
/** How far the arc lifts its middle, as a share of the spread. */
const ARC_LIFT = 0.045
/** Tilt across the open hand, in degrees per unit of spread. */
const FAN_TILT = 0.16
/** Share of the section the hand may fill — the rest is room for the tilt. */
const FIT_MARGIN = 0.92

interface FanPose {
  i: number
  /** Gap between neighbours, % of card width. Shrinks to fit narrow screens. */
  spread: number
  /** When set, the hand is simply already open — no travel. */
  reduce: boolean
}

/**
 * The desktop fan: a squared deck that opens into a hand of cards. Both poses
 * are in percentages of a card, so the hand stays in proportion at every width.
 */
const card: Variants = {
  stacked: ({ i }: FanPose) => ({
    x: '0%',
    y: '0%',
    rotate: (i - MID) * STACK_TILT,
  }),
  fanned: ({ i, spread, reduce }: FanPose) => ({
    x: `${(i - MID) * spread}%`,
    // Squared term lifts the middle of the hand and drops the outer cards.
    y: `${(i - MID) ** 2 * spread * ARC_LIFT}%`,
    rotate: (i - MID) * spread * FAN_TILT,
    transition: t(reduce, SETTLE),
  }),
}

export function ProductsSection() {
  const openWaitlist = useWaitlist()
  // A six-card fan has nowhere to open on a phone, so the phone gets a deck
  // instead — a different component, not the same one in a different pose.
  const isPhone = useMediaQuery('(max-width: 640px)')
  const open = (p: Product) => openWaitlist(productSource(p))

  return (
    <section id="products" className="section deck-stage">
      <Reveal className="deck-head">
        <span className="sec-label">Products</span>
      </Reveal>

      {isPhone ? <ProductDeck products={PRODUCTS} onOpen={open} /> : <ProductFan onOpen={open} />}

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

function ProductFan({ onOpen }: { onOpen: (product: Product) => void }) {
  const fanRef = useRef<HTMLDivElement>(null)
  const [spread, setSpread] = useState(MAX_SPREAD)
  const reduce = useReduce()
  const inView = useInView(fanRef, { once: true, margin: '-120px' })

  // Open the hand only as wide as the section allows. Re-fits on resize.
  useLayoutEffect(() => {
    const fan = fanRef.current
    const slot = fan?.firstElementChild as HTMLElement | null
    if (!fan || !slot) return

    const fit = () => {
      const slotWidth = slot.offsetWidth
      if (!slotWidth) return
      const roomPerStep = (fan.offsetWidth * FIT_MARGIN - slotWidth) / 2 / MID
      setSpread(Math.max(16, Math.min(MAX_SPREAD, (roomPerStep / slotWidth) * 100)))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(fan)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="deck-wrap">
      <motion.div
        className="deck-fan"
        ref={fanRef}
        initial="stacked"
        animate={inView || reduce ? 'fanned' : 'stacked'}
        variants={{ fanned: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
      >
        {PRODUCTS.map((p, i) => (
          // The slot centres every card on one point; the motion layer inside
          // owns the deck-to-fan transform. Resting depth is a custom property
          // rather than an inline z-index, so the hover rule can still lift a
          // card over its neighbours.
          <div key={p.name} className="deck-slot" style={{ ['--z' as string]: String(i) }}>
            <motion.div className="deck-card" custom={{ i, spread, reduce }} variants={card}>
              <ProductCard product={p} onOpen={() => onOpen(p)} />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
