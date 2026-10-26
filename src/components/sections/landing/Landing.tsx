'use client'

import { useRef, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { SceneView } from '@/components/three/SceneView'
import { GhostWord } from '@/components/type/GhostWord'
import { button } from '@/components/ui/button'
import { useWaitlist } from '@/components/WaitlistForm'
import { useReduce } from '@/lib/motion'
import { track, useSectionProgress } from '@/lib/scroll/useSectionProgress'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { COPY_OUT, CUE_OUT, FILL, LANDING_STILL, WORD_OUT, type LandingVariant } from './beats'

// Keeps three.js out of the page bundle; it arrives with the canvas.
const LandingScene = dynamic(() => import('./LandingScene'), { ssr: false })

/**
 * How long the landing pins for. Print runs three slow fly-pasts; merch runs
 * four pieces one after another plus the stickers, each needing its own beat,
 * so it gets the longer track (about a screen and a half per piece).
 */
const TRACK = {
  print: 'h-[220vh] md:h-[260vh]',
  merch: 'h-[340vh] md:h-[420vh]',
}

interface LandingProps {
  /** What sails past behind the name: printed paper, or a creator's merch. */
  variant: LandingVariant
  /** The page's h1. Shown over the copy when `showTitle`, otherwise for screen readers only. */
  title: ReactNode
  showTitle?: boolean
  lede: string
  /** The primary action: a link out, or the waitlist (tagged with its source). */
  cta: { label: string } & ({ href: string } | { waitlist: string })
  secondary: { label: string; href: string }
}

/**
 * Chapter 1 — the landing. The brand name alone, filling with amber as you
 * scroll and then taking the metallic finish, while printed pieces sail past
 * behind it. Nothing is being sold yet: the products come two chapters down.
 *
 * Two sticky layers share the track. Sticky creates a stacking context, so the
 * scene layer (no z-index) sits under the fixed canvas and the copy layer
 * (z-10) sits over it.
 */
export function Landing({ variant, title, showTitle = false, lede, cta, secondary }: LandingProps) {
  const trackRef = useRef<HTMLElement>(null)
  const scrolled = useSectionProgress(trackRef)
  const reduce = useReduce()
  const still = useMotionValue(LANDING_STILL)
  const progress = reduce ? still : scrolled

  const compact = useMediaQuery('(max-width: 767px)')
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const openWaitlist = useWaitlist()

  const word = useTransform(progress, ...track(WORD_OUT, [1, 0]))
  // The insets run past the box on every side: a clip-path clips to the element
  // box, and the line box is tighter than the letters, so `inset(0%)` would
  // leave the tops and tails of the word unfilled.
  const fill = useTransform(progress, ...track(FILL, ['inset(100% -6% -20% -6%)', 'inset(-20% -6% -20% -6%)']))
  const copy = useTransform(progress, ...track(COPY_OUT, [1, 0]))
  const copyY = useTransform(progress, ...track(COPY_OUT, [0, -28]))
  // Hidden, not just transparent, so a faded CTA cannot take keyboard focus.
  const copyVisibility = useTransform(progress, v => (v < COPY_OUT[1] ? 'visible' : 'hidden'))
  const cue = useTransform(progress, ...track(CUE_OUT, [1, 0]))

  return (
    <Chapter ground="ink" ref={trackRef} className={clsx(TRACK[variant], 'motion-reduce:h-svh')}>
      {/* ── Below the canvas: the brand name ── */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <GhostWord
          word="MOWLO."
          opacity={word}
          tint="rgba(240, 237, 232, 0.1)"
          fill={fill}
          paper
          variant="landing"
          align="top"
        />
        <SceneView className="absolute inset-0">
          <LandingScene variant={variant} progress={progress} compact={compact} tilt={fine && !reduce} />
        </SceneView>
      </div>

      {/* ── Above the canvas: copy and controls ── */}
      <div className="pointer-events-none sticky top-0 z-10 -mt-[100svh] h-svh">
        {!showTitle && <h1 className="sr-only">{title}</h1>}

        <motion.div
          style={{ opacity: copy, y: copyY, visibility: copyVisibility }}
          className="pointer-events-auto absolute inset-x-0 bottom-0 pb-6 md:pb-12"
        >
          <Container className="flex md:justify-end">
            <div className="w-full md:max-w-md">
              {showTitle && (
                // Full-width face, set like the parade finale and the closing CTA,
                // so the poster word above is the only condensed type on screen.
                <h1 className="mb-4 max-w-[14ch] font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-bone">
                  {title}
                </h1>
              )}
              <p className="mb-5 max-w-[34ch] text-base leading-relaxed text-bone/70 md:mb-6 md:text-lead">{lede}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {'href' in cta ? (
                  <a href={cta.href} className={button.primary}>
                    {cta.label}
                    <Icon icon="lucide:arrow-right" width={18} aria-hidden="true" />
                  </a>
                ) : (
                  <button type="button" className={button.primary} onClick={() => openWaitlist(cta.waitlist)}>
                    {cta.label}
                    <Icon icon="lucide:arrow-right" width={18} aria-hidden="true" />
                  </button>
                )}
                <a href={secondary.href} className={clsx(button.ghost, 'hidden sm:inline-flex')}>
                  {secondary.label}
                </a>
              </div>
            </div>
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
