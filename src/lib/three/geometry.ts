import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  Shape,
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
 */
export function mugGeometry() {
  const { radius: r, height: h } = MUG
  const v = (x: number, y: number) => new Vector2(x, y)
  const body = new LatheGeometry(
    [v(0, 0.02), v(r - 0.12, 0), v(r - 0.01, 0.06), v(r - 0.004, 0.12), v(r - 0.004, h - 0.07), v(r - 0.02, h - 0.005), v(r - 0.07, h - 0.005), v(r - 0.09, h - 0.06), v(r - 0.09, 0.22), v(0, 0.2)],
    72,
  )
  const wall = new LatheGeometry([v(r, 0.12), v(r, h - 0.07)], 72, Math.PI, Math.PI * 2)
  const handle = new TorusGeometry(0.46, 0.1, 20, 48, Math.PI)
  return { body, wall, handle }
}
