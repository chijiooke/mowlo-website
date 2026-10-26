import {
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  Quaternion,
  Shape,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type PlaneGeometry,
} from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { MOWLO_BODY_PATH } from '@/components/MowloLogo'

// ── Outlines ──────────────────────────────────────────────────────────────

export function roundedRectShape(width: number, height: number, radius: number): Shape {
  const x = -width / 2
  const y = -height / 2
  const r = Math.min(radius, width / 2, height / 2)
  const shape = new Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + r)
  shape.lineTo(x + width, y + height - r)
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  shape.lineTo(x + r, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

export function circleShape(radius: number): Shape {
  const shape = new Shape()
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false)
  return shape
}

/** A tee laid flat: neckline, shoulders, sleeves, body. About 3.1 × 2.5 units. */
export function teeShape(): Shape {
  const s = new Shape()
  s.moveTo(-0.34, 1.22)
  s.quadraticCurveTo(0, 0.95, 0.34, 1.22)
  s.lineTo(0.78, 1.14)
  s.quadraticCurveTo(1.2, 0.95, 1.55, 0.62)
  s.lineTo(1.2, 0.08)
  s.lineTo(0.92, 0.34)
  s.lineTo(0.92, -1.2)
  s.quadraticCurveTo(0, -1.3, -0.92, -1.2)
  s.lineTo(-0.92, 0.34)
  s.lineTo(-1.2, 0.08)
  s.lineTo(-1.55, 0.62)
  s.quadraticCurveTo(-1.2, 0.95, -0.78, 1.14)
  s.lineTo(-0.34, 1.22)
  return s
}

let mascotCache: Shape[] | null = null

