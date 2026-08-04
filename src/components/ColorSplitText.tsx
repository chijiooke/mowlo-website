'use client'

import clsx from 'clsx'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/**
 * Splits a phrase into letters that pop in one by one when scrolled into view,
 * each painted in a rotating brand colour and then left on a slow wave.
 */
const PALETTE = [
  'var(--amber)',
  'var(--teal)',
  'var(--pink)',
  'var(--sky)',
  'var(--lime)',
  'var(--purple)',
  'var(--amber-hi)',
]

const letter: Variants = {
  hidden: { opacity: 0, y: '0.5em', rotate: -12, scale: 0.7 },
  visible: { opacity: 1, y: 0, rotate: 0, scale: 1 },
}

interface ColorSplitTextProps {
  text: string
  className?: string
  /** Seconds to wait before the first letter lands. */
  delay?: number
}

export function ColorSplitText({ text, className, delay = 0 }: ColorSplitTextProps) {
  const reduce = useReducedMotion()

  return (
    <motion.span
      className={clsx('color-split', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {Array.from(text).map((char, i) =>
        char === ' ' ? (
          <span key={i} aria-hidden="true">
            &nbsp;
          </span>
        ) : (
          <motion.span
            key={i}
            className="color-split-char"
            aria-hidden="true"
            variants={letter}
            transition={{ type: 'spring', stiffness: 420, damping: 17 }}
            style={{ color: PALETTE[i % PALETTE.length] }}
          >
            {/* Inner span owns the looping wave so it cannot fight the
                entrance transform on its parent. */}
            <span className="color-split-wave" style={{ animationDelay: `${i * 0.11}s` }}>
              {char}
            </span>
          </motion.span>
        ),
      )}
    </motion.span>
  )
}
