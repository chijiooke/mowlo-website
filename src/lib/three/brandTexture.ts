import { CanvasTexture, NoColorSpace, RepeatWrapping, SRGBColorSpace, TextureLoader, type Texture } from 'three'
import { MOWLO_BODY_PATH } from '@/components/MowloLogo'

/**
 * Print faces for the product scenes, drawn on canvas in Mowlo's own identity —
 * the mascot, the wordmark, the brand colours and the print-shop patterns.
 * Every face also has a blank: the stock before it is printed.
 *
 * No prices and no invented customer brands on any face.
 */

export type Face = 'card-front' | 'card-back' | 'sheet' | 'mascot' | 'badge' | 'flyer' | 'bag' | 'mug' | 'tee' | 'cap' | 'sock' | 'bottle' | 'sticker-neon' | 'sticker-worn' | 'sticker-burst'

/** What the badge is printed on. */
export type BadgeGround = 'pink' | 'ink' | 'teal'

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
  cap: [1024, 640], // the front panels, as the patch on the crown unrolls
  sock: [2048, 832], // cuff → toe along x, once round along y: ~3.4 × 1.4 units
  bottle: [1024, 640], // the wrap, unrolled: once round (2πr ≈ 2.6) by the straight wall (≈ 1.6)
  'sticker-neon': [1024, 1024],
  'sticker-worn': [1024, 1024],
  'sticker-burst': [1024, 1024],
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
  /** The cap's twill: purple, a shade deeper than the brand purple so the mark reads. */
  twill: '#5E43A3',
  cotton: '#EDEBE6',
  /** The bottle's powder coat: the brand pink, a touch deeper so the wrap reads on it. */
  bottle: '#E0466F',
}

/** The grounds a badge can be printed on, by name. */
const GROUNDS: Record<BadgeGround, string> = { pink: C.pink, ink: C.ink, teal: C.teal }

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


// ── Landing stickers ──────────────────────────────────────────────────────

/** The landing stickers' grounds and inks. */
export const STICKER_INK = {
  neon: { ground: '#A6D93A', back: '#CBE98A' },
  worn: { ground: '#F2B21F', back: '#EED9A4' },
  burst: { ground: '#1D6C86', border: '#A9DCCB', ink: '#F59AB8', back: '#EEF3F0' },
}

/**
 * The burst sticker's die-cut edge: radius at angle t, as a share of the
 * sticker's radius. Shared with the geometry, so print and cut line up.
 */
export const burstRadius = (t: number) => 0.94 + 0.06 * Math.cos(t * 16)

