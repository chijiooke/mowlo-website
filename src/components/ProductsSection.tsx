'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type Variants } from 'framer-motion'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { Reveal } from './Reveal'
import { MOWLO_BODY_PATH } from './MowloLogo'
import { useWaitlist } from './WaitlistForm'

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
  { name: 'Stickers',        spec: 'Round · Square · Die-cut',   bg: '#F5A623', face: '#0E0E0F' },
  { name: 'Business Cards',  spec: '85×55mm · Matte or Gloss',   bg: '#1FB89E', face: '#0a5248', deco: antenna },
  { name: 'Flyers',          spec: 'A5 · A4 · DL',               bg: '#E8527A', face: '#6b1530' },
  { name: 'Tee Shirts',      spec: 'S–XXL · DTF print',          bg: '#7C5CBF', face: '#2d1b69', deco: sparkle, light: true },
  { name: 'Thank-You Cards', spec: 'A6 · custom size',           bg: '#2A9FD6', face: '#0b4a6b', deco: heart },
  { name: 'Branded Bags',    spec: 'Paper & shopping',           bg: '#8DB82B', face: '#3d5c0a', soon: true },
]

/** Middle of the deck — the card the fan opens around. */
const MID = (PRODUCTS.length - 1) / 2
/** Widest gap between neighbouring cards, as a share of one card's width. */
const MAX_SPREAD = 62

/** How often the phone-sized deck deals its top card to the back. */
const SHUFFLE_MS = 2600
/** How far a card can be pulled aside before it resists. */
const DRAG_LIMIT = 120

/** `%` keeps the sign in JS, and the cycle counter only ever goes up. */
const modulo = (n: number, m: number) => ((n % m) + m) % m

interface FanPose {
  i: number
  /** Gap between neighbours, % of card width. Shrinks to fit narrow screens. */
  spread: number
  /** Layers below the top of the shuffling deck: 0 is the card on top. */
  depth: number
  /** When set, the hand is simply already open — no travel. */
  reduce: boolean
}

/**
 * Three poses, all measured in percentages of a card so they stay in
 * proportion at every width: a squared deck, the same deck fanned open like a
 * hand of cards, and — where a fan will not fit — a shuffling stack.
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
    scale: 1,
    opacity: 1,
    transition: reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 22, mass: 0.8 },
  }),
}

/**
 * Where a card sits in the shuffling pile. Passed to `animate` as a plain
 * object rather than a variant: a variant label that never changes will not
 * re-fire just because its `custom` did, which left a swiped card stranded
 * until the next render happened to nudge it.
 *
 * Depth is capped rather than faded — cards past the third sit together at the
 * back, hidden by the ones in front, so nothing blinks in or out.
 */
function shufflePose(depth: number, reduce: boolean) {
  const d = Math.min(depth, 3)
  return {
    x: `${(d % 2 ? 1 : -1) * d * 4}%`,
    y: `${d * 6}%`,
    rotate: (d % 2 ? 1 : -1) * d * 7,
    scale: 1 - d * 0.07,
    opacity: 1,
    transition: reduce
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 150, damping: 14, mass: 1 },
  }
}

