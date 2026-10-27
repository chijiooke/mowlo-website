'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { LoveSticker } from './LoveSticker'
import { button } from '@/components/ui/button'
import { APPLY_URL } from '@/lib/links'
import { useReduce } from '@/lib/motion'

/**
 * Two hand-set lines on the left, leaving the right for the sticker and the
 * pitch. Capped by height so the pair and the scroll cue under it fit the
 * first screen; the second is set larger so both come out the same width.
 */
const WORDS = [
  { text: 'For living', size: 'text-[min(21vw,26svh)] md:text-[min(16.5vw,26svh)]', tone: 'text-ink' },
  { text: 'artists.', size: 'text-[min(25.8vw,32svh)] md:text-[min(20.2vw,32svh)]', tone: 'text-ink' },
]

const EASE = [0.16, 1, 0.3, 1] as const

/** Over the sculptor, one at a time: each fades in, holds, and fades out. */
const PHRASES: { key: string; text: ReactNode }[] = [
  { key: 'make', text: 'Make what you love.' },
  { key: 'for', text: 'For the people you love.' },
  {
    key: 'wallet',
    text: (
      <>
        But your <Circled>wallet</Circled> stays out of it.
      </>
    ),
  },
]

/** How far the phrase in view is through drawing its marker ring, 0 → 1. */
const DrawContext = createContext<MotionValue<number> | null>(null)

/**
 * Artist's Corner — the landing. The line in black on amber, in the home
 * landing's condensed face with crumpled paper showing through the letters,
 * set left with a sticker, the pitch and the way in beside it; then a sculptor
 * at work, pinned full-screen while three phrases fade in and out over him.
 */
