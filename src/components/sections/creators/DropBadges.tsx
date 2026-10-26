'use client'

import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { MowloLogo } from '@/components/MowloLogo'
import { PillPattern } from '@/components/ui/PillPattern'
import { useReduce } from '@/lib/motion'

/** Mowlo and the merch, as two overlapping badges: the brand and what it makes for you. */
const BADGES = [
  { key: 'mowlo', tone: 'bg-ink', body: <MowloLogo size={84} /> },
  { key: 'merch', tone: 'bg-pink text-ink', body: <Icon icon="lucide:shirt" width={64} aria-hidden="true" /> },
]

/**
 * The closing panel: a purple capsule pattern with two badges overlapping in
 * the middle. The badges pop in one after the other, then breathe.
 */
export function DropBadges() {
  const reduce = useReduce()

  return (
    <div className="relative mx-auto mb-14 aspect-[4/3] w-full max-w-[1100px] overflow-hidden rounded-[2rem] bg-purple text-ink/70 sm:aspect-[16/7] md:mb-20">
      <PillPattern size={120} />
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        {BADGES.map((badge, i) => (
          <motion.span
            key={badge.key}
            className={clsx('relative', i > 0 && '-ml-8 md:-ml-10')}
            initial={reduce ? false : { scale: 0.4, opacity: 0, rotate: i ? 25 : -25 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.15 + i * 0.18 }}
          >
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, delay: i * 1.6 }}
              className={clsx(
                'flex size-36 items-center justify-center rounded-full ring-[7px] ring-white md:size-48',
                badge.tone,
              )}
            >
              {badge.body}
            </motion.span>
          </motion.span>
        ))}
      </div>
    </div>
  )
}
