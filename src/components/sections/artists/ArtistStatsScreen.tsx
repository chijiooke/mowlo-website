import { useId } from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { MowloLogo } from '@/components/MowloLogo'
import { MERCH } from '@/lib/merch'

/** Sales by day across the drop so far, as heights (0–1). */
const DAYS = [
  { day: 'M', h: 0.35 },
  { day: 'T', h: 0.5 },
  { day: 'W', h: 0.42 },
  { day: 'T', h: 0.68 },
  { day: 'F', h: 0.8 },
  { day: 'S', h: 1 },
  { day: 'S', h: 0.86 },
]

/** One tap from the balance, the way banking apps line them up. */
const ACTIONS = [
  { icon: 'lucide:plus', label: 'New drop' },
  { icon: 'lucide:link', label: 'Share' },
  { icon: 'lucide:receipt-text', label: 'Payouts' },
]

/** What's sold of each piece in the drop. */
const STOCK = [
  { name: 'Framed print', sold: 38, of: 50, icon: 'lucide:frame', tone: 'bg-amber' },
  { name: MERCH.sticker.name, sold: 136, of: 200, icon: 'lucide:sticker', tone: 'bg-pink' },
  { name: MERCH.keyholder.name, sold: 20, of: 50, icon: 'lucide:key-round', tone: 'bg-teal' },
]

/** Section label inside the app. */
const LABEL = 'text-[9px] font-semibold tracking-[0.08em] text-bone/45 uppercase'

/**
 * The artist's side of a live drop, laid out the way fintech home screens are:
 * the wallet balance first and largest, a row of quick actions under it, then
 * one chart for the drop with a trend badge, two small tiles, and the stock.
 * Monochrome with one accent per job — purple for money held, amber for the
 * drop, teal for growth.
 *
 * The mock is Mowlo's own drop (art direction §6). The figures are
 * illustrative, shown at the founder's call — the one place the site carries
 * naira amounts.
 */
