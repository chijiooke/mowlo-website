'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { MowloLogo } from '@/components/MowloLogo'
import { useReduce } from '@/lib/motion'

type Shape = 'flower' | 'arch' | 'double' | 'circle' | 'pill'

interface Piece {
  name: [string, string]
  src: string
  focus: string
  tone: string
  shape: Shape
}

/**
 * What we brand, one card each: the name in two light lines, the mascot in
 * the corner, and the piece cut into a shape. The shots are our own merch,
 * Mowlo-branded, rendered from the site's 3D models on a bold ground
 * (/dev/studio, scripts/studio/shoot.sh): nothing in them belongs to anyone
 * else. Each card's tone differs from its shot's ground so the shape reads.
 */
const LEFT: Piece[] = [
  { name: ['Branded', 'tees'], src: '/assets/brand/tee.jpg', focus: 'object-center', tone: 'bg-amber text-ink', shape: 'flower' },
  { name: ['Caps &', 'hats'], src: '/assets/brand/cap.jpg', focus: 'object-center', tone: 'bg-teal text-ink', shape: 'double' },
  { name: ['Water', 'bottles'], src: '/assets/brand/bottle.jpg', focus: 'object-center', tone: 'bg-purple text-white', shape: 'arch' },
  { name: ['Mugs', '& cups'], src: '/assets/brand/mugs.jpg', focus: 'object-center', tone: 'bg-pink text-ink', shape: 'circle' },
]

const RIGHT: Piece[] = [
  { name: ['Business', 'cards'], src: '/assets/brand/cards.jpg', focus: 'object-center', tone: 'bg-lime text-ink', shape: 'pill' },
  { name: ['Die-cut', 'stickers'], src: '/assets/brand/stickers.jpg', focus: 'object-center', tone: 'bg-ink text-bone', shape: 'flower' },
  { name: ['Shopping', 'bags'], src: '/assets/brand/bag.jpg', focus: 'object-center', tone: 'bg-sky text-ink', shape: 'arch' },
  { name: ['Crew', 'socks'], src: '/assets/brand/socks.jpg', focus: 'object-center', tone: 'bg-amber text-ink', shape: 'double' },
]

/**
 * What we brand, as two columns of colourful cards drifting past in opposite
 * directions, each column a list doubled so the loop never shows a seam.
 * Still when motion is reduced. Sized by its parent; fades at top and bottom.
 */
export function BrandedCarousel({ className }: { className?: string }) {
  return (
    <div
      aria-label="Tees, caps, bottles, mugs, business cards, stickers, bags and socks we print"
      className={clsx(
        'relative flex justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] md:gap-5',
        className,
      )}
    >
      <ShapeDefs />
      <Column pieces={LEFT} direction="up" />
      <Column pieces={RIGHT} direction="down" className="mt-[-6rem]" />
    </div>
  )
}

/** One column, doubled and drifting; a full pass every 40 seconds. */
function Column({ pieces, direction, className }: { pieces: Piece[]; direction: 'up' | 'down'; className?: string }) {
  const reduce = useReduce()
  const from = direction === 'up' ? '0%' : '-50%'
  const to = direction === 'up' ? '-50%' : '0%'
  return (
    <motion.div
      className={clsx('flex shrink-0 flex-col gap-4 md:gap-5', className)}
      initial={{ y: from }}
      animate={reduce ? undefined : { y: [from, to] }}
      transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
    >
      {[...pieces, ...pieces].map((piece, i) => (
        <Card key={`${piece.name.join(' ')}-${i}`} piece={piece} hidden={i >= pieces.length} />
      ))}
    </motion.div>
  )
}

function Card({ piece, hidden }: { piece: Piece; hidden: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className={clsx('flex h-[17rem] w-[11.5rem] flex-col rounded-[1.6rem] p-4 md:h-[19.5rem] md:w-[14rem] md:p-5', piece.tone)}
    >
      <figcaption className="flex items-start justify-between">
        <span className="text-[1.35rem] leading-[1.05] font-normal tracking-[-0.01em] md:text-[1.6rem]">
          {piece.name[0]}
          <br />
          {piece.name[1]}
        </span>
        {/* On a black disc, so the amber mascot holds on the amber cards too. */}
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-ink">
          <MowloLogo size={22} />
        </span>
      </figcaption>
      <div className={clsx('relative mt-auto aspect-[1.1] w-full overflow-hidden', SHAPE_CLASS[piece.shape])}>
        <Image src={piece.src} alt="" fill sizes="224px" className={clsx('object-cover', piece.focus)} />
      </div>
    </figure>
  )
}

/** How each shape cuts the photo: simple ones in CSS, the scalloped ones by an SVG clip-path (ShapeDefs). */
const SHAPE_CLASS: Record<Shape, string> = {
  flower: '[clip-path:url(#branded-flower)]',
  double: '[clip-path:url(#branded-double)]',
  arch: 'rounded-t-full rounded-b-[1.1rem]',
  circle: 'rounded-full',
  pill: 'rounded-[999px]',
}

/** The scalloped shapes, in objectBoundingBox units so they fit any box. */
function ShapeDefs() {
  // A flower: a circle with twelve round bumps on its rim.
  const bumps = 12
  const petals = Array.from({ length: bumps }, (_, i) => {
    const a = (i / bumps) * Math.PI * 2
    const cx = 0.5 + Math.cos(a) * 0.36
    const cy = 0.5 + Math.sin(a) * 0.36
    return `M ${cx + 0.12} ${cy} a 0.12 0.12 0 1 0 -0.24 0 a 0.12 0.12 0 1 0 0.24 0 Z`
  }).join(' ')

  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <clipPath id="branded-flower" clipPathUnits="objectBoundingBox">
          <path d={`${petals} M 0.86 0.5 a 0.36 0.36 0 1 0 -0.72 0 a 0.36 0.36 0 1 0 0.72 0 Z`} />
        </clipPath>
        {/* Two arches side by side, joined at the foot. */}
        <clipPath id="branded-double" clipPathUnits="objectBoundingBox">
          <path d="M0 1 V0.42 A0.25 0.38 0 0 1 0.5 0.42 A0.25 0.38 0 0 1 1 0.42 V1 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}
