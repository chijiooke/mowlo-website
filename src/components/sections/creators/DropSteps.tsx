'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, motionValue, transform, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Accent } from '@/components/type/Accent'
import { Eyebrow } from '@/components/type/Type'
import { button } from '@/components/ui/button'
import { APPLY_URL } from '@/lib/links'
import { useReduce } from '@/lib/motion'
import { track, useSectionProgress } from '@/lib/scroll/useSectionProgress'

interface Step {
  n: string
  /** Where the step sits against the drop's window. */
  phase: string
  title: string
  body: string
  icon: string
  tint: string
  photo: string
  alt: string
  /** How the photo is cropped, so the subject survives the card's box. */
  focus: string
  /** Where the photo's settling zoom is anchored. Centre unless the subject sits at an edge. */
  zoomFrom?: string
}

const STEPS: Step[] = [
  {
    n: '01',
    phase: 'Prep',
    title: 'Cook up the design',
    body: 'Tees, caps, socks, stickers: pick what fits your vibe and upload your art. Got mockups? Throw them in too.',
    icon: 'lucide:pen-tool',
    tint: 'bg-amber text-ink',
    photo: '/assets/creators-step-design.jpg',
    alt: 'A hand fanning out a deck of bright paper colour swatches beside a laptop',
    // Held to the right edge, and zoomed from there, so the laptop under the
    // other hand stays in frame the whole time.
    focus: 'object-[100%_40%]',
    zoomFrom: 'origin-right',
  },
  {
    n: '02',
    phase: 'Prep',
    title: 'Set the price and drop end date',
    body: 'You decide what it costs and when the drop closes. We give it a quick once-over before it goes live.',
    icon: 'lucide:timer',
    tint: 'bg-teal text-ink',
    photo: '/assets/creators-step-price.jpg',
    alt: 'A young woman in a yellow tee checking a tablet at her studio desk, with a laptop and a bright shirt laid out in front of her',
    focus: 'object-[58%_40%]',
  },
  {
    n: '03',
    phase: 'Live',
    title: 'Your people cop it',
    body: 'Your drop gets its own shop. Put the link in your bio, your stories, the group chat. Orders roll in till the timer hits zero or it sells out.',
    icon: 'lucide:shopping-bag',
    tint: 'bg-pink text-ink',
    photo: '/assets/creators-step-cop.jpg',
    alt: 'Two friends lying on a rug beside a keyboard, laughing at something on a phone',
    focus: 'object-[45%_40%]',
  },
  {
    n: '04',
    phase: 'After the drop',
    title: 'It lands at their door',
    body: 'Once the drop closes, we print exactly what sold, pack it up and deliver it. You get paid. Easy.',
    icon: 'lucide:package-check',
    tint: 'bg-purple text-white',
    photo: '/assets/creators-step-delivery.jpg',
    alt: 'A smiling delivery rider in a yellow cap and polo holding out two boxes',
    focus: 'object-[50%_30%]',
  },
]

/** White on cream, told apart by tone alone — the Audience and Quality card. */
const CARD = 'rounded-[2rem] bg-white'

/**
 * Chapter — how a drop works, in the voice of the people it's for: relaxed,
 * plain, a little slang. The steps still read prep, live, after, and the copy
 * says the close before the landing (PRD-002 guardrail 5).
 */
export function DropSteps() {
  const reduce = useReduce()

  return (
    <Chapter ground="cream" pattern="grain" id="drops" className="pt-section">
      <Container>
        <FillHeader />
      </Container>

      {reduce ? <StepGrid /> : <StepTrack />}
    </Chapter>
  )
}

/**
 * The pinned sequence, on the parade's pattern: one step on stage at a time,
 * in place. Each photo wipes in over the last (print-pass direction, top
 * down) and settles from a slight zoom; the copy beside it swaps, the old
 * step fully gone before the next arrives (motion-system §3: never crossfade
 * words in one place); the progress bar fills step by step.
 *
 * Kept short to fit the pin budget: landing and parade already take 660vh
 * of the 900vh desktop allowance (560 of 750 on a phone).
 */
const START = 0.04
const STEP = 0.23
/** How long a photo's wipe, or a copy fade, takes — as a share of the track. */
const SWAP = 0.05

const at = (i: number) => START + i * STEP

/** The three lines, in the order they fill. The last is the payoff, in the accent serif. */
const LINES = ['You drop it.', 'They cop it.', 'We ship it.']
/** Share of the header's scroll the three lines fill across; the button pops as it ends. */
const FILL_END = 0.85

