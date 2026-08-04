/**
 * Artist's Corner gallery — data layer.
 *
 * The Mowlo API has no public artwork feed yet (`GET /artworks` is scoped to a
 * signed-in artist's own works pool). Until it does, the gallery is served from
 * the seed below via `/api/gallery`.
 *
 * To switch to the live API, replace the body of `getGalleryPage` — the route
 * handler, the grid, and the `GalleryItem` shape all stay as they are.
 */

export const CATEGORIES = ['Stickers', 'Cards', 'Flyers', 'Packaging', 'Labels', 'Posters'] as const
export type Category = (typeof CATEGORIES)[number]

type Accent = 'amber' | 'teal' | 'pink' | 'purple' | 'sky' | 'lime'

export interface GalleryItem {
  id: string
  title: string
  artist: string
  handle: string
  city: string
  src: string
  alt: string
  /** width ÷ height of the card crop — this is what gives the masonry its rhythm */
  ratio: number
  category: Category
  accent: Accent
}

export interface GalleryPage {
  items: GalleryItem[]
  /** null when there is nothing left to load */
  nextPage: number | null
  total: number
}

export const PAGE_SIZE = 12

/* ── Source material ─────────────────────────────────────────────────────── */

const PHOTOS = {
  ayra:      { src: '/assets/ayra-beauty.jpg',                                                        alt: 'Skincare range styled with printed brand labels' },
  cosmetic:  { src: '/assets/cosmetic-male-beauty-products-with-display.jpg',                          alt: 'Grooming products on a display stand with printed cards' },
  stone:     { src: '/assets/view-male-beauty-products-with-rock-stone-display.jpg',                   alt: 'Beauty products arranged on a stone display' },
  kombucha:  { src: '/assets/delicious-kombucha-drink-arrangement.jpg',                                alt: 'Bottled drinks arranged with printed product labels' },
  booth:     { src: '/assets/night-booth.png',                                                         alt: 'Market stall lit up at night' },
  bags:      { src: '/assets/vecteezy_colorful-paper-shopping-bags_27614808.jpg',                       alt: 'Colourful branded paper shopping bags' },
  hustle:    { src: '/assets/side-hustle.jpg',                                                          alt: 'Small business owner at work on a side hustle' },
  garage:    { src: '/assets/side-view-man-garage-sale.jpg',                                            alt: 'Seller behind a table of goods at a weekend sale' },
  happy:     { src: '/assets/happy-mowlo.jpg',                                                          alt: 'Customer holding a completed Mowlo print order' },
  studio:    { src: '/assets/man-working-animation-studio.jpg',                                         alt: 'Designer working on artwork at a studio desk' },
  neural:    { src: '/assets/computer-scientist-updating-artificial-intelligence-neural-networks-home.jpg', alt: 'Designer refining generated artwork on screen' },
  diffusion: { src: '/assets/woman-home-using-generative-artificial-intelligence-website-generating-videos-using-diffusion.jpg', alt: 'Artist generating brand visuals at home' },
} satisfies Record<string, { src: string; alt: string }>

const ARTISTS = {
  tobi:   { artist: 'Tobi Adeyemi',   handle: '@tobi.art',      city: 'Lagos',         accent: 'amber'  },
  amara:  { artist: 'Amara Nwosu',    handle: '@amaradraws',    city: 'Enugu',         accent: 'pink'   },
  kwesi:  { artist: 'Kwesi Mensah',   handle: '@kwesi.studio',  city: 'Accra',         accent: 'teal'   },
  zainab: { artist: 'Zainab Bello',   handle: '@zeeprints',     city: 'Abuja',         accent: 'purple' },
  efe:    { artist: 'Efe Okorie',     handle: '@efe.makes',     city: 'Port Harcourt', accent: 'sky'    },
  adjoa:  { artist: 'Adjoa Boateng',  handle: '@adjoa.ink',     city: 'Kumasi',        accent: 'lime'   },
  seyi:   { artist: 'Seyi Balogun',   handle: '@seyibalogun',   city: 'Ibadan',        accent: 'amber'  },
  nneka:  { artist: 'Nneka Eze',      handle: '@nneka.design',  city: 'Lagos',         accent: 'teal'   },
} satisfies Record<string, { artist: string; handle: string; city: string; accent: Accent }>

/** Crop ratios — the same photo reads as a different card at a different ratio. */
const TALL = 0.68
const PORTRAIT = 0.8
const SQUARE = 1
const WIDE = 1.4

type Work = [keyof typeof PHOTOS, keyof typeof ARTISTS, Category, number, string]

