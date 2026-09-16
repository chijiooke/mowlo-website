import { CanvasTexture, NoColorSpace, RepeatWrapping, SRGBColorSpace } from 'three'
import { MOWLO_BODY_PATH } from '@/components/MowloLogo'

/**
 * Print faces for the product scenes, drawn on canvas in Mowlo's own identity —
 * the mascot, the wordmark, the brand colours and the print-shop patterns.
 * Every face also has a blank: the stock before it is printed.
 *
 * No prices and no invented customer brands on any face.
 */

export type Face = 'card-front' | 'card-back' | 'sheet' | 'mascot' | 'badge' | 'flyer' | 'bag' | 'mug' | 'tee'

/** Pixel size at scale 1, in the proportions of the surface each face wraps. */
const SIZES: Record<Face, [number, number]> = {
  'card-front': [1024, 662], // 85 × 55mm
  'card-back': [1024, 662],
  sheet: [1024, 1260], // 2.6 × 3.2
  mascot: [1024, 929], // the mascot's art bounds
  badge: [1024, 1024],
  flyer: [1024, 1459], // A5
  bag: [1024, 1265], // 1.7 × 2.1 panel
  mug: [1024, 380], // the wrap, unrolled
  tee: [1024, 512], // the chest mark, on transparent
}

const C = {
  ink: '#0A0A0B',
  face: '#0E0E0F',
  bone: '#F0EDE8',
  paper: '#F7F4EE',
  vinyl: '#FBFBF9',
  amber: '#F5A623',
  teal: '#1FB89E',
  pink: '#E8527A',
  purple: '#7C5CBF',
  purpleDeep: '#4E3490',
  sky: '#2A9FD6',
  lime: '#8DB82B',
  kraft: '#C49A6C',
  ceramic: '#F4F2EE',
}

/** The mascot's art inside its 80 × 80 viewBox (brand guide §3). */
export const MASCOT_BOUNDS = { x: 1.45, y: 5.19, w: 76.91, h: 69.78 }

// ── Fonts ─────────────────────────────────────────────────────────────────

/** next/font hashes family names; the CSS variable carries the real one. */
function family(cssVar: string, fallback: string) {
  const name = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  return name ? `${name}, ${fallback}` : fallback
}

const display = () => family('--font-bricolage', 'sans-serif')
const body = () => family('--font-dm-sans', 'sans-serif')

type Ctx = CanvasRenderingContext2D & { fontStretch?: string; letterSpacing?: string }

function setFont(ctx: Ctx, weight: number, px: number, fam: string, condensed = false) {
  ctx.font = `${weight} ${px}px ${fam}`
  if ('fontStretch' in ctx) ctx.fontStretch = condensed ? 'condensed' : 'normal'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
}

/** The largest size, up to `px`, at which every line fits `max` pixels. */
function fitSize(ctx: Ctx, lines: string[], px: number, max: number, condensed: boolean) {
  let size = px
  const fam = display()
  const widest = () => Math.max(...lines.map(l => ctx.measureText(l).width))
  setFont(ctx, 800, size, fam, condensed)
  while (widest() > max && size > 10) {
    size -= 2
    setFont(ctx, 800, size, fam, condensed)
  }
  return size
}

/** Condensed poster lines. */
function poster(ctx: Ctx, lines: string[], x: number, y: number, px: number, colour: string, max: number, align: CanvasTextAlign = 'left', leading = 0.84) {
  const size = fitSize(ctx, lines, px, max, true)
  ctx.fillStyle = colour
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * size * leading))
}

