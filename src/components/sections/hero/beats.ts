/**
 * The hero's scroll timeline, as progress through its pinned track. The 3D
 * scene and the DOM both read from here, so they can't drift apart.
 *
 * Six products take the stage one at a time, each in its own brand colour,
 * then all of them come back together for the finale.
 */
export type Range = [number, number]
export type PatternId = 'halftone' | 'diecut' | 'stripes' | 'cropmarks'

export interface Piece {
  id: 'card' | 'stickers' | 'flyer' | 'bag' | 'mug' | 'tee'
  /** The mega word behind the piece. */
  word: string
  name: string
  /** Rail and pill label. */
  short: string
  /** One line on what it is. Never a price. */
  spec: string
  soon?: boolean
  dot: string
  pill: string
  /** Glow behind the piece and tint of its mega word. */
  glow: string
  tint: string
  pattern: PatternId
}

export const PIECES: Piece[] = [
  { id: 'card', word: 'CARDS.', name: 'Business cards', short: 'Cards', spec: '85×55mm — matte, gloss, soft-touch or holographic.', dot: 'bg-amber', pill: 'bg-amber text-ink', glow: 'rgba(245, 166, 35, 0.28)', tint: 'rgba(245, 166, 35, 0.16)', pattern: 'halftone' },
  { id: 'stickers', word: 'STICKERS.', name: 'Stickers', short: 'Stickers', spec: 'Round, square, or die-cut to any shape you draw.', dot: 'bg-teal', pill: 'bg-teal text-ink', glow: 'rgba(31, 184, 158, 0.26)', tint: 'rgba(31, 184, 158, 0.16)', pattern: 'diecut' },
  { id: 'flyer', word: 'FLYERS.', name: 'Flyers', short: 'Flyers', spec: 'A5, A4 or DL — for the shop window and the WhatsApp status.', dot: 'bg-pink', pill: 'bg-pink text-ink', glow: 'rgba(232, 82, 122, 0.26)', tint: 'rgba(232, 82, 122, 0.16)', pattern: 'stripes' },
  { id: 'bag', word: 'BAGS.', name: 'Paper bags', short: 'Bags', spec: 'Your mark on every carry-out.', soon: true, dot: 'bg-purple', pill: 'bg-purple text-white', glow: 'rgba(124, 92, 191, 0.32)', tint: 'rgba(124, 92, 191, 0.2)', pattern: 'cropmarks' },
  { id: 'mug', word: 'MUGS.', name: 'Mugs', short: 'Mugs', spec: 'Full-wrap print on glossy ceramic.', soon: true, dot: 'bg-sky', pill: 'bg-sky text-ink', glow: 'rgba(42, 159, 214, 0.26)', tint: 'rgba(42, 159, 214, 0.16)', pattern: 'halftone' },
  { id: 'tee', word: 'TEES.', name: 'Tee shirts', short: 'Tees', spec: 'S–XXL, DTF print.', dot: 'bg-lime', pill: 'bg-lime text-ink', glow: 'rgba(141, 184, 43, 0.26)', tint: 'rgba(141, 184, 43, 0.16)', pattern: 'stripes' },
]

/**
 * Windows must stay inside [0.02, 0.98]. Scroll progress is hardware
 * accelerated: framer-motion hands a useTransform input range straight to the
 * Web Animations API as keyframe offsets, and an offset outside 0–1 throws
 * ("Offsets must be monotonically non-decreasing"). The rail pads each window
 * by 0.02 either side, hence the margin.
 */
const START = 0.02
const STEP = 0.14
const LENGTH = 0.18

export const pieceWindow = (i: number): Range => [START + i * STEP, START + i * STEP + LENGTH]

if (process.env.NODE_ENV !== 'production') {
  PIECES.forEach((_, i) => {
    const [start, end] = pieceWindow(i)
    if (start < 0.02 || end > 0.98) {
      throw new Error(`Hero beat ${i} runs outside 0.02–0.98 (${start.toFixed(3)}–${end.toFixed(3)}); see the note on START.`)
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

export const INTRO_OUT: Range = [0.04, 0.09]
export const FINALE: Range = [0.84, 0.95]

/** Progress the page holds at when motion is reduced: the finished line-up. */
export const HERO_STILL = 0.99
