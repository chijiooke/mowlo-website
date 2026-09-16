'use client'

import { useRef } from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { backOut, motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { MowloLogo } from '@/components/MowloLogo'
import { Eyebrow } from '@/components/type/Type'
import { SplitReveal } from '@/components/type/SplitReveal'
import { button } from '@/components/ui/button'
import { WaitlistCTA } from '@/components/WaitlistForm'
import { useReduce } from '@/lib/motion'
import { track } from '@/lib/scroll/useSectionProgress'
import { useMediaQuery } from '@/lib/useMediaQuery'

/* Play first — Android is the bigger platform in both markets. Markers, not
   links: there is nothing to point at yet. */
const STORES = [
  { icon: 'logos:google-play-icon', name: 'Google Play' },
  { icon: 'logos:apple-app-store', name: 'App Store' },
]

/* Sample account figures for the mock screen. Counts only — no money. */
const STATS = [
  { value: '14', label: 'Orders placed' },
  { value: '940', label: 'Items delivered' },
]

const ORDER_STAGES = ['Received', 'Printing', 'Packed', 'Delivery']

const PAST_ORDERS = [
  { name: '250 business cards', meta: 'Delivered 12 Mar', dot: 'bg-teal' },
  { name: '50 A5 flyers', meta: 'Delivered 28 Feb', dot: 'bg-pink' },
]

type Point = [number, number]

interface PopCard {
  icon: string
  tone: string
  title: string
  body: string
  /** Where the card lands, in px from the phone's centre. */
  wide: Point
  narrow: Point
  /** Progress over which it flies out. */
  range: [number, number]
}

/** What the phone throws out once it has landed, one after another. */
const CARDS: PopCard[] = [
  { icon: 'lucide:package-check', tone: 'bg-teal/15 text-teal-deep', title: 'Out for delivery', body: '100 stickers · arriving today', wide: [-250, -190], narrow: [-64, -232], range: [0.42, 0.56] },
  { icon: 'lucide:repeat-2', tone: 'bg-amber/20 text-amber-deep', title: 'Reorder in one tap', body: '250 business cards · running low?', wide: [250, -100], narrow: [64, -140], range: [0.5, 0.64] },
  { icon: 'lucide:badge-check', tone: 'bg-pink/15 text-pink-deep', title: 'Proof approved', body: 'Your flyers are going to print', wide: [-260, 130], narrow: [-64, 150], range: [0.58, 0.72] },
  { icon: 'lucide:palette', tone: 'bg-purple/15 text-purple-deep', title: 'Brand kit saved', body: 'Logo, colours and fonts, ready to reuse', wide: [236, 220], narrow: [64, 240], range: [0.66, 0.8] },
]

/**
 * Chapter — the Mobile app. A pinned beat: the phone flies up spinning,
 * shows its amber back as it turns, lands, and throws out the notifications
 * it will send you.
 *
 * Desktop pins the whole chapter; a phone pins only the phone, below the pitch,
 * because both will not fit one screen.
 */
export function MobileApp() {
  const wideTrack = useRef<HTMLDivElement>(null)
  const narrowTrack = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 768px)')
  const reduce = useReduce()

  const { scrollYProgress: wideProgress } = useScroll({ target: wideTrack, offset: ['start start', 'end end'] })
  const { scrollYProgress: narrowProgress } = useScroll({ target: narrowTrack, offset: ['start start', 'end end'] })
  const landed = useMotionValue(1)
  const progress = reduce ? landed : wide ? wideProgress : narrowProgress

  return (
    <Chapter ground="cream" pattern="halftone" id="app" className="pb-section md:pb-0">
      <div ref={wideTrack} className="relative md:h-[250vh] motion-reduce:md:h-auto">
        <div className="md:sticky md:top-0 md:flex md:h-svh md:items-center motion-reduce:md:static motion-reduce:md:h-auto">
          <Container className="grid items-center gap-6 pt-section md:grid-cols-2 md:gap-12 md:pt-0 motion-reduce:md:py-section">
            <Pitch />
            <div ref={narrowTrack} className="relative h-[200vh] md:h-auto motion-reduce:h-auto">
              <div className="sticky top-0 flex h-svh items-center justify-center md:static md:h-[680px] motion-reduce:static motion-reduce:h-[640px]">
                <PhoneStage progress={progress} wide={wide} />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Chapter>
  )
}

