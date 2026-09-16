'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { SceneView } from '@/components/three/SceneView'
import { Eyebrow } from '@/components/type/Type'
import { button } from '@/components/ui/button'
import { useWaitlist } from '@/components/WaitlistForm'
import { useReduce } from '@/lib/motion'
import { track, useSectionProgress } from '@/lib/scroll/useSectionProgress'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { FINALE, HERO_STILL, INTRO_OUT, PIECES, pieceWindow, type PatternId, type Piece } from './beats'

// Keeps three.js out of the page bundle; it arrives with the canvas.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

const PATTERNS: Record<PatternId, string> = {
  halftone: 'bg-halftone-light',
  diecut: 'bg-diecut',
  stripes: 'bg-stripes-light',
  cropmarks: 'bg-cropmarks-light',
}

/** Four points through piece i's window, as shares of it: in, full, full, out. */
function within(i: number, a: number, b: number, c: number, d: number) {
  const [start, end] = pieceWindow(i)
  const span = end - start
  return [start + span * a, start + span * b, start + span * c, start + span * d]
}

/**
 * When a piece's mega word is on screen, as four points through its window.
 * Tighter than the glow and pattern, which crossfade: two words fading through
 * each other in the same place read as one garbled word.
 */
const wordRange = (i: number) => within(i, 0.22, 0.36, 0.64, 0.78)

/**
 * Chapter 1 — the product line, one piece at a time. A pinned track: each
 * product flies in, is printed, has its moment and flies out, while the
 * ground behind it takes on that product's colour, pattern and name. The
 * finale lines them all up on one shelf.
 *
 * Two sticky layers share the track. Sticky creates a stacking context, so the
 * backdrop layer (no z-index) sits under the fixed canvas and the copy layer
 * (z-10) sits over it.
 */
