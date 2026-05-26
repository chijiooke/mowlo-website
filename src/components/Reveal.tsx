'use client'

import { motion, type Variants } from 'framer-motion'

type Direction = 'up' | 'left' | 'right'

interface RevealProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  className?: string
}

const variants: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 34 },  visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -34 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 34 },  visible: { opacity: 1, x: 0 } },
}

export function Reveal({ children, direction = 'up', delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function Stagger({ children, className, staggerDelay = 0.08 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
