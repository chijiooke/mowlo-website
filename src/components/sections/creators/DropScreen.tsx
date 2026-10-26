'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { MowloLogo } from '@/components/MowloLogo'
import { useReduce } from '@/lib/motion'
import { MERCH } from '@/lib/merch'

/**
 * The mock drop is Mowlo's own: the mascot on Mowlo's own merch, never an
 * invented creator brand (art direction §6). Counts only — no prices.
 */
const ITEMS = [
  { name: MERCH.tee.name, left: 18, icon: 'lucide:shirt', tone: 'bg-pink/15 text-pink' },
  // Lucide has no cap or sock; Phosphor's sit with it at the same weight.
  { name: MERCH.cap.name, left: 32, icon: 'ph:baseball-cap', tone: 'bg-purple/20 text-purple' },
  { name: MERCH.socks.name, left: 45, icon: 'ph:sock', tone: 'bg-amber/15 text-amber' },
]

/** Where the countdown starts: 2d 14h 08m 30s. It only ever counts down from here. */
const WINDOW_SECONDS = 2 * 86400 + 14 * 3600 + 8 * 60 + 30

/** A fan's view of a live drop, after the real page in mowlo-web-app (PublicDropPage). */
export function DropScreen() {
  const left = useCountdown(WINDOW_SECONDS)
  const d = Math.floor(left / 86400)
  const h = Math.floor((left % 86400) / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  const pad = (n: number) => String(n).padStart(2, '0')

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

      <div className="flex items-center gap-2.5 px-4 pt-10 pb-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-amber/15">
          <MowloLogo size={24} />
        </span>
        <div>
          <div className="text-[13px] font-bold">@mowlo</div>
          <div className="text-[9.5px] text-muted">Creator Store</div>
        </div>
      </div>

      <div className="px-4">
        <div className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.02em]">The Mascot Drop</div>
        <div className="mt-3 rounded-2xl border border-amber/30 bg-amber/10 px-3 py-2.5">
          <div className="text-[9px] font-bold tracking-[0.08em] text-amber uppercase">Orders close in</div>
          <div className="mt-0.5 font-display text-[20px] font-extrabold tracking-[-0.02em] tabular-nums">
            {d}d {pad(h)}h {pad(m)}m <span className="text-bone/50">{pad(s)}s</span>
          </div>
          <div className="mt-1 text-[9.5px] text-bone/60">Then in your hands the week after</div>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2 px-4 pt-3">
        {ITEMS.map(item => (
          <li key={item.name} className="flex items-center gap-2.5 rounded-[14px] border border-bone/10 bg-ink-2 px-3 py-2.5">
            <span className={clsx('flex size-8 shrink-0 items-center justify-center rounded-[10px]', item.tone)}>
              <Icon icon={item.icon} width={16} />
            </span>
            <span className="min-w-0 flex-1 text-[12px] font-semibold">{item.name}</span>
            <span className="text-[10px] text-muted">{item.left} left</span>
          </li>
        ))}
      </ul>

      <div className="px-4 pb-5">
        <div className="mb-2.5 flex items-center gap-1.5 text-[9.5px] text-bone/60">
          <Icon icon="lucide:package" width={11} />
          Made, packed and delivered to you by Mowlo.
        </div>
        <div className="rounded-full bg-amber py-2.5 text-center text-[12px] font-bold text-ink">Order now</div>
      </div>
    </div>
  )
}

/**
 * Seconds left, ticking once a second. Starts from a fixed figure rather than
 * a date, so the server and the first client render agree. Holds still when
 * motion is reduced.
 */
function useCountdown(from: number) {
  const [left, setLeft] = useState(from)
  const reduce = useReduce()

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setLeft(v => (v > 0 ? v - 1 : from)), 1000)
    return () => window.clearInterval(id)
  }, [from, reduce])

  return left
}