export function Hero() {
  const track_ = useRef<HTMLElement>(null)
  const scrolled = useSectionProgress(track_)
  const reduce = useReduce()
  const still = useMotionValue(HERO_STILL)
  const progress = reduce ? still : scrolled

  const compact = useMediaQuery('(max-width: 767px)')
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const openWaitlist = useWaitlist()

  const introOpacity = useTransform(progress, ...track(INTRO_OUT, [1, 0]))
  const introY = useTransform(progress, ...track(INTRO_OUT, [0, -32]))
  // Hidden, not just transparent, so a faded CTA can't take keyboard focus.
  const introVisibility = useTransform(progress, v => (v < INTRO_OUT[1] ? 'visible' : 'hidden'))
  const finaleOpacity = useTransform(progress, ...track(FINALE, [0, 1]))
  const finaleY = useTransform(progress, ...track(FINALE, [32, 0]))
  const finaleVisibility = useTransform(progress, v => (v > FINALE[0] ? 'visible' : 'hidden'))
  const cue = useTransform(progress, ...track([0, 0.03], [1, 0]))

  return (
    <Chapter ground="ink" ref={track_} className="h-[520vh] md:h-[620vh] motion-reduce:h-svh">
      {/* ── Below the canvas: colour, pattern and the mega word ── */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <Backdrop progress={progress} />
        <SceneView className="absolute inset-0">
          <HeroScene progress={progress} compact={compact} tilt={fine && !reduce} />
        </SceneView>
      </div>

      {/* ── Above the canvas: copy and controls ── */}
      <div className="pointer-events-none sticky top-0 z-10 -mt-[100svh] h-svh">
        {/* The captions below are the visual form of this list. */}
        <ul className="sr-only">
          {PIECES.map(p => (
            <li key={p.id}>
              {p.name}
              {p.soon ? ' (coming soon)' : ''}: {p.spec}
            </li>
          ))}
        </ul>

        <motion.div
          style={{ opacity: introOpacity, y: introY, visibility: introVisibility }}
          className="pointer-events-auto absolute inset-x-0 top-0 pt-24 md:pt-32"
        >
          <Container>
            <Eyebrow className="mb-4 text-amber">Designed · Printed · Delivered</Eyebrow>
            <h1 className="max-w-[12ch] font-display text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[0.88] font-extrabold font-condensed tracking-[-0.035em] md:max-w-none">
              <span className="md:block">Your hustle deserves </span>
              <span className="md:block">
                to look <span className="text-amber">this good.</span>
              </span>
            </h1>
          </Container>
        </motion.div>

        <motion.div
          style={{ opacity: introOpacity, y: introY, visibility: introVisibility }}
          className="pointer-events-auto absolute inset-x-0 bottom-0 pb-6 md:pb-12"
        >
          <Container className="flex md:justify-end">
            <div className="w-full md:max-w-md">
              <p className="mb-5 max-w-[34ch] text-base leading-relaxed text-bone/70 md:mb-6 md:text-lead">
                Business cards, stickers, flyers, bags, mugs and tees — designed in minutes, printed locally, delivered to
                your door.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" className={button.primary} onClick={() => openWaitlist('hero')}>
                  Join the waitlist
                  <Icon icon="lucide:arrow-right" width={18} aria-hidden="true" />
                </button>
                <a href="#products" className={clsx(button.ghost, 'hidden sm:inline-flex')}>
                  See what we print
                </a>
              </div>
            </div>
          </Container>
        </motion.div>

        {PIECES.map((piece, i) => (
          <Caption key={piece.id} piece={piece} index={i} progress={progress} />
        ))}

        <Rail progress={progress} />

        {/* The finale: headline above the shelf of products, pills and CTA below it. */}
        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY, visibility: finaleVisibility }}
          className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-between pt-24 pb-8 text-center md:pt-28 md:pb-12"
        >
          <Container className="flex flex-col items-center">
            <Eyebrow className="mb-4 text-amber">One brand, everything it touches</Eyebrow>
            <p className="font-display text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.9] font-extrabold font-condensed tracking-[-0.04em]">
              <span className="block md:inline">Your brand. </span>
              <span className="block text-amber md:inline">On everything.</span>
            </p>
          </Container>
          <Container className="flex flex-col items-center">
            <ul className="mb-6 flex flex-wrap justify-center gap-2">
              {PIECES.map((p, i) => (
                <li key={p.id} className={clsx('rounded-full px-3.5 py-1.5 text-sm font-bold', p.pill, i % 2 ? 'rotate-2' : '-rotate-2')}>
                  {p.short}
                </li>
              ))}
            </ul>
            <button type="button" className={clsx(button.primary, 'w-full sm:w-auto')} onClick={() => openWaitlist('hero-finale')}>
              Join the waitlist
              <Icon icon="lucide:arrow-right" width={18} aria-hidden="true" />
            </button>
          </Container>
        </motion.div>

        <motion.div
          style={{ opacity: cue }}
          aria-hidden="true"
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-eyebrow text-bone/50 uppercase motion-reduce:hidden lg:flex"
        >
          Scroll
          <span className="h-10 w-px overflow-hidden bg-bone/15">
            <span className="block h-1/2 w-full animate-[scroll-cue_1.6s_var(--ease-in-out-quart)_infinite] bg-amber" />
          </span>
        </motion.div>
      </div>
    </Chapter>
  )
}

/** Glow, pattern and mega word for whichever piece holds the stage. */
function Backdrop({ progress }: { progress: MotionValue<number> }) {
  const blank = useTransform(progress, ...track([0, 0.06], [1, 0]))
  const brandGlow = useTransform(progress, ...track(FINALE, [0, 1]))
  // The word waits for the last product's word to be gone.
  const brandWordRange = [wordRange(PIECES.length - 1)[3] + 0.01, FINALE[1]]
  const brandWord = useTransform(progress, ...track(brandWordRange, [0, 1]))
  const brandScale = useTransform(progress, ...track(brandWordRange, [0.9, 1]))

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <GhostWord word="BLANK." opacity={blank} tint="rgba(240, 237, 232, 0.07)" />
      {PIECES.map((piece, i) => (
        <PieceBackdrop key={piece.id} piece={piece} index={i} progress={progress} />
      ))}
      <motion.div
        style={{ opacity: brandGlow }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_52%,rgba(245,166,35,0.2),transparent_70%)]"
      />
      <GhostWord word="BRAND." opacity={brandWord} scale={brandScale} tint="rgba(245, 166, 35, 0.18)" />
    </div>
  )
}

