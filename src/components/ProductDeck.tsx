'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import type { Product } from './products'

/** How long a card sits on top before the deck deals it away on its own. */
const DEAL_MS = 2800
/** How far a card can be pulled aside before it resists. */
const DRAG_LIMIT = 120
/** Past this, letting go sends the card to the back. */
const DEAL_THRESHOLD = 62
/** Layers deeper than this share the back pose, so nothing has to fade. */
const MAX_DEPTH = 3

/**
 * The phone deck: a pile you can swipe through, one card at a time.
 *
 * Deliberately separate from the desktop fan. The fan drives its cards with
 * inherited variants, and a variant label that never changes will not re-fire
 * for a card whose position did — which is what left swiped cards hanging
 * mid-air. Nothing here uses variants: every pose is a plain object, so a new
 * position is always a new animation.
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
  const ref = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const inView = useInView(ref, { margin: '-80px' })

  const deal = useCallback(() => setOrder(o => [...o.slice(1), o[0]]), [])

  // Restarts on every deal, so a card you swipe by hand gets a full turn on
  // top. Pauses while a card is in your hand, and while the deck is off screen.
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
          reduce={reduce}
          onDeal={deal}
          onHold={setHeld}
          onOpen={() => onOpen(p)}
        />
      ))}
    </div>
  )
}

interface DeckCardProps {
  product: Product
  /** 0 is the card on top of the pile. */
  depth: number
  count: number
  reduce: boolean
  onDeal: () => void
  onHold: (held: boolean) => void
  onOpen: () => void
}

function DeckCard({ product: p, depth, count, reduce, onDeal, onHold, onOpen }: DeckCardProps) {
  const x = useMotionValue(0)
  // The card leans into the direction you pull it, the way a real one would.
  const tilt = useTransform(x, [-DRAG_LIMIT, 0, DRAG_LIMIT], [-15, 0, 15])
  // A drag ends in a click too — this swallows it so swiping a card away does
  // not also open the waitlist.
  const dragged = useRef(false)

  const d = Math.min(depth, MAX_DEPTH)
  const onTop = depth === 0
  const canDrag = onTop && !reduce

  // Belt and braces: whenever a card stops being the one in hand, put it back
  // on centre. A gesture cut short by the browser never reaches onDragEnd, and
  // without this the card would sit wherever the finger left it.
  useEffect(() => {
    if (!canDrag && x.get() !== 0) animate(x, 0, { type: 'spring', stiffness: 340, damping: 32 })
  }, [canDrag, x])

  return (
    <motion.div
      className="pdeck-card"
      style={{ zIndex: count - depth }}
      animate={{
        y: d * 18,
        scale: 1 - d * 0.07,
        rotate: (d % 2 ? 1 : -1) * d * 3.5,
      }}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 190, damping: 21, mass: 0.9 }}
    >
      <motion.div
        className={`pdeck-hand${canDrag ? ' grabbable' : ''}`}
        style={{ x, rotate: canDrag ? tilt : 0 }}
        // Sideways only, so the page still scrolls under your thumb. Bounded,
        // so a card can never push the page wider than the screen.
        drag={canDrag ? 'x' : false}
        dragConstraints={{ left: -DRAG_LIMIT, right: DRAG_LIMIT }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => {
          dragged.current = true
          onHold(true)
        }}
        onDragEnd={(_, info) => {
          onHold(false)
          // Hand the card back to centre explicitly — leaving it to the drag
          // helper left it sitting wherever it was dropped.
          animate(x, 0, { type: 'spring', stiffness: 340, damping: 32 })
          if (Math.abs(info.offset.x) > DEAL_THRESHOLD || Math.abs(info.velocity.x) > 350) onDeal()
        }}
        // Fires when the browser takes the gesture away mid-drag. Framer does
        // not always reach onDragEnd in that case, so decide the deal here too.
        onPointerCancel={() => {
          onHold(false)
          if (Math.abs(x.get()) > DEAL_THRESHOLD) onDeal()
          animate(x, 0, { type: 'spring', stiffness: 340, damping: 32 })
        }}
        whileDrag={{ scale: 1.04 }}
      >
        <button
          type="button"
          className="prod-card"
          // Only the card on top is reachable; the pile behind it is scenery.
          tabIndex={onTop ? 0 : -1}
          aria-hidden={!onTop}
          onClick={() => {
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
            {p.soon && <div className="card-p cs">Coming soon</div>}
          </div>
          <p.Blob />
        </button>
      </motion.div>
    </motion.div>
  )
}