/** Type set round a circle, centred on the top, reading clockwise. */
function ringText(ctx: Ctx, text: string, cx: number, cy: number, r: number, px: number, colour: string, start = -Math.PI / 2) {
  setFont(ctx, 800, px, display())
  ctx.fillStyle = colour
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const chars = Array.from(text)
  // Spread to fill the whole ring exactly, so the line meets itself.
  const step = (Math.PI * 2) / chars.length
  chars.forEach((ch, i) => {
    const a = start + i * step
    ctx.save()
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    ctx.rotate(a + Math.PI / 2)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
}

/** The mascot as an ink drawing: a thick, slightly wobbly outline and its face, no fill. */
function inkMascot(ctx: Ctx, cx: number, cy: number, size: number, ink: string) {
  bodyPath ??= new Path2D(MOWLO_BODY_PATH)
  const s = size / MASCOT_BOUNDS.w
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(s, s)
  ctx.translate(-(MASCOT_BOUNDS.x + MASCOT_BOUNDS.w / 2), -(MASCOT_BOUNDS.y + MASCOT_BOUNDS.h / 2))
  ctx.strokeStyle = ink
  ctx.fillStyle = ink
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  // Two passes a hair apart: a marker line, not a vector one.
  for (const [dx, dy, w] of [[0, 0, 5.2], [0.6, -0.4, 3.4]]) {
    ctx.save()
    ctx.translate(dx, dy)
    ctx.lineWidth = w
    ctx.stroke(bodyPath)
    ctx.restore()
  }
  for (const [x, y] of [[26, 34], [52, 34]]) {
    ctx.beginPath()
    ctx.ellipse(x, y, 4.6, 6.4, 0.1, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(23, 51)
  ctx.quadraticCurveTo(39, 66, 55, 50)
  ctx.stroke()
  ctx.restore()
}

/** A scuffed ink edge round a circle: many faint, jittered strokes, like worn print. */
function scuffedRing(ctx: Ctx, cx: number, cy: number, r: number, width: number, ink: string, seed: number) {
  ctx.save()
  ctx.strokeStyle = ink
  ctx.lineCap = 'round'
  let k = seed * 9301
  const rand = () => ((k = (k * 9301 + 49297) % 233280) / 233280)
  for (let pass = 0; pass < 46; pass++) {
    ctx.globalAlpha = 0.18 + rand() * 0.3
    ctx.lineWidth = width * (0.15 + rand() * 0.5)
    const a0 = rand() * Math.PI * 2
    const span = 0.6 + rand() * 2.2
    const rr = r - width * 0.6 + (rand() - 0.5) * width * 0.5
    ctx.beginPath()
    ctx.arc(cx, cy, rr, a0, a0 + span)
    ctx.stroke()
  }
  ctx.restore()
}

// ── Faces ─────────────────────────────────────────────────────────────────

type Draw = (ctx: Ctx, w: number, h: number, ground?: BadgeGround) => void

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

  badge: (ctx, w, h, ground = 'pink') => {
    const r = w / 2
    const dark = ground === 'ink'
    ctx.save()
    ctx.beginPath()
    ctx.arc(r, r, r, 0, Math.PI * 2)
    ctx.clip()
    fill(ctx, w, h, GROUNDS[ground])
    // The stripes and the wordmark swap with the ground — both are drawn in ink,
    // which disappears on an ink badge.
    stripes(ctx, w, h, dark ? 'rgba(240, 237, 232, 0.1)' : 'rgba(10, 10, 11, 0.08)', w * 0.02, w * 0.04, Math.PI / 4)
    ctx.strokeStyle = C.bone
    ctx.lineWidth = w * 0.014
    ctx.beginPath()
    ctx.arc(r, r, r * 0.84, 0, Math.PI * 2)
    ctx.stroke()
    mascot(ctx, r, r * 0.8, r * 0.8)
    wordmark(ctx, r, r * 1.45, r * 0.3, dark ? C.bone : C.ink, 'center')
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

  cap: (ctx, w, h) => {
    // The panel's own twill, so the patch meets the crown without a seam; the
    // mark is set low on the front panels, where a cap's embroidery sits.
    fill(ctx, w, h, C.twill)
    mascot(ctx, w * 0.5, h * 0.5, h * 0.46)
    wordmark(ctx, w * 0.5, h * 0.86, h * 0.18, C.bone, 'center')
  },

  'sticker-neon': (ctx, w, h) => {
    // Edge to edge: no white margin. Type round the rim, the mascot drawn in ink.
    const c = w / 2
    fill(ctx, w, h, STICKER_INK.neon.ground)
    ringText(ctx, 'YOU DROP IT · THEY COP IT · WE SHIP IT · ', c, c, c * 0.8, w * 0.088, C.ink)
    inkMascot(ctx, c, c * 1.02, w * 0.4, C.ink)
  },

  'sticker-worn': (ctx, w, h) => {
    // Amber, a big face, and an inky edge scuffed like a sticker that's been around.
    const c = w / 2
    fill(ctx, w, h, STICKER_INK.worn.ground)
    ctx.save()
    ctx.translate(c, c * 1.04)
    ctx.scale(w / 80 * 0.7, w / 80 * 0.7)
    ctx.translate(-39, -40)
    // Just the face, big: the ground is the mascot's own amber.
    drawMascotNative(ctx, STICKER_INK.worn.ground, true)
    ctx.restore()
    scuffedRing(ctx, c, c, c, w * 0.04, '#1B1712', 3)
    grainOver(ctx, w, h, 0.08)
  },

  'sticker-burst': (ctx, w, h) => {
    // A scalloped die-cut: mint border, deep teal inside, puffy pink type.
    const c = w / 2
    fill(ctx, w, h, STICKER_INK.burst.border)
    ctx.fillStyle = STICKER_INK.burst.ground
    ctx.beginPath()
    for (let i = 0; i <= 360; i++) {
      const t = (i / 360) * Math.PI * 2
      const r = c * burstRadius(t) * 0.86
      const x = c + Math.cos(t) * r
      const y = c + Math.sin(t) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.fill()
    // Puffy: each word filled and then stroked fat in the same pink, round-joined.
    const puffy = (text: string, y: number, px: number) => {
      setFont(ctx, 800, px, display())
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${px * 0.06}px`
      ctx.lineJoin = 'round'
      ctx.strokeStyle = STICKER_INK.burst.ink
      ctx.lineWidth = px * 0.07
      ctx.strokeText(text, c, y)
      ctx.fillStyle = STICKER_INK.burst.ink
      ctx.fillText(text, c, y)
    }
    puffy('DROP', c * 0.7, w * 0.17)
    puffy('is', c * 1.0, w * 0.09)
    puffy('LIVE', c * 1.3, w * 0.17)
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  },

  bottle: (ctx, w, h) => {
    // Powder-coated pink, with one ribbon looping round the bottle in the
    // brand's purple turning to lime, and the mark set upright on the front.
    // u = 0.5 is the front (the wall's UVs start at the back, as on the mug).
    fill(ctx, w, h, C.bottle)
    ctx.save()
    const grad = ctx.createLinearGradient(0, 0, w, 0)
    grad.addColorStop(0, C.lime)
    grad.addColorStop(0.35, C.purple)
    grad.addColorStop(0.75, C.purple)
    grad.addColorStop(1, C.lime)
    ctx.strokeStyle = grad
    ctx.lineWidth = h * 0.075
    ctx.lineCap = 'round'
    ctx.beginPath()
    for (let x = -10; x <= w + 10; x += 4) {
      const t = x / w
      const y = h * (0.62 + 0.26 * Math.sin(t * Math.PI * 2 + 0.6) + 0.06 * Math.sin(t * Math.PI * 6))
      if (x === -10) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    // A loop in the ribbon, on the back.
    ctx.beginPath()
    ctx.arc(w * 0.13, h * 0.42, h * 0.12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
    mascot(ctx, w * 0.5, h * 0.36, h * 0.34)
    wordmark(ctx, w * 0.5, h * 0.66, h * 0.13, C.bone, 'center')
    label(ctx, 'Drink up. Drop more.', w * 0.5, h * 0.76, h * 0.045, 'rgba(240, 237, 232, 0.85)', 'center', 600)
  },

  sock: (ctx, w, h) => {
    // x runs from the cuff (0) to the toe (1); y is once round the sock.
    fill(ctx, w, h, C.cotton)
    const at = (u: number) => u * w
    // Rib cuff: amber and ink bands.
    ctx.fillStyle = C.amber
    ctx.fillRect(0, 0, at(0.05), h)
    ctx.fillStyle = C.ink
    ctx.fillRect(at(0.07), 0, at(0.018), h)
    ctx.fillRect(at(0.1), 0, at(0.018), h)
    // Heel and toe in amber, as on a knitted sock.
    ctx.fillStyle = C.amber
    ctx.fillRect(at(SOCK_HEEL[0]), 0, at(SOCK_HEEL[1] - SOCK_HEEL[0]), h)
    ctx.fillRect(at(0.9), 0, at(0.1), h)
    // Mascots down the leg and along the foot, upright to someone wearing it:
    // their heads point back up the leg, toward x = 0.
    const size = h * 0.2
    for (const [from, to] of [[0.15, SOCK_HEEL[0] - 0.02], [SOCK_HEEL[1] + 0.03, 0.87]]) {
      let row = 0
      for (let u = from + 0.03; u < to; u += 0.055, row++) {
        for (let k = 0; k < 3; k++) {
          const y = ((k + (row % 2) * 0.5) / 3) * h + h / 6
          // Drawn again one turn either side, so a mascot on the wrap seam is whole.
          for (const turn of [-h, 0, h]) mascot(ctx, at(u), y + turn, size, -Math.PI / 2)
        }
      }
    }
  },
}

/** Where the heel sits along the sock, as a share of its length (see Socks). */
export const SOCK_HEEL: [number, number] = [0.47, 0.6]

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
  cap: (ctx, w, h) => fill(ctx, w, h, C.twill),
  sock: (ctx, w, h) => fill(ctx, w, h, C.cotton),
  bottle: (ctx, w, h) => fill(ctx, w, h, C.bottle),
  'sticker-neon': (ctx, w, h) => fill(ctx, w, h, STICKER_INK.neon.back),
  'sticker-worn': (ctx, w, h) => fill(ctx, w, h, STICKER_INK.worn.back),
  'sticker-burst': (ctx, w, h) => fill(ctx, w, h, STICKER_INK.burst.back),
}

function draw(canvas: HTMLCanvasElement, face: Face, printed: boolean, ground?: BadgeGround) {
  const ctx = canvas.getContext('2d') as Ctx
  const { width: w, height: h } = canvas
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  ;(printed ? PRINTED : BLANK)[face](ctx, w, h, ground)
  ctx.restore()
}

// ── Textures ──────────────────────────────────────────────────────────────

export interface FaceOptions {
  /** False for the blank stock. */
  printed: boolean
  /** 1 on phones, 2 for crisp desktop close-ups. */
  scale?: 1 | 2
  /** Badge only: what it is printed on. Default pink. */
  ground?: BadgeGround
}

const cache = new Map<string, CanvasTexture>()

/**
 * A cached texture for a face. Drawn at once with whatever fonts are ready,
 * then redrawn when the web fonts land, so no frame waits on them. Cached
 * textures are shared: never dispose one from a component.
 */
export function faceTexture(face: Face, { printed, scale = 1, ground = 'pink' }: FaceOptions): CanvasTexture {
  const key = `${face}|${printed ? 'printed' : 'blank'}|${scale}|${ground}`
  const hit = cache.get(key)
  if (hit) return hit

  const [w, h] = SIZES[face]
  const canvas = document.createElement('canvas')
  canvas.width = w * scale
  canvas.height = h * scale
  draw(canvas, face, printed, ground)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cache.set(key, texture)

  if (printed) {
    document.fonts.ready.then(() => {
      draw(canvas, face, printed, ground)
      texture.needsUpdate = true
    })
  }
  return texture
}

let photo: Texture | null = null

/**
 * The photographed crumpled sheet. Relief rather than colour — no colour space —
 * for surfaces that should carry real creases instead of paperBump's fine grain.
 */
export function paperPhoto(): Texture {
  if (photo) return photo
  photo = new TextureLoader().load('/assets/paper-crumpled.jpg')
  photo.colorSpace = NoColorSpace
  photo.wrapS = photo.wrapT = RepeatWrapping
  return photo
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

/**
 * The mascot in shades, as a one-colour print: a white body, the glaze
 * showing through as the lenses' outline and the smile, so it reads as the
 * same white ink as the type.
 */
function coolMascot(ctx: Ctx, cx: number, cy: number, size: number, glaze: string) {
  bodyPath ??= new Path2D(MOWLO_BODY_PATH)
  const s = size / MASCOT_BOUNDS.w
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(s, s)
  ctx.translate(-(MASCOT_BOUNDS.x + MASCOT_BOUNDS.w / 2), -(MASCOT_BOUNDS.y + MASCOT_BOUNDS.h / 2))
  ctx.fillStyle = '#FFFFFF'
  ctx.fill(bodyPath)
  // Shades: two rounded lenses on a bridge, across where the eyes sit.
  ctx.fillStyle = C.ink
  const lens = (x: number) => {
    ctx.beginPath()
    ctx.roundRect(x - 11.5, 28.5, 23, 15, [3, 3, 9, 9])
    ctx.fill()
  }
  lens(26)
  lens(52)
  ctx.fillRect(36, 30.5, 6, 3.4)
  // A glint on each lens.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  for (const x of [20, 46]) {
    ctx.beginPath()
    ctx.moveTo(x, 34)
    ctx.lineTo(x + 4, 31)
    ctx.stroke()
  }
  // A smirk, in the glaze colour.
  ctx.strokeStyle = glaze
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(29, 55)
  ctx.quadraticCurveTo(42, 63, 52, 52)
  ctx.stroke()
  ctx.restore()
}

const mugCache = new Map<string, CanvasTexture>()

/**
 * A glazed mug's wrap: one solid glaze colour, and — printed — "main
 * character energy" set small in white on the front (u = 0.5), the way the
 * reference mugs carry a single mark, with the mascot in shades under it. `aspect` is the wrap's width over its
 * height, so the type keeps its shape on a stubby mug.
 */
export function glazeTexture(colour: string, printed: boolean, aspect: number): CanvasTexture {
  const key = `${colour}|${printed}|${aspect.toFixed(2)}`
  const hit = mugCache.get(key)
  if (hit) return hit
  const w = 1024
  const h = Math.round(w / aspect)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const paint = () => {
    const ctx = canvas.getContext('2d') as Ctx
    fill(ctx, w, h, colour)
    if (!printed) return
    const px = h * 0.15
    setFont(ctx, 800, px, display())
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${-0.03 * px}px`
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const lines = ['main', 'character', 'energy.']
    // The type sits a little high, leaving room for the mascot under it.
    lines.forEach((line, i) => ctx.fillText(line, w * 0.5, h * 0.36 + (i - 1) * px * 0.95))
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
    coolMascot(ctx, w * 0.5, h * 0.74, h * 0.22, colour)
  }
  paint()
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  mugCache.set(key, texture)
  if (printed) {
    document.fonts.ready.then(() => {
      paint()
      texture.needsUpdate = true
    })
  }
  return texture
}
