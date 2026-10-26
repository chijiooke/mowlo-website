'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { MowloLogo } from '@/components/MowloLogo'
import { useReduce } from '@/lib/motion'
import { MERCH } from '@/lib/merch'

/**
 * The creator's side of a live drop: orders coming in, stock going, and the
 * two payouts waiting on the close and the deliveries. Mowlo's own mock drop
 * (never an invented creator) and counts only — no prices, no earnings figures.
 */
const ITEMS = [
  { name: MERCH.tee.name, sold: 0.72, bar: 'bg-pink' },
  { name: MERCH.cap.name, sold: 0.55, bar: 'bg-purple' },
  { name: MERCH.socks.name, sold: 0.38, bar: 'bg-amber' },
]

/** Where the order count starts; it ticks up from here while the screen is on show. */
const FIRST_ORDERS = 214

export function CreatorScreen() {
  const orders = useTicker(FIRST_ORDERS)

  return (
    <div aria-hidden="true" className="flex h-full w-full flex-col bg-ink text-bone">
      <div className="flex items-center justify-between px-5 pt-3.5 text-[10px] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <Icon icon="lucide:signal-high" width={11} />
          <Icon icon="lucide:wifi" width={11} />
          <Icon icon="lucide:battery-full" width={13} />
        </span>
      </div>

      <div className="flex items-center justify-between px-4 pt-10 pb-3">
        <div className="flex items-center gap-2">
          <MowloLogo size={22} />
          <span className="text-[12px] font-bold">My drops</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-pink/15 px-2 py-0.5 text-[9px] font-bold text-pink uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-pink" />
          Live
        </span>
      </div>

      <div className="px-4">
        <div className="font-display text-[19px] leading-tight font-extrabold tracking-[-0.02em]">The Mascot Drop</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-[14px] border border-bone/10 bg-ink-2 px-3 py-2.5">
            <div className="font-display text-[20px] font-extrabold tracking-[-0.03em] tabular-nums">{orders}</div>
            <div className="text-[9.5px] text-muted">Orders so far</div>
          </div>
          <div className="rounded-[14px] border border-bone/10 bg-ink-2 px-3 py-2.5">
            <div className="font-display text-[20px] font-extrabold tracking-[-0.03em]">2d 14h</div>
            <div className="text-[9.5px] text-muted">Till it closes</div>
          </div>
        </div>

        <ul className="mt-3 flex flex-col gap-2 rounded-[14px] border border-bone/10 bg-ink-2 px-3 py-3">
          {ITEMS.map(item => (
            <li key={item.name}>
              <div className="mb-1 flex justify-between text-[10.5px]">
                <span className="font-semibold">{item.name}</span>
                <span className="text-muted">{Math.round(item.sold * 100)}% gone</span>
              </div>
              <span className="block h-1 overflow-hidden rounded-full bg-bone/10">
                <span className={clsx('block h-full w-(--w) rounded-full', item.bar)} style={{ ['--w' as string]: `${item.sold * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto px-4 pb-5">
        <div className="text-[9px] font-bold tracking-[0.08em] text-muted uppercase">Payouts</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-[14px] border border-amber/30 bg-amber/10 px-3 py-2.5">
            <Icon icon="lucide:lock-keyhole-open" width={14} className="text-amber" />
            <div className="mt-1.5 font-display text-[15px] leading-none font-extrabold tracking-[-0.03em] tabular-nums">50%</div>
            <div className="text-[9px] text-bone/60">When it closes</div>
          </div>
          <div className="rounded-[14px] border border-teal/30 bg-teal/10 px-3 py-2.5">
            <Icon icon="lucide:package-check" width={14} className="text-teal" />
            <div className="mt-1.5 font-display text-[15px] leading-none font-extrabold tracking-[-0.03em] tabular-nums">50%</div>
            <div className="text-[9px] text-bone/60">Once delivered</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * A count that goes up by one every couple of seconds, the way orders land in
 * a live drop. Starts from a fixed figure so server and client agree; holds
 * still when motion is reduced.
 */
function useTicker(from: number) {
  const [count, setCount] = useState(from)
  const reduce = useReduce()

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setCount(c => c + 1), 2400)
    return () => window.clearInterval(id)
  }, [reduce])

  return count
}
