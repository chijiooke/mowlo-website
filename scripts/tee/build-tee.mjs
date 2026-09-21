#!/usr/bin/env node
/**
 * Builds public/models/tee.glb — a boxy, drop-shoulder cotton tee, modelled the
 * way a garment is made: panels, not a blob.
 *
 *  - Front and back body panels wrap a rounded-rectangle cross-section, roll
 *    over the shoulders to meet at the shoulder seam, and meet again at the
 *    side seams. Above the armpit they stop short of each other: the armhole.
 *  - Each sleeve is lofted from its armhole (its first ring *is* the armhole's
 *    vertices) out to an elliptical cuff, hanging down and out.
 *  - A crew neckband is swept round the neck edge: out of the body surface,
 *    over a folded top edge, and back down inside to meet the inner wall.
 *  - Every part has thickness — an inner wall, and rounded folds at the hem and
 *    cuffs. Parts don't share vertices, so each seam reads as a soft crease.
 *  - Folds are placed, not noise: a soft hem wave pinned at the side seams,
 *    drag lines from the armpits, a little crumple under the sleeves, and
 *    double-needle stitching at the hem and cuffs.
 *  - Baked per vertex: ambient occlusion (COLOR_0), and _MASK — r inner wall,
 *    g rib neckband, b stitch lines, a how freely the cloth hangs — which the
 *    garment material reads for rib texture, stitching and cloth motion.
 *
 *   node scripts/tee/build-tee.mjs      then      scripts/tee/shoot.sh <out-dir>
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/models/tee.glb')

// ── Math ──────────────────────────────────────────────────────────────────

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
const mix = (a, b, t) => a + (b - a) * t
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const length = a => Math.hypot(a[0], a[1], a[2])
const normalize = a => scale(a, 1 / (length(a) || 1))

function keyed(keys, x) {
  if (x <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    if (x <= keys[i][0]) return mix(keys[i - 1][1], keys[i][1], smoothstep(keys[i - 1][0], keys[i][0], x))
  }
  return keys[keys.length - 1][1]
}

// ── The pattern ───────────────────────────────────────────────────────────
// Scene units, front facing +Z. `p` is distance down a panel from the shoulder
// seam; `s` runs across a panel from the left side seam (−1) to the right (+1).

const NECK_Y = 1.16
const SHOULDER_DROP = 0.2
/** Boxy: nearly as wide as it is long, with a touch of flare at the hem. */
const HALF_WIDTH = [[0, 1.0], [1.0, 1.0], [2.45, 1.04]]
const HALF_DEPTH = [[0, 0.34], [0.9, 0.35], [1.7, 0.33], [2.45, 0.31]]
const CORNER = 0.2
/** The shoulder roll: from the seam on top round to the front and back faces. */
const ROLL = 0.2
const ROLL_P = (ROLL * Math.PI) / 2
const LENGTH = 2.3
const P_HEM = ROLL_P + (LENGTH - ROLL)
const ARMPIT = 0.82
/** How far each panel stops short of the side seam at the armhole's widest. */
const ARMHOLE_GAP = 0.3
const NECK_HALF = 0.34
/** How far the neckline dips below the shoulder line, measured straight down. */
const FRONT_DROP = 0.24
const BACK_DROP = 0.1
const WALL = 0.016
const BAND = 0.09
const SLEEVE = { dir: [0.55, -0.835, 0.03], length: 0.72, rx: 0.33, rz: 0.28 }

const COLUMNS = 56
const ARMHOLE_ROWS = 16
const BODY_ROWS = 26
const SLEEVE_RINGS = 18
const BAND_POINTS = 96
/** Hem and cuff detail rows: distance from the edge, and stitch weight. Double-needle stitching. */
const HEM_ROWS = [[0.075, 0.3], [0.058, 1], [0.049, 0], [0.04, 1], [0.022, 0], [0.008, 0], [0, 0]]

// The shoulder starts sloping where the collar ends, so the line runs out of the
// neckband in one curve. Starting it further in left a flat top with a bend in it.
const ridgeY = x => NECK_Y - SHOULDER_DROP * Math.pow(smoothstep(NECK_HALF * 0.9, 1.02, Math.abs(x)), 1.15)
const sectionLength = (a, b) => 2 * (b - CORNER) + Math.PI * CORNER + 2 * (a - CORNER)

/** A point on the front half of a rounded-rectangle section, by arc length from the left side. */
function section(l, a, b) {
  const side = b - CORNER
  const arc = (Math.PI / 2) * CORNER
  const front = 2 * (a - CORNER)
  if (l < side) return [-a, l]
  l -= side
  if (l < arc) {
    const t = l / CORNER
    return [-a + CORNER - CORNER * Math.cos(t), side + CORNER * Math.sin(t)]
  }
  l -= arc
  if (l < front) return [-(a - CORNER) + l, b]
  l -= front
  if (l < arc) {
    const t = l / CORNER
    return [a - CORNER + CORNER * Math.sin(t), side + CORNER * Math.cos(t)]
  }
  l -= arc
  return [a, Math.max(0, side - l)]
}

