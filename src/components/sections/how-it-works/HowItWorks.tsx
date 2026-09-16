'use client'

import { useRef } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ColorSplitText } from '@/components/ColorSplitText'
import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/type/Type'
import { SplitReveal } from '@/components/type/SplitReveal'
import { useReduce } from '@/lib/motion'

interface Step {
  n: string
  /** The step's own brand colour — numeral, rule and first pill. */
  colour: string
  title: string[]
  body: string
  tags: string[]
  photo: { src: string; alt: string; position: string }
}

const STEPS: Step[] = [
  {
    n: '01',
    colour: 'var(--color-amber)',
    title: ['Pick your product'],
    body: 'Stickers, business cards, flyers, thank-you cards, tees — one at a time, or a bundle that costs less than the pieces on their own. Order 25 or 500; no minimum that eats your profit.',
    tags: ['Stickers', 'Business cards', 'Flyers', 'Bundles'],
    photo: {
      src: '/assets/vecteezy_colorful-paper-shopping-bags_27614808.jpg',
      alt: 'A row of colourful paper shopping bags',
      position: 'object-center',
    },
  },
  {
    n: '02',
    colour: 'var(--color-teal)',
    title: ['Add your design —', 'or let AI draw it'],
    body: 'Upload the designs you already have. No designs? Answer five questions and our AI designer draws your logo, colour palette and print-ready layouts in minutes — no designer, no trip to Computer Village.',
    tags: ['Upload your own', 'AI designer', 'Saved brand profile'],
    photo: {
      src: '/assets/man-working-animation-studio.jpg',
      alt: 'A designer drawing on a pen tablet in front of a large screen',
      position: 'object-[60%_50%]',
    },
  },
  {
    n: '03',
    colour: 'var(--color-pink)',
    title: ['Track it', 'to your door'],
    body: 'Approve your proof with one tap and we go straight to print. Then follow it the whole way — from the press to the rider at your gate. 24hrs in Lagos, 2–3 days across Nigeria and Ghana.',
    tags: ['One-tap proofing', 'Live tracking', '24hr Lagos'],
    photo: {
      src: '/assets/delivery-man.jpeg',
      alt: 'A smiling delivery rider holding a parcel',
      position: 'object-[35%_40%]',
    },
  },
]

/** Pills take the brand colours in turn, each step starting on its own. */
const PILLS = [
  'bg-amber text-ink',
  'bg-teal text-ink',
  'bg-pink text-ink',
  'bg-sky text-ink',
  'bg-lime text-ink',
  'bg-purple text-white',
]

/**
 * Chapter — How it works. Three steps, each in its own brand colour from the
 * start: the numeral fills with it as the step scrolls in, the photo opens out
 * of a frame, and the pills land like stickers.
 */
export function HowItWorks() {
  return (
    <Chapter ground="ink" id="how" className="py-section">
      <Container>
        <header className="mb-20 md:mb-28">
          <Eyebrow className="mb-5 text-amber">How it works</Eyebrow>
          <h2 className="font-display text-poster font-condensed">
            <span className="block">Three steps.</span>
            <ColorSplitText text="No wahala." delay={0.15} />
          </h2>
          <p className="mt-6 max-w-[34rem] text-lead text-bone/60">
            A three-day, four-person errand, collapsed into a phone flow.
          </p>
        </header>

        <ol className="flex flex-col gap-24 md:gap-36">
          {STEPS.map((step, i) => (
            <StepRow key={step.n} step={step} index={i} />
          ))}
        </ol>
      </Container>
    </Chapter>
  )
}

function StepRow({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useReduce()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'start 35%'] })

  // Scrubbed, so the colour arrives with the step and leaves if you scroll back.
  const fill = useTransform(scrollYProgress, [0, 1], reduce ? ['inset(0% 0 0 0)', 'inset(0% 0 0 0)'] : ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'])
  const frame = useTransform(
    scrollYProgress,
    [0, 1],
    reduce
      ? ['inset(0% 0% 0% 0% round 2rem)', 'inset(0% 0% 0% 0% round 2rem)']
      : ['inset(14% 10% 14% 10% round 2rem)', 'inset(0% 0% 0% 0% round 2rem)'],
  )
  const zoom = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.18, 1])
  const rule = useTransform(scrollYProgress, [0.3, 1], reduce ? [1, 1] : [0, 1])
  const flip = index % 2 === 1

  return (
    <li ref={ref} style={{ ['--step' as string]: step.colour }} className="relative grid items-center gap-10 md:grid-cols-12 md:gap-12">
      {/* Photo, with the numeral overlapping its corner */}
      <div className={clsx('relative md:col-span-6', flip ? 'md:order-2 md:col-start-7' : 'md:col-start-1')}>
        <div className="relative aspect-[4/3] w-full">
          <motion.div style={{ clipPath: frame }} className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <motion.div style={{ scale: zoom }} className="absolute inset-0">
              <Image
                src={step.photo.src}
                alt={step.photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={clsx('object-cover', step.photo.position)}
              />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-t from-ink/45 via-transparent to-transparent" />
          </motion.div>

          <span
            aria-hidden="true"
            className={clsx(
              'pointer-events-none absolute -top-[0.42em] z-10 font-display text-[clamp(5.5rem,13vw,11rem)] font-extrabold font-condensed leading-none tracking-[-0.05em]',
              flip ? 'right-4 md:-right-[0.12em]' : 'left-4 md:-left-[0.12em]',
            )}
          >
            <span className="text-transparent [-webkit-text-stroke:2px_var(--step)]">{step.n}</span>
            <motion.span style={{ clipPath: fill }} className="absolute inset-0 text-(color:--step)">
              {step.n}
            </motion.span>
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className={clsx('md:col-span-5', flip ? 'md:order-1 md:col-start-1' : 'md:col-start-8')}>
        <motion.span style={{ scaleX: rule }} className="mb-6 block h-1 w-16 origin-left rounded-full bg-(--step)" />
        <SplitReveal as="h3" lines={step.title} className="mb-5 font-display text-title font-semicondensed" />
        <p className="max-w-[30rem] text-base leading-relaxed text-bone/65 md:text-lg">{step.body}</p>
        <Pills tags={step.tags} start={index} />
      </div>
    </li>
  )
}

const pill: Variants = {
  hidden: { opacity: 0, scale: 0.55, y: 12, rotate: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    // A slight alternating tilt, like stickers slapped on by hand.
    rotate: i % 2 ? 2.5 : -2.5,
    transition: { type: 'spring', stiffness: 520, damping: 15, delay: 0.3 + i * 0.08 },
  }),
}

function Pills({ tags, start }: { tags: string[]; start: number }) {
  const reduce = useReduce()

  return (
    <motion.ul
      className="mt-8 flex flex-wrap gap-2.5"
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {tags.map((tag, i) => (
        <motion.li
          key={tag}
          custom={i}
          variants={pill}
          whileHover={{ rotate: 0, scale: 1.06 }}
          className={clsx(
            'cursor-default rounded-full px-4 py-2 text-sm font-bold shadow-[0_8px_20px_rgba(0,0,0,0.3)]',
            PILLS[(start + i) % PILLS.length],
          )}
        >
          {tag}
        </motion.li>
      ))}
    </motion.ul>
  )
}
