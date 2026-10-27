'use client'

import { useRef } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, useInView } from 'framer-motion'
import { useReduce } from '@/lib/motion'
import { Spline } from './ArtistStatsScreen'

/**
 * An order's road, as the web app's statuses run (OrderStatus in
 * mowlo-web-app): paid, printing, shipped, delivered. Each in a brand tone.
 */
const STEPS = [
  { key: 'paid', label: 'Paid', tone: 'bg-bone text-ink' },
  { key: 'printing', label: 'Printing', tone: 'bg-amber text-ink' },
  { key: 'shipped', label: 'Shipped', tone: 'bg-sky text-ink' },
  { key: 'delivered', label: 'Delivered', tone: 'bg-teal text-ink' },
] as const

type Step = (typeof STEPS)[number]['key']

/**
 * A page of the creator's Sales list, after CreatorSalesPage: who bought,
 * what, what you earn on it, and where it is. Names are illustrative; the
 * mock drop is Mowlo's own.
 */
const ORDERS: { buyer: string; item: string; id: string; earn: string; status: Step }[] = [
  { buyer: 'Ada O.', item: 'Framed print · A3', id: 'SB-0142', earn: '₦9,500', status: 'delivered' },
  { buyer: 'Tobi K.', item: 'Framed print · A3', id: 'SB-0141', earn: '₦9,500', status: 'shipped' },
  { buyer: 'Ife A.', item: 'Sticker pack ×2', id: 'SB-0140', earn: '₦1,800', status: 'printing' },
  { buyer: 'Kemi B.', item: 'Key holder', id: 'SB-0139', earn: '₦1,200', status: 'paid' },
]

/** How the drop is doing, as the creator analytics card counts it: earnings, orders, units. */
const STATS = [
  { label: 'Earnings', value: '₦248,500', note: '↗ 18% this week', noteTone: 'text-teal' },
  { label: 'Orders', value: '152', note: '31 today', noteTone: 'text-bone/45' },
  { label: 'Units sold', value: '194', note: 'of 300 · 65%', noteTone: 'text-bone/45', fill: 0.65 },
]

/** Sales across the week so far, as heights (0–1), for the line on the screen. */
const WEEK = [0.35, 0.5, 0.42, 0.68, 0.8, 1, 0.86]

const tone = (status: Step) => STEPS.find(s => s.key === status)!.tone

/**
 * How a drop is doing: the copy on one side (or above, `stacked`); on the other, the drop's numbers
 * up top and its latest orders under them, rows landing one after another as
 * the card comes into view.
 */