export function ProductsSection() {
  const fanRef = useRef<HTMLDivElement>(null)
  const [spread, setSpread] = useState(MAX_SPREAD)
  const [cycle, setCycle] = useState(0)
  const [dragging, setDragging] = useState(false)
  const reduce = !!useReducedMotion()
  const openWaitlist = useWaitlist()
  const inView = useInView(fanRef, { once: true, margin: '-120px' })
  // A six-card fan has nowhere to open on a phone, so it shuffles instead.
  const shuffles = useMediaQuery('(max-width: 640px)')

  // Restarts on every swap, so a card you deal by hand gets its full dwell
  // before the timer takes over again. Pauses while a card is in hand.
  useEffect(() => {
    if (!shuffles || reduce || !inView || dragging) return
    const tick = setInterval(() => setCycle(c => c + 1), SHUFFLE_MS)
    return () => clearInterval(tick)
  }, [shuffles, reduce, inView, dragging, cycle])

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
          className={`deck-fan${shuffles ? ' shuffling' : ''}`}
          ref={fanRef}
          initial="stacked"
          animate={inView || reduce ? 'fanned' : 'stacked'}
          variants={{ fanned: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
        >
          {PRODUCTS.map((p, i) => {
            // Subtracting the cycle sends the card you swiped to the back and
            // promotes the one beneath it. Adding it would do the opposite:
            // drop the top card a single layer and pull the bottom one up.
            const depth = shuffles ? modulo(i - cycle, PRODUCTS.length) : 0

            return (
              <DeckCard
                key={p.name}
                product={p}
                i={i}
                spread={spread}
                depth={depth}
                z={shuffles ? PRODUCTS.length - depth : i}
                reduce={reduce}
                shuffling={shuffles}
                canDrag={shuffles && depth === 0 && !reduce}
                onSwap={() => setCycle(c => c + 1)}
                onDragState={setDragging}
                onOpen={() => openWaitlist(`product-${p.name.toLowerCase().replace(/\s+/g, '-')}`)}
              />
            )
          })}
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

interface DeckCardProps {
  product: (typeof PRODUCTS)[number]
  i: number
  spread: number
  depth: number
  z: number
  reduce: boolean
  /** The deck is a pile rather than a fan — phone widths only. */
  shuffling: boolean
  canDrag: boolean
  onSwap: () => void
  onDragState: (dragging: boolean) => void
  onOpen: () => void
}

/**
 * One card, in two layers. The outer layer is driven by the deck's pose
 * variants; the inner one is the card in your hand. They have to be separate
 * elements — sharing one means every re-render re-resolves the variant and
 * yanks the card back out of your grip mid-gesture.
 */
function DeckCard({ product: p, i, spread, depth, z, reduce, shuffling, canDrag, onSwap, onDragState, onOpen }: DeckCardProps) {
  const x = useMotionValue(0)
  // The card leans into the direction you pull it, the way a real one would.
  const tilt = useTransform(x, [-DRAG_LIMIT, 0, DRAG_LIMIT], [-14, 0, 14])
  const dragged = useRef(false)

  return (
    // The slot centres every card on one point. Resting depth is a custom
    // property, not an inline z-index, so the hover rule can still lift a card
    // over its neighbours in the fan.
    <div className="deck-slot" style={{ ['--z' as string]: String(z) }}>
      {/* In the pile the pose is passed straight to `animate`, so every swap
          re-fires it. In the fan it inherits the variant from the deck. */}
      <motion.div
        className="deck-card"
        custom={{ i, spread, depth, reduce }}
        variants={card}
        {...(shuffling ? { animate: shufflePose(depth, reduce) } : {})}
      >
        <motion.div
          className={`deck-drag${canDrag ? ' grabbable' : ''}`}
          style={{ x, rotate: canDrag ? tilt : 0 }}
          // Sideways only, so the page still scrolls under your thumb. Bounded
          // so a thrown card can never push the page wider than the screen.
          drag={canDrag ? 'x' : false}
          dragConstraints={{ left: -DRAG_LIMIT, right: DRAG_LIMIT }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true
            onDragState(true)
          }}
          onDragEnd={(_, info) => {
            onDragState(false)
            // Hand the card back to centre explicitly rather than leaving it
            // to dragSnapToOrigin, which left it sitting where it was dropped.
            animate(x, 0, { type: 'spring', stiffness: 320, damping: 30 })
            // Moved out of the way, or flicked — it goes to the back.
            if (Math.abs(info.offset.x) > 62 || Math.abs(info.velocity.x) > 350) onSwap()
          }}
          whileDrag={{ scale: 1.05, zIndex: 40 }}
        >
          <button
            type="button"
            className="prod-card"
            onClick={() => {
              // Swallow the click that trails a drag.
              if (dragged.current) {
                dragged.current = false
                return
              }
              onOpen()
            }}
            style={{
              ['--bg' as string]: p.bg,
              ...(p.light ? { ['--fg' as string]: 'rgba(255,255,255,0.92)' } : {}),
            }}
          >
            <div>
              <div className="card-name">{p.name}</div>
              <div className="card-spec">{p.spec}</div>
              {/* Status, not price — the only badge left on a card. */}
              {p.soon && <div className="card-p cs">Coming soon</div>}
            </div>
            <Blob face={p.face} deco={p.deco} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
