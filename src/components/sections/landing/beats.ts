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
/** Word and copy clear before the product parade below takes over. */
export const WORD_OUT: Range = [0.78, 0.94]
export const COPY_OUT: Range = [0.8, 0.96]
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

/**
 * One flyer and a pair of round stickers, each crossing once, slowly, over the
 * whole landing. The stickers travel together — near lanes, overlapping timing —
 * the leading one big with a curled edge, the one behind it small and flat.
 */
export const FLIGHTS: Flight[] = [
  { id: 'flyer', sticker: false, from: 0.04, to: 0.82, dir: 1, lane: [-1.5, 1.2], depth: [-3, 1.4], scale: 0.95, spin: 2.4 },
  { id: 'sticker-a', sticker: true, from: 0.16, to: 0.9, dir: -1, lane: [1.25, -0.3], depth: [-1.6, 1.1], scale: 1.15, spin: 3, fold: 1.8 },
  { id: 'sticker-b', sticker: true, from: 0.2, to: 0.94, dir: -1, lane: [1.7, 0.4], depth: [-1.9, 0.8], scale: 0.7, spin: -2.6 },
]
