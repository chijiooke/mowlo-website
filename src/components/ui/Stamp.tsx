'use client'

import { useId, type ReactNode } from 'react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

/**
 * A maker's mark: a green disc with its type set round the ring, turning slowly
 * and breathing on the spot, the way a stamp sits on something rather than a
 * spinning graphic. The words are the promise itself — no separate label.
 *
 * `text` is one pass of the ring and is printed twice, so it reads whichever way
 * the disc has turned. Keep it short: both passes are fitted to the ring's
 * circumference (2πr, r=34 ≈ 213), and a long line comes out spaced to pieces.
 *
 * The middle sits outside the turning SVG, so whatever stands there — the tick,
 * or an object — stays upright while the ring goes round it.
 */
export function Stamp({
  text,
  icon = 'lucide:check',
  center,
  className,
}: {
  text: string
  icon?: string
  /** Replaces the icon in the middle. */
  center?: ReactNode
  className?: string
}) {
  // Scoped, because two stamps on one page would otherwise share a path id.
  const ring = `stamp-ring-${useId().replace(/:/g, '')}`

  return (
    <span aria-hidden="true" className={clsx('stamp-float', className)}>
      <svg viewBox="0 0 100 100" className="stamp-spin size-full">
        <defs>
          <path id={ring} fill="none" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
        </defs>
        <circle cx="50" cy="50" r="48" className="fill-teal" />
        <text className="fill-ink text-[8px] font-bold uppercase">
          <textPath href={`#${ring}`} startOffset="0" textLength="213" lengthAdjust="spacingAndGlyphs">
            {`${text} ${text} `}
          </textPath>
        </text>
      </svg>
      {center ?? (
        <Icon icon={icon} width={22} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ink" aria-hidden="true" />
      )}
    </span>
  )
}