function PieceBackdrop({ piece, index, progress }: { piece: Piece; index: number; progress: MotionValue<number> }) {
  const range = within(index, 0.08, 0.28, 0.72, 0.92)
  const opacity = useTransform(progress, ...track(range, [0, 1, 1, 0]))
  const words = wordRange(index)
  const wordOpacity = useTransform(progress, ...track(words, [0, 1, 1, 0]))
  const y = useTransform(progress, ...track(words, ['35%', '0%', '0%', '-35%']))

  return (
    <>
      <motion.div
        style={{ opacity, ['--glow' as string]: piece.glow }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_50%,var(--glow),transparent_70%)] md:bg-[radial-gradient(ellipse_50%_55%_at_58%_50%,var(--glow),transparent_70%)]"
      />
      <motion.div style={{ opacity }} className={clsx('absolute inset-0 pattern-fade', PATTERNS[piece.pattern])} />
      <GhostWord word={piece.word} opacity={wordOpacity} y={y} tint={piece.tint} />
    </>
  )
}

function GhostWord({
  word,
  opacity,
  y,
  scale,
  tint,
}: {
  word: string
  opacity: MotionValue<number>
  y?: MotionValue<string>
  scale?: MotionValue<number>
  tint: string
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.span
        style={{ opacity, y, scale, ['--tint' as string]: tint }}
        className="font-display text-[clamp(4rem,19vw,19rem)] leading-[0.82] font-extrabold font-condensed tracking-[-0.045em] whitespace-nowrap text-(color:--tint)"
      >
        {word}
      </motion.span>
    </div>
  )
}

/** The name and spec of the piece on stage. Visual only — the sr-only list carries it. */
function Caption({ piece, index, progress }: { piece: Piece; index: number; progress: MotionValue<number> }) {
  const range = within(index, 0.22, 0.36, 0.66, 0.8)
  const opacity = useTransform(progress, ...track(range, [0, 1, 1, 0]))
  const y = useTransform(progress, ...track(range, [24, 0, 0, -24]))

  return (
    <motion.div aria-hidden="true" style={{ opacity, y }} className="absolute inset-x-0 bottom-0 pb-8 md:pb-14">
      <Container>
        <div className="max-w-sm">
          <div className="mb-3 flex items-center gap-3 text-eyebrow text-bone/55 uppercase">
            <span className={clsx('size-2 rounded-full', piece.dot)} />
            {String(index + 1).padStart(2, '0')} / {String(PIECES.length).padStart(2, '0')}
          </div>
          <p className="flex flex-wrap items-center gap-3 font-display text-title font-condensed text-bone">
            {piece.name}
            {piece.soon && (
              <span className="rounded-full bg-bone/10 px-2.5 py-1 font-body text-xs font-semibold tracking-normal text-bone/75">
                Coming soon
              </span>
            )}
          </p>
          <p className="mt-2 text-base text-bone/65 md:text-lg">{piece.spec}</p>
        </div>
      </Container>
    </motion.div>
  )
}

/** Desktop progress rail: one segment per piece, filling as it plays. */
function Rail({ progress }: { progress: MotionValue<number> }) {
  // Gone by the finale: the line-up is the whole story by then.
  const opacity = useTransform(progress, ...track(FINALE, [1, 0]))

  return (
    <motion.ol
      aria-hidden="true"
      style={{ opacity }}
      className="absolute top-1/2 right-gutter hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
    >
      {PIECES.map((piece, i) => (
        <RailItem key={piece.id} piece={piece} index={i} progress={progress} />
      ))}
    </motion.ol>
  )
}

function RailItem({ piece, index, progress }: { piece: Piece; index: number; progress: MotionValue<number> }) {
  const [start, end] = pieceWindow(index)
  const fill = useTransform(progress, ...track([start, end], [0, 1]))
  const opacity = useTransform(progress, ...track([start - 0.02, start + 0.03, end - 0.03, end + 0.02], [0.4, 1, 1, 0.4]))

  return (
    <li className="flex items-center justify-end gap-3">
      <motion.span style={{ opacity }} className="text-xs font-semibold text-bone">
        {piece.short}
      </motion.span>
      <span className="relative h-9 w-[3px] overflow-hidden rounded-full bg-bone/15">
        <motion.span style={{ scaleY: fill }} className={clsx('absolute inset-0 origin-top rounded-full', piece.dot)} />
      </span>
    </li>
  )
}
