'use client'

import clsx from 'clsx'
import { motion, type Variants } from 'framer-motion'
import { useReduce } from '@/lib/motion'

const letter: Variants = {
  hidden: { opacity: 0, y: '0.5em', rotate: -12, scale: 0.7 },
  visible: { opacity: 1, y: 0, rotate: 0, scale: 1 },
}

interface PopLettersProps {
  text: string
  className?: string
  /** Seconds before the first letter lands. */
  delay?: number
  /** How much of the line must be on screen before it plays (0–1). Default: as soon as it's in. */
  amount?: number
}

/**
 * Letters that pop in one by one when scrolled into view — the entrance of
 * ColorSplitText, without its colours or its looping wave. The type keeps
 * whatever style its parent gives it.
 *
 * Words stay unbroken, and screen readers get the plain text.
 */
export function PopLetters({ text, className, delay = 0, amount }: PopLettersProps) {
  const reduce = useReduce()
  let index = 0

  return (
    <motion.span
      className={clsx('inline-block', className)}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={amount === undefined ? { once: true, margin: '-40px' } : { once: true, amount }}
      variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
    >
      <span className="sr-only">{text}</span>
      {text.split(' ').map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word).map(char => (
            <motion.span
              key={index++}
              className="inline-block will-change-transform"
              variants={letter}
              transition={{ type: 'spring', stiffness: 420, damping: 17 }}
            >
              {char}
            </motion.span>
          ))}
          {w < text.split(' ').length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  )
}
