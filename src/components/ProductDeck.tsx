'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { EXIT, RECENTRE, SETTLE, t, useReduce } from '@/lib/motion'
import { ProductCard } from './ProductCard'
import type { Product } from './products'

/** How long a card sits on top before the deck deals it away on its own. */
const DEAL_MS = 4200
/** Share of the deck's width a card must travel to commit. */
const COMMIT_FRACTION = 0.22
/** Release speed that commits on its own, however far the card got (px/s). */
const FLICK_V = 500
/** Layers deeper than this share the back pose, so nothing has to fade. */
const MAX_DEPTH = 3
/** Vertical step between layers. Mirrors --step in the stylesheet. */
const STEP = 18

/**
 * The phone deck: a pile you swipe through, one card at a time.
 *
 * Deliberately separate from the desktop fan. The fan drives its cards with
 * inherited variants, and a variant label that never changes will not re-fire
 * for a card whose position did — which is what left swiped cards hanging.
 * Nothing here uses variants: every pose is a plain object, so a new position
 * is always a new animation.
 */
export function ProductDeck({
  products,
  onOpen,
}: {
  products: Product[]
  onOpen: (product: Product) => void
}) {
  // order[0] is the card on top. Dealing rotates the array — no modular
  // arithmetic, and the card you swiped is provably at the back.
  const [order, setOrder] = useState(() => products.map((_, i) => i))
  const [held, setHeld] = useState(false)
  const [width, setWidth] = useState(300)
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReduce()
  const inView = useInView(ref, { margin: '-80px' })

  const deal = useCallback(() => setOrder(o => [...o.slice(1), o[0]]), [])
  const undeal = useCallback(() => setOrder(o => [o[o.length - 1], ...o.slice(0, -1)]), [])

  // Commit distance and tilt are relative to the card, so the same gesture
  // means the same thing on every phone.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.offsetWidth || 300)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Restarts on every deal, so a card you swipe by hand gets a full turn on
  // top. Pauses while a card is under a finger, and while off screen.
  useEffect(() => {
    if (!inView || reduce || held) return
    const tick = setInterval(deal, DEAL_MS)
    return () => clearInterval(tick)
  }, [inView, reduce, held, deal, order])

  return (
    <div className="pdeck" ref={ref}>
      {products.map((p, i) => (
        <DeckCard
          key={p.name}
          product={p}
          depth={order.indexOf(i)}
          count={products.length}
          width={width}
          reduce={reduce}
          onDeal={deal}
          onHold={setHeld}
          onOpen={() => onOpen(p)}
        />
      ))}

      {/* The deck is a gesture; these are the same thing for anyone who cannot
          make one. Reachable by keyboard and screen reader, invisible to mice. */}
      <div className="pdeck-nav">
        <button type="button" className="sr-only" onClick={undeal}>
          Previous product
        </button>
        <button type="button" className="sr-only" onClick={deal}>
          Next product
        </button>
      </div>
    </div>
  )
}

interface DeckCardProps {
  product: Product
  /** 0 is the card on top of the pile. */
  depth: number
  count: number
  width: number
  reduce: boolean
  onDeal: () => void
  onHold: (held: boolean) => void
  onOpen: () => void
}

function DeckCard({ product: p, depth, count, width, reduce, onDeal, onHold, onOpen }: DeckCardProps) {
  const x = useMotionValue(0)
  // The card leans into the direction you pull it, the way a real one would.
  const tilt = useTransform(x, [-width, 0, width], [-12, 0, 12])
  /** Direction a committed card is flying, or 0 when the card is at rest. */
  const [exiting, setExiting] = useState(0)
  /** The pointer that owns this gesture — a second finger elsewhere is not it. */
  const pointer = useRef<number | null>(null)
  /** Set once the card actually moves, so a committed swipe cannot land as a tap. */
  const moved = useRef(false)

  const d = Math.min(depth, MAX_DEPTH)
  const onTop = depth === 0

  /**
   * Ends the gesture, however it ended: Framer's own callback, a pointerup,
   * or the browser cancelling the touch. Idempotent — whichever arrives first
   * resolves the card and the rest are no-ops.
   */
  const settle = useCallback(() => {
    if (pointer.current === null) return
    pointer.current = null
    onHold(false)

    const px = x.get()
    // Read velocity from the value, not from Framer's callback argument: the
    // window listener below can resolve the gesture before onDragEnd runs, and
    // both paths have to reach the same answer.
    const v = x.getVelocity()
    const far = Math.abs(px) > width * COMMIT_FRACTION
    const flicked = Math.abs(v) > FLICK_V && Math.sign(v) === (Math.sign(px) || Math.sign(v))

    if (!far && !flicked) {
      animate(x, 0, RECENTRE)
      return
    }

    // Deal immediately so the pile rises as this card leaves, and carry the
    // release velocity into the flight so a hard flick leaves hard.
    const dir = Math.sign(px) || Math.sign(v)
    setExiting(dir)
    onDeal()
    animate(x, dir * width * 1.4, {
      ...EXIT,
      velocity: v,
      onComplete: () => {
        x.jump(0)
        setExiting(0)
      },
    })
  }, [onDeal, onHold, width, x])

  // Drag your finger to the edge of the screen and iOS claims the gesture for
  // its own back-swipe; the cancel does not reliably reach the element. These
  // listeners catch every way a touch can end, at the window, where none of
  // them can be missed.
  useEffect(() => {
    if (!onTop) return
    const end = (e: PointerEvent) => {
      if (pointer.current !== null && e.pointerId !== pointer.current) return
      settle()
    }
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [onTop, settle])

  return (
    <motion.div
      className="pdeck-card"
      // A card in flight is pinned above the pile; at rest it takes its layer.
      style={{ zIndex: exiting ? count + 1 : count - depth }}
      // Everything behind the top card is scenery: not focusable, not
      // hit-testable, absent from the accessibility tree.
      inert={!onTop}
      animate={
        exiting
          ? { y: 0, scale: 1, rotate: 0 }
          : { y: d * STEP, scale: 1 - d * 0.07, rotate: (d % 2 ? 1 : -1) * d * 3.5 }
      }
      transition={t(reduce, SETTLE)}
    >
      <motion.div
        className={`pdeck-hand${onTop ? ' grabbable' : ''}`}
        style={{ x, rotate: tilt }}
        // drag={true} with y pinned, not drag="x": Framer writes touch-action
        // inline from this prop, and "x" makes it pan-y — which lets iOS
        // reclaim the gesture mid-swipe. `true` makes it none.
        drag={onTop}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0, left: 1, right: 1 }}
        dragMomentum={false}
        onPointerDown={e => {
          // Bookkeeping starts on contact, not on Framer's 3px drag threshold:
          // press and hold has to stop the deck too, or it deals out from
          // under the finger.
          pointer.current = e.pointerId
          moved.current = false
          onHold(true)
        }}
        onDragStart={() => {
          moved.current = true
        }}
        onDragEnd={() => settle()}
        whileDrag={{ scale: 1.02 }}
        transition={{ scale: { duration: 0.18, ease: 'easeOut' } }}
      >
        <ProductCard
          product={p}
          onOpen={() => {
            // A committed swipe ends off the button, so the tap that follows a
            // drag is swallowed here rather than left to leak into the next one.
            if (moved.current) return
            onOpen()
          }}
        />
      </motion.div>
    </motion.div>
  )
}
