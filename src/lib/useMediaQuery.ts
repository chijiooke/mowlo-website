'use client'

import { useEffect, useState } from 'react'

/**
 * Subscribe to a media query. Returns `false` on the server and for the first
 * client render so hydration always matches, then settles on the real value.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)

    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])

  return matches
}
