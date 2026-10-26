'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/type/Type'
import { Handset } from '@/components/ui/Handset'
import { PillPattern } from '@/components/ui/PillPattern'
import { Stamp } from '@/components/ui/Stamp'
import { useReduce } from '@/lib/motion'
import { CreatorScreen } from './CreatorScreen'

/** Where a creator's people already are. Marks only — no follower counts or brands' claims. */
const SOCIALS = [
  { icon: 'ri:instagram-line', name: 'Instagram' },
  { icon: 'ri:tiktok-line', name: 'TikTok' },
  { icon: 'ri:twitter-x-line', name: 'X' },
  { icon: 'ri:whatsapp-line', name: 'WhatsApp' },
  { icon: 'ri:snapchat-line', name: 'Snapchat' },
]

/**
 * A drop's money, start to finish: half at close, the rest once every paid
 * order is delivered (mowlo-api creator-settlement.service). No figures — the
 * markup share is still open (PRD-002 Q1) and prices are banned.
 */
const TIMELINE: { when: string; what: string; icon: string; dot: string; payout?: 1 | 2 }[] = [
  { when: 'Drop goes live', what: 'Your people order. You watch the count climb.', icon: 'lucide:radio', dot: 'bg-pink text-ink' },
  { when: 'Drop closes', what: 'The first half of your earnings lands in your wallet.', icon: 'lucide:lock-keyhole-open', dot: 'bg-amber text-ink', payout: 1 },
  { when: 'Every order delivered', what: 'The other half lands. That drop’s done — run it back.', icon: 'lucide:package-check', dot: 'bg-teal text-ink', payout: 2 },
]

/** White on cream, told apart by tone alone — the Quality grid's card. */
const CARD = 'rounded-[2rem] bg-white'

