'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useReduce } from '@/lib/motion'

let instance: Lenis | null = null

/** The page's Lenis instance, or null when smooth scrolling is off. */
export const getLenis = () => instance

/**
 * Smooth wheel scrolling for the whole page. Renders nothing — it is a sibling
 * of the content, not a wrapper, so turning it on or off never remounts the
 * tree.
 *
 * Touch stays native (syncTouch off) and reduced motion turns it off entirely.
 * Anything that scrolls on its own inside the page needs `data-lenis-prevent`.
 */
export function SmoothScroll() {
  const reduce = useReduce()

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      syncTouch: false,
      autoRaf: true,
      // Clears the fixed nav when an in-page anchor is followed.
      anchors: { offset: -88 },
    })
    instance = lenis
    return () => {
      lenis.destroy()
      instance = null
    }
  }, [reduce])

  return null
}
