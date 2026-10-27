import { useId } from 'react'
import clsx from 'clsx'

/** A chunky heart on a 24-unit box, centred on (12, 12.75). */
const HEART =
  'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.2 0 3.9 1.3 5.4 3.2 1.5-1.9 3.2-3.2 5.4-3.2 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z'

/**
 * A bold repeat of hearts — PillPattern's sibling, for panels rather than
 * chapter grounds. Rows are offset half a tile and the hearts tilt opposite
 * ways, so it reads as scattered rather than gridded. Colour comes from
 * classes on the wrapper: the ground from `bg-*`, the hearts from `text-*`.
 *
 * Decorative: aria-hidden, and it fills its positioned parent.
 */
export function HeartPattern({ className, size = 96 }: { className?: string; size?: number }) {
  const id = `heart-${useId().replace(/:/g, '')}`
  const w = size
  const h = size
  // Each heart is just under half a tile, so tilted ones never cross the tile edge; the path is drawn on a 24-unit box.
  const s = (size * 0.44) / 24

  const heart = (x: number, y: number, tilt: number) => (
    <path d={HEART} fill="currentColor" transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s}) translate(-12 -12.75)`} />
  )

  return (
    <svg aria-hidden="true" className={clsx('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {heart(w * 0.25, h * 0.25, -14)}
          {heart(w * 0.75, h * 0.75, 12)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