/**
 * The header. As it scrolls up the screen, each line of the headline fills in
 * from an outline, left to right, one after another — the way the landing's
 * word fills — and the moment the last has filled, Apply to sell springs out
 * with an elastic overshoot. Both follow the scroll: scroll back and the fill
 * empties and the button tucks away, ready to pop again.
 */
function FillHeader() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReduce()
  // 0 as the header's top reaches 85% down the screen, 1 as its foot passes 55%:
  // the lines fill over the first FILL_END of that, so all three are done while
  // the header still sits mid-screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const progress = reduce ? FULL_FILL : scrollYProgress
  const [ready, setReady] = useState(Boolean(reduce))
  useMotionValueEvent(scrollYProgress, 'change', p => {
    // Out the moment "We ship it." is fully filled; tucked away again if the
    // fill is scrolled back, so the pop always lands with the last letter.
    setReady(p >= FILL_END)
  })

  return (
    <header ref={ref} className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end md:gap-12">
      <div className="md:col-span-7">
        <Eyebrow className="mb-5 text-ink/55">How drops work</Eyebrow>
        {/* `.sec-title` hard-codes the dark ground's colour as unlayered CSS,
            hence the inline ink (see Audience). */}
        <h2 className="sec-title sec-title-xl" style={{ color: 'var(--ink)' }}>
          <span className="sr-only">{LINES.join(' ')}</span>
          {LINES.map((line, i) => (
            <FillLine key={line} text={line} index={i} progress={progress} accent={i === LINES.length - 1} />
          ))}
        </h2>
      </div>
      <div className="md:col-span-5">
        <Reveal>
          <p className="mb-6 max-w-[34rem] text-base leading-relaxed text-muted-on-light md:text-lg">
            Here’s the gist: you open a drop for a few days, your people order, and once it closes we print every piece
            and get it to their door. No stock piling up in your room. No money down.
          </p>
        </Reveal>
        <motion.a
          href={APPLY_URL}
          className={clsx(button.ink, 'origin-left')}
          initial={reduce ? false : { scale: 0, opacity: 0, rotate: -6 }}
          animate={ready || reduce ? 'out' : 'in'}
          variants={{
            // Low damping on the way out: it overshoots and wobbles back, like a sticker slapped down.
            out: { scale: 1, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 420, damping: 9, mass: 0.9, opacity: { duration: 0.15 } } },
            in: { scale: 0, opacity: 0, rotate: -6, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
          }}
        >
          Apply to sell →
        </motion.a>
      </div>
    </header>
  )
}

/** Progress held at full: the reduced-motion headline, already filled. */
const FULL_FILL = motionValue(1)

/**
 * One headline line: an outline of the line, with the filled line over it,
 * revealed left to right across its third of the header's scroll. Both are
 * visual only (the sr-only copy carries the text). The fill is a clip on a
 * wrapper, so the shimmer's text-clipped background on the accent line is
 * untouched by it.
 */
function FillLine({ text, index, progress, accent }: { text: string; index: number; progress: MotionValue<number>; accent: boolean }) {
  const third = FILL_END / LINES.length
  const from = index * third
  // A function transform, worked out in JS: an accelerated clip runs ahead of the scroll (see useScrub).
  const clipPath = useTransform(progress, p => `inset(-40% ${100 - 100 * Math.min(1, Math.max(0, (p - from) / third))}% -45% -2%)`)
  const outline = accent
    ? '[-webkit-text-stroke:1.5px_rgb(245_166_35_/_0.55)]'
    : '[-webkit-text-stroke:1.5px_rgb(10_10_11_/_0.2)]'
  // The outline carries exactly the box the shimmer gives itself (padding past
  // the script's overhang, cancelled by negative margins), so both copies land
  // on the same spot; nowrap holds each to one line.
  // Both copies also reach above and below the line (without moving it): the
  // shimmer is a background clipped to the glyphs, and the script's tall
  // strokes and the p's tail hang past the box, where there's no background.
  const body = accent ? <Accent className="inline-block -ms-[0.12em] -mt-[0.2em] -mb-[0.22em] px-[0.12em] pt-[0.2em] pb-[0.22em]">{text}</Accent> : text

  return (
    <>
      <span aria-hidden="true" className="relative inline-block whitespace-nowrap">
        <span className={clsx('inline-block text-transparent', outline)}>{body}</span>
        <motion.span style={{ clipPath }} className="absolute inset-0 inline-block">
          {accent ? <Accent className="inline-block text-shimmer">{text}</Accent> : text}
        </motion.span>
      </span>
      {index < LINES.length - 1 && (
        <>
          {' '}
          <br />
        </>
      )}
    </>
  )
}


