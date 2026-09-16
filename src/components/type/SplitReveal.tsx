'use client'

import clsx from 'clsx'
import { motion, type Variants } from 'framer-motion'
import { useReduce } from '@/lib/motion'

interface SplitRevealProps {
  /** One entry per line. Lines are hand-set — nothing wraps on its own. */
  lines: React.ReactNode[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  /** Seconds before the first line rises. */
  delay?: number
}

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p }

/**
 * Poster headline that rises line by line out of a mask when scrolled into
 * view. Under reduced motion the lines simply fade in together.
 */
export function SplitReveal({ lines, as = 'h2', className, delay = 0 }: SplitRevealProps) {
  const reduce = useReduce()
  const Tag = TAGS[as]

  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: '110%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduce ? { duration: 0.2 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: delay } } }}
    >
      {lines.map((content, i) => (
        // The padding/negative margin pair keeps descenders inside the mask.
        <span key={i} className={clsx('block overflow-hidden pb-[0.1em] -mb-[0.1em]')}>
          <motion.span className="block" variants={line}>
            {content}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
