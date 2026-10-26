'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, MeshPhysicalMaterial } from 'three'
import { burstRadius, faceTexture, paperBump, paperPhoto } from '@/lib/three/brandTexture'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

export type StickerStyle = 'neon' | 'worn' | 'burst'

const RADIUS = 0.58
/** Half the stock's thickness: the face sits this far in front, the back this far behind. */
const HALF = 0.006
/** Where the peel starts, as a share of the radius from the centre. */
const CURL_FROM = 0.5

/**
 * Per style, after the references:
 *   neon   edge-to-edge print, type round the rim, a soft rolled peel; fine paper grain
 *   worn   heavily crumpled paper, creases you see in the colour, a scuffed edge
 *   burst  a scalloped die-cut in matte vinyl, flat and crisp
 */
const STYLE: Record<StickerStyle, { crumple: number; creases: number; grain: number; shape: (t: number) => number; vinyl?: boolean }> = {
  neon: { crumple: 0.006, creases: 1.6, grain: 0.6, shape: () => 1 },
  worn: { crumple: 0.026, creases: 11, grain: 1, shape: () => 1 },
  burst: { crumple: 0, creases: 0, grain: 0, shape: burstRadius, vinyl: true },
}

interface LandingStickerProps {
  live: Live
  style: StickerStyle
  /** The curl, in radians: written by the scene each frame. */
  curl: { value: number }
  /** Which edge peels, in radians round the sticker; 0 is the right edge. */
  curlAt?: number
  /** Seeds the crumple, so no two crease alike. */
  seed?: number
}

/** Crumples: soft crossing waves, held flat at the centre where the sticker is stuck. */
function crumple(x: number, y: number, seed: number, depth: number) {
  if (!depth) return 0
  const r = Math.hypot(x, y) / RADIUS
  const w =
    Math.sin(x * 11 + seed * 1.7) * Math.cos(y * 8.5 - seed) * 0.5 +
    Math.sin((x + y) * 17 + seed * 2.3) * 0.3 +
    Math.abs(Math.sin((x * 0.7 - y) * 9 + seed)) * 0.4 - 0.2
  return depth * w * Math.min(1, r * 1.6)
}

/**
 * A polar grid over the sticker's outline — `shape(t)` scales the radius
 * round it, so the same mesh is a disc or a scalloped burst — with UVs laid
 * flat across it, so the print lands where it was drawn. `side` 1 is the face,
 * −1 the back.
 */
function sheet(shape: (t: number) => number, side: 1 | -1) {
  const around = 384
  const rings = 44
  const positions: number[] = []
  const uvs: number[] = []
  const index: number[] = []
  positions.push(0, 0, side * HALF)
  uvs.push(0.5, 0.5)
  for (let j = 1; j <= rings; j++) {
    for (let i = 0; i < around; i++) {
      const t = (i / around) * Math.PI * 2
      const r = RADIUS * shape(t) * (j / rings)
      const x = Math.cos(t) * r
      const y = Math.sin(t) * r
      positions.push(x, y, side * HALF)
      uvs.push(0.5 + x / (2 * RADIUS), 0.5 + y / (2 * RADIUS))
    }
  }
  const at = (j: number, i: number) => (j === 0 ? 0 : 1 + (j - 1) * around + (i % around))
  for (let i = 0; i < around; i++) {
    if (side > 0) index.push(0, at(1, i), at(1, i + 1))
    else index.push(0, at(1, i + 1), at(1, i))
  }
  for (let j = 1; j < rings; j++)
    for (let i = 0; i < around; i++) {
      const a = at(j, i)
      const b = at(j, i + 1)
      const c = at(j + 1, i)
      const d = at(j + 1, i + 1)
      if (side > 0) index.push(a, c, d, a, d, b)
      else index.push(a, d, c, a, b, d)
    }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(positions, 3))
  g.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  g.setIndex(index)
  return g
}

