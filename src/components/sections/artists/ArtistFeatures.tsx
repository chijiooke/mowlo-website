'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Accent } from '@/components/type/Accent'
import { Eyebrow } from '@/components/type/Type'
import { OrdersCard } from './OrdersCard'
import { Receipt } from './Receipt'

const CARD = 'rounded-[2rem]'

/**
 * Chapter — what Artist's Corner gives you, as a bento: the framed print in a
 * timed drop (the painter carries it) beside what it costs to start and how
 * each drop is doing.
 */
export function ArtistFeatures() {
  return (
    <Chapter ground="white" id="features" className="py-section">
      <Container>
        <header className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-5 text-ink/55">Artist’s Corner</Eyebrow>
            <h2 className="text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
              <span className="block">Your work.</span> <span className="block text-muted-on-light">On their walls.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <p className="max-w-[34rem] text-base leading-relaxed text-muted-on-light">
              Upload a piece, choose how many exist and how long the drop runs. Collectors order while it’s open; we
              print, frame and deliver every one, and you get paid.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-6 md:grid-cols-12 md:gap-7">
          {/* Framed prints in timed drops: the photo carries it. */}
          <Reveal className="md:col-span-5">
            <figure className={clsx(CARD, 'relative h-full min-h-[26rem] overflow-hidden bg-ink-3 md:min-h-0')}>
              <Image
                src="/assets/artists-painter.jpg"
                alt="A painter in a black apron mixing colour on a palette beside his easel"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1320px) 42vw, 540px"
                className="object-cover object-[55%_18%]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-transparent" />
              {/* The drop's two limits: how long it runs, and how many exist. */}
              <span className="absolute top-6 left-6 flex items-center divide-x divide-ink/20 rounded-full bg-purple py-1.5 text-[13px] font-bold text-ink shadow-[0_6px_16px_rgba(10,10,11,0.3)]">
                <span className="flex items-center gap-1.5 px-3.5">
                  <Icon icon="lucide:timer" width={15} aria-hidden="true" />
                  7-day drop · 2d 14h left
                </span>
                <span className="flex items-center gap-1.5 px-3.5">
                  <Icon icon="lucide:layers" width={15} aria-hidden="true" />
                  Edition of 50 · 12 left
                </span>
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <p className="text-[clamp(1.7rem,2.8vw,2.4rem)] leading-[1.08] font-semibold tracking-[-0.02em] text-white">
                  Framed prints. <Accent>Limited</Accent> runs.
                </p>
                <p className="mt-3 max-w-[30rem] text-[15px] leading-relaxed text-white/75">
                  Sell your digital art as framed prints in timed drops. You set the edition size; when the timer runs
                  out or the run sells through, that’s it.
                </p>
              </figcaption>
            </figure>
          </Reveal>

          {/* Free to start: a receipt prints out and comes to nothing; the end of the roll runs off the card. */}
          <Reveal delay={0.08} className="md:col-span-7">
            <article
              className={clsx(
                CARD,
                'grid h-[30rem] grid-rows-[auto_1fr] gap-6 overflow-hidden bg-amber px-8 pt-8 text-ink md:h-[24rem] md:grid-cols-[1fr_auto] md:grid-rows-1 md:gap-10 md:pt-0 md:pl-11',
              )}
            >
              <div className="flex flex-col justify-between md:py-11">
                <Eyebrow className="text-ink/60">What it costs to start</Eyebrow>
                <p className="mt-4 font-display text-[clamp(3.25rem,5vw,4.75rem)] leading-[0.85] font-extrabold tracking-[-0.01em] uppercase font-condensed md:mt-0">
                  <span className="block">Literally</span>
                  <span className="block">nothing.</span>
                </p>
              </div>
              <div className="md:pr-11">
                <Receipt />
              </div>
            </article>
          </Reveal>

          {/* How the drop is doing, across the full width. */}
          <Reveal delay={0.14} className="md:col-span-12">
            <OrdersCard />
          </Reveal>
        </div>
      </Container>
    </Chapter>
  )
}
