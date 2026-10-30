/**
 * The landing's own timeline, 0 → 1 through its pinned track. The word, the
 * copy and the fly-past all read from here, so they cannot drift apart.
 *
 * Ranges stay inside 0–1 and never decrease: framer-motion hands a useTransform
 * input range straight to the Web Animations API as keyframe offsets.
 */
export type Range = [number, number]

/** The brand name fills with amber as you scroll. */
export const FILL: Range = [0.06, 0.42]
/**
 * Word and copy clear before the product parade below takes over. The copy
 * outlasts the word, holding until the very end of the pin.
 */
export const WORD_OUT: Range = [0.78, 0.94]
export const COPY_OUT: Range = [0.9, 0.99]
/**
 * Merch only: the copy stays off the first screen and rises in once you
 * scroll, a part at a time — headline, then lede, then the buttons — each
 * slice overlapping the next.
 */
export const COPY_IN: Range[] = [
  [0.08, 0.15],
  [0.13, 0.2],
  [0.18, 0.25],
]
export const CUE_OUT: Range = [0.16, 0.34]

/** Where the landing holds when motion is reduced: filled, lit, copy in place. */
export const LANDING_STILL = 0.55


export interface Flight {
  id: string
  sticker: boolean
  /** Landing progress at which it enters, and at which it has left. */
  from: number
  to: number
  /** Which way it crosses: 1 left to right, −1 right to left. */
  dir: 1 | -1
  /** Height entering and leaving, and how near the camera it passes. */
  lane: [number, number]
  depth: [number, number]
  scale: number
  spin: number
  /** Stickers only: radians the leading edge curls up. */
  fold?: number
}

/** Which pieces a landing runs: printed paper for Print, merch for Creators. */
export type LandingVariant = 'print' | 'merch'

/**
 * Print: one flyer and a pair of round stickers, each crossing once, slowly,
 * over the whole landing. The stickers travel together — near lanes,
 * overlapping timing — the leading one big with a curled edge, the one behind
 * it small and flat.
 */
export const FLIGHTS: Flight[] = [
  { id: 'flyer', sticker: false, from: 0.04, to: 0.82, dir: 1, lane: [-1.5, 1.2], depth: [-3, 1.4], scale: 0.95, spin: 2.4 },
  { id: 'sticker-a', sticker: true, from: 0.16, to: 0.9, dir: -1, lane: [1.25, -0.3], depth: [-1.6, 1.1], scale: 1.15, spin: 3, fold: 1.8 },
  { id: 'sticker-b', sticker: true, from: 0.2, to: 0.94, dir: -1, lane: [1.7, 0.4], depth: [-1.9, 0.8], scale: 0.7, spin: -2.6 },
]

/** A piece's turn: arriving, holding the stage, leaving. Each range is landing progress. */
export interface Turn {
  in: Range
  hold: Range
  out: Range
}

/**
 * Merch: a choreographed sequence, one piece on stage at a time, each with its
 * own entrance — the tee eases into frame and fades away, the cap spins in
 * from the left and spins off, the water bottle rises from the bottom, turning
 * as it holds, and sinks back,
 * and then the stickers: three slap onto the word in quick succession, sit
 * there while it fills, and peel off and flutter away as the word clears.
 *
 * Each piece starts as the one before begins to leave, so the stage is never
 * empty and never crowded. The stickers' peel runs with WORD_OUT.
 */
export const MERCH_TURNS: Record<'tee' | 'cap' | 'bottle', Turn> = {
  tee: { in: [0.02, 0.1], hold: [0.1, 0.22], out: [0.22, 0.3] },
  cap: { in: [0.26, 0.36], hold: [0.36, 0.43], out: [0.43, 0.52] },
  bottle: { in: [0.48, 0.57], hold: [0.57, 0.63], out: [0.63, 0.72] },
}

export const STICKER_SLAPS = {
  /** When each of the three lands. */
  at: [0.68, 0.72, 0.76],
  /** How long one slap takes, from the camera to stuck. */
  length: 0.035,
  /** All three peel off and flutter away together, with the word going. */
  peel: [0.82, 0.94] as Range,
}

if (process.env.NODE_ENV !== 'production') {
  const ranges = [...Object.values(MERCH_TURNS).flatMap(t => [t.in, t.hold, t.out]), STICKER_SLAPS.peel]
  for (const [a, b] of ranges) {
    if (a < 0.02 || b > 0.98 || b < a) throw new Error(`Merch landing beat ${a}–${b} runs outside 0.02–0.98 or backwards.`)
  }
}
