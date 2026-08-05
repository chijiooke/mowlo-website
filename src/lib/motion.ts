'use client'

import { useReducedMotion, type Transition } from 'framer-motion'

/**
 * Shared springs. All are damped to ζ ≈ 0.93 — they settle without the bounce
 * that makes a six-card pile jiggle when every card animates at once.
 */

/** A pile rearranging itself: the fan opening, cards changing depth. */
export const SETTLE: Transition = { type: 'spring', stiffness: 195, damping: 24, mass: 0.85 }
/** A card returning to centre after a swipe that did not commit. Must not overshoot. */
export const RECENTRE: Transition = { type: 'spring', stiffness: 340, damping: 34 }
/** A committed card leaving the deck. Seed it with the release velocity. */
export const EXIT: Transition = { type: 'spring', stiffness: 260, damping: 34 }
export const INSTANT: Transition = { duration: 0 }

/** The same pose, with the motion taken out. */
export const t = (reduce: boolean, spring: Transition): Transition => (reduce ? INSTANT : spring)

/** `useReducedMotion` returns `boolean | null`; this never does. */
export const useReduce = (): boolean => !!useReducedMotion()