/**
 * A scrubbed value, worked out in JS from scroll progress. Not the usual
 * `useTransform(progress, ...track(…))`: framer hands that to the browser's
 * ScrollTimeline, and over this short pin Chrome ran it visibly ahead of the
 * real scroll position (a step's copy fading while still mid-step). A
 * function transform keeps it in step with `progress` exactly.
 */
function useScrub<T>(progress: MotionValue<number>, input: number[], output: T[]) {
  const map = transform(...track(input, output))
  return useTransform(progress, p => map(p))
}

function StepTrack() {
  const trackRef = useRef<HTMLDivElement>(null)
  const progress = useSectionProgress(trackRef)

  return (
    <div ref={trackRef} className="relative h-[180vh] md:h-[240vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16 pb-8">
        <Container>
          {/* The visual layers below are aria-hidden; this is what they say. */}
          <ol className="sr-only">
            {STEPS.map(step => (
              <li key={step.n}>
                {step.title}: {step.body}
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="grid items-center gap-6 md:grid-cols-12 md:gap-12">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-ink md:col-span-7">
              {STEPS.map((step, i) => (
                <StepPhoto key={step.n} step={step} index={i} progress={progress} />
              ))}
            </div>

            <div className="md:col-span-5">
              <ol className="mb-6 grid grid-cols-4 gap-2 md:mb-10">
                {STEPS.map((step, i) => (
                  <Segment key={step.n} step={step} index={i} progress={progress} />
                ))}
              </ol>
              <div className="relative min-h-[11rem] md:min-h-[14rem]">
                {STEPS.map((step, i) => (
                  <StepCopy key={step.n} step={step} index={i} progress={progress} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

/** Each photo after the first wipes in over the one before, then settles. */
function StepPhoto({ step, index, progress }: { step: Step; index: number; progress: MotionValue<number> }) {
  const s = at(index)
  // The first photo is simply there; each one after wipes down over it.
  const reveal = useScrub(progress, [s - SWAP, s], index === 0 ? [100, 100] : [0, 100])
  const clipPath = useTransform(reveal, r => `inset(0 0 ${100 - r}% 0)`)
  const scale = useScrub(progress, [Math.max(0, s - SWAP), s + STEP], [1.14, 1])

  return (
    <motion.div style={{ clipPath }} className="absolute inset-0">
      <motion.div style={{ scale }} className={clsx('absolute inset-0', step.zoomFrom)}>
        <Image
          src={step.photo}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 58vw"
          className={clsx('object-cover', step.focus)}
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-6 font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none font-extrabold font-condensed tracking-[-0.04em] text-white">
        {step.n}
      </span>
    </motion.div>
  )
}

/** One step's copy: in as its photo lands, fully out before the next step's arrives. */
function StepCopy({ step, index, progress }: { step: Step; index: number; progress: MotionValue<number> }) {
  const first = index === 0
  const last = index === STEPS.length - 1
  // In over the SWAP before its photo has landed (the first is simply there);
  // out over the SWAP before the next step's photo starts to wipe in.
  const inAt: [number, number] = [at(index) - SWAP, at(index)]
  const outAt: [number, number] = [at(index + 1) - SWAP * 2, at(index + 1) - SWAP]
  const input = [...(first ? [] : inAt), ...(last ? [] : outAt)]
  const opacity = useScrub(progress, input, [...(first ? [] : [0, 1]), ...(last ? [] : [1, 0])])
  // The first title's entrance watches the heading itself, which is never masked.
  const title = useRef<HTMLHeadingElement>(null)
  const titleShown = useInView(title, { once: true, amount: 0.5 })
  // The body follows the title in, a beat behind.
  const bodyAt: [number, number] = [at(index) - SWAP * 0.2, at(index) + SWAP]
  const bodyIn = useScrub(progress, bodyAt, first ? [1, 1] : [0, 1])
  const bodyY = useScrub(progress, bodyAt, first ? [0, 0] : [14, 0])
  const y = useScrub(progress, input, [...(first ? [] : [24, 0]), ...(last ? [] : [0, -24])])
  // Hidden when out, so it can't be selected.
  const visibility = useTransform(progress, p =>
    (first || p >= inAt[0]) && (last || p <= outAt[1]) ? 'visible' : 'hidden',
  )

  return (
    <motion.div style={{ opacity, y, visibility }} className="absolute inset-x-0 top-0">
      <div className="mb-4 flex items-center gap-3">
        <span className={clsx('flex size-10 shrink-0 items-center justify-center rounded-[0.9rem]', step.tint)}>
          <Icon icon={step.icon} width={19} />
        </span>
        <span className="text-eyebrow text-muted-on-light uppercase">{step.phase}</span>
      </div>
      <h3 ref={title} className="mb-4 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
        {step.title.split(' ').map((word, w, words) =>
          first ? (
            <EnterWord key={w} word={word} last={w === words.length - 1} index={w} shown={titleShown} />
          ) : (
            <TitleWord key={w} word={word} last={w === words.length - 1} window={titleWindow(index, w, words.length)} progress={progress} />
          ),
        )}
      </h3>
      <motion.p style={{ opacity: bodyIn, y: bodyY }} className="max-w-[28rem] text-base leading-relaxed text-muted-on-light md:text-lg">
        {step.body}
      </motion.p>
    </motion.div>
  )
}

/**
 * When word w of step i's title rises: the words share the step's arrival,
 * each starting a little after the one before.
 */
function titleWindow(index: number, w: number, count: number): [number, number] {
  const [from, to] = [at(index) - SWAP, at(index) + SWAP * 0.6]
  const span = to - from
  const each = span * 0.55
  const start = from + ((span - each) * w) / Math.max(count - 1, 1)
  return [start, start + each]
}

/**
 * The first step's words. That step is on stage before the pin starts, so its
 * entrance plays once as it comes into view rather than on scroll — scrubbed,
 * it would sit blank while the section scrolls up to the pin.
 */
function EnterWord({ word, last, index, shown }: { word: string; last: boolean; index: number; shown: boolean }) {
  const reduce = useReduce()
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span
          className="inline-block"
          initial={reduce ? false : { y: '110%' }}
          animate={shown || reduce ? { y: '0%' } : undefined}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.08 }}
        >
          {word}
        </motion.span>
      </span>
      {!last && ' '}
    </>
  )
}

/** One word of a step title, rising out of a mask. Scrubbed, so it reverses on the way back. */
function TitleWord({ word, last, window, progress }: { word: string; last: boolean; window: [number, number]; progress: MotionValue<number> }) {
  const y = useScrub(progress, window, ['110%', '0%'])
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span style={{ y }} className="inline-block">
          {word}
        </motion.span>
      </span>
      {!last && ' '}
    </>
  )
}

/** A step's slot in the progress bar: fills across its window, labelled with its number. */
function Segment({ step, index, progress }: { step: Step; index: number; progress: MotionValue<number> }) {
  const s = at(index)
  const scaleX = useScrub(progress, [s - (index === 0 ? 0 : SWAP), s + STEP - SWAP], [0, 1])

  return (
    <li>
      <span className="block h-1 overflow-hidden rounded-full bg-ink/10">
        <motion.span style={{ scaleX }} className="block h-full origin-left rounded-full bg-ink" />
      </span>
      <span className="mt-2 block text-[11px] font-semibold tracking-wide text-ink/50">{step.n}</span>
    </li>
  )
}

/** Reduced motion: no pin, the four steps as cards. */
function StepGrid() {
  return (
    <Container className="pt-14 pb-section md:pt-20">
      <ol className="grid gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={0.06 * i} className="h-full">
            <li className={clsx(CARD, 'flex h-full flex-col overflow-hidden')}>
              <div className="relative aspect-[5/4] w-full">
                <Image
                  src={step.photo}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 320px"
                  className={clsx('object-cover', step.focus)}
                />
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-5 font-display text-[2.5rem] leading-none font-extrabold font-condensed tracking-[-0.04em] text-white drop-shadow-[0_2px_10px_rgba(10,10,11,0.45)]"
                >
                  {step.n}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7 pt-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className={clsx('flex size-9 shrink-0 items-center justify-center rounded-[0.8rem]', step.tint)}>
                    <Icon icon={step.icon} width={17} aria-hidden="true" />
                  </span>
                  <span className="text-eyebrow text-muted-on-light uppercase">{step.phase}</span>
                </div>
                <h3 className="mb-3 text-[1.3rem] leading-snug font-semibold tracking-[-0.01em] text-ink">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-on-light">{step.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Container>
  )
}