function Pitch() {
  return (
    <div>
      <Eyebrow className="mb-5 text-teal-deep">Mobile app</Eyebrow>
      <SplitReveal
        lines={['The', 'Mowlo app', <span key="hi" className="text-teal-deep">is coming.</span>]}
        className="mb-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-extrabold font-condensed leading-[0.88] tracking-[-0.04em]"
      />
      <p className="mb-7 max-w-[28rem] text-base leading-relaxed text-muted-on-light md:text-lg">
        Everything you run on Mowlo today — reordering, proofing, tracking — built for the phone you already run your
        business from.
      </p>

      <div className="mb-8 flex flex-wrap gap-2.5">
        {STORES.map(s => (
          <span
            key={s.name}
            className="inline-flex items-center gap-3 rounded-2xl border border-ink/10 bg-white py-2.5 pr-5 pl-3.5 text-sm font-bold text-ink shadow-[0_2px_5px_rgba(10,10,11,0.05)]"
          >
            <Icon icon={s.icon} width={24} aria-hidden="true" />
            <span className="leading-tight">
              <small className="block text-[10px] font-semibold text-muted-on-light">Coming soon to</small>
              {s.name}
            </span>
          </span>
        ))}
      </div>

      <div className="flex flex-col items-start gap-3">
        <WaitlistCTA className={button.ink} source="mobile-app" label="Join the waitlist →" />
        <p className="max-w-[21rem] text-[13px] leading-snug text-muted-on-light">
          Android first, iOS right behind it. One message the day it drops — nothing else.
        </p>
      </div>
    </div>
  )
}

/** Decorative: the pitch carries the meaning. */
function PhoneStage({ progress, wide }: { progress: MotionValue<number>; wide: boolean }) {
  const y = useTransform(progress, ...track([0, 0.36], ['75vh', '0vh']))
  // One and a half turns, so the amber back flashes past twice before it lands.
  const rotateY = useTransform(progress, ...track([0, 0.36], [-540, 0]))
  const rotateZ = useTransform(progress, ...track([0, 0.36], [-18, 0]))
  const scale = useTransform(progress, ...track([0, 0.36], [0.55, 1]))
  const shadowScale = useTransform(progress, ...track([0.18, 0.36], [0.35, 1]))
  const shadowOpacity = useTransform(progress, ...track([0.18, 0.36], [0, 1]))

  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center [perspective:1400px]">
      <motion.div
        style={{ scaleX: shadowScale, opacity: shadowOpacity }}
        className="absolute bottom-[12%] h-8 w-56 rounded-[50%] bg-ink/25 blur-xl md:bottom-[6%]"
      />

      <motion.div style={{ y, rotateY, rotateZ, scale }} className="relative [transform-style:preserve-3d]">
        <PhoneFront progress={progress} />
        <PhoneBack />
      </motion.div>

      {CARDS.map((card, i) => (
        <FlyingCard key={card.title} card={card} index={i} progress={progress} wide={wide} />
      ))}
    </div>
  )
}

const FACE = '[-webkit-backface-visibility:hidden] [backface-visibility:hidden]'