const armholeGap = p => (p < ARMPIT ? ARMHOLE_GAP * Math.pow(Math.sin((Math.PI * p) / ARMPIT), 0.7) : 0)

/**
 * Where a column's neck edge starts, as distance down the panel. The curve is a
 * round crew scoop in true vertical drop, converted back through the shoulder
 * roll. Shaped in panel distance instead, the roll squashes the top of the
 * curve and pinches the bottom into a V.
 */
function neckTop(sigma, x) {
  const u = Math.abs(x) / NECK_HALF
  if (u >= 1) return 0
  // Exponent 1: the curve meets the shoulder seam at a slope it can leave on.
  // Below 1 it arrives vertically, which cusps into a peak either side of the collar.
  const drop = (sigma > 0 ? FRONT_DROP : BACK_DROP) * (1 - u * u)
  if (drop < ROLL) return ((ROLL_P * 2) / Math.PI) * Math.acos(1 - drop / ROLL)
  return ROLL_P + (drop - ROLL)
}

function bodyAt(sigma, s, p) {
  const a = keyed(HALF_WIDTH, p)
  const b = keyed(HALF_DEPTH, p)
  const gap = armholeGap(p)
  const L = sectionLength(a, b)
  const l = gap + ((s + 1) / 2) * (L - 2 * gap)
  const [x, zs] = section(l, a, b)
  const k = Math.min(p / ROLL_P, 1)
  const roll = Math.sin((k * Math.PI) / 2)
  const dy = p < ROLL_P ? ROLL * (1 - Math.cos((k * Math.PI) / 2)) : ROLL + (p - ROLL_P)
  // The shoulder slope belongs to the shoulders. It fades out down the body so
  // the hem hangs level instead of arching up in the middle.
  const slope = (NECK_Y - ridgeY(x)) * (1 - smoothstep(0, ARMPIT + 0.5, p))
  return { pos: [x, NECK_Y - slope - dy, sigma * zs * roll], roll, seam: ((1 - Math.abs(s)) / 2) * (L - 2 * gap), l }
}

// ── Mesh helpers ──────────────────────────────────────────────────────────

function grid(W, H, closedU) {
  const tris = []
  const cols = closedU ? W : W - 1
  for (let j = 0; j < H - 1; j++)
    for (let i = 0; i < cols; i++) {
      const i2 = (i + 1) % W
      const a = j * W + i
      const b = j * W + i2
      const c = (j + 1) * W + i2
      const d = (j + 1) * W + i
      tris.push(a, b, c, a, c, d)
    }
  return tris
}

/** Winds every triangle to agree with the reference normals of its corners. */
function orient(pts, refs, tris) {
  const out = []
  for (let t = 0; t < tris.length; t += 3) {
    const [a, b, c] = [tris[t], tris[t + 1], tris[t + 2]]
    const face = cross(sub(pts[b], pts[a]), sub(pts[c], pts[a]))
    if (dot(face, add(add(refs[a], refs[b]), refs[c])) >= 0) out.push(a, b, c)
    else out.push(a, c, b)
  }
  return out
}

function vertexNormals(pts, tris) {
  const n = pts.map(() => [0, 0, 0])
  for (let t = 0; t < tris.length; t += 3) {
    const [a, b, c] = [tris[t], tris[t + 1], tris[t + 2]]
    const face = cross(sub(pts[b], pts[a]), sub(pts[c], pts[a]))
    for (const i of [a, b, c]) n[i] = add(n[i], face)
  }
  return n.map(normalize)
}

const flip = tris => {
  const out = []
  for (let t = 0; t < tris.length; t += 3) out.push(tris[t], tris[t + 2], tris[t + 1])
  return out
}

// ── Body panels ───────────────────────────────────────────────────────────

const rows = []
const rowStitch = []
for (let k = 0; k <= ARMHOLE_ROWS; k++) {
  rows.push((ARMPIT * k) / ARMHOLE_ROWS)
  rowStitch.push(0)
}
for (let k = 1; k <= BODY_ROWS; k++) {
  rows.push(ARMPIT + ((P_HEM - 0.1 - ARMPIT) * k) / BODY_ROWS)
  rowStitch.push(0)
}
for (const [d, stitch] of HEM_ROWS) {
  rows.push(P_HEM - d)
  rowStitch.push(stitch)
}

function buildPanel(sigma) {
  const W = COLUMNS + 1
  const H = rows.length
  // Neck depth per column: mirrored so both sides match exactly, then eased
  // across neighbouring columns. A column-to-column jump at the neck corner
  // shears the panel into a crease running down the chest.
  let tops = []
  for (let i = 0; i < W; i++) {
    const mirror = Math.min(i, COLUMNS - i)
    tops.push(neckTop(sigma, bodyAt(sigma, -1 + (2 * mirror) / COLUMNS, 0).pos[0]))
  }
  // Enough passes to round off where the neckline meets the shoulder seam. That
  // corner is a kink in the pattern, and the neckband, sewn along this edge,
  // turns it into a tab sticking out at each shoulder.
  for (let pass = 0; pass < 9; pass++) {
    tops = tops.map((t, i) => (i === 0 || i === W - 1 ? t : 0.25 * tops[i - 1] + 0.5 * t + 0.25 * tops[i + 1]))
  }
  const pts = []
  const meta = []
  const refs = []
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const s = -1 + (2 * i) / COLUMNS
      // Only the rows above the armpit make room for the neck; the hem rows stay put.
      const p = rows[j] >= ARMPIT ? rows[j] : tops[i] + (rows[j] / ARMPIT) * (ARMPIT - tops[i])
      const at = bodyAt(sigma, s, p)
      pts.push(at.pos)
      refs.push([at.pos[0], 0.05 + 2 * (1 - at.roll), at.pos[2]])
      meta.push({ p, s, seam: at.seam, l: at.l, stitch: rowStitch[j] })
    }
  const tris = orient(pts, refs, grid(W, H, false))
  return { W, H, pts, meta, tops, sigma, tris, normals: vertexNormals(pts, tris), closed: false }
}

