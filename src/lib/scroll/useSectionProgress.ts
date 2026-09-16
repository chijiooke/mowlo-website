'use client'

import type { RefObject } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'

/**
 * Progress through a pinned track, 0 → 1: 0 when the track's top reaches the
 * top of the viewport, 1 when its bottom reaches the bottom. Pair it with a
 * `sticky top-0 h-svh` frame inside a tall track.
 *
 * Read it with `.get()` inside `useFrame`, or map it with `useTransform` —
 * never copy it into React state.
 */
export function useSectionProgress(track: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  return scrollYProgress
}

/** Local 0 → 1 progress of a beat that runs from `start` to `end`. */
export const beat = (p: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (p - start) / (end - start)))

/**
 * A `useTransform` input/output pair padded to span the whole 0 → 1 track,
 * holding the first and last values. Spread it in:
 *   useTransform(progress, ...track([0, 0.06], [1, 0]))
 *
 * Use it for every scroll-linked transform. framer-motion hardware-accelerates
 * opacity, clipPath and transform off `useScroll` through the Web Animations
 * API, and WAAPI fills the gap before the first offset and after the last with
 * the element's underlying style. Unpadded, a fade that ends at 0.06 climbs
 * back toward its starting value by the end of the track.
 */
export function track<T>(input: readonly number[], output: readonly T[]): [number[], T[]] {
  const i = [...input]
  const o = [...output]
  if (i[0] > 0) {
    i.unshift(0)
    o.unshift(o[0])
  }
  if (i[i.length - 1] < 1) {
    i.push(1)
    o.push(o[o.length - 1])
  }
  return [i, o]
}
