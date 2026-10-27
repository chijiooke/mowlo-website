import type { Ref } from 'react'
import clsx from 'clsx'

/**
 * A chapter of the page: one ground, one pattern. The only grounds and patterns
 * allowed are these — see the art-direction skill before adding one.
 */
const GROUNDS = {
  ink: 'bg-ink text-bone',
  'ink-2': 'bg-ink-2 text-bone',
  cream: 'bg-cream text-ink',
  /** Artist's Corner only: a gallery-white page. */
  white: 'bg-white text-ink',
  amber: 'bg-amber text-ink',
} as const

const PATTERNS = {
  none: '',
  grain: 'bg-grain',
  halftone: 'bg-halftone',
  diecut: 'bg-diecut',
  cropmarks: 'bg-cropmarks',
} as const

export type Ground = keyof typeof GROUNDS
export type Pattern = keyof typeof PATTERNS

interface ChapterProps {
  ground: Ground
  pattern?: Pattern
  id?: string
  className?: string
  ref?: Ref<HTMLElement>
  children: React.ReactNode
}

/**
 * No z-index here on purpose: a stacking context would trap the chapter's copy
 * under the fixed 3D canvas. Give copy `relative z-10` instead — and inside a
 * sticky frame, which is a stacking context of its own, use a separate sticky
 * copy layer with the z-index (see the Hero).
 */
export function Chapter({ ground, pattern = 'none', id, className, ref, children }: ChapterProps) {
  return (
    <section id={id} ref={ref} data-ground={ground} className={clsx('relative', GROUNDS[ground], className)}>
      {pattern !== 'none' && (
        <div aria-hidden="true" className={clsx('pointer-events-none absolute inset-0 pattern-fade', PATTERNS[pattern])} />
      )}
      {children}
    </section>
  )
}
