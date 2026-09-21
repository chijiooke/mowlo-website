'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReduce } from '@/lib/motion'

/**
 * The saving, as an object: a piggy bank standing in the middle of the stamp,
 * shrinking into place as the card arrives — big and soft first, then settling
 * to size — and floating there while the ring turns around it. It is wider than
 * the disc on purpose: the snout and the coins break the ring's edge, so the pig
 * sits on the stamp rather than inside a hole in it.
 */
export function SavingsPig() {
  const reduce = useReduce()

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 w-[136%] -translate-x-1/2 -translate-y-1/2"
      initial={reduce ? false : { scale: 1.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/assets/piggy-savings.png"
          alt=""
          width={464}
          height={333}
          sizes="(max-width: 767px) 200px, 250px"
          className="h-auto w-full drop-shadow-[0_10px_12px_rgba(10,10,11,0.35)]"
        />
      </motion.div>
    </motion.div>
  )
}