/** The Mowlo wordmark: Bricolage 800, normal width, −0.025em. */
function wordmark(ctx: Ctx, x: number, y: number, px: number, colour: string, align: CanvasTextAlign = 'left') {
  setFont(ctx, 800, px, display())
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${-0.025 * px}px`
  ctx.fillStyle = colour
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Mowlo', x, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
}

function label(ctx: Ctx, text: string, x: number, y: number, px: number, colour: string, align: CanvasTextAlign = 'left', weight = 600) {
  setFont(ctx, weight, px, body())
  ctx.fillStyle = colour
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, x, y)
}

// ── Surfaces and patterns ─────────────────────────────────────────────────

let grain: CanvasPattern | null = null

function grainOver(ctx: Ctx, w: number, h: number, alpha: number) {
  if (!grain) {
    const tile = document.createElement('canvas')
    tile.width = tile.height = 160
    const t = tile.getContext('2d')!
    const img = t.createImageData(160, 160)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    t.putImageData(img, 0, 0)
    grain = ctx.createPattern(tile, 'repeat')
  }
  if (!grain) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = grain
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

function fill(ctx: Ctx, w: number, h: number, colour: string) {
  ctx.fillStyle = colour
  ctx.fillRect(0, 0, w, h)
}

/** Kraft paper: short dark fibres over the base. */
function kraft(ctx: Ctx, w: number, h: number) {
  fill(ctx, w, h, C.kraft)
  ctx.save()
  ctx.strokeStyle = 'rgba(80, 52, 24, 0.09)'
  ctx.lineCap = 'round'
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const len = w * (0.01 + Math.random() * 0.03)
    const a = (Math.random() - 0.5) * 0.6
    ctx.lineWidth = 0.6 + Math.random() * 1.4
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.stroke()
  }
  ctx.restore()
  grainOver(ctx, w, h, 0.1)
}

/** Halftone dots that shrink away from a corner (fx, fy in 0–1). */
function halftone(ctx: Ctx, w: number, h: number, colour: string, step: number, maxR: number, fx: number, fy: number) {
  ctx.fillStyle = colour
  const diag = Math.hypot(w, h)
  let row = 0
  for (let y = step / 2; y < h + step; y += step, row++) {
    for (let x = step / 2 + (row % 2 ? step / 2 : 0); x < w + step; x += step) {
      const r = maxR * Math.max(0, 1 - (Math.hypot(x - fx * w, y - fy * h) / diag) * 1.4)
      if (r < 0.5) continue
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function stripes(ctx: Ctx, w: number, h: number, colour: string, band: number, gap: number, angle: number) {
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(angle)
  ctx.fillStyle = colour
  const reach = Math.hypot(w, h)
  for (let x = -reach; x < reach; x += band + gap) ctx.fillRect(x, -reach, band, reach * 2)
  ctx.restore()
}

function waves(ctx: Ctx, w: number, h: number, colour: string, amp: number, length: number, gap: number, width: number) {
  ctx.save()
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  for (let y = -amp; y < h + amp; y += gap) {
    ctx.beginPath()
    for (let x = 0; x <= w; x += 6) {
      const yy = y + Math.sin((x / length) * Math.PI * 2) * amp
      if (x === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function dashedEllipse(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, colour: string, width: number, dash: number[]) {
  ctx.save()
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.setLineDash(dash)
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

// ── The mascot ────────────────────────────────────────────────────────────

let bodyPath: Path2D | null = null

/** The mascot in its own viewBox units. The body is always amber — never recoloured. */
function drawMascotNative(ctx: Ctx, bodyColour = C.amber, withFace = true) {
  bodyPath ??= new Path2D(MOWLO_BODY_PATH)
  ctx.fillStyle = bodyColour
  ctx.fill(bodyPath)
  if (!withFace) return

  const dots = (points: number[][], r: number, colour: string) => {
    ctx.fillStyle = colour
    for (const [x, y] of points) {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  dots([[25.92, 35.86], [52.07, 35.86]], 11.63, '#FFFFFF')
  dots([[26.09, 36.05], [52.13, 36.05]], 6.18, C.face)
  dots([[28.74, 33.3], [54.78, 33.3]], 1.39, '#FFFFFF')

  ctx.strokeStyle = C.face
  ctx.lineWidth = 2.23
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(26.48, 54.58)
  ctx.quadraticCurveTo(38.61, 65.26, 50.74, 54.58)
  ctx.stroke()
}

/** The mascot centred on (cx, cy), `size` pixels wide. */
function mascot(ctx: Ctx, cx: number, cy: number, size: number, rotate = 0) {
  const s = size / MASCOT_BOUNDS.w
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rotate)
  ctx.scale(s, s)
  ctx.translate(-(MASCOT_BOUNDS.x + MASCOT_BOUNDS.w / 2), -(MASCOT_BOUNDS.y + MASCOT_BOUNDS.h / 2))
  drawMascotNative(ctx)
  ctx.restore()
}

/** Fills the canvas with the mascot's art bounds — for the die-cut sticker. */
function mascotToBounds(ctx: Ctx, w: number, h: number, bodyColour: string, withFace: boolean) {
  ctx.save()
  ctx.scale(w / MASCOT_BOUNDS.w, h / MASCOT_BOUNDS.h)
  ctx.translate(-MASCOT_BOUNDS.x, -MASCOT_BOUNDS.y)
  drawMascotNative(ctx, bodyColour, withFace)
  ctx.restore()
}

// ── Faces ─────────────────────────────────────────────────────────────────

type Draw = (ctx: Ctx, w: number, h: number) => void

const PRINTED: Record<Face, Draw> = {
  'card-front': (ctx, w, h) => {
    fill(ctx, w, h, C.ink)
    halftone(ctx, w, h, 'rgba(245, 166, 35, 0.55)', w * 0.022, w * 0.0075, 0, 0)
    // The mascot bleeds off the edge: printed to the trim, the way a real card is.
    mascot(ctx, w * 0.84, h * 0.68, h * 1.05, -0.12)
    const pad = w * 0.07
    wordmark(ctx, pad, h - pad - h * 0.11, h * 0.24, C.bone)
    label(ctx, 'Small business. Big brand energy.', pad, h - pad, h * 0.052, 'rgba(240, 237, 232, 0.66)')
    grainOver(ctx, w, h, 0.05)
  },

  'card-back': (ctx, w, h) => {
    fill(ctx, w, h, C.amber)
    stripes(ctx, w, h, 'rgba(10, 10, 11, 0.07)', w * 0.012, w * 0.03, -Math.PI / 4)
    const pad = w * 0.07
    poster(ctx, ['BIG BRAND', 'ENERGY.'], pad, pad + h * 0.24, h * 0.3, C.ink, w - pad * 2)
    label(ctx, 'Designed · Printed · Delivered', pad, h - pad, h * 0.05, 'rgba(10, 10, 11, 0.72)', 'left', 700)
    mascot(ctx, w - pad - h * 0.16, h - pad - h * 0.13, h * 0.32)
    grainOver(ctx, w, h, 0.05)
  },

  sheet: (ctx, w, h) => {
    fill(ctx, w, h, C.teal)
    halftone(ctx, w, h, 'rgba(240, 237, 232, 0.22)', w * 0.03, w * 0.009, 1, 1)
    // Kiss-cut guides where the stickers sit — positions mirror StickerSheet.
    const x = (u: number) => (0.5 + u / 2.6) * w
    const y = (v: number) => (0.5 - v / 3.2) * h
    const guide = 'rgba(240, 237, 232, 0.6)'
    const dash = [w * 0.018, w * 0.012]
    dashedEllipse(ctx, x(0), y(0.45), (1.95 / 2 / 2.6) * w, (1.8 / 2 / 3.2) * h, guide, w * 0.004, dash)
    dashedEllipse(ctx, x(-0.62), y(-0.95), (0.6 / 2.6) * w, (0.6 / 3.2) * h, guide, w * 0.004, dash)
    const pad = w * 0.08
    wordmark(ctx, w - pad, h - pad - w * 0.06, w * 0.075, C.ink, 'right')
    label(ctx, 'Die-cut to any shape', w - pad, h - pad, w * 0.03, 'rgba(10, 10, 11, 0.72)', 'right', 700)
    grainOver(ctx, w, h, 0.04)
  },

  mascot: (ctx, w, h) => mascotToBounds(ctx, w, h, C.amber, true),

  badge: (ctx, w, h) => {
    const r = w / 2
    ctx.save()
    ctx.beginPath()
    ctx.arc(r, r, r, 0, Math.PI * 2)
    ctx.clip()
    fill(ctx, w, h, C.pink)
    stripes(ctx, w, h, 'rgba(10, 10, 11, 0.08)', w * 0.02, w * 0.04, Math.PI / 4)
    ctx.strokeStyle = C.bone
    ctx.lineWidth = w * 0.014
    ctx.beginPath()
    ctx.arc(r, r, r * 0.84, 0, Math.PI * 2)
    ctx.stroke()
    mascot(ctx, r, r * 0.8, r * 0.8)
    wordmark(ctx, r, r * 1.45, r * 0.3, C.ink, 'center')
    ctx.restore()
  },

  flyer: (ctx, w, h) => {
    fill(ctx, w, h, C.paper)
    const block = h * 0.64
    ctx.fillStyle = C.pink
    ctx.fillRect(0, 0, w, block)
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, w, block)
    ctx.clip()
    halftone(ctx, w, block, 'rgba(10, 10, 11, 0.2)', w * 0.028, w * 0.01, 1, 0)
    ctx.restore()

    const pad = w * 0.08
    label(ctx, 'MOWLO PRESENTS', pad, pad + w * 0.03, w * 0.032, C.ink, 'left', 700)
    poster(ctx, ['BIG', 'BRAND', 'ENERGY.'], pad, h * 0.24, h * 0.14, C.ink, w - pad * 2, 'left', 0.82)
    mascot(ctx, w * 0.76, block, w * 0.4, 0.14)
    poster(ctx, ['Stickers · Cards · Flyers', 'Bags · Mugs · Tees'], pad, h * 0.76, h * 0.042, C.ink, w * 0.6, 'left', 1.1)
    label(ctx, 'Designed, printed & delivered — Nigeria & Ghana', pad, h - pad, w * 0.028, 'rgba(10, 10, 11, 0.6)', 'left', 500)
    grainOver(ctx, w, h, 0.05)
  },

  bag: (ctx, w, h) => {
    kraft(ctx, w, h)
    ctx.fillStyle = C.purple
    ctx.fillRect(0, 0, w, h * 0.085)
    halftone(ctx, w, h * 0.085, 'rgba(240, 237, 232, 0.35)', w * 0.02, w * 0.006, 0, 0)
    mascot(ctx, w / 2, h * 0.46, w * 0.52)
    wordmark(ctx, w / 2, h * 0.8, w * 0.17, C.purpleDeep, 'center')
    label(ctx, 'Small business. Big brand energy.', w / 2, h * 0.87, w * 0.034, 'rgba(78, 52, 144, 0.9)', 'center')
    grainOver(ctx, w, h, 0.06)
  },

  mug: (ctx, w, h) => {
    fill(ctx, w, h, C.sky)
    waves(ctx, w, h, 'rgba(240, 237, 232, 0.28)', h * 0.03, w * 0.12, h * 0.1, h * 0.012)
    // u = 0.5 is the front of the mug; the art runs round to the right.
    mascot(ctx, w * 0.4, h * 0.52, h * 0.72)
    poster(ctx, ['BIG BRAND', 'ENERGY.'], w * 0.52, h * 0.44, h * 0.24, C.ink, w * 0.44)
  },

  tee: (ctx, w, h) => {
    // A small chest mark on transparent: the mascot and the wordmark.
    mascot(ctx, h * 0.48, h * 0.5, h * 0.86)
    wordmark(ctx, h * 0.98, h * 0.66, h * 0.3, C.ink)
  },
}

const BLANK: Record<Face, Draw> = {
  'card-front': (ctx, w, h) => (fill(ctx, w, h, C.paper), grainOver(ctx, w, h, 0.05)),
  'card-back': (ctx, w, h) => (fill(ctx, w, h, C.paper), grainOver(ctx, w, h, 0.05)),
  sheet: (ctx, w, h) => (fill(ctx, w, h, C.paper), grainOver(ctx, w, h, 0.04)),
  mascot: (ctx, w, h) => mascotToBounds(ctx, w, h, C.vinyl, false),
  badge: (ctx, w, h) => {
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2)
    ctx.fillStyle = C.vinyl
    ctx.fill()
  },
  flyer: (ctx, w, h) => (fill(ctx, w, h, C.paper), grainOver(ctx, w, h, 0.05)),
  bag: (ctx, w, h) => kraft(ctx, w, h),
  mug: (ctx, w, h) => fill(ctx, w, h, C.ceramic),
  tee: () => {}, // unprinted: no ink at all
}

function draw(canvas: HTMLCanvasElement, face: Face, printed: boolean) {
  const ctx = canvas.getContext('2d') as Ctx
  const { width: w, height: h } = canvas
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  ;(printed ? PRINTED : BLANK)[face](ctx, w, h)
  ctx.restore()
}

// ── Textures ──────────────────────────────────────────────────────────────

export interface FaceOptions {
  /** False for the blank stock. */
  printed: boolean
  /** 1 on phones, 2 for crisp desktop close-ups. */
  scale?: 1 | 2
}

const cache = new Map<string, CanvasTexture>()

/**
 * A cached texture for a face. Drawn at once with whatever fonts are ready,
 * then redrawn when the web fonts land, so no frame waits on them. Cached
 * textures are shared: never dispose one from a component.
 */
export function faceTexture(face: Face, { printed, scale = 1 }: FaceOptions): CanvasTexture {
  const key = `${face}|${printed ? 'printed' : 'blank'}|${scale}`
  const hit = cache.get(key)
  if (hit) return hit

  const [w, h] = SIZES[face]
  const canvas = document.createElement('canvas')
  canvas.width = w * scale
  canvas.height = h * scale
  draw(canvas, face, printed)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cache.set(key, texture)

  if (printed) {
    document.fonts.ready.then(() => {
      draw(canvas, face, printed)
      texture.needsUpdate = true
    })
  }
  return texture
}

let bump: CanvasTexture | null = null

/** Fine paper and fibre relief, shared by every printed surface as a bump map. */
export function paperBump(): CanvasTexture {
  if (bump) return bump
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(256, 256)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 90
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  bump = new CanvasTexture(canvas)
  bump.colorSpace = NoColorSpace
  bump.wrapS = bump.wrapT = RepeatWrapping
  bump.repeat.set(3, 3)
  return bump
}
