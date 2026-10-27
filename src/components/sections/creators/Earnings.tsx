'use client'

import { useRef } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, useInView } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Accent } from '@/components/type/Accent'
import { Eyebrow } from '@/components/type/Type'
import { useReduce } from '@/lib/motion'
import { Handset } from '@/components/ui/Handset'
import { ArtistStatsScreen } from '@/components/sections/artists/ArtistStatsScreen'

/**
 * How little it takes to run one: three steps, each in its own brand colour
 * and tipped a little either way, like notes stuck down in a hurry.
 */
const EASY = [
  { icon: 'lucide:upload', text: 'Upload your design', note: 'We can also help', tone: 'bg-teal', tilt: -2 },
  { icon: 'lucide:tag', text: 'Set a price and drop duration', note: 'Your price, your timer', tone: 'bg-pink', tilt: 1.5 },
  { icon: 'lucide:link', text: 'Post the link', note: 'Your people do the rest', tone: 'bg-sky', tilt: -1 },
]

/** Why there's no downside. */
const NOTHING_TO_LOSE = [
  'No stock to buy',
  'No fee to open a drop',
  'No boxes of unsold merch',
  'Nothing printed until it sells',
]

const CARD = 'rounded-[2rem]'

/**
 * Chapter — getting paid. Its own shape, unlike Quality's phone-and-list
 * grid: a wide photo on the money (the bread) beside the two payouts as a
 * single bar, then three short cards on how the money splits, how easy a drop
 * is, and why there's nothing to lose.
 */
export function Earnings() {
  return (
    <Chapter ground="cream" pattern="grain" id="paid" className="py-section">
      <Container>
        <header className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-5 text-ink/55">Getting paid</Eyebrow>
            <h2 className="text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
              <span className="block">Your clout.</span> <span className="block text-muted-on-light">Your cut.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <p className="max-w-[34rem] text-base leading-relaxed text-muted-on-light">
              You already did the hard part: building the audience. A drop turns the people who rock with you into
              buyers: you set the price, production cost comes out of each sale, and you earn on everything above it.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-6 md:grid-cols-12 md:gap-7">
          {/* The bread: the photo carries the line, with a money-bag sticker slapped on the corner. */}
          <Reveal className="relative md:col-span-7">
            <figure className={clsx(CARD, 'relative h-full min-h-[22rem] overflow-hidden bg-sky md:min-h-[28rem]')}>
              <Image
                src="/assets/creators-bread.jpg"
                alt="A young woman in a blue jumper hugging a basket of fresh bread and blowing a kiss"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1320px) 58vw, 760px"
                className="object-cover object-[52%_30%]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <p className="text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-white">
                  Get that <Accent>bread</Accent> in.
                </p>
                <p className="mt-2 max-w-[28rem] text-[15px] leading-relaxed text-white/75">
                  Every piece your people cop puts money in your wallet. Not ours, not a brand’s. Yours.
                </p>
              </figcaption>
            </figure>
            <NairaSticker />
          </Reveal>

          {/* The two payouts, as one bar. */}
          <Reveal delay={0.08} className="md:col-span-5">
            <article className={clsx(CARD, 'flex h-full flex-col justify-between bg-white p-7 md:p-9')}>
              <div>
                <h3 className="text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                  Paid in two halves. <span className="text-muted-on-light">Every drop.</span>
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-on-light">
                  One bar is your earnings on the drop. Here’s when each half lands.
                </p>
              </div>
              <PayoutBar />
              <div className="rounded-[1.25rem] bg-cream p-5">
                <div className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <Icon icon="lucide:trending-up" width={17} aria-hidden="true" />
                  Bigger drop, bigger bonus
                </div>
                <p className="text-[14px] leading-snug text-muted-on-light">
                  We quote production at the small-batch rate. If your run costs less to make, the difference is yours.
                </p>
              </div>
            </article>
          </Reveal>

          {/* The money side of the app: half a phone, cut off by the card. */}
          <Reveal delay={0.06} className="relative md:col-span-4">
            <article className={clsx(CARD, 'relative h-full min-h-[30rem] overflow-hidden bg-white p-7')}>
              <h3 className="relative z-10 text-[1.25rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                Watch it land.
              </h3>
              <p className="relative z-10 mt-1 text-[15px] leading-relaxed text-muted-on-light">Earnings, wallet and stock, live.</p>
              <div aria-hidden="true" className="absolute top-36 left-1/2 -translate-x-1/2">
                <Handset>
                  <ArtistStatsScreen />
                </Handset>
              </div>
            </article>
            <ChaChing />
          </Reveal>

          {/* How easy it is. */}
          <Reveal delay={0.12} className="md:col-span-4">
            <article className={clsx(CARD, 'flex h-full flex-col bg-amber p-7')}>
              <span className="mb-5 flex size-10 items-center justify-center rounded-full bg-ink text-amber">
                <Icon icon="lucide:zap" width={19} aria-hidden="true" />
              </span>
              <h3 className="text-[1.25rem] leading-snug font-semibold tracking-[-0.01em] text-ink">Three steps, then you’re live</h3>
              <EasySteps />
            </article>
          </Reveal>

          {/* Nothing to lose. */}
          <Reveal delay={0.18} className="md:col-span-4">
            <article className={clsx(CARD, 'h-full bg-ink p-7 text-bone')}>
              <Icon icon="lucide:shield-check" width={22} className="mb-5 text-amber" aria-hidden="true" />
              <h3 className="mb-2 text-[1.25rem] leading-snug font-semibold tracking-[-0.01em]">
                Nothing to <Accent>lose</Accent>
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {NOTHING_TO_LOSE.map(item => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-bone/80">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
                      <Icon icon="lucide:check" width={14} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </Container>
    </Chapter>
  )
}

/**
 * The three steps as coloured notes that pop in one after another and lean a
 * little each way, joined by a dashed line, ending on a pulsing "You're live".
 */
function EasySteps() {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReduce()
  const shown = inView || reduce

  return (
    <>
      <ol ref={ref} className="relative mt-6 flex flex-col gap-3">
        {/* The thread through the steps. */}
        <span aria-hidden="true" className="absolute top-6 bottom-6 left-[1.625rem] border-l-2 border-dashed border-ink/25" />
        {EASY.map((step, i) => (
          <motion.li
            key={step.text}
            style={{ ['--tilt' as string]: `${step.tilt}deg` }}
            className={clsx(
              'relative flex rotate-(--tilt) items-center gap-3 rounded-2xl px-3 py-2.5 text-ink shadow-[0_8px_18px_rgba(10,10,11,0.16)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-0.5',
              step.tone,
            )}
            initial={reduce ? false : { opacity: 0, scale: 0.7, y: 16 }}
            animate={shown ? { opacity: 1, scale: 1, y: 0 } : undefined}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 + i * 0.18 }}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[13px] font-extrabold text-bone tabular-nums">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-tight font-semibold">{step.text}</span>
              <span className="block text-[12.5px] text-ink/65">{step.note}</span>
            </span>
            <Icon icon={step.icon} width={18} className="shrink-0" aria-hidden="true" />
          </motion.li>
        ))}
      </ol>
      <motion.div
        className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-ink px-4 py-2 text-[14px] font-bold text-bone"
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={shown ? { opacity: 1, scale: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.75 }}
      >
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-75 motion-reduce:animate-none" />
          <span className="relative size-2.5 rounded-full bg-lime" />
        </span>
        You’re live
      </motion.div>
    </>
  )
}

