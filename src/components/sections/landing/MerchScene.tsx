'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { Mesh, type Group, type Material, type Object3D } from 'three'
import { beat } from '@/lib/scroll/useSectionProgress'
import { Bottle } from '@/components/three/objects/Bottle'
import { Cap } from '@/components/three/objects/Cap'
import { LandingSticker, type StickerStyle } from '@/components/three/objects/LandingSticker'
import { Tee } from '@/components/three/objects/Tee'
import { createLive } from '@/components/three/objects/live'
import { MERCH_TURNS, STICKER_SLAPS } from './beats'

type V3 = [number, number, number]

/**
 * Where things happen, per screen. Desktop holds each piece left of centre,
 * clear of the copy at the bottom right; a phone holds it above the copy.
 * `reach` is far enough off screen that a piece enters from nothing.
 */
const STAGE = {
  wide: { hold: [-2.3, 0.35, 0] as V3, reach: 9, floor: -6, scale: 1 },
  compact: { hold: [0, 1.55, 0] as V3, reach: 5, floor: -7, scale: 0.6 },
}

/** Per piece: size, and how near the camera it sits, so no two ever share depth. */
const SIZE = { tee: 1.05, cap: 0.95, bottle: 0.95, sticker: 1 }
const DEPTH = { tee: -1.4, cap: 0, bottle: -0.7, sticker: 1.4 }

/**
 * The three stickers, one of each style (see LandingSticker): where on the
 * word each lands, its tilt, which edge peels (`curlAt`, radians round it) and
 * how far that edge stays peeled once it's stuck (`rest`, radians). The neon
 * one keeps a proper roll, like the reference; the worn one barely lifts; the
 * vinyl burst lies flat.
 */
const STICKERS: { style: StickerStyle; wide: V3; compact: V3; tilt: number; curlAt: number; rest: number }[] = [
  { style: 'neon', wide: [-3.2, 0.85, 0], compact: [-1.15, 2.2, 0], tilt: -0.28, curlAt: 0.7, rest: 1.9 },
  { style: 'worn', wide: [0.3, 1.3, 0], compact: [0.95, 1.8, 0], tilt: 0.2, curlAt: 2.4, rest: 0.25 },
  { style: 'burst', wide: [3.1, 0.55, 0], compact: [-0.1, 1.2, 0], tilt: -0.12, curlAt: -0.9, rest: 0 },
]

const TAU = Math.PI * 2
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const outCubic = (t: number) => 1 - (1 - t) ** 3
const inCubic = (t: number) => t ** 3
/** Overshoots and settles: a slap, a bounce. */
const outBack = (t: number, s = 1.7) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2

/** Damping time for every move. Short enough to track a fast scroll, long enough to hide wheel steps. */
const DAMP = 0.12

/**
 * Fades every mesh under a piece. Materials are made transparent once, the
 * first time, so the fade never forces a shader recompile mid-scroll.
 */
function setOpacity(root: Object3D, opacity: number) {
  root.traverse(o => {
    const mesh = o as Mesh
    if (!mesh.isMesh || mesh.userData.depthOnly) return
    for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as Material[]) {
      if (!m.transparent) {
        m.transparent = true
        m.needsUpdate = true
      }
      m.opacity = opacity
    }
  })
}

/**
 * Lets a solid piece fade as one surface. A see-through tee otherwise shows
 * its own inside — the back panel, the folds, the neckband's far side — as it
 * fades. Each mesh gets a depth-only twin drawn first (same geometry, a clone
 * of its material sharing the same shader hooks, so the cloth moves
 * identically); the visible pass then only paints the nearest surface.
 * Runs once per mesh, whenever the model has loaded.
 */
