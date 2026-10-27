'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MowloLogo } from '@/components/MowloLogo'
import { useReduce } from '@/lib/motion'

/** What it costs to start, as the lines on a till receipt. */
const LINES = ['Opening your shop', 'Starting a drop', 'Stock up front', 'Printing samples']

/** Barcode stripes, as widths in px — fixed, so server and client agree. */
const BARS = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2]

/**
 * The cost of starting, as a till receipt that prints out of a slot when it
 * scrolls into view and comes to ₦0.00. Print-shop vocabulary (art direction
 * §5): the paper is the proof, so the card needs no other copy to say "free".
 *
 * The slot sits at the top of its parent and clips the paper, so the receipt
 * reads as feeding out of it; the parent should clip at the bottom too, so the
 * end of the roll runs off the card.
 */
export function Receipt() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReduce()

  return (
    <div ref={ref} className="relative mx-auto w-[17.5rem]">
      {/* The printer's slot. */}
      <div className="relative z-10 mx-[-0.75rem] h-3 rounded-full bg-ink shadow-[0_6px_10px_rgba(10,10,11,0.35)]" />
      <div className="-mt-1.5 overflow-hidden px-1 pb-6 drop-shadow-[0_14px_22px_rgba(10,10,11,0.2)]">
        <motion.div
          initial={reduce ? false : { y: '-101%' }}
          animate={inView || reduce ? { y: '0%' } : undefined}
          // Printers feed in short bursts: steps, not a glide.
          transition={{ duration: 1.8, ease: (t: number) => Math.round(t * 14) / 14 }}
          // The torn foot: a row of teeth cut by a mask (after Temani Afif's CSS
          // shapes). The mask takes any box-shadow with it, hence the drop-shadow
          // filter on the parent.
          className="bg-paper px-5 pt-6 pb-8 font-mono text-[11.5px] text-ink [mask:conic-gradient(from_-45deg_at_bottom,#0000,#000_1deg_89deg,#0000_90deg)_50%/12px_100%]"
        >
          <div className="flex flex-col items-center gap-1.5 text-center">
            <MowloLogo size={30} />
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase">Mowlo</span>
            <span className="text-[10px] tracking-[0.12em] text-ink/55 uppercase">Artist’s Corner · Receipt #0001</span>
          </div>

          <div className="my-4 border-t border-dashed border-ink/30" />

          <ul className="flex flex-col gap-2">
            {LINES.map(line => (
              <li key={line} className="flex items-baseline gap-1.5">
                <span className="shrink-0">{line}</span>
                <span aria-hidden="true" className="min-w-2 flex-1 translate-y-[-0.2em] border-b border-dotted border-ink/35" />
                <span className="shrink-0 tabular-nums">₦0.00</span>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-dashed border-ink/30" />

          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-bold tracking-[0.12em] uppercase">Total</span>
            <span className="font-display text-[30px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">₦0.00</span>
          </div>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-ink/60">
            We print what sells, after it sells.
            <br />
            Thank you for making things <span className="text-pink-deep">♥</span>
          </p>

          <div aria-hidden="true" className="mt-4 flex h-9 items-stretch justify-center gap-[2px]">
            {BARS.map((w, i) => (
              <span key={i} style={{ ['--w' as string]: `${w}px` }} className="block w-(--w) bg-ink" />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