/** The mascot silhouette, in its 80 × 80 SVG units (y down). */
function mascotShapes(): Shape[] {
  if (mascotCache) return mascotCache
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path d="${MOWLO_BODY_PATH}"/></svg>`
  mascotCache = new SVGLoader().parse(svg).paths.flatMap(path => SVGLoader.createShapes(path))
  return mascotCache
}

// ── Printed solids ────────────────────────────────────────────────────────

interface ExtrudeOptions {
  depth: number
  bevel?: number
  bevelSegments?: number
  curveSegments?: number
  /** For outlines drawn in SVG space, where y runs down. */
  flipY?: boolean
}

/**
 * Extrudes an outline into printed stock with real thickness.
 *
 * Material slots: 0 back, 1 front, 2 edge. UVs are planar across the whole
 * outline, 0 → 1, and mirrored on the back so it reads correctly once turned.
 */
export function printedExtrude(shapes: Shape | Shape[], { depth, bevel = 0, bevelSegments = 3, curveSegments = 12, flipY = false }: ExtrudeOptions): BufferGeometry {
  const geometry = new ExtrudeGeometry(shapes, {
    depth,
    curveSegments,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments,
  })

  geometry.translate(0, 0, -depth / 2)
  // Rotating about X flips y without mirroring, so the triangles keep facing
  // out — but the lid that faced −Z now faces +Z.
  if (flipY) geometry.rotateX(Math.PI)

  geometry.computeBoundingBox()
  const { min, max } = geometry.boundingBox!
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) - min.x) / (max.x - min.x)
    const v = (pos.getY(i) - min.y) / (max.y - min.y)
    uv.setXY(i, pos.getZ(i) < 0 ? 1 - u : u, v)
  }
  uv.needsUpdate = true

  // ExtrudeGeometry writes each shape's lids — bottom, then top — as one
  // group (slot 0) and its sides as another (slot 1). Split the lids.
  const groups = geometry.groups.slice()
  geometry.clearGroups()
  for (const g of groups) {
    if (g.materialIndex === 0) {
      const half = g.count / 2
      geometry.addGroup(g.start, half, flipY ? 1 : 0)
      geometry.addGroup(g.start + half, half, flipY ? 0 : 1)
    } else {
      geometry.addGroup(g.start, g.count, 2)
    }
  }
  return geometry
}

/**
 * Curls one edge of a flat disc up out of its plane: everything past the chord
 * at `from` (a share of the radius) bends round a cylinder, so the edge lifts
 * the way a sticker does when it starts to peel. The mesh needs rings between
 * the chord and the rim, or the curl creases into facets.
 */
export function foldEdge(geometry: BufferGeometry, radius: number, from: number, angle: number) {
  if (angle <= 0) return geometry
  const chord = radius * from
  const curvature = angle / (radius - chord)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const past = pos.getX(i) - chord
    if (past <= 0) continue
    pos.setX(i, chord + Math.sin(curvature * past) / curvature)
    pos.setZ(i, pos.getZ(i) + (1 - Math.cos(curvature * past)) / curvature)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/** A die-cut mascot, `size` units wide, centred. Slots as printedExtrude. */
export function mascotGeometry(size: number, depth: number, bevel: number): BufferGeometry {
  // Extrude in SVG units, then scale down: bevel and depth scale with it.
  const k = 80 / size
  const geometry = printedExtrude(mascotShapes(), { depth: depth * k, bevel: bevel * k, curveSegments: 24, flipY: true })
  geometry.scale(1 / k, 1 / k, 1 / k)
  geometry.center()
  return geometry
}

// ── Paper ─────────────────────────────────────────────────────────────────

/**
 * Bends a flyer plane in place: a soft arc across its width, and the bottom
 * right corner lifting off. `curl` 0 is flat.
 */
export function curlSheet(geometry: PlaneGeometry, width: number, height: number, segX: number, segY: number, curl: number) {
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const ix = i % (segX + 1)
    const iy = Math.floor(i / (segX + 1))
    const u = ix / segX
    const v = iy / segY // 0 at the top
    const x = u * width - width / 2
    const y = height / 2 - v * height
    const corner = Math.max(0, u + v - 1.3)
    const z = curl * (0.16 * Math.cos((u - 0.5) * Math.PI) + corner * corner * 1.7)
    pos.setXYZ(i, x, y, z)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
}

/**
 * One side gusset of a paper bag, folded inward to a V. Sits at x = 0 with the
 * fold toward −x; mirror it for the other side.
 */
export function gussetGeometry(height: number, depth: number, fold: number): BufferGeometry {
  const y0 = -height / 2
  const y1 = height / 2
  const front0 = [0, y0, depth / 2]
  const front1 = [0, y1, depth / 2]
  const fold0 = [-fold, y0, 0]
  const fold1 = [-fold, y1, 0]
  const back0 = [0, y0, -depth / 2]
  const back1 = [0, y1, -depth / 2]
  const positions = [front0, fold0, front1, front1, fold0, fold1, fold0, back0, fold1, fold1, back0, back1].flat()
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

/** A twisted-paper rope handle rising from the bag's top edge at depth z. */
export function bagHandle(height: number, z: number): TubeGeometry {
  const top = height / 2
  const curve = new CatmullRomCurve3([
    new Vector3(-0.36, top - 0.16, z),
    new Vector3(-0.33, top + 0.28, z),
    new Vector3(0, top + 0.5, z),
    new Vector3(0.33, top + 0.28, z),
    new Vector3(0.36, top - 0.16, z),
  ])
  return new TubeGeometry(curve, 48, 0.028, 10, false)
}

// ── Ceramic ───────────────────────────────────────────────────────────────

export const MUG = { radius: 0.78, height: 2 }

/**
 * A mug: the ceramic body (base, rim, inside), the printable outer wall, and
 * the handle. The wall's UVs start at the back, so u = 0.5 is the front.
 * `height` defaults to a standard 11oz; pass less for a stubby one.
 */
export function mugGeometry(height = MUG.height) {
  const { radius: r } = MUG
  const h = height
  const v = (x: number, y: number) => new Vector2(x, y)
  const body = new LatheGeometry(
    [v(0, 0.02), v(r - 0.12, 0), v(r - 0.01, 0.06), v(r - 0.004, 0.12), v(r - 0.004, h - 0.07), v(r - 0.02, h - 0.005), v(r - 0.07, h - 0.005), v(r - 0.09, h - 0.06), v(r - 0.09, 0.22), v(0, 0.2)],
    72,
  )
  const wall = new LatheGeometry([v(r, 0.12), v(r, h - 0.07)], 72, Math.PI, Math.PI * 2)
  // The handle keeps its share of the height, so a stubby mug gets a smaller loop.
  const handle = new TorusGeometry(0.46 * (h / MUG.height) ** 0.6, 0.1, 20, 48, Math.PI)
  return { body, wall, handle }
}

// ── Five-panel cap ────────────────────────────────────────────────────────

/**
 * A five-panel camp cap, 1 unit = the crown's half-width: a wide flat front
 * panel, a strip running over the crown from front to back, two side panels
 * with a pair of eyelets each, a strap across the opening at the back, and a
 * flat brim. No button on top.
 */
export const CAP = {
  radius: 1,
  height: 1.14,
  /** How far the crown reaches forward and back from its centre. The back is rounder. */
  front: 0.96,
  back: 1.1,
  bill: 0.62,
  thickness: 0.035,
  /** Half-width of the strip over the crown. */
  strip: 0.34,
  /** How high the front panel reaches, as a share of the crown's height. */
  frontTop: 0.8,
}

/** Plan exponents: >2 squares the front off flat; 2 keeps the back round. */
const CAP_PLAN = { front: 2.8, back: 2 }
/** Crown profile: >2 gives steep sides and a broad, flat-ish top, like a structured camp cap. */
const CAP_PROFILE = 2.9

const signedPow = (v: number, p: number) => Math.sign(v) * Math.pow(Math.abs(v), p)

/** The crown's footprint at angle a (0 = front, π/2 = right side), before the profile scales it in. */
function capPlan(a: number): [number, number] {
  const c = Math.cos(a)
  const q = c >= 0 ? CAP_PLAN.front : CAP_PLAN.back
  return [CAP.radius * signedPow(Math.sin(a), 2 / q), (c >= 0 ? CAP.front : CAP.back) * signedPow(c, 2 / q)]
}

/** How far in the crown has come at height share t (0 at the rim, 1 at the top). */
const capRho = (t: number) => Math.pow(Math.max(0, 1 - Math.pow(t, CAP_PROFILE)), 1 / CAP_PROFILE)

/** A point on the crown at angle a and height share t, pushed `lift` along the outward direction. */
function capPoint(a: number, t: number, lift = 0): Vector3 {
  const [x, z] = capPlan(a)
  const rho = capRho(t)
  const p = new Vector3(rho * x, CAP.height * t, rho * z)
  if (lift) p.add(capNormal(a, t).multiplyScalar(lift))
  return p
}

/** The crown's outward normal at (a, t), by finite differences. */
function capNormal(a: number, t: number): Vector3 {
  const e = 1e-3
  const t0 = Math.min(t, 1 - 2 * e)
  const da = capPoint(a + e, t0).sub(capPoint(a - e, t0))
  const dt = capPoint(a, t0 + e).sub(capPoint(a, Math.max(0, t0 - e)))
  const n = da.cross(dt).normalize()
  return n
}

/** The angle at which the crown is `x` wide at height share t, on the front (side 1) or back (−1) half. */
function capAngleForX(x: number, t: number, half: 1 | -1): number {
  const ratio = Math.min(1, Math.abs(x) / (CAP.radius * Math.max(capRho(t), 1e-4)))
  const q = half > 0 ? CAP_PLAN.front : CAP_PLAN.back
  const a = Math.asin(Math.pow(ratio, q / 2))
  return Math.sign(x) * (half > 0 ? a : Math.PI - a)
}

/** A grid over part of the crown, (a, t) ranges, lifted `lift` off it, UVs 0–1 across it. */
function capPatch(a0: number, a1: number, t0: number, t1: number, lift: number, cols = 48, rows = 24) {
  const positions: number[] = []
  const uvs: number[] = []
  const index: number[] = []
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) {
      const p = capPoint(mix(a0, a1, i / cols), mix(t0, t1, j / rows), lift)
      positions.push(p.x, p.y, p.z)
      uvs.push(i / cols, j / rows)
    }
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i
      const b = a + 1
      const c = a + cols + 1
      const d = c + 1
      index.push(a, b, c, b, d, c)
    }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(positions, 3))
  g.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  g.setIndex(index)
  g.computeVertexNormals()
  return g
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** A seam: a thin cord laid along the crown through (a, t) points. */
function capSeam(points: [number, number][]) {
  const curve = new CatmullRomCurve3(points.map(([a, t]) => capPoint(a, t, 0.006)))
  return new TubeGeometry(curve, Math.max(24, points.length * 4), 0.011, 6, false)
}

/** The back opening's half-width (as an angle round the back) and height share. */
const CAP_OPENING = { half: 0.36, top: 0.34 }
/** Where the eyelets sit on each side panel: angles from the front, at one height. */
const CAP_EYELETS = { at: [1.95, 2.3], t: 0.42 }

/**
 * The cap's parts, all in one frame with the crown's rim on y = 0:
 *   crown     the dome, open underneath
 *   patch     the front panel's print, a hair proud of the crown, UVs 0–1
 *   seams     the five panels' seams
 *   opening   the dark arch at the back, where the head shows through
 *   strap     the strap across the opening
 *   buckle    its slide buckle
 *   eyelets   two metal-ringed eyelets on each side panel
 *   bill      the brim: top, underside and the stitched front edge
 */
export function capGeometry() {
  const { strip, frontTop } = CAP

  const crown = capPatch(-Math.PI, Math.PI, 0, 1, 0, 120, 36)

  // The front panel's top corners: where the strip's seams meet the front panel's top seam.
  const corner = capAngleForX(strip, frontTop, 1)
  // The front panel flares out toward the brim, as its side seams run down.
  const foot = corner + 0.2

  // Only the panel's middle is printed; the patch never reaches the seams.
  const patch = capPatch(-corner * 0.92, corner * 0.92, 0.06, frontTop - 0.05, 0.004, 40, 20)

  const seams: BufferGeometry[] = []
  const steps = 28
  for (const side of [1, -1] as const) {
    // Front panel's side seam: from the corner down to the rim.
    seams.push(capSeam(Array.from({ length: steps + 1 }, (_, k) => [side * mix(corner, foot, Math.pow(k / steps, 1.4)), mix(frontTop, 0, k / steps)])))
    // The strip's seam: from the corner up over the crown and down the back to
    // the top of the opening, keeping the strip's width all the way.
    const crest = Math.pow(1 - Math.pow(strip / CAP.radius, CAP_PROFILE), 1 / CAP_PROFILE) * 0.995
    const path: [number, number][] = []
    for (let k = 0; k <= steps; k++) {
      const t = mix(frontTop, crest, Math.sin((Math.PI / 2) * (k / steps)))
      path.push([capAngleForX(side * strip, t, 1), t])
    }
    for (let k = 1; k <= steps; k++) {
      const t = mix(crest, CAP_OPENING.top + 0.04, 1 - Math.cos((Math.PI / 2) * (k / steps)))
      path.push([capAngleForX(side * strip * mix(1, 0.62, k / steps), t, -1), t])
    }
    seams.push(capSeam(path))
  }
  // The front panel's top seam.
  seams.push(capSeam(Array.from({ length: steps + 1 }, (_, k) => [mix(-corner, corner, k / steps), frontTop + 0.015 * Math.sin((Math.PI * k) / steps)])))

  // The back opening: a dark arch, a hair proud of the crown, shaped by a mask in its UVs (see Cap).
  const opening = capPatch(Math.PI - CAP_OPENING.half, Math.PI + CAP_OPENING.half, 0, CAP_OPENING.top, 0.003, 24, 12)

  // The strap: a band across the opening, low down.
  const strap = capPatch(Math.PI - CAP_OPENING.half - 0.05, Math.PI + CAP_OPENING.half + 0.05, 0.07, 0.15, 0.008, 24, 2)

  // The buckle: a small flat slide at the back centre.
  const buckle = new TorusGeometry(0.075, 0.014, 6, 4)
  buckle.rotateZ(Math.PI / 4)
  buckle.scale(1.25, 0.75, 0.6)
  orientOnCap(buckle, Math.PI, 0.11, 0.018)

  // Eyelets: a metal ring round a dark hole, square to the crown.
  const eyelets: BufferGeometry[] = []
  for (const side of [1, -1])
    for (const a of CAP_EYELETS.at) {
      const ring = new TorusGeometry(0.03, 0.01, 8, 20)
      orientOnCap(ring, side * a, CAP_EYELETS.t, 0.006)
      eyelets.push(ring)
    }

  return {
    crown,
    patch,
    seams: mergeSimple(seams),
    opening,
    strap,
    buckle,
    eyelets: mergeSimple(eyelets),
    bill: billGeometry(),
  }
}

/** Turns a geometry made facing +z to face out of the crown at (a, t), and moves it there. */
function orientOnCap(g: BufferGeometry, a: number, t: number, lift: number) {
  const n = capNormal(a, t)
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), n)
  g.applyQuaternion(q)
  const p = capPoint(a, t, lift)
  g.translate(p.x, p.y, p.z)
}

/**
 * The visor as a grid, so it can bend: its inner edge follows the front of
 * the crown's rim, its outer edge reaches `bill` forward at the middle and
 * meets the rim at the sides. Curved down across its width and tipped a little
 * down toward the front.
 */
function billGeometry() {
  const { bill, thickness } = CAP
  const across = 48
  const out = 10
  const positions: number[] = []
  const uvs: number[] = []
  const index: number[] = []

  const point = (i: number, j: number, under: boolean) => {
    // Round the front of the crown, from side to side.
    const a = (i / across - 0.5) * Math.PI * 0.86
    const v = j / out
    const [px, pz] = capPlan(a)
    // Square-ish: full reach across most of the front, rounding off only near the sides.
    const reach = bill * Math.pow(Math.cos(a / 0.86), 0.55)
    const x = px * (1 + 0.06 * v)
    const z = pz + reach * v
    // A camp cap's brim is flat: the faintest curve across it and the
    // faintest dip toward the tip, just enough to read as cloth over board.
    const y = -(0.05 * Math.pow(Math.sin(a), 2) + 0.03) * v * v - (under ? thickness : 0)
    return [x, y, z]
  }

  // Top, then underside, then the front edge between them.
  for (const under of [false, true]) {
    const base = positions.length / 3
    for (let j = 0; j <= out; j++) {
      for (let i = 0; i <= across; i++) {
        positions.push(...point(i, j, under))
        uvs.push(i / across, j / out)
      }
    }
    for (let j = 0; j < out; j++) {
      for (let i = 0; i < across; i++) {
        const a = base + j * (across + 1) + i
        const b = a + 1
        const c = a + across + 1
        const d = c + 1
        if (under) index.push(a, b, c, b, d, c)
        else index.push(a, c, b, b, c, d)
      }
    }
  }
  const edge = positions.length / 3
  for (let i = 0; i <= across; i++) {
    positions.push(...point(i, out, false), ...point(i, out, true))
    uvs.push(i / across, 0, i / across, 1)
  }
  for (let i = 0; i < across; i++) {
    const a = edge + i * 2
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(index)
  geometry.computeVertexNormals()
  return geometry
}

/** Joins indexed geometries with the same attributes (here: position, normal, uv). */
function mergeSimple(parts: BufferGeometry[]) {
  const names = ['position', 'normal', 'uv'] as const
  const data: Record<(typeof names)[number], number[]> = { position: [], normal: [], uv: [] }
  const index: number[] = []
  let offset = 0
  for (const g of parts) {
    for (const n of names) data[n].push(...(g.attributes[n].array as Float32Array))
    for (const k of g.index!.array) index.push(k + offset)
    offset += g.attributes.position.count
    g.dispose()
  }
  const merged = new BufferGeometry()
  merged.setAttribute('position', new Float32BufferAttribute(data.position, 3))
  merged.setAttribute('normal', new Float32BufferAttribute(data.normal, 3))
  merged.setAttribute('uv', new Float32BufferAttribute(data.uv, 2))
  merged.setIndex(index)
  return merged
}

// ── Water bottle ──────────────────────────────────────────────────────────

/**
 * A 1L insulated bottle, base on y = 0: rounded foot, a long straight wall
 * (the printed wrap), a soft shoulder into the neck, a steel collar, and a
 * screw cap with a carry loop.
 */
export const BOTTLE = { radius: 0.42, wall: [0.14, 1.78] as [number, number], shoulder: 2.12, neck: 0.29, collar: 0.07, cap: 0.3 }

export function bottleGeometry() {
  const { radius: r, wall, shoulder, neck, collar, cap } = BOTTLE
  const v = (x: number, y: number) => new Vector2(x, y)
  // Foot, wall and shoulder in one lathe; the printed wall is a second lathe
  // laid over its straight part, a hair proud, with its own clean 0–1 UVs.
  const body = new LatheGeometry(
    [
      v(0, 0),
      v(r - 0.1, 0),
      v(r - 0.03, 0.025),
      v(r, 0.09),
      v(r, wall[1] + 0.02),
      v(r - 0.02, wall[1] + 0.16),
      v(r - 0.08, wall[1] + 0.26),
      v(neck + 0.02, shoulder - 0.03),
      v(neck, shoulder),
    ],
    96,
  )
  const print = new LatheGeometry([v(r + 0.002, wall[0]), v(r + 0.002, wall[1])], 96, Math.PI, Math.PI * 2)
  const ring = new CylinderGeometry(neck + 0.01, neck + 0.01, collar, 64, 1, true)
  ring.translate(0, shoulder + collar / 2, 0)
  const top = shoulder + collar
  // The cap: a ribbed cylinder with a rounded top edge.
  const capBody = new LatheGeometry(
    [v(0, top + cap), v(neck - 0.04, top + cap), v(neck + 0.02, top + cap - 0.03), v(neck + 0.03, top + cap * 0.6), v(neck + 0.03, top), v(0, top)],
    64,
  )
  const ribs: BufferGeometry[] = [0.22, 0.42, 0.62].map(k => {
    const t = new TorusGeometry(neck + 0.027, 0.007, 6, 64)
    t.rotateX(Math.PI / 2)
    t.translate(0, top + cap * k * 0.95, 0)
    return t
  })
  // The carry loop: a flattened arch standing on the cap.
  const loop = new TorusGeometry(neck * 0.68, 0.055, 16, 48, Math.PI)
  loop.scale(1, 0.95, 1.7)
  loop.translate(0, top + cap - 0.02, 0)
  return { body, print, ring, cap: mergeSimple([capBody, ...ribs]), loop }
}

// ── Socks ─────────────────────────────────────────────────────────────────

/**
 * A crew sock in profile: the leg straight down, a heel bend, the foot running
 * forward to a rounded toe. Its width follows a knitted sock's — a ribbed
 * cuff, a narrower ankle, a fuller heel — and it is flattened front to back,
 * the way a sock lies when no one is wearing it. UVs run cuff → toe along u
 * (see SOCK_HEEL in brandTexture, which this path is shaped to match).
 */
export function sockGeometry() {
  const path = new CatmullRomCurve3(
    [
      new Vector3(0, 1.7, 0),
      new Vector3(0, 0.9, 0),
      new Vector3(0.02, 0.15, 0),
      new Vector3(-0.08, -0.38, 0),
      new Vector3(-0.5, -0.62, 0),
      new Vector3(-1.2, -0.66, 0),
      new Vector3(-1.75, -0.6, 0),
    ],
    false,
    'centripetal',
  )
  const length = 160
  const round = 32
  const tube = new TubeGeometry(path, length, 1, round, false)

  // Radius along the sock, as (share of length, radius) stops.
  const profile: [number, number][] = [
    [0, 0.31],
    [0.08, 0.3],
    [0.3, 0.27],
    [0.44, 0.26],
    [0.55, 0.33],
    [0.66, 0.29],
    [0.9, 0.27],
    [0.96, 0.2],
    [1, 0.04],
  ]
  const radiusAt = (u: number) => {
    const k = profile.findIndex(([at]) => at >= u)
    if (k <= 0) return profile[0][1]
    const [u0, r0] = profile[k - 1]
    const [u1, r1] = profile[k]
    const t = (u - u0) / (u1 - u0)
    // The toe closes on a quarter circle, not a cone.
    if (k === profile.length - 1) return Math.max(r1, r0 * Math.sqrt(Math.max(0, 1 - t * t)))
    return r0 + (r1 - r0) * (t * t * (3 - 2 * t))
  }

  const pos = tube.attributes.position
  const centre = new Vector3()
  const p = new Vector3()
  for (let i = 0; i <= length; i++) {
    const u = i / length
    path.getPointAt(u, centre)
    const r = radiusAt(u)
    for (let j = 0; j <= round; j++) {
      const k = i * (round + 1) + j
      p.fromBufferAttribute(pos, k).sub(centre).multiplyScalar(r)
      // Flattened front to back: a sock lying flat, not on a foot.
      p.z *= 0.55
      p.add(centre)
      pos.setXYZ(k, p.x, p.y, p.z)
    }
  }
  pos.needsUpdate = true
  tube.computeVertexNormals()
  tube.center()
  return tube
}