// ── Sleeves ───────────────────────────────────────────────────────────────

function buildSleeve(side, front, back) {
  const col = side > 0 ? COLUMNS : 0
  const loop = []
  for (let k = 0; k <= ARMHOLE_ROWS; k++) loop.push(front.pts[k * front.W + col])
  for (let k = ARMHOLE_ROWS - 1; k >= 1; k--) loop.push(back.pts[k * back.W + col])
  const M = loop.length
  const origin = scale(loop.reduce((sum, q) => add(sum, q), [0, 0, 0]), 1 / M)
  const dir = normalize([side * SLEEVE.dir[0], SLEEVE.dir[1], SLEEVE.dir[2]])
  const e1 = normalize(sub([0, 1, 0], scale(dir, dir[1])))
  const e2 = normalize(cross(dir, e1))
  const angles = loop.map(q => {
    const v = sub(q, origin)
    return Math.atan2(dot(v, e2), dot(v, e1))
  })
  const cuffCentre = add(origin, scale(dir, SLEEVE.length))
  const cuff = angles.map(th => add(cuffCentre, add(scale(e1, Math.cos(th) * SLEEVE.rx), scale(e2, Math.sin(th) * SLEEVE.rz))))

  const ws = []
  const ringStitch = []
  for (let k = 0; k <= SLEEVE_RINGS; k++) {
    ws.push(((1 - 0.1 / SLEEVE.length) * k) / SLEEVE_RINGS)
    ringStitch.push(0)
  }
  for (const [d, stitch] of HEM_ROWS) {
    ws.push(1 - d / SLEEVE.length)
    ringStitch.push(stitch)
  }

  const pts = []
  const meta = []
  const refs = []
  for (let j = 0; j < ws.length; j++) {
    const w = ws[j]
    const axis = add(origin, scale(dir, SLEEVE.length * w))
    for (let m = 0; m < M; m++) {
      let q = add(scale(loop[m], 1 - w), scale(cuff[m], w))
      // A little fullness through the middle of the sleeve.
      q = add(q, scale(normalize(sub(q, axis)), 0.03 * Math.sin(Math.PI * Math.min(w / 0.9, 1))))
      pts.push(j === 0 ? loop[m] : q)
      refs.push(sub(q, axis))
      meta.push({ w, theta: angles[m], stitch: ringStitch[j] })
    }
  }
  const tris = orient(pts, refs, grid(M, ws.length, true))
  return { W: M, H: ws.length, pts, meta, origin, dir, tris, normals: vertexNormals(pts, tris), closed: true }
}

function displace(part, fold) {
  part.pts = part.pts.map((q, i) => add(q, scale(part.normals[i], fold(q, part.meta[i]))))
  part.normals = vertexNormals(part.pts, part.tris)
}

// ── Cloth simulation ──────────────────────────────────────────────────────
// The worn shape above is the pattern; this makes it cloth. Every outer vertex
// becomes a particle, seams are welded, and the tee drapes under gravity over
// an invisible mannequin: position-based dynamics with stretch and bending
// constraints, body collision with friction, and the neckline and shoulder
// seams pinned where a hanger would hold them.

const SIM = { frames: 360, iterations: 10, gravity: 0.0004, damping: 0.985, slack: 1.02, weft: 1.07, bend: 0.2, friction: 0.7, margin: 0.014 }
/** The mannequin: narrower and shallower than the tee everywhere, so it starts clear of the cloth. */
const BODY_WIDTH = [[-1.6, 0.8], [-0.6, 0.72], [0.35, 0.8], [0.85, 0.84]]
const BODY_DEPTH = [[-1.6, 0.25], [-0.5, 0.23], [0.35, 0.28], [0.85, 0.2]]

const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)

function capsule(q, a, dir, len, r) {
  const t = clamp(dot(sub(q, a), dir), 0, len)
  return length(sub(q, add(a, scale(dir, t)))) - r
}