/**
 * Rolls everything past the chord at CURL_FROM up and back over the face,
 * round a cylinder — a peel, not a crease. Each layer keeps its offset from
 * the middle of the stock along the bent surface's normal, so as the edge
 * turns over the back comes into view, as on a real sticker.
 */
function roll(g: BufferGeometry, flat: Float32Array, angle: number, at: number) {
  const pos = g.attributes.position
  ;(pos.array as Float32Array).set(flat)
  const c = Math.cos(at)
  const s = Math.sin(at)
  const chord = RADIUS * CURL_FROM
  // Over the remaining reach, curve by `angle` in all: a broad, soft roll.
  const radius = (RADIUS * (1.02 - CURL_FROM)) / Math.max(angle, 1e-3)
  if (angle > 1e-3) {
    for (let i = 0; i < pos.count; i++) {
      const x0 = pos.getX(i)
      const y0 = pos.getY(i)
      const z0 = pos.getZ(i)
      const u = x0 * c + y0 * s
      const v = -x0 * s + y0 * c
      const past = u - chord
      if (past <= 0) continue
      const th = past / radius
      const nu = chord + (radius + z0) * Math.sin(th)
      const nz = radius - (radius - z0) * Math.cos(th)
      pos.setXYZ(i, nu * c - v * s, nu * s + v * c, nz)
    }
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
}

/** One of the landing's stickers. See STYLE for how each is made. */
export function LandingSticker({ live, style, curl, curlAt = 0, seed = 1 }: LandingStickerProps) {
  const spec = STYLE[style]

  const geometry = useMemo(() => {
    const layers = { face: sheet(spec.shape, 1), back: sheet(spec.shape, -1) }
    for (const g of Object.values(layers)) {
      const pos = g.attributes.position
      for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) + crumple(pos.getX(i), pos.getY(i), seed, spec.crumple))
      g.userData.flat = Float32Array.from(pos.array as Float32Array)
      roll(g, g.userData.flat, curl.value, curlAt)
    }
    return layers
  }, [spec, seed, curl, curlAt])

  // Re-roll when the scene moves the curl; skip frames where it hasn't.
  const last = useRef(Number.NaN)
  useFrame(() => {
    if (Math.abs(curl.value - last.current) < 0.004) return
    last.current = curl.value
    for (const g of Object.values(geometry)) roll(g, g.userData.flat as Float32Array, curl.value, curlAt)
  })

  const materials = useMemo(() => {
    const face = `sticker-${style}` as const
    // Paper carries the crumpled sheet's creases in its normals; vinyl is smooth.
    const creases = spec.creases ? paperPhoto().clone() : null
    if (creases) {
      creases.repeat.set(1.2, 1.2)
      creases.offset.set(seed * 0.31, seed * 0.17)
      creases.needsUpdate = true
    }
    const relief = creases ? { bumpMap: creases, bumpScale: spec.creases } : { bumpMap: paperBump(), bumpScale: 0.3 }
    const print = createPrintMaterial(faceTexture(face, { printed: false }), faceTexture(face, { printed: true }), live.print, spec.vinyl ? 'soft_touch' : 'matte', relief)
    if (spec.vinyl) Object.assign(print, { roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.4 })
    else Object.assign(print, { sheen: 0.2, sheenRoughness: 0.8 })
    // The back: the stock's own colour, the face's texture so its creases match.
    const back = new MeshPhysicalMaterial({ map: faceTexture(face, { printed: false }), roughness: 0.9, ...relief })
    return { print, back, creases }
  }, [style, spec, seed, live.print])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(
    () => () => {
      materials.print.dispose()
      materials.back.dispose()
      materials.creases?.dispose()
    },
    [materials],
  )

  return (
    <group>
      <mesh geometry={geometry.back} material={materials.back} />
      <mesh geometry={geometry.face} material={materials.print} />
    </group>
  )
}