function PhoneFront({ progress }: { progress: MotionValue<number> }) {
  const toastOpacity = useTransform(progress, ...track([0.36, 0.44], [0, 1]))
  const toastY = useTransform(progress, ...track([0.36, 0.44], [-16, 0]))

  return (
    <div
      className={clsx(
        'relative h-[492px] w-[244px] rounded-[41px] bg-linear-160 from-ink-3 to-ink p-2.5 shadow-[0_44px_90px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] md:h-[552px] md:w-[274px] md:rounded-[46px] md:p-[11px]',
        FACE,
      )}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-ink text-bone md:rounded-[36px]">
        <div className="absolute top-2 left-1/2 z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />

        <div className="flex items-center justify-between px-5 pt-3.5 text-[10px] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Icon icon="lucide:signal-high" width={11} />
            <Icon icon="lucide:wifi" width={11} />
            <Icon icon="lucide:battery-full" width={13} />
          </span>
        </div>

        <div className="border-b border-bone/10 px-4 py-3">
          <div className="text-[10.5px] text-muted">Welcome back</div>
          <div className="font-display text-lg font-extrabold tracking-[-0.02em]">Your brand</div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 px-3 pt-12 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {STATS.map(s => (
              <div key={s.label} className="rounded-[14px] border border-bone/10 bg-ink-2 px-3 py-2.5">
                <div className="font-display text-base font-extrabold tracking-[-0.03em]">{s.value}</div>
                <div className="text-[9.5px] text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-teal/25 bg-teal/10 px-3 py-3">
            <div className="mb-1 text-[9px] font-bold tracking-[0.08em] text-muted uppercase">Order #4192</div>
            <div className="text-[12.5px] font-semibold">100 product stickers</div>
            <div className="mt-2.5 flex gap-1">
              {ORDER_STAGES.map((s, i) => (
                <span key={s} className={clsx('h-1 flex-1 rounded-full', i < 3 ? 'bg-teal' : 'bg-bone/10')} />
              ))}
            </div>
            <div className="mt-1.5 flex text-[7.5px] font-semibold text-muted">
              {ORDER_STAGES.map((s, i) => (
                <span key={s} className={clsx('flex-1', i === 2 && 'text-teal')}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-bone/10 bg-ink-2 px-3 py-3">
            <div className="mb-1 text-[9px] font-bold tracking-[0.08em] text-muted uppercase">Order again</div>
            <ul className="mt-2 flex flex-col gap-2">
              {PAST_ORDERS.map(o => (
                <li key={o.name} className="flex items-center gap-2">
                  <span className={clsx('size-[7px] shrink-0 rounded-full', o.dot)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11.5px] font-semibold">{o.name}</div>
                    <div className="text-[9px] text-muted">{o.meta}</div>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber/30 bg-amber/15 px-2 py-1 text-[9.5px] font-bold text-amber">
                    Reorder
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-around border-t border-bone/10 bg-ink-2 pt-3 pb-4 text-muted">
          <Icon icon="lucide:house" width={19} className="text-amber" />
          <Icon icon="lucide:image" width={19} />
          <span className="-mt-6 flex size-[42px] items-center justify-center rounded-full bg-amber text-ink shadow-[0_8px_22px_rgba(245,166,35,0.45)]">
            <Icon icon="lucide:plus" width={21} />
          </span>
          <Icon icon="lucide:receipt-text" width={19} />
          <Icon icon="lucide:user" width={19} />
        </div>

        <motion.div
          style={{ opacity: toastOpacity, y: toastY }}
          className="absolute top-[94px] right-3 left-3 z-10 flex items-center gap-2 rounded-[14px] border border-bone/15 bg-ink-3/95 px-3 py-2 shadow-[0_12px_26px_rgba(0,0,0,0.55)] md:top-[104px]"
        >
          <MowloLogo size={18} />
          <span className="text-[11.5px] font-semibold">Your brand kit is saved</span>
        </motion.div>
      </div>
    </div>
  )
}

/** The back of the phone — amber, mascot, camera. Only seen mid-spin. */
function PhoneBack() {
  return (
    <div
      className={clsx(
        'absolute inset-0 flex items-center justify-center rounded-[41px] bg-linear-160 from-amber-hi to-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] [transform:rotateY(180deg)] md:rounded-[46px]',
        FACE,
      )}
    >
      <span className="absolute top-5 left-5 grid size-[4.5rem] grid-cols-2 place-items-center gap-1 rounded-[1.4rem] bg-ink/12 p-2">
        <span className="size-5 rounded-full bg-ink/80 ring-2 ring-ink/20" />
        <span className="size-5 rounded-full bg-ink/80 ring-2 ring-ink/20" />
        <span className="size-5 rounded-full bg-ink/80 ring-2 ring-ink/20" />
        <span className="size-2 rounded-full bg-bone/70" />
      </span>
      <MowloLogo size={92} />
    </div>
  )
}

function FlyingCard({ card, index, progress, wide }: { card: PopCard; index: number; progress: MotionValue<number>; wide: boolean }) {
  const [toX, toY] = wide ? card.wide : card.narrow
  const [start, end] = card.range
  const side = index % 2 ? 1 : -1

  // backOut overshoots and settles: the card pops rather than slides.
  const x = useTransform(progress, ...track([start, end], [0, toX]), { ease: backOut })
  const flyY = useTransform(progress, ...track([start, end], [0, toY]), { ease: backOut })
  const drift = useTransform(progress, ...track([end, 1], [0, side * 14]))
  const y = useTransform([flyY, drift], ([a, b]: number[]) => a + b)
  const scale = useTransform(progress, ...track([start, end], [0.3, 1]), { ease: backOut })
  const rotate = useTransform(progress, ...track([start, end], [side * 28, side * 3]))
  const opacity = useTransform(progress, ...track([start, start + 0.03], [0, 1]))

  return (
    <motion.div
      style={{ x, y, scale, rotate, opacity }}
      className="absolute top-1/2 left-1/2 z-10 flex w-[13rem] -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-2xl border border-ink/10 bg-white p-3 shadow-[0_2px_6px_rgba(10,10,11,0.08),0_18px_40px_rgba(10,10,11,0.16)] md:w-[15rem]"
    >
      <span className={clsx('flex size-8 shrink-0 items-center justify-center rounded-[10px]', card.tone)}>
        <Icon icon={card.icon} width={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-ink">{card.title}</span>
        <span className="block text-[11px] leading-snug text-muted-on-light">{card.body}</span>
      </span>
    </motion.div>
  )
}