/** The mannequin's signed distance: torso, neck column and arms running down each sleeve. */
function makeBody(sleeves) {
  const arms = sleeves.map(s => {
    const up = normalize(sub([0, 1, 0], scale(s.dir, s.dir[1])))
    return { a: add(sub(s.origin, scale(s.dir, 0.25)), scale(up, 0.05)), dir: s.dir }
  })
  return q => {
    const [x, y, z] = q
    const ax = Math.abs(x)
    const a = keyed(BODY_WIDTH, y)
    const b = keyed(BODY_DEPTH, y)
    const r = b * 0.9
    const qx = ax - a + r
    const qz = Math.abs(z) - b + r
    const section = Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r
    let d = smax(section, y - (ridgeY(Math.min(ax, 0.9)) - 0.05), 0.12)
    d = smin(d, Math.max(Math.hypot(x, z * 1.15) - 0.21, 0.9 - y), 0.08)
    for (const arm of arms) d = smin(d, capsule(q, arm.a, arm.dir, SLEEVE.length + 0.3, 0.16), 0.12)
    return d
  }
}

/**
 * Held in place: only the neck edge. Pinning the shoulder seams as well left a
 * hard ridge along each shoulder, with peaks where the pins stopped; the
 * mannequin's shoulders carry the cloth instead.
 */
function pinTest(part, v) {
  return Boolean(part.tops) && v < part.W && part.tops[v % part.W] > 1e-6
}

function simulate(parts, body) {
  // Weld: seam vertices are exact copies, so identical positions are one particle.
  const key = q => `${Math.round(q[0] * 1e4)},${Math.round(q[1] * 1e4)},${Math.round(q[2] * 1e4)}`
  const ids = new Map()
  const start = []
  const pinned = []
  const maps = parts.map(part =>
    part.pts.map((q, v) => {
      const k = key(q)
      let id = ids.get(k)
      if (id === undefined) {
        id = start.length
        ids.set(k, id)
        start.push(q)
        pinned.push(false)
      }
      if (pinTest(part, v)) pinned[id] = true
      return id
    }),
  )
  const n = start.length
  const x = new Float64Array(n * 3)
  start.forEach((q, i) => x.set(q, i * 3))
  // A whisper of irregularity so the drape doesn't come out mirror-perfect.
  for (let i = 0; i < n; i++) if (!pinned[i]) for (let k = 0; k < 3; k++) x[i * 3 + k] += ((Math.sin((i * 3 + k) * 12.9898) * 43758.5453) % 1) * 0.003
  const prev = new Float64Array(x)
  const inv = new Float64Array(n).map((_, i) => (pinned[i] ? 0 : 1))
  const dist = (a, b) => Math.hypot(x[b * 3] - x[a * 3], x[b * 3 + 1] - x[a * 3 + 1], x[b * 3 + 2] - x[a * 3 + 2])

  // Jersey has more give across than along. The extra width across the tee has
  // nowhere to go but out of plane, so it buckles into the soft vertical folds
  // a tee falls into from the shoulders.
  const rest = (a, b) => {
    const dy = Math.abs(x[b * 3 + 1] - x[a * 3 + 1])
    const across = 1 - Math.min(dy / Math.max(dist(a, b), 1e-9), 1)
    return SIM.slack + (SIM.weft - SIM.slack) * across * across
  }
  const stretch = []
  const bends = []
  const seen = new Set()
  parts.forEach((part, pi) => {
    const map = maps[pi]
    const opposite = new Map()
    for (let t = 0; t < part.tris.length; t += 3) {
      const tri = [map[part.tris[t]], map[part.tris[t + 1]], map[part.tris[t + 2]]]
      for (let e = 0; e < 3; e++) {
        const a = tri[e]
        const b = tri[(e + 1) % 3]
        const c = tri[(e + 2) % 3]
        const k = a < b ? a * n + b : b * n + a
        if (!seen.has(k)) {
          seen.add(k)
          stretch.push(a, b, dist(a, b) * rest(a, b))
        }
        const other = opposite.get(k)
        if (other === undefined) opposite.set(k, c)
        else bends.push(other, c, dist(other, c) * rest(other, c))
      }
    }
  })

  const solve = (list, stiffness) => {
    for (let c = 0; c < list.length; c += 3) {
      const a = list[c]
      const b = list[c + 1]
      const wa = inv[a]
      const wb = inv[b]
      const w = wa + wb
      if (w === 0) continue
      const ia = a * 3
      const ib = b * 3
      const dx = x[ib] - x[ia]
      const dy = x[ib + 1] - x[ia + 1]
      const dz = x[ib + 2] - x[ia + 2]
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < 1e-9) continue
      const s = (stiffness * (d - list[c + 2])) / (d * w)
      x[ia] += dx * s * wa
      x[ia + 1] += dy * s * wa
      x[ia + 2] += dz * s * wa
      x[ib] -= dx * s * wb
      x[ib + 1] -= dy * s * wb
      x[ib + 2] -= dz * s * wb
    }
  }

  let contacts = 0
  for (let f = 0; f < SIM.frames; f++) {
    for (let i = 0; i < n; i++) {
      if (!inv[i]) continue
      for (let k = 0; k < 3; k++) {
        const o = i * 3 + k
        const v = (x[o] - prev[o]) * SIM.damping
        prev[o] = x[o]
        x[o] += v - (k === 1 ? SIM.gravity : 0)
      }
    }
    for (let it = 0; it < SIM.iterations; it++) {
      solve(stretch, 1)
      solve(bends, SIM.bend)
    }
    for (let i = 0; i < n; i++) {
      if (!inv[i]) continue
      const o = i * 3
      const q = [x[o], x[o + 1], x[o + 2]]
      const d = body(q)
      if (d >= SIM.margin) continue
      if (f === SIM.frames - 1) contacts++
      const e = 1e-3
      const g = normalize([
        body([q[0] + e, q[1], q[2]]) - body([q[0] - e, q[1], q[2]]),
        body([q[0], q[1] + e, q[2]]) - body([q[0], q[1] - e, q[2]]),
        body([q[0], q[1], q[2] + e]) - body([q[0], q[1], q[2] - e]),
      ])
      for (let k = 0; k < 3; k++) {
        x[o + k] += g[k] * (SIM.margin - d)
        // Friction: cloth resting on the body loses most of its slide.
        prev[o + k] += (x[o + k] - prev[o + k]) * SIM.friction
      }
    }
  }

  parts.forEach((part, pi) => {
    part.pts = maps[pi].map(id => [x[id * 3], x[id * 3 + 1], x[id * 3 + 2]])
  })
  return { particles: n, stretch: stretch.length / 3, bends: bends.length / 3, contacts }
}

