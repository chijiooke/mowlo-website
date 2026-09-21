'use client'

import clsx from 'clsx'
import { motion, type MotionValue } from 'framer-motion'

/**
 * Size, leading and letter-spacing per use. They live here rather than being
 * passed in: two arbitrary Tailwind values for the same property have equal
 * specificity, so which one won would come down to stylesheet order.
 */
const VARIANTS = {
  /** Behind a product in the parade: big, and tightly set. */
  piece: 'text-[clamp(4rem,19vw,19rem)] leading-[0.82] tracking-[-0.045em]',
  /** The brand name on the landing: near the full width of the screen, evenly spaced. */
  landing: 'text-[33vw] leading-[0.78] tracking-[0.012em]',
} as const

/**
 * The mega word behind a scene. Up to three layers of the same text: the ghost
 * itself, an optional coloured copy wiped in by a clip-path, and an optional
 * metallic highlight that rakes across the result.
 */
export function GhostWord({
  word,
  opacity,
  y,
  scale,
  tint,
  fill,
  paper,
  variant = 'piece',
  align = 'center',
}: {
  word: string
  opacity: MotionValue<number>
  y?: MotionValue<string>
  scale?: MotionValue<number>
  tint: string
  variant?: keyof typeof VARIANTS
  /** Where the word sits in the frame. */
  align?: 'center' | 'top'
  /** A clip-path that wipes a second, amber copy of the word over the ghost. */
  fill?: MotionValue<string>
  /** Lays crumpled paper over the letters, so the fill reads as printed stock. */
  paper?: boolean
}) {
  return (
    <div
      className={clsx(
        'absolute inset-0 flex justify-center overflow-hidden',
        // Clear of the nav when it sits at the top.
        align === 'top' ? 'items-start pt-24 md:pt-28' : 'items-center',
      )}
    >
      <motion.span
        style={{ opacity, y, scale, ['--tint' as string]: tint }}
        className={clsx(
          'relative font-display font-extrabold font-condensed whitespace-nowrap text-(color:--tint)',
          VARIANTS[variant],
        )}
      >
        {word}
        {fill && (
          <motion.span style={{ clipPath: fill }} className="absolute inset-0 text-amber">
            {word}
          </motion.span>
        )}
        {paper && (
          <span aria-hidden="true" className="mowlo-paper absolute inset-0">
            {word}
          </span>
        )}
      </motion.span>
    </div>
  )
}