/**
 * Chapter — getting paid, on the Quality chapter's grid: the creator's own
 * screen on the left, their audience in the middle, the money on the right.
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
              You already did the hard part — building the audience. A drop turns the people who rock with you into
              buyers: you set the price, production comes out of each sale, and you earn on everything above it.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {/* The creator's own screen, cropped by the card the way Quality crops the fan's. */}
          <Reveal className="md:row-span-2">
            {/* Pink capsule pattern behind the phone: the loud panel in a calm grid. */}
            <div className="relative h-full min-h-[26rem] overflow-hidden rounded-[2rem] bg-pink text-pink-deep md:min-h-[36rem]">
              <PillPattern />
              <div aria-hidden="true" className="absolute right-[-12%] bottom-12 md:right-[-18%] md:bottom-14">
                <div className="origin-bottom scale-[1.25] md:scale-[1.55]">
                  <Handset>
                    <CreatorScreen />
                  </Handset>
                </div>
              </div>
              {/* Top corner: the phone's payouts sit low in the card and must stay readable. */}
              <Stamp
                text="Your clout · Your cut ·"
                icon="lucide:sparkles"
                className="absolute top-6 left-5 size-28 md:top-8 md:left-8 md:size-36"
              />
            </div>
          </Reveal>

          {/* The audience: a photo with the line over it. */}
          <Reveal delay={0.06}>
            <figure className={clsx(CARD, 'relative h-full min-h-[18rem] overflow-hidden md:min-h-[16rem]')}>
              <Image
                src="/assets/happy-mowlo.jpg"
                alt="A smiling woman filming herself on her phone in a shop"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1320px) 33vw, 420px"
                className="object-cover object-[40%_30%]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[1.2rem] leading-snug font-semibold text-white">
                  Your clout does the selling. <span className="text-white/65">No ads needed.</span>
                </p>
                <ul className="mt-3 flex gap-2.5" aria-label="Post your drop where your people already are">
                  {SOCIALS.map(s => (
                    <li key={s.name} className="flex size-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                      <Icon icon={s.icon} width={16} aria-label={s.name} />
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </Reveal>

          {/* The money, as the drop's own timeline. */}
          <Reveal delay={0.12} className="md:row-span-2">
            <article className={clsx(CARD, 'flex h-full flex-col p-7')}>
              <h3 className="mb-7 text-[1.35rem] leading-snug font-semibold tracking-[-0.01em] text-ink">
                Two payouts. <span className="text-muted-on-light">Every drop.</span>
              </h3>
              <ol className="relative flex flex-1 flex-col gap-7">
                {/* The thread the steps hang from. */}
                <span aria-hidden="true" className="absolute top-5 bottom-5 left-5 w-px bg-ink/10" />
                {TIMELINE.map(step => (
                  <li key={step.when} className="relative flex items-start gap-4">
                    <span className={clsx('relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full', step.dot)}>
                      <Icon icon={step.icon} width={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-ink">{step.when}</span>
                          <span className="block text-[14px] leading-snug text-muted-on-light">{step.what}</span>
                        </span>
                        {step.payout && <Share payout={step.payout} />}
                      </span>
                      {step.payout && <Halves payout={step.payout} />}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 rounded-[1.25rem] bg-cream p-5">
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

          {/* The buyer: the other end of your cut. */}
          <Reveal delay={0.18}>
            <figure className={clsx(CARD, 'relative h-full min-h-[18rem] overflow-hidden md:min-h-[16rem]')}>
              <Image
                src="/assets/creators-shopping-haul.jpg"
                alt="A smiling man in a sharp suit holding up shopping bags in both hands"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1320px) 33vw, 420px"
                className="object-cover object-[50%_30%]"
              />
            </figure>
          </Reveal>
        </div>
      </Container>
    </Chapter>
  )
}

/**
 * A payout's share, set big: "50%" in the display face, the number counting
 * up from nothing as it comes into view, and "of earnings" tucked under it.
 * Tabular figures, so the width holds while it counts.
 */
function Share({ payout }: { payout: 1 | 2 }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 1 })
  const reduce = useReduce()
  const count = useMotionValue(reduce ? 50 : 0)
  const shown = useTransform(count, v => String(Math.round(v)))

  useEffect(() => {
    if (!inView || reduce) return
    const run = animate(count, 50, { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: payout === 1 ? 0.1 : 0.35 })
    return () => run.stop()
  }, [inView, reduce, count, payout])

  return (
    <span ref={ref} className="shrink-0 text-right" aria-label="50% of your earnings">
      <span
        aria-hidden="true"
        className={clsx(
          'block font-display text-[2.6rem] leading-[0.85] font-extrabold font-semicondensed tracking-[-0.04em] tabular-nums',
          payout === 1 ? 'text-amber-deep' : 'text-teal-deep',
        )}
      >
        <motion.span>{shown}</motion.span>
        <span className="ml-[0.04em] text-[0.62em] tracking-normal">%</span>
      </span>
      <span aria-hidden="true" className="mt-1 block text-[11px] font-semibold tracking-wide text-muted-on-light uppercase">
        of earnings
      </span>
    </span>
  )
}

/**
 * The whole of a drop's earnings as one bar in two halves. The first payout
 * fills the first half; the second fills the rest, so the bar reads complete.
 */
function Halves({ payout }: { payout: 1 | 2 }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 1 })
  const reduce = useReduce()
  const grow = { initial: reduce ? false : { scaleX: 0 }, animate: inView || reduce ? { scaleX: 1 } : undefined }

  return (
    <span ref={ref} aria-hidden="true" className="mt-3 grid grid-cols-2 gap-1">
      <span className="block h-2 overflow-hidden rounded-l-full rounded-r-[3px] bg-ink/8">
        <motion.span
          {...grow}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="block h-full origin-left bg-amber"
        />
      </span>
      <span className="block h-2 overflow-hidden rounded-l-[3px] rounded-r-full bg-ink/8">
        {payout === 2 && (
          <motion.span
            {...grow}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="block h-full origin-left bg-teal"
          />
        )}
      </span>
    </span>
  )
}