// ── Build ─────────────────────────────────────────────────────────────────

const started = performance.now()
const front = buildPanel(1)
const back = buildPanel(-1)
// Sleeves are lofted from the armhole before anything moves.
const right = buildSleeve(1, front, back)
const left = buildSleeve(-1, front, back)

const garment = [front, back, right, left]
const draped = simulate(garment, makeBody([right, left]))
for (const part of garment) part.normals = vertexNormals(part.pts, part.tris)
// The drape makes the folds; only the stitching is placed by hand.
for (const part of garment) displace(part, (q, m) => -0.0025 * m.stitch)

/** Output parts: pts, normals, uvs, mask [r,g,b,a], ao, tris. */
const parts = []

const planarUV = q => [q[0], q[1]]

function emitSurface(part, maskOf, inner = false) {
  parts.push({
    pts: inner ? part.pts.map((q, i) => sub(q, scale(part.normals[i], WALL))) : part.pts,
    normals: inner ? part.normals.map(n => scale(n, -1)) : part.normals,
    uvs: part.pts.map(planarUV),
    mask: part.meta.map(m => {
      const mk = maskOf(m)
      return inner ? [1, mk[1], 0, mk[3]] : mk
    }),
    tris: inner ? flip(part.tris) : part.tris,
    inner,
  })
}

/** A rounded fold from the outer edge of an open row round to the inner wall. */
function emitRim(part, row, prevRow, maskOf) {
  const W = part.W
  const steps = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI]
  const pts = []
  const refs = []
  const uvs = []
  const mask = []
  for (const th of steps) {
    for (let i = 0; i < W; i++) {
      const e = part.pts[row * W + i]
      const n = part.normals[row * W + i]
      let d = normalize(sub(e, part.pts[prevRow * W + i]))
      d = normalize(sub(d, scale(n, dot(d, n))))
      const q = add(add(e, scale(d, (Math.sin(th) * WALL) / 2)), scale(n, (-(1 - Math.cos(th)) * WALL) / 2))
      pts.push(q)
      refs.push(add(scale(d, Math.sin(th)), scale(n, Math.cos(th))))
      uvs.push(planarUV(q))
      const mk = maskOf(part.meta[row * W + i])
      mask.push([0, 0, 0, mk[3]])
    }
  }
  const tris = orient(pts, refs, grid(W, steps.length, part.closed))
  parts.push({ pts, normals: refs.map(normalize), uvs, mask, tris, inner: false })
}

// Hang is zero along the armhole seam on both sides of it, so body and sleeve
// never move apart there.
const bodyMask = m => [0, 0, m.stitch, smoothstep(0.25, P_HEM, m.p) * (m.p < ARMPIT ? smoothstep(0, 0.15, m.seam) : 1)]
const sleeveMask = m => [0, 0, m.stitch, Math.pow(m.w, 1.3) * smoothstep(0, 0.2, m.w)]

for (const panel of [front, back]) {
  emitSurface(panel, bodyMask)
  emitSurface(panel, bodyMask, true)
  emitRim(panel, panel.H - 1, panel.H - 2, bodyMask)
}
for (const sleeve of [right, left]) {
  emitSurface(sleeve, sleeveMask)
  emitSurface(sleeve, sleeveMask, true)
  emitRim(sleeve, sleeve.H - 1, sleeve.H - 2, sleeveMask)
}

// ── Neckband ──────────────────────────────────────────────────────────────

