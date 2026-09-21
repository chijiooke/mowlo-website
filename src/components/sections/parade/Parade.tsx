'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { SceneView } from '@/components/three/SceneView'
import { useReduce } from '@/lib/motion'
import { track, useSectionProgress } from '@/lib/scroll/useSectionProgress'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { FINALE, PARADE_STILL, PIECES, pieceWindow, type Piece } from './beats'

// Keeps three.js out of the page bundle; it arrives with the canvas.
const ParadeScene = dynamic(() => import('./ParadeScene'), { ssr: false })

/** Four points through piece i's window, as shares of it: in, full, full, out. */
function within(i: number, a: number, b: number, c: number, d: number) {
  const [start, end] = pieceWindow(i)
  const span = end - start
  return [start + span * a, start + span * b, start + span * c, start + span * d]
}

/**
 * Chapter 3 — the parade. Each product flies in, is printed, has its moment and
 * flies out over dark crumpled paper: no glows, patterns or mega words, so the
 * product is the only thing moving. Once the last one has gone, the finale
 * says there is much more than these three.
 *
 * Two sticky layers share the track. Sticky creates a stacking context, so the
 * canvas layer sits under the copy layer (z-10).
 */
export function Parade() {
  const trackRef = useRef<HTMLElement>(null)
  const scrolled = useSectionProgress(trackRef)
  const reduce = useReduce()
  const still = useMotionValue(PARADE_STILL)
  const progress = reduce ? still : scrolled

  const compact = useMediaQuery('(max-width: 767px)')
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')

  const finaleOpacity = useTransform(progress, ...track(FINALE, [0, 1]))
  const finaleY = useTransform(progress, ...track(FINALE, [32, 0]))
  const finaleVisibility = useTransform(progress, v => (v > FINALE[0] ? 'visible' : 'hidden'))

  return (
    <Chapter ground="ink" ref={trackRef} className="h-[340vh] md:h-[400vh] motion-reduce:h-svh">
      {/* ── The canvas, on crumpled paper ── */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <PaperGround />
        <SceneView className="absolute inset-0">
          <ParadeScene progress={progress} compact={compact} tilt={fine && !reduce} />
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

        {PIECES.map((piece, i) => (
          <Caption key={piece.id} piece={piece} index={i} progress={progress} />
        ))}

        {/* The finale: the three were a sample, not the range. */}
        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY, visibility: finaleVisibility }}
          className="absolute inset-0 flex items-center text-center"
        >
          <Container className="flex flex-col items-center">
            {/* Set like "Show up properly." below it: full-width face, two lines, room between them. */}
            <p className="font-display text-[clamp(46px,9vw,108px)] leading-none font-extrabold tracking-[-0.04em]">
              <span className="block">And much</span>
              <span className="block text-amber">more.</span>
            </p>
            <p className="mt-6 max-w-[30rem] text-lg leading-relaxed text-bone/70 md:mt-8 md:text-xl">
              Everything your business or event needs, made easy. No chasing printers. No wahala.
            </p>
          </Container>
        </motion.div>
      </div>
    </Chapter>
  )
}

/**
 * The ground: the same crumpled sheet the hero's letters are printed on, faint
 * over ink, so the creases catch light and the dark reads as paper rather than
 * a flat fill. A vignette keeps the edges quiet and the middle clear for the
 * products.
 */
function PaperGround() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[url('/assets/paper-crumpled.jpg')] bg-cover bg-center opacity-[0.13] grayscale" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_40%,rgba(10,10,11,0.75)_100%)]" />
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