export function OrdersCard({ stacked = false }: { stacked?: boolean }) {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReduce()

  return (
    <article
      className={clsx(
        'grid h-full overflow-hidden rounded-[2rem] bg-ink p-7 text-bone',
        // Stacked when it shares a row: the copy over the panel.
        stacked ? 'gap-7 md:p-9' : 'gap-10 md:grid-cols-[1fr_1.15fr] md:gap-14 md:p-11',
      )}
    >
      <div className="flex flex-col">
        <span className="mb-5 flex size-10 items-center justify-center rounded-full bg-sky text-ink">
          <Icon icon="lucide:chart-line" width={19} aria-hidden="true" />
        </span>
        <h3 className="text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.02em]">
          How’s the drop doing? <span className="text-bone/50">You’ll always know.</span>
        </h3>
        <p className="mt-4 max-w-[30rem] text-[15px] leading-relaxed text-bone/65">
          Earnings, orders and units for every drop, live and charted by the week, month or quarter: what’s selling,
          what’s left and how long it runs. Then follow each order from paid to printing to your collector’s door.
        </p>

        {/* The road an order takes. */}
        <ol className="mt-8 flex flex-wrap items-center gap-2">
          {STEPS.map((step, i) => (
            <li key={step.key} className="flex items-center gap-2">
              <span className={clsx('rounded-full px-3 py-1 text-[12.5px] font-bold', step.tone)}>{step.label}</span>
              {i < STEPS.length - 1 && <Icon icon="lucide:chevron-right" width={14} className="text-bone/35" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>

      {/* The drop on a tablet: the photographed frame over the app's screen,
          three quarters of it showing, the rest run off the card's bottom edge. */}
      <div aria-hidden="true" className="relative mx-auto -mb-7 aspect-[1100/1150] w-full max-w-[27rem] self-end overflow-hidden md:-mb-11">
        <div className="absolute inset-x-0 top-0 aspect-[1100/1533]">
        {/* The glass: insets measured off the frame PNG, a hair larger so no gap shows at the edge. */}
        <div className="absolute top-[3.8%] right-[5.7%] bottom-[3.9%] left-[6%] flex flex-col overflow-hidden rounded-[4.5%/3.2%] bg-ink-2 px-3.5 pt-2.5 pb-3">
          <div className="flex items-center justify-between px-1 text-[9px] font-semibold text-bone/80">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <Icon icon="lucide:wifi" width={10} />
              <Icon icon="lucide:battery-full" width={12} />
            </span>
          </div>

          <div className="mt-3 mb-2.5 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-[12px] font-bold">
              Space Boy
              <span className="flex items-center gap-1 rounded-full bg-teal/15 px-1.5 py-0.5 text-[8.5px] font-bold tracking-[0.06em] text-teal uppercase">
                <span className="size-1 rounded-full bg-teal" />
                Live
              </span>
            </span>
            <span className="text-[10px] text-bone/55">Closes in 2d 14h</span>
          </div>

          {/* The drop's numbers. */}
          <div className="grid grid-cols-3 gap-1.5">
            {STATS.map(stat => (
              <div key={stat.label} className="rounded-xl bg-ink-3 p-2">
                <div className="text-[8px] font-semibold tracking-[0.06em] text-bone/45 uppercase">{stat.label}</div>
                <div className="mt-1 font-display text-[13px] leading-none font-extrabold tabular-nums">{stat.value}</div>
                {stat.fill !== undefined && (
                  <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-bone/10">
                    <span style={{ ['--w' as string]: `${stat.fill * 100}%` }} className="block h-full w-(--w) rounded-full bg-amber" />
                  </div>
                )}
                <div className={clsx('mt-1 text-[8.5px]', stat.noteTone)}>{stat.note}</div>
              </div>
            ))}
          </div>

          {/* The week, as a line. */}
          <div className="mt-2 rounded-xl bg-ink-3 px-2.5 pt-2 pb-1">
            <div className="text-[8px] font-semibold tracking-[0.06em] text-bone/45 uppercase">Earnings this week</div>
            <Spline values={WEEK} tone="purple" />
          </div>

          <div className="mt-2.5 mb-1.5 px-1 text-[8px] font-semibold tracking-[0.06em] text-bone/45 uppercase">Latest orders</div>
          <ul ref={ref} className="flex flex-col gap-1.5">
            {ORDERS.map((order, i) => (
              <motion.li
                key={order.id}
                className="flex items-center gap-2 rounded-xl bg-ink-3 px-2.5 py-2"
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={inView || reduce ? { opacity: 1, x: 0 } : undefined}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 + i * 0.12 }}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bone/10 text-[9px] font-bold">
                  {order.buyer.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10.5px] font-semibold">{order.buyer}</span>
                  <span className="block truncate text-[8.5px] text-bone/50">
                    {order.item} · <span className="text-teal">{order.earn}</span>
                  </span>
                </span>
                <span className={clsx('w-[3.9rem] shrink-0 rounded-full py-0.5 text-center text-[8.5px] font-bold', tone(order.status))}>
                  {STEPS.find(s => s.key === order.status)!.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        <Image
          src="/assets/tablet-frame.png"
          alt=""
          fill
          sizes="(max-width: 767px) 90vw, 432px"
          className="pointer-events-none select-none"
        />
        </div>
      </div>
    </article>
  )
}