{
  const neckCols = []
  for (let i = 0; i < front.W; i++) if (front.tops[i] > 1e-6) neckCols.push(i)
  const i1 = neckCols[0]
  const i2 = neckCols[neckCols.length - 1]
  const edge = []
  const edgeNormals = []
  for (let i = i1 - 1; i <= i2 + 1; i++) {
    edge.push(front.pts[i])
    edgeNormals.push(front.normals[i])
  }
  for (let i = i2; i >= i1; i--) {
    edge.push(back.pts[i])
    edgeNormals.push(back.normals[i])
  }

  // Resample the neck edge smoothly (Catmull-Rom) so the band is round, not faceted.
  const E = edge.length
  const perSegment = Math.ceil(BAND_POINTS / E)
  const loop = []
  const loopNormals = []
  const cr = (p0, p1, p2, p3, t) => {
    const t2 = t * t
    const t3 = t2 * t
    return [0, 1, 2].map(
      k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3),
    )
  }
  for (let i = 0; i < E; i++) {
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment
      loop.push(cr(edge[(i - 1 + E) % E], edge[i], edge[(i + 1) % E], edge[(i + 2) % E], t))
      loopNormals.push(normalize(add(scale(edgeNormals[i], 1 - t), scale(edgeNormals[(i + 1) % E], t))))
    }
  }

  const M = loop.length
  const arc = [0]
  for (let m = 1; m < M; m++) arc.push(arc[m - 1] + length(sub(loop[m], loop[m - 1])))
  const thick = WALL * 1.9
  const K = 4
  const rims = [Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]
  const rowsCount = K + 1 + rims.length + K + 1

  const pts = []
  const refs = []
  const uvs = []
  const mask = []
  const push = (q, ref, m, row, inner, seam) => {
    pts.push(q)
    refs.push(ref)
    uvs.push([arc[m], row / (rowsCount - 1)])
    mask.push([inner ? 1 : 0, 1, seam, 0])
  }
  // Frames round the loop, smoothed over neighbours so the band can't twist at
  // the corners. The band's direction is carried continuously point to point
  // from the front centre, where it must rise toward the neck opening.
  // The band's width runs from the neck edge inward, toward the middle of the
  // opening, lying in the cloth's own surface: that is what makes a ring of rib
  // round the hole, and it needs no sign to be carried round the loop. Taken
  // square to the edge instead, it fanned outward into a flat brim at the sides,
  // fins above the back, and a pinch where the two sides met at the front.
  const centre = scale(
    loop.reduce((sum, q) => add(sum, q), [0, 0, 0]),
    1 / M,
  )
  const raw = loop.map((q, m) => {
    const n = loopNormals[m]
    const tangent = normalize(sub(loop[(m + 1) % M], loop[(m - 1 + M) % M]))
    // Square to the edge and lying in the cloth's surface, then turned to face
    // the middle of the opening. Aimed straight at the centre instead, it
    // collapses to nothing at the back of the neck — where that direction is the
    // surface normal — and knots the band there.
    const d = normalize(cross(tangent, n))
    return { n, d: dot(d, sub(centre, q)) < 0 ? scale(d, -1) : d }
  })
  // Wide enough to carry the band round the corner where the front and back neck
  // curves meet at the shoulder, which otherwise juts out as a flat tab.
  const SPAN = 7
  const frames = loop.map((q, m) => {
    let n = [0, 0, 0]
    let d = [0, 0, 0]
    for (let o = -SPAN; o <= SPAN; o++) {
      const r = raw[(m + o + M) % M]
      n = add(n, r.n)
      d = add(d, r.d)
    }
    n = normalize(n)
    d = normalize(sub(d, scale(n, dot(d, n))))
    return { q, n, d }
  })
  // The band stands a little proud of the panel, the way a sewn-on rib does.
  const outerAt = ({ q, n, d }, k) => add(add(q, scale(d, (BAND * k) / K)), scale(n, (0.007 * k) / K))

  let row = 0
  for (let k = 0; k <= K; k++, row++) frames.forEach((f, m) => push(outerAt(f, k), f.n, m, row, false, k === 0 ? 0.8 : 0))
  for (const th of rims) {
    frames.forEach((f, m) => {
      const q = add(add(outerAt(f, K), scale(f.d, (Math.sin(th) * thick) / 2)), scale(f.n, (-(1 - Math.cos(th)) * thick) / 2))
      push(q, add(scale(f.d, Math.sin(th)), scale(f.n, Math.cos(th))), m, row, false, 0)
    })
    row++
  }
  for (let k = K; k >= 0; k--, row++) {
    frames.forEach((f, m) => push(sub(outerAt(f, k), scale(f.n, WALL + ((thick - WALL) * k) / K)), scale(f.n, -1), m, row, true, 0))
  }

  const tris = orient(pts, refs, grid(M, rowsCount, true))
  parts.push({ pts, normals: vertexNormals(pts, tris), uvs, mask, tris, inner: false, band: true })
}

// ── Occlusion ─────────────────────────────────────────────────────────────
// Baked by casting rays against the finished mesh itself, so folds, the inside
// of the neck and the underarms shade each other the way they do under a
// softbox. A uniform grid keeps it to a few seconds.

const AO_RAYS = 24
const AO_REACH = 0.35
const AO_CELL = 0.06
const AO_NEAR = WALL * 2.5

/** Cosine-weighted directions over the +Z hemisphere, on a Fibonacci spiral. */
const HEMISPHERE = Array.from({ length: AO_RAYS }, (_, i) => {
  const u = (i + 0.5) / AO_RAYS
  const phi = i * Math.PI * (3 - Math.sqrt(5))
  const r = Math.sqrt(u)
  return [r * Math.cos(phi), r * Math.sin(phi), Math.sqrt(1 - u)]
})