function fadeAsOne(root: Object3D) {
  const meshes: Mesh[] = []
  root.traverse(o => {
    const mesh = o as Mesh
    if (mesh.isMesh && !mesh.userData.depthOnly && !mesh.userData.hasDepthTwin) meshes.push(mesh)
  })
  for (const mesh of meshes) {
    const source = mesh.material as Material
    const depth = source.clone()
    // clone() resets a physical material's defines; the garment shader needs its USE_UV back.
    depth.defines = { ...(source as Material & { defines?: Record<string, unknown> }).defines }
    depth.onBeforeCompile = source.onBeforeCompile
    depth.colorWrite = false
    const twin = new Mesh(mesh.geometry, depth)
    twin.userData.depthOnly = true
    twin.renderOrder = -1
    mesh.add(twin)
    mesh.userData.hasDepthTwin = true
  }
}

interface MerchSceneProps {
  progress: MotionValue<number>
  compact: boolean
}

/**
 * The Creators landing: a creator's drop, one piece at a time, timed to the
 * landing's scroll (MERCH_TURNS). Every value is computed from progress and
 * then damped toward, so the choreography scrubs both ways and a wheel notch
 * never jumps.
 */
export function MerchScene({ progress, compact }: MerchSceneProps) {
  const tee = useRef<Group>(null)
  const cap = useRef<Group>(null)
  const bottle = useRef<Group>(null)
  const stickers = useRef<(Group | null)[]>([])
  // Each sticker's curl, written here every frame and read by the sticker.
  const curls = useMemo(() => STICKERS.map(sticker => ({ value: sticker.rest })), [])
  const live = useMemo(() => {
    const it = createLive()
    it.print.value = 1
    return it
  }, [])

  // The depth twins' materials are ours (fadeAsOne made them); the rest belong to the pieces.
  useEffect(() => {
    const root = tee.current
    return () =>
      root?.traverse(o => {
        if (o.userData.depthOnly) ((o as Mesh).material as Material).dispose()
      })
  }, [])

  useFrame((_, dt) => {
    const p = progress.get()
    const stage = compact ? STAGE.compact : STAGE.wide
    const [hx, hy] = stage.hold

    // ── Tee: eases up into frame, holds and turns, fades away ──
    if (tee.current) {
      const { in: i, hold: h, out: o } = MERCH_TURNS.tee
      const a = outCubic(beat(p, ...i))
      const held = beat(p, ...h)
      const f = beat(p, ...o)
      const g = tee.current
      g.visible = p > i[0] && p < o[1]
      easing.damp3(g.position, [mix(hx - 1.2, hx, a), mix(hy - 3.2, hy, a) + f * 0.5, DEPTH.tee - (1 - a) * 1.5 - f * 1.2], DAMP, dt)
      easing.damp(g.rotation, 'y', mix(-0.9, 0, a) + held * 0.45 + f * 0.25, DAMP, dt)
      easing.damp(g.rotation, 'x', (1 - a) * 0.3, DAMP, dt)
      easing.damp(g.rotation, 'z', (1 - a) * -0.15, DAMP, dt)
      g.scale.setScalar(SIZE.tee * stage.scale * (1 - f * 0.08))
      fadeAsOne(g)
      setOpacity(g, Math.min(a * 1.6, 1) * (1 - f))
    }

    // ── Cap: spins in from the left, settles, spins off to the right ──
    if (cap.current) {
      const { in: i, hold: h, out: o } = MERCH_TURNS.cap
      const a = outCubic(beat(p, ...i))
      const held = beat(p, ...h)
      const f = inCubic(beat(p, ...o))
      const g = cap.current
      g.visible = p > i[0] && p < o[1]
      const x = f > 0 ? mix(hx, stage.reach, f) : mix(-stage.reach, hx, a)
      const y = f > 0 ? hy + f * 2.4 : hy + (1 - a) * 0.8
      easing.damp3(g.position, [x, y, DEPTH.cap], DAMP, dt)
      // Two turns in, slowing to face front; a little nod while held; two turns out.
      easing.damp(g.rotation, 'y', -(1 - a) * 2 * TAU + Math.sin(held * Math.PI) * 0.35 + f * 2 * TAU, DAMP, dt)
      easing.damp(g.rotation, 'z', (1 - a) * 0.35 - f * 0.4, DAMP, dt)
      easing.damp(g.rotation, 'x', 0.12, DAMP, dt)
      g.scale.setScalar(SIZE.cap * stage.scale)
    }

    // ── Bottle: rises from the bottom with a bounce, tipped at a jaunty angle,
    //    turning slowly so the wrap goes round; sinks back down ──
    if (bottle.current) {
      const { in: i, hold: h, out: o } = MERCH_TURNS.bottle
      const a = outBack(beat(p, ...i), 1.2)
      const held = beat(p, ...h)
      const f = inCubic(beat(p, ...o))
      const g = bottle.current
      g.visible = p > i[0] && p < o[1]
      const y = f > 0 ? mix(hy, stage.floor, f) : mix(stage.floor, hy, a)
      easing.damp3(g.position, [hx + 0.2, y, DEPTH.bottle], DAMP, dt)
      // Tipped about 35°, like a bottle tossed into the air; it straightens a
      // touch as it settles, and tips further as it drops away.
      easing.damp(g.rotation, 'z', -0.62 + (1 - Math.min(a, 1)) * 0.3 - f * 0.4, DAMP, dt)
      easing.damp(g.rotation, 'x', 0.15, DAMP, dt)
      // Half a turn in, a slow turn while held, half a turn out: the wrap goes round.
      easing.damp(g.rotation, 'y', -(1 - Math.min(a, 1)) * Math.PI + held * 1.2 + f * Math.PI, DAMP, dt)
      g.scale.setScalar(SIZE.bottle * stage.scale)
    }

    // ── Stickers: slap, slap, slap onto the word; peel off and flutter away ──
    const peel = beat(p, ...STICKER_SLAPS.peel)
    STICKERS.forEach((sticker, k) => {
      const g = stickers.current[k]
      if (!g) return
      const start = STICKER_SLAPS.at[k]
      const s = beat(p, start, start + STICKER_SLAPS.length)
      // Each peels a beat after the one before, so they leave as they came.
      const off = beat(peel, k * 0.12, 0.7 + k * 0.12)
      g.visible = s > 0 && off < 1
      if (!g.visible) return
      const [tx, ty, tz] = compact ? sticker.compact : sticker.wide
      const side = k % 2 ? 1 : -1
      // From just in front of the camera to stuck flat on the word.
      const slap = outBack(s, 2.2)
      g.position.set(
        tx + side * off * 1.6,
        ty + off * 4.5 + Math.sin(off * Math.PI * 3) * 0.2 * off,
        mix(DEPTH.sticker + 6, DEPTH.sticker + tz, Math.min(s * 1.4, 1)) + off * 2,
      )
      // Curled as it flies in, pressed down on impact to its resting lift, then
      // peeled back hard from that same edge as it comes away.
      curls[k].value = Math.max(0, s < 1 ? mix(1.5, sticker.rest, outBack(s, 1.4)) : mix(sticker.rest, 2.7, Math.min(1, off * 1.6)))
      // Lands tilted toward you, flattens on impact; peels by lifting its bottom edge, then tumbles.
      g.rotation.set(mix(-0.7, 0, Math.min(s * 1.3, 1)) - off * 1.3, side * off * 0.8, sticker.tilt + (1 - s) * 0.6 + side * off * 2.2)
      g.scale.setScalar(SIZE.sticker * stage.scale * mix(2.2, 1, slap))
      setOpacity(g, Math.min(s * 3, 1) * (1 - beat(off, 0.6, 1)))
    })
  })

  return (
    <>
      <group ref={tee} visible={false}>
        {/* A model file; nothing else waits for it to load. */}
        <Suspense fallback={null}>
          <Tee live={live} />
        </Suspense>
      </group>
      <group ref={cap} visible={false}>
        <Cap live={live} />
      </group>
      <group ref={bottle} visible={false}>
        <Bottle live={live} />
      </group>
      {STICKERS.map((sticker, k) => (
        <group
          key={sticker.style}
          ref={el => {
            stickers.current[k] = el
          }}
          visible={false}
        >
          <LandingSticker live={live} style={sticker.style} curl={curls[k]} curlAt={sticker.curlAt} seed={k + 1} />
        </group>
      ))}
    </>
  )
}