export function ArtistStatsScreen() {
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

      {/* Top bar: who's signed in, and the bell. */}
      <div className="flex items-center justify-between px-4 pt-8 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-amber/15">
            <MowloLogo size={18} />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] text-bone/50">Good morning</div>
            <div className="text-[11.5px] font-semibold">@mowlo</div>
          </div>
        </div>
        <span className="relative flex size-7 items-center justify-center rounded-full bg-bone/8">
          <Icon icon="lucide:bell" width={13} />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-pink" />
        </span>
      </div>

      {/* The hero: what's in the wallet. */}
      <div className="mx-4 rounded-[18px] bg-purple p-3.5 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold tracking-[0.08em] text-ink/75 uppercase">Wallet balance</span>
          <Icon icon="lucide:eye" width={12} className="text-ink/60" />
        </div>
        <div className="mt-1 font-display text-[24px] leading-none font-extrabold tracking-[-0.03em] text-white tabular-nums">
          <span className="mr-0.5 text-[16px] align-[0.32em]">₦</span>1,340,000<span className="text-[15px] text-white/60">.00</span>
        </div>
        <div className="mt-3 flex justify-end">
          <span className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-bold text-white">Withdraw</span>
        </div>
      </div>

      {/* Quick actions. */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {ACTIONS.map(action => (
          <div key={action.label} className="flex flex-col items-center gap-1 rounded-[14px] bg-ink-2 py-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-bone/8">
              <Icon icon={action.icon} width={12} />
            </span>
            <span className="text-[8.5px] font-medium text-bone/70">{action.label}</span>
          </div>
        ))}
      </div>

      {/* The drop: one chart, with the number and its trend over it. */}
      <div className="mx-4 mt-3 rounded-[18px] bg-ink-2 p-3.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold">
            Space Boy
            <span className="flex items-center gap-1 rounded-full bg-teal/15 px-1.5 py-0.5 text-[7.5px] font-bold tracking-[0.06em] text-teal uppercase">
              <span className="size-1 rounded-full bg-teal" />
              Live
            </span>
          </span>
          <span className="flex rounded-full bg-bone/8 p-0.5 text-[8px] font-semibold">
            <span className="rounded-full bg-bone px-1.5 py-0.5 text-ink">7D</span>
            <span className="px-1.5 py-0.5 text-bone/50">All</span>
          </span>
        </div>
        <div className={clsx(LABEL, 'mt-2.5')}>Earnings this drop</div>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="font-display text-[19px] font-extrabold tracking-[-0.03em] tabular-nums">₦248,500</span>
          <span className="flex items-center gap-0.5 rounded-full bg-teal/15 px-1.5 py-0.5 text-[8.5px] font-bold text-teal">
            <Icon icon="lucide:arrow-up-right" width={9} />
            18%
          </span>
        </div>
        <Spline values={DAYS.map(d => d.h)} />
        <div className="mt-1 flex justify-between">
          {DAYS.map((d, i) => (
            <span key={i} className="w-3 text-center text-[7.5px] text-bone/35">
              {d.day}
            </span>
          ))}
        </div>
      </div>

      {/* Two small tiles under the chart. */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-[14px] bg-ink-2 p-2.5">
          <div className={LABEL}>Sold</div>
          <div className="mt-0.5 font-display text-[15px] font-extrabold tabular-nums">
            194<span className="text-[10px] font-semibold text-bone/40"> / 300</span>
          </div>
        </div>
        <div className="rounded-[14px] bg-ink-2 p-2.5">
          <div className={LABEL}>Closes in</div>
          <div className="mt-0.5 font-display text-[15px] font-extrabold tabular-nums">2d 14h</div>
        </div>
      </div>

      {/* Stock: sold against the run, piece by piece. */}
      <div className="mx-4 mt-3 rounded-[18px] bg-ink-2 p-3.5">
        <div className={clsx(LABEL, 'mb-2.5')}>Stock</div>
        <ul className="flex flex-col gap-2.5">
          {STOCK.map(item => (
            <li key={item.name}>
              <div className="mb-1 flex items-center justify-between text-[10.5px]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Icon icon={item.icon} width={11} className="text-bone/55" />
                  {item.name}
                </span>
                <span className="text-bone/45 tabular-nums">
                  {item.sold}/{item.of}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-bone/10">
                <span
                  style={{ ['--w' as string]: `${(item.sold / item.of) * 100}%` }}
                  className={clsx('block h-full w-(--w) rounded-full', item.tone)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Width and height of the chart's drawing box; the SVG stretches it to fit. */
const W = 100
const H = 40

/**
 * The week as a smooth line with a soft fill under it. Catmull-Rom through the
 * points, drawn as cubic Béziers, so the curve passes through every day.
 */
export function Spline({ values, tone = 'amber' }: { values: number[]; tone?: 'amber' | 'purple' }) {
  const id = useId().replace(/:/g, '')
  const fillId = `spline-fill-${id}`
  const strokeId = `spline-stroke-${id}`
  const purple = tone === 'purple'
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - v * (H - 4) - 2] as const)
  let line = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    line += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  const area = `${line} L ${W} ${H} L 0 ${H} Z`
  const peak = values.indexOf(Math.max(...values))

  return (
    <div className="relative mt-2 h-12">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={purple ? 'var(--color-purple)' : 'var(--color-amber)'} stopOpacity={purple ? 0.5 : 0.35} />
            <stop offset="100%" stopColor={purple ? 'var(--color-purple-deep)' : 'var(--color-amber)'} stopOpacity="0" />
          </linearGradient>
          {/* Purple: the line deepens left to right, ending on a lilac lift where the week peaks. */}
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-purple-deep)" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--color-purple) 55%, white)" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${fillId})`} />
        <path
          d={line}
          fill="none"
          stroke={purple ? `url(#${strokeId})` : 'var(--color-amber)'}
          strokeWidth={purple ? 2.5 : 2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The best day, marked. Placed in HTML so the stretched SVG can't squash it. */}
      <span
        style={{ ['--x' as string]: `${(pts[peak][0] / W) * 100}%`, ['--y' as string]: `${(pts[peak][1] / H) * 100}%` }}
        className={clsx(
          'absolute top-(--y) left-(--x) size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-2',
          purple ? 'bg-white shadow-[0_0_0_4px_rgba(124,92,191,0.35),0_0_14px_rgba(124,92,191,0.9)]' : 'bg-amber',
        )}
      />
    </div>
  )
}
