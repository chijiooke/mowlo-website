/**
 * The product parade's timeline, as progress through its pinned track. The 3D
 * scene and the DOM both read from here, so they can't drift apart.
 *
 * Three products take the stage one at a time, then the finale says there is
 * much more. Kept to three on purpose: six read
 * as a catalogue, and the full list lives in the Products section right after.
 */
export type Range = [number, number]

export interface Piece {
  id: 'card' | 'stickers' | 'tee'
  name: string
  /** Pill label. */
  short: string
  /** One line on what it is. Never a price. */
  spec: string
  soon?: boolean
  dot: string
}

export const PIECES: Piece[] = [
  { id: 'card', name: 'Business cards', short: 'Cards', spec: '85×55mm — matte, gloss, soft-touch or holographic.', dot: 'bg-amber' },
  { id: 'stickers', name: 'Stickers', short: 'Stickers', spec: 'Round, square, or die-cut to any shape you draw.', dot: 'bg-teal' },
  { id: 'tee', name: 'Tee shirts', short: 'Tees', spec: 'S–XXL, DTF print.', dot: 'bg-lime' },
]

/**
 * Windows must stay inside [0.02, 0.98]. Scroll progress is hardware
 * accelerated: framer-motion hands a useTransform input range straight to the
 * Web Animations API as keyframe offsets, and an offset outside 0–1 throws
 * ("Offsets must be monotonically non-decreasing").
 */
const START = 0.03
const STEP = 0.24
const LENGTH = 0.29

export const pieceWindow = (i: number): Range => [START + i * STEP, START + i * STEP + LENGTH]

if (process.env.NODE_ENV !== 'production') {
  PIECES.forEach((_, i) => {
    const [start, end] = pieceWindow(i)
    if (start < 0.02 || end > 0.98) {
      throw new Error(`Parade beat ${i} runs outside 0.02–0.98 (${start.toFixed(3)}–${end.toFixed(3)}); see the note on START.`)
    }
  })
}

/** Phases inside a piece's own window, 0 → 1. */
export const PHASE: Record<'arrive' | 'print' | 'flourish' | 'leave', Range> = {
  arrive: [0, 0.3],
  print: [0.24, 0.5],
  flourish: [0.5, 0.72],
  leave: [0.72, 1],
}

/**
 * Starts clear of the last piece's window (which ends at 0.80), so nothing is
 * still flying when the closing line fades in.
 */
export const FINALE: Range = [0.84, 0.94]

/** Progress the parade holds at when motion is reduced: the closing line. */
export const PARADE_STILL = 0.99