function bakeOcclusion(positions, normals, indices, colors, masks) {
  const triCount = indices.length / 3
  const T = new Float64Array(triCount * 9)
  for (let t = 0; t < triCount; t++)
    for (let k = 0; k < 3; k++) {
      const v = indices[t * 3 + k]
      T[t * 9 + k * 3] = positions[v * 3]
      T[t * 9 + k * 3 + 1] = positions[v * 3 + 1]
      T[t * 9 + k * 3 + 2] = positions[v * 3 + 2]
    }

  const lo = [Infinity, Infinity, Infinity]
  const hi = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < positions.length; i += 3)
    for (let k = 0; k < 3; k++) {
      lo[k] = Math.min(lo[k], positions[i + k] - AO_CELL)
      hi[k] = Math.max(hi[k], positions[i + k] + AO_CELL)
    }
  const dims = [0, 1, 2].map(k => Math.ceil((hi[k] - lo[k]) / AO_CELL))
  const cellOf = (i, j, k) => i + dims[0] * (j + dims[1] * k)
  const cells = new Map()
  for (let t = 0; t < triCount; t++) {
    const a = [0, 1, 2].map(k => Math.floor((Math.min(T[t * 9 + k], T[t * 9 + 3 + k], T[t * 9 + 6 + k]) - lo[k]) / AO_CELL))
    const b = [0, 1, 2].map(k => Math.floor((Math.max(T[t * 9 + k], T[t * 9 + 3 + k], T[t * 9 + 6 + k]) - lo[k]) / AO_CELL))
    for (let i = a[0]; i <= b[0]; i++)
      for (let j = a[1]; j <= b[1]; j++)
        for (let k = a[2]; k <= b[2]; k++) {
          const c = cellOf(i, j, k)
          const list = cells.get(c)
          if (list) list.push(t)
          else cells.set(c, [t])
        }
  }

  // Möller–Trumbore.
  const intersect = (o, d, t) => {
    const b = t * 9
    const e1x = T[b + 3] - T[b], e1y = T[b + 4] - T[b + 1], e1z = T[b + 5] - T[b + 2]
    const e2x = T[b + 6] - T[b], e2y = T[b + 7] - T[b + 1], e2z = T[b + 8] - T[b + 2]
    const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x
    const det = e1x * px + e1y * py + e1z * pz
    if (Math.abs(det) < 1e-12) return Infinity
    const inv = 1 / det
    const tx = o[0] - T[b], ty = o[1] - T[b + 1], tz = o[2] - T[b + 2]
    const u = (tx * px + ty * py + tz * pz) * inv
    if (u < 0 || u > 1) return Infinity
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x
    const v = (d[0] * qx + d[1] * qy + d[2] * qz) * inv
    if (v < 0 || u + v > 1) return Infinity
    const hit = (e2x * qx + e2y * qy + e2z * qz) * inv
    // Nearer than the cloth's own thickness is the other side of the same fold (a rim
    // seeing its inner wall), which outlined every hem in black.
    return hit > AO_NEAR ? hit : Infinity
  }

  const stamp = new Int32Array(triCount)
  let rayId = 0
  // Grid traversal (Amanatides & Woo): the nearest hit within reach, or Infinity.
  const trace = (o, d) => {
    rayId++
    const idx = [0, 1, 2].map(k => Math.floor((o[k] - lo[k]) / AO_CELL))
    const step = d.map(c => (c > 0 ? 1 : -1))
    const tMax = [0, 1, 2].map(k => (d[k] !== 0 ? ((idx[k] + (d[k] > 0 ? 1 : 0)) * AO_CELL + lo[k] - o[k]) / d[k] : Infinity))
    const tDelta = d.map(c => (c !== 0 ? AO_CELL / Math.abs(c) : Infinity))
    let best = Infinity
    for (;;) {
      if (idx.some((c, k) => c < 0 || c >= dims[k])) return best
      const list = cells.get(cellOf(idx[0], idx[1], idx[2]))
      if (list)
        for (const t of list) {
          if (stamp[t] === rayId) continue
          stamp[t] = rayId
          const hit = intersect(o, d, t)
          if (hit < best) best = hit
        }
      const next = Math.min(tMax[0], tMax[1], tMax[2])
      if (best <= next || next > AO_REACH) return best
      const axis = tMax[0] === next ? 0 : tMax[1] === next ? 1 : 2
      idx[axis] += step[axis]
      tMax[axis] += tDelta[axis]
    }
  }

  const count = positions.length / 3
  for (let v = 0; v < count; v++) {
    const n = [normals[v * 3], normals[v * 3 + 1], normals[v * 3 + 2]]
    const o = [positions[v * 3] + n[0] * 0.004, positions[v * 3 + 1] + n[1] * 0.004, positions[v * 3 + 2] + n[2] * 0.004]
    const t1 = normalize(cross(Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], n))
    const t2 = cross(n, t1)
    let occluded = 0
    for (const h of HEMISPHERE) {
      const d = [0, 1, 2].map(k => t1[k] * h[0] + t2[k] * h[1] + n[k] * h[2])
      const hit = trace(o, d)
      if (hit <= AO_REACH) occluded += 1 - (hit / AO_REACH) * 0.6
    }
    const ao = 1 - occluded / AO_RAYS
    // The inside of a sleeve or the body is enclosed on every side and would bake
    // nearly black; in a studio it's lit through the openings, so it keeps a floor.
    const floor = masks[v * 4] > 127 ? 0.55 : 0.3
    const shade = Math.round(clamp(floor + (1 - floor) * Math.pow(ao, 1.3), 0, 1) * 255)
    colors.set([shade, shade, shade, 255], v * 4)
  }
}

