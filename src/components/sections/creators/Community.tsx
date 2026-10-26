'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Accent } from '@/components/type/Accent'
import { Eyebrow } from '@/components/type/Type'
import { APPLY_URL } from '@/lib/links'
import { useReduce } from '@/lib/motion'
import { MERCH } from '@/lib/merch'

interface Chip {
  icon: string
  tone: string
  title: string
  sub: string
  /** Where it sits over the photo, overhanging an edge on desktop. */
  place: string
  /** Seconds its bob is offset by, so the three never move together. */
  phase: number
}

/**
 * What a live drop looks like from the creator's side: people buying, stock
 * going, parcels landing. Only things the product does — no follower counts,
 * no comments, no money.
 */
const CHIPS: Chip[] = [
  {
    icon: 'lucide:shopping-bag',
    tone: 'bg-pink/15 text-pink-deep',
    title: '@tobi just copped',
    sub: `${MERCH.tee.name} · size M · your drop`,
    place: 'left-3 top-4 md:-left-10 md:top-16',
    phase: 0,
  },
  {
    icon: 'lucide:flame',
    tone: 'bg-amber/20 text-amber-deep',
    title: `${MERCH.cap.name} are going fast`,
    sub: '9 left · The Mascot Drop',
    place: 'bottom-4 left-1/2 -translate-x-1/2 md:bottom-12 md:left-[38%] md:translate-x-0',
    phase: 1.1,
  },
  {
    icon: 'lucide:package-check',
    tone: 'bg-teal/15 text-teal-deep',
    title: 'Delivered to Ada in Yaba',
    sub: 'Tracked the whole way',
    place: 'right-3 top-[38%] md:-right-10 md:top-10',
    phase: 2.2,
  },
]

/**
 * Chapter — community. A drop as a moment your people rally round, on a wide
 * photo with the drop's live moments floating over it; then a statement row.
 */
export function Community() {
  const reduce = useReduce()

  return (
    <Chapter ground="ink" id="community" className="py-section">
      <Container>
        <header className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-5 text-amber">Community</Eyebrow>
            <h2 className="text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-bone">
              <span className="block">Followers in.</span> <Accent className="inline-block text-metallic">A crew out.</Accent>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <p className="max-w-[34rem] text-base leading-relaxed text-bone/65">
              A drop gives your people a reason to show up together — and every piece they wear puts your name in front
              of someone new. That’s engagement you can see on the street, not just in your notifications.
            </p>
          </Reveal>
        </header>

        <Reveal>
          <div className="relative md:mx-10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[16/10] md:aspect-[16/7]">
              <Image
                src="/assets/creators-matching-fits.jpg"
                alt="Two friends in matching colour-block jackets laughing as they take a selfie together"
                fill
                sizes="(max-width: 767px) 100vw, 1240px"
                className="object-cover object-[45%_35%]"
              />
            </div>

            {CHIPS.map((chip, i) => (
              <motion.div
                key={chip.title}
                className={clsx('absolute z-10', chip.place)}
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.25 + i * 0.22 }}
              >
                {/* The bob lives on an inner layer, so it never fights the entrance. */}
                <motion.div
                  animate={reduce ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, delay: chip.phase }}
                  className="flex w-[15.5rem] items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-[0_2px_6px_rgba(10,10,11,0.1),0_18px_40px_rgba(10,10,11,0.28)] md:w-[18rem]"
                >
                  <span className={clsx('flex size-10 shrink-0 items-center justify-center rounded-full', chip.tone)}>
                    <Icon icon={chip.icon} width={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-ink">{chip.title}</span>
                    <span className="block text-[12px] text-muted-on-light">{chip.sub}</span>
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* The statement row. */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col gap-6 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-12">
            <div className="flex items-start gap-5">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-[38%] bg-lime text-ink md:size-20">
                <Icon icon="lucide:users-round" width={30} aria-hidden="true" />
              </span>
              <div>
                <h3 className="mb-2 text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight font-semibold tracking-[-0.02em] text-bone">
                  Every drop grows the crew
                </h3>
                <p className="max-w-[40rem] text-base leading-relaxed text-bone/60">
                  Drops are moments. Your people rally, cop together and turn up wearing it — the kind of buzz a single
                  post can’t buy, and the reason they’ll be first in line for the next one.
                </p>
              </div>
            </div>
            <a
              href={APPLY_URL}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-bone/15 bg-bone/5 px-6 py-4 font-semibold text-bone transition duration-150 ease-out-expo hover:bg-bone/10 md:self-auto"
            >
              Start your first drop
              <Icon icon="lucide:chevron-right" width={18} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </Container>
    </Chapter>
  )
}