/**
 * A sale landing, as a green notification stuck over the card's top-right
 * corner: it drops in when the card comes into view, then gives a little shake every few seconds, the
 * way a till rings.
 */
function ChaChing() {
  const reduce = useReduce()
  return (
    <motion.div
      aria-hidden="true"
      className="absolute -top-5 right-3 z-10 w-[14.5rem] rotate-3"
      initial={reduce ? false : { opacity: 0, y: -30, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
    >
      <motion.div
        animate={reduce ? undefined : { rotate: [0, -3, 3, -2, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.2, delay: 1.4 }}
        className="flex items-center gap-2 rounded-xl bg-teal p-2 pr-3 text-ink shadow-[0_2px_5px_rgba(10,10,11,0.12),0_12px_24px_rgba(10,10,11,0.26)]"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[0.55rem] bg-ink text-teal">
          <Icon icon="lucide:banknote" width={14} />
        </span>
        <span className="min-w-0">
          <span className="block text-[8px] font-semibold tracking-[0.04em] text-ink/60 uppercase">Mowlo · now</span>
          <span className="block font-display text-[12.5px] leading-tight font-extrabold">Cha-ching! +₦12,500</span>
          <span className="block text-[9.5px] text-ink/70">Framed print sold · Space Boy</span>
        </span>
      </motion.div>
    </motion.div>
  )
}

/**
 * The money bag, its $ redrawn as ₦, as a round sticker slapped over the
 * bread card's top corner: it spins in, then sits slightly tipped.
 */
function NairaSticker() {
  const reduce = useReduce()
  return (
    <motion.div
      aria-hidden="true"
      className="absolute -top-6 -right-3 z-10 size-28 overflow-hidden rounded-full bg-white shadow-[0_12px_24px_rgba(10,10,11,0.25)] ring-4 ring-white md:-top-8 md:-right-6 md:size-36"
      initial={reduce ? false : { scale: 0.3, rotate: -60, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 10, opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: 'spring', stiffness: 240, damping: 13, delay: 0.3 }}
    >
      <Image src="/assets/creators-naira-bag.png" alt="" fill sizes="144px" className="scale-[1.18] object-cover object-[50%_52%]" />
    </motion.div>
  )
}

/**
 * The drop's earnings as one bar in two halves, each half labelled 50% inside
 * it and filling in turn — amber at close, teal once everything's delivered.
 */
function PayoutBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const reduce = useReduce()
  const halves = [
    { label: 'When the drop closes', icon: 'lucide:lock-keyhole-open', fill: 'bg-amber', delay: 0.15 },
    { label: 'When every order’s delivered', icon: 'lucide:package-check', fill: 'bg-teal', delay: 0.6 },
  ]
  return (
    <div ref={ref} className="my-8">
      <div className="grid grid-cols-2 gap-1.5">
        {halves.map((half, i) => (
          <div
            key={half.label}
            className={clsx('relative h-14 overflow-hidden bg-ink/8', i === 0 ? 'rounded-l-2xl rounded-r-md' : 'rounded-l-md rounded-r-2xl')}
          >
            <motion.span
              aria-hidden="true"
              className={clsx('absolute inset-0 block origin-left', half.fill)}
              initial={reduce ? false : { scaleX: 0 }}
              animate={inView || reduce ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: half.delay }}
            />
            <span className="relative flex h-full items-center justify-center font-display text-[1.6rem] font-extrabold tracking-[-0.03em] text-ink">
              50%
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {halves.map(half => (
          <div key={half.label} className="flex items-start gap-2 text-[13px] leading-snug font-semibold text-ink">
            <Icon icon={half.icon} width={15} className="mt-[1px] shrink-0" aria-hidden="true" />
            {half.label}
          </div>
        ))}
      </div>
    </div>
  )
}
