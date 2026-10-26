import type { CSSProperties } from 'react'
import { MERCH } from '@/lib/merch'
import { MOWLO_BODY_PATH } from './MowloLogo'

/**
 * The product list, shared by the desktop fan and the phone deck. Kept here so
 * the two presentations can differ completely without the data following suit.
 */
export interface Product {
  name: string
  spec: string
  /** Card background. */
  bg: string
  /** Mascot face colour, read against the card background. */
  face: string
  /** Light type, for the darker card backgrounds. */
  light?: boolean
  soon?: boolean
  Blob: () => React.ReactElement
}

const sparkle = (
  <>
    <path d="M18 12L14 3L26 7" stroke="rgba(255,255,255,0.6)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M62 10L70 1L59 6" stroke="rgba(255,255,255,0.6)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
)
const antenna = <path d="M63 12C71 3 82 4 80 13" stroke="rgba(255,255,255,0.5)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
const heart = <path d="M36 26C32 21 25 23 25 29C25 34 31 38 36 43C41 38 47 34 47 29C47 23 40 21 36 26Z" fill="rgba(255,255,255,0.35)" />

/**
 * The mascot, silhouetted into a product card. Six hand-drawn variants used to
 * live here — they are one component now, driven by the card's face colour,
 * and they reuse the real logo silhouette so the mark never drifts.
 */
function blob(face: string, deco?: React.ReactNode) {
  return function Blob() {
    return (
      <svg className="card-blob-c" viewBox="0 0 80 80" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d={MOWLO_BODY_PATH} fill="rgba(0,0,0,0.2)" />
        {deco}
        <circle cx="25.92" cy="35.86" r="11.63" fill="#FFFFFF" opacity="0.95" />
        <circle cx="52.07" cy="35.86" r="11.63" fill="#FFFFFF" opacity="0.95" />
        <circle cx="26.09" cy="36.05" r="6.18" fill={face} />
        <circle cx="52.13" cy="36.05" r="6.18" fill={face} />
        <circle cx="28.74" cy="33.30" r="1.39" fill="#FFFFFF" />
        <circle cx="54.78" cy="33.30" r="1.39" fill="#FFFFFF" />
        <path d="M26.48 54.58Q38.61 65.26 50.74 54.58" stroke={face} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
    )
  }
}

/** The face colour is written once and the mascot is built from it. */
const CATALOGUE = [
  { name: 'Stickers',        spec: 'Round · Square · Die-cut', bg: '#F5A623', face: '#0E0E0F' },
  { name: 'Business Cards',  spec: '85×55mm · Matte or Gloss', bg: '#1FB89E', face: '#0a5248', deco: antenna },
  { name: 'Flyers',          spec: 'A5 · A4 · DL',             bg: '#E8527A', face: '#6b1530' },
  { name: 'Tee Shirts',      spec: 'S–XXL · DTF print',        bg: '#7C5CBF', face: '#2d1b69', light: true, deco: sparkle },
  { name: 'Thank-You Cards', spec: 'A6 · custom size',         bg: '#2A9FD6', face: '#0b4a6b', deco: heart },
  { name: 'Branded Bags',    spec: 'Paper & shopping',         bg: '#8DB82B', face: '#3d5c0a', soon: true },
]

export const PRODUCTS: Product[] = CATALOGUE.map(({ deco, ...p }) => ({ ...p, Blob: blob(p.face, deco) }))

/** The custom properties a card paints itself with. */
export const cardVars = (p: Product) => ({ ['--bg']: p.bg }) as CSSProperties

/** Analytics tag for a card, e.g. `product-business-cards`. */
export const productSource = (p: Product) => `product-${p.name.toLowerCase().replace(/\s+/g, '-')}`

/**
 * The Creators line, as cards — same faces, colourways run in the brand order
 * and repeated, the last card a dark one for everything else. Names and specs
 * come from lib/merch, so a rename is one diff.
 */
const MERCH_CATALOGUE = [
  { ...MERCH.tee, bg: '#E8527A', face: '#6b1530' },
  { ...MERCH.cap, bg: '#7C5CBF', face: '#2d1b69', light: true, deco: sparkle },
  { ...MERCH.socks, bg: '#F5A623', face: '#0E0E0F' },
  { ...MERCH.bottle, bg: '#2A9FD6', face: '#0b4a6b' },
  { ...MERCH.sticker, bg: '#1FB89E', face: '#0a5248', deco: antenna },
  { ...MERCH.keyholder, bg: '#8DB82B', face: '#3d5c0a' },
  { ...MERCH.card, bg: '#F0EDE8', face: '#0E0E0F', deco: heart },
  { ...MERCH.mug, bg: '#FFD152', face: '#6b4400' },
  { name: 'And more', spec: 'Wristbands, and whatever’s next.', bg: '#1E1E22', face: '#F5A623', light: true, deco: sparkle },
]

export const MERCH_PRODUCTS: Product[] = MERCH_CATALOGUE.map(({ deco, ...p }: { deco?: React.ReactNode } & Omit<Product, 'Blob'>) => ({
  ...p,
  Blob: blob(p.face, deco),
}))