export function ArtistsLanding() {
  const reduce = useReduce()
  // The cue has done its job once the page is moving.
  const { scrollY } = useScroll()
  const cue = useTransform(scrollY, [0, 160], [1, 0])

  // The photo's pinned run: 0 as it reaches the top, 1 as it lets go.
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  // A slow push in across the run, so the frame never sits dead still.
  const zoom = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.08])

  return (
    <section data-ground="amber" className="relative overflow-x-clip bg-amber pt-[68px]">
      {/* ── The line ── */}
      <Container className="relative grid items-end gap-8 pt-[4vh] pb-[3vh] md:grid-cols-[auto_1fr] md:gap-12">
        <h1 className="flex flex-col items-start font-display leading-[0.82] font-extrabold tracking-[0.005em] uppercase font-condensed">
          {WORDS.map((word, i) => (
            <motion.span
              key={word.text}
              className={clsx('relative block whitespace-nowrap', word.size, word.tone)}
              initial={reduce ? false : { opacity: 0, y: '0.3em' }}
              animate={{ opacity: 1, y: '0em' }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.14 }}
            >
              {word.text}
              {/* Crumpled paper through the letters, as on the home landing's MOWLO. Multiply
                  would vanish into black, so the sheet is inverted (white paper to
                  black, grey creases to light) and screened on: only the creases
                  show, and the type reads as crumpled black stock. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[url('/assets/paper-crumpled.jpg')] bg-[length:140%_auto] bg-center bg-clip-text text-transparent opacity-80 mix-blend-screen invert"
              >
                {word.text}
              </span>
            </motion.span>
          ))}
        </h1>

        {/* The sticker, then what it is, in a line or two. */}
        <motion.div
          className="flex flex-col items-start gap-6 md:items-end md:pb-[1.5vh] md:text-right"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        >
          <motion.div
            initial={reduce ? false : { scale: 0.3, rotate: -40 }}
            animate={{ scale: 1, rotate: -10 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.55 }}
            className="drop-shadow-[0_10px_18px_rgba(10,10,11,0.28)]"
          >
            <LoveSticker className="size-32 md:size-[min(13vw,22svh)]" />
          </motion.div>
          <div className="max-w-[24rem] text-balance">
            <p className="text-[clamp(1.25rem,1.8vw,1.6rem)] leading-tight font-semibold tracking-[-0.02em] text-ink">
              Fast, free art shops for digital artists.
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
              Make what you love. Sell it to the people who love you. Your wallet stays out of it.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              We handle everything: orders, printing, packing and delivery. Sell on Mowlo.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={APPLY_URL} className={clsx(button.ink, 'px-5 py-3 text-[15px]')}>
              Apply to sell
              <Icon icon="lucide:arrow-right" width={18} aria-hidden="true" />
            </a>
            <a href="#features" className="inline-flex items-center justify-center rounded-full border border-ink/20 px-5 py-3 text-[15px] font-semibold text-ink transition duration-150 hover:bg-ink/5">
              What you get
            </a>
          </div>
        </motion.div>
      </Container>

      {/* The home landing's scroll cue, under the line. */}
      <motion.div
        style={{ opacity: cue }}
        aria-hidden="true"
        className="flex flex-col items-center gap-3 pb-[3vw] text-eyebrow text-ink/45 uppercase motion-reduce:hidden"
      >
        Scroll
        <span className="h-10 w-px overflow-hidden bg-ink/15">
          <span className="block h-1/2 w-full animate-[scroll-cue_1.6s_var(--ease-in-out-quart)_infinite] bg-ink" />
        </span>
      </motion.div>

      {/* ── The maker: pinned, with the phrases passing over it ── */}
      <div ref={trackRef} className="relative h-[320svh] motion-reduce:h-auto">
        <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative">
          <motion.div style={{ scale: zoom }} className="absolute inset-0">
            <Image
              src="/assets/artists-sculptor.jpg"
              alt="A sculptor in a workshop shaping the face of a large clay bust"
              fill
              sizes="100vw"
              className="object-cover object-[50%_40%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/30 to-ink/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-gutter pt-[68px]">
            {PHRASES.map((phrase, i) => (
              <Phrase key={phrase.key} progress={scrollYProgress} index={i} reduce={reduce}>
                {phrase.text}
              </Phrase>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One phrase over the photo. Each gets an equal slice of the pinned run:
 * in over its first quarter, held, out over its last. Stacked in the same
 * spot, so only one reads at a time. With reduced motion they simply stack.
 */
function Phrase({ progress, index, reduce, children }: { progress: MotionValue<number>; index: number; reduce: boolean; children: ReactNode }) {
  const slice = 1 / PHRASES.length
  const from = index * slice
  const to = from + slice
  const edge = slice * 0.28
  const opacity = useTransform(progress, [from, from + edge, to - edge, to], [0, 1, 1, 0])
  const y = useTransform(progress, [from, from + edge, to - edge, to], [40, 0, 0, -40])
  const filter = useTransform(progress, [from, from + edge, to - edge, to], ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'])
  // Once the phrase has landed, any marker ring in it draws on.
  const draw = useTransform(progress, [from + edge, from + edge * 2.2], [0, 1])

  if (reduce) {
    return <p className={clsx(PHRASE, 'relative')}>{children}</p>
  }
  return (
    <DrawContext.Provider value={draw}>
      <motion.p style={{ opacity, y, filter }} className={clsx(PHRASE, 'absolute inset-x-gutter')}>
        {children}
      </motion.p>
    </DrawContext.Provider>
  )
}

/**
 * A word circled in amber marker: a loose, hand-drawn loop that overshoots
 * where it started, drawn on as its phrase lands. Without a phrase driving
 * it (reduced motion) it's simply there.
 */
function Circled({ children }: { children: ReactNode }) {
  const draw = useContext(DrawContext)
  return (
    <span className="relative mx-[0.14em] inline-block">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-[-22%] left-[-14%] h-[144%] w-[128%] overflow-visible"
      >
        <motion.path
          d="M162 14 C120 1 42 4 15 27 C-6 45 30 76 102 75 C172 74 205 52 191 28 C180 11 138 5 88 11"
          fill="none"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-amber"
          style={{ pathLength: draw ?? 1 }}
        />
      </svg>
    </span>
  )
}

/** Set like the drops page's "You drop it. They cop it.": the display face, extra bold, white over the photo. */
const PHRASE =
  'text-center font-display text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[1] font-extrabold tracking-[-0.04em] text-balance text-white drop-shadow-[0_4px_30px_rgba(10,10,11,0.45)]'