// ── Merge ─────────────────────────────────────────────────────────────────

let total = 0
for (const part of parts) total += part.pts.length
const positions = new Float32Array(total * 3)
const normals = new Float32Array(total * 3)
const uvs = new Float32Array(total * 2)
const colors = new Uint8Array(total * 4)
const masks = new Uint8Array(total * 4)
const indices = []
let offset = 0
for (const part of parts) {
  part.pts.forEach((q, i) => {
    const v = offset + i
    positions.set(q, v * 3)
    normals.set(part.normals[i], v * 3)
    uvs.set(part.uvs[i], v * 2)
    const mk = part.mask[i]
    masks.set(mk.map(c => Math.round(clamp(c, 0, 1) * 255)), v * 4)
  })
  for (const t of part.tris) indices.push(t + offset)
  offset += part.pts.length
}

bakeOcclusion(positions, normals, indices, colors, masks)

// ── GLB ───────────────────────────────────────────────────────────────────

function glb() {
  const views = []
  const accessors = []
  const chunks = []
  let byteOffset = 0
  const put = (typed, target, accessor) => {
    const pad = (4 - (byteOffset % 4)) % 4
    if (pad) {
      chunks.push(new Uint8Array(pad))
      byteOffset += pad
    }
    views.push({ buffer: 0, byteOffset, byteLength: typed.byteLength, target })
    chunks.push(new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength))
    byteOffset += typed.byteLength
    accessors.push({ bufferView: views.length - 1, ...accessor })
    return accessors.length - 1
  }

  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < total; i++)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], positions[i * 3 + k])
      max[k] = Math.max(max[k], positions[i * 3 + k])
    }

  const POSITION = put(positions, 34962, { componentType: 5126, count: total, type: 'VEC3', min, max })
  const NORMAL = put(normals, 34962, { componentType: 5126, count: total, type: 'VEC3' })
  const TEXCOORD_0 = put(uvs, 34962, { componentType: 5126, count: total, type: 'VEC2' })
  const COLOR_0 = put(colors, 34962, { componentType: 5121, normalized: true, count: total, type: 'VEC4' })
  const _MASK = put(masks, 34962, { componentType: 5121, normalized: true, count: total, type: 'VEC4' })
  const wide = total > 65535
  const index = put(wide ? new Uint32Array(indices) : new Uint16Array(indices), 34963, {
    componentType: wide ? 5125 : 5123,
    count: indices.length,
    type: 'SCALAR',
  })
  const tail = (4 - (byteOffset % 4)) % 4
  if (tail) {
    chunks.push(new Uint8Array(tail))
    byteOffset += tail
  }

  const json = {
    asset: { version: '2.0', generator: 'mowlo scripts/tee/build-tee.mjs' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: 'tee', mesh: 0 }],
    meshes: [{ name: 'tee', primitives: [{ attributes: { POSITION, NORMAL, TEXCOORD_0, COLOR_0, _MASK }, indices: index, mode: 4 }] }],
    buffers: [{ byteLength: byteOffset }],
    bufferViews: views,
    accessors,
  }
  let text = Buffer.from(JSON.stringify(json))
  if (text.length % 4) text = Buffer.concat([text, Buffer.alloc(4 - (text.length % 4), 0x20)])
  const bin = Buffer.concat(chunks.map(c => Buffer.from(c.buffer, c.byteOffset, c.byteLength)))
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(12 + 8 + text.length + 8 + bin.length, 8)
  const jsonHead = Buffer.alloc(8)
  jsonHead.writeUInt32LE(text.length, 0)
  jsonHead.writeUInt32LE(0x4e4f534a, 4)
  const binHead = Buffer.alloc(8)
  binHead.writeUInt32LE(bin.length, 0)
  binHead.writeUInt32LE(0x004e4942, 4)
  return Buffer.concat([header, jsonHead, text, binHead, bin])
}

const file = glb()
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, file)

console.log(
  [
    `vertices ${total}`,
    `triangles ${indices.length / 3}`,
    `parts ${parts.length} (panels, sleeves, inner walls, rims, neckband)`,
    `cloth: ${draped.particles} particles, ${draped.stretch} stretch + ${draped.bends} bend constraints, ${draped.contacts} resting on the body`,
    `size ${(file.length / 1024).toFixed(0)} KB`,
    `built in ${((performance.now() - started) / 1000).toFixed(2)}s`,
    `→ ${OUT}`,
  ].join('\n'),
)
