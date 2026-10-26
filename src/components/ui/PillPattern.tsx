import { useId } from 'react'
import clsx from 'clsx'

/**
 * A bold repeat of diagonal capsules — the louder cousin of the print-shop
 * patterns, for panels rather than chapter grounds. Colour comes from classes
 * on the wrapper: the ground from `bg-*`, the capsules from `text-*` (they're
 * stroked in currentColor), e.g. `bg-purple text-ink/70`.
 *
 * Decorative: aria-hidden, and it fills its positioned parent.
 */
export function PillPattern({ className, size = 96 }: { className?: string; size?: number }) {
  const id = `pill-${useId().replace(/:/g, '')}`
  // One capsule per tile, rising left to right; the stroke's round caps make the ends.
  const w = size
  const h = size * 0.8

  return (
    <svg aria-hidden="true" className={clsx('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          <line
            x1={w * 0.3}
            y1={h * 0.64}
            x2={w * 0.7}
            y2={h * 0.32}
            stroke="currentColor"
            strokeWidth={size * 0.5}
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