const WORKS: Work[] = [
  ['ayra',      'nneka',  'Labels',    TALL,     'Rosewater Edit — bottle labels'],
  ['booth',     'tobi',   'Posters',   SQUARE,   'Night Market — stall poster set'],
  ['bags',      'adjoa',  'Packaging', WIDE,     'Kente Pop — carrier bags'],
  ['studio',    'kwesi',  'Posters',   PORTRAIT, 'Desk Days — studio print'],
  ['kombucha',  'efe',    'Labels',    SQUARE,   'Fizz Club — wrap-around labels'],
  ['hustle',    'seyi',   'Flyers',    WIDE,     'Open Saturdays — A5 flyer run'],
  ['cosmetic',  'zainab', 'Cards',     TALL,     'Clean Shave Co. — product cards'],
  ['diffusion', 'amara',  'Posters',   WIDE,     'Soft Machine — generative series'],
  ['garage',    'tobi',   'Flyers',    PORTRAIT, 'Weekend Table — market flyer'],
  ['stone',     'nneka',  'Cards',     TALL,     'Basalt — insert card set'],
  ['happy',     'adjoa',  'Stickers',  WIDE,     'Thank You, Sis — sticker sheet'],
  ['neural',    'kwesi',  'Stickers',  PORTRAIT, 'Circuit Bloom — die-cut pack'],

  ['bags',      'zainab', 'Packaging', PORTRAIT, 'Abuja Blues — gift bag run'],
  ['kombucha',  'amara',  'Stickers',  PORTRAIT, 'Sour Patch — round stickers'],
  ['ayra',      'seyi',   'Packaging', PORTRAIT, 'Glow Ritual — box sleeves'],
  ['booth',     'efe',    'Flyers',    WIDE,     'After Dark — event flyers'],
  ['studio',    'tobi',   'Cards',     WIDE,     'Studio Hours — business cards'],
  ['garage',    'nneka',  'Posters',   SQUARE,   'Everything Must Go — poster'],
  ['diffusion', 'kwesi',  'Cards',     PORTRAIT, 'Ghost Layer — folded cards'],
  ['hustle',    'adjoa',  'Stickers',  SQUARE,   'Grind Season — laptop stickers'],
  ['stone',     'amara',  'Labels',    TALL,     'Riverbed — jar labels'],
  ['neural',    'zainab', 'Posters',   WIDE,     'Signal Path — A2 poster'],
  ['happy',     'seyi',   'Cards',     PORTRAIT, 'Big Day — thank-you cards'],
  ['cosmetic',  'efe',    'Packaging', TALL,     'Barber Bar — sleeve packaging'],

  ['bags',      'tobi',   'Stickers',  SQUARE,   'Bag Tag — logo stickers'],
  ['kombucha',  'nneka',  'Packaging', PORTRAIT, 'Six Pack — carrier wrap'],
  ['booth',     'amara',  'Stickers',  PORTRAIT, 'Stall Kit — price stickers'],
  ['studio',    'zainab', 'Flyers',    WIDE,     'Open Studio — DL flyers'],
  ['ayra',      'kwesi',  'Cards',     TALL,     'Petal Count — loyalty cards'],
  ['garage',    'adjoa',  'Cards',     WIDE,     'Second Life — trade cards'],
  ['neural',    'seyi',   'Labels',    PORTRAIT, 'Overclock — spine labels'],
  ['diffusion', 'efe',    'Stickers',  WIDE,     'Dream Feed — holo stickers'],
  ['hustle',    'zainab', 'Posters',   PORTRAIT, 'Still Building — wall print'],
  ['stone',     'tobi',   'Packaging', TALL,     'Quarry — rigid box print'],
  ['happy',     'kwesi',  'Flyers',    WIDE,     'Order Up — promo flyers'],
  ['cosmetic',  'amara',  'Labels',    TALL,     'Fresh Cut — tube labels'],

  ['booth',     'nneka',  'Packaging', SQUARE,   'Late Trade — takeaway bags'],
  ['bags',      'efe',    'Flyers',    WIDE,     'Bag & Go — insert flyers'],
  ['kombucha',  'seyi',   'Cards',     SQUARE,   'Brew Note — tasting cards'],
  ['studio',    'adjoa',  'Stickers',  PORTRAIT, 'Pencil Dust — sticker pack'],
  ['garage',    'kwesi',  'Packaging', WIDE,     'Boot Sale — wrap paper'],
  ['ayra',      'zainab', 'Posters',   TALL,     'Second Skin — display poster'],
  ['neural',    'amara',  'Cards',     PORTRAIT, 'Latent — appointment cards'],
  ['diffusion', 'nneka',  'Labels',    WIDE,     'Render Farm — spec labels'],
  ['hustle',    'efe',    'Cards',     WIDE,     'Day One — starter cards'],
  ['stone',     'seyi',   'Stickers',  TALL,     'Cold Press — seal stickers'],
  ['happy',     'tobi',   'Packaging', WIDE,     'Handover — branded mailers'],
  ['cosmetic',  'adjoa',  'Flyers',    TALL,     'Chair Four — barber flyers'],
]

export const SEED: GalleryItem[] = WORKS.map(([photo, artist, category, ratio, title], i) => ({
  id: `w${String(i + 1).padStart(3, '0')}`,
  title,
  category,
  ratio,
  ...PHOTOS[photo],
  ...ARTISTS[artist],
}))

/* ── Access ──────────────────────────────────────────────────────────────── */

/** Page through the catalogue, optionally narrowed to one category. */
export function getGalleryPage(page: number, category?: string | null): GalleryPage {
  const pool = isCategory(category) ? SEED.filter(w => w.category === category) : SEED
  const start = (page - 1) * PAGE_SIZE
  const items = pool.slice(start, start + PAGE_SIZE)
  const hasMore = start + items.length < pool.length

  return { items, nextPage: hasMore ? page + 1 : null, total: pool.length }
}

function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value)
}
