'use client'

import { Suspense, useMemo, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera } from '@react-three/drei'
import { easing } from 'maath'
import type { Group } from 'three'
import { beat } from '@/lib/scroll/useSectionProgress'
import { StudioLighting } from '@/components/three/StudioLighting'
import { BusinessCard } from '@/components/three/objects/BusinessCard'
import { Flyer } from '@/components/three/objects/Flyer'
import { createLive } from '@/components/three/objects/live'
import { Mug } from '@/components/three/objects/Mug'
import { PaperBag } from '@/components/three/objects/PaperBag'
import { StickerSheet } from '@/components/three/objects/StickerSheet'
import { Tee } from '@/components/three/objects/Tee'
import { FINALE, PHASE, PIECES, pieceWindow } from './beats'

type V3 = [number, number, number]

interface Path {
  /** How far off-screen a piece starts and ends, sideways. */
  far: number
  drop: number
  /** How high the swoop rises between entry and the spotlight. */
  lift: number
  /** Where a piece holds while it's in the spotlight. */
  hold: V3
}

/** Desktop holds right of centre, clear of the caption. A phone holds centre. */
const WIDE: Path = { far: 9, drop: 2.6, lift: 2.2, hold: [0.9, -0.05, 0] }
const COMPACT: Path = { far: 5.5, drop: 3.6, lift: 1.4, hold: [0, 0.25, 0] }

/** Per piece: base scale, and how far it turns each way while held. */
const FIT = [
  { scale: 0.95, turn: 0.45 }, // card
  { scale: 0.92, turn: 0.35 }, // stickers
  { scale: 0.92, turn: 0.4 }, // flyer
  { scale: 1.0, turn: 0.9 }, // bag
  { scale: 1.1, turn: 1.1 }, // mug
  { scale: 0.95, turn: 0.55 }, // tee
]

/**
 * The finale: the whole line-up on one shelf across the middle, between the
 * headline and the call to action — never a scattered cluster. A phone gets a
 * three-by-two grid.
 */
const SHELF_WIDE: V3[] = [-3.575, -2.225, -0.875, 0.475, 1.825, 3.175].map(x => [x, -0.35, 0] as V3)
/**
 * The pieces reach the shelf early in the finale, easing out, so the line-up has
 * settled while the closing copy is still on screen rather than arriving as it
 * scrolls away.
 */
const GATHER: [number, number] = [FINALE[0], FINALE[0] + 0.07]
const SHELF_COMPACT: V3[] = [
  [-1.2, 0.85, 0],
  [0, 0.85, 0],
  [1.2, 0.85, 0],
  [-1.2, -0.65, 0],
  [0, -0.65, 0],
  [1.2, -0.65, 0],
]
/** Shelf scale per piece, so each reads at about the same size. */
const SHELF_SCALE = [0.32, 0.34, 0.36, 0.4, 0.5, 0.33]

const smooth = (t: number) => t * t * (3 - 2 * t)
const easeIn = (t: number) => t * t * t
const easeOut = (t: number) => 1 - (1 - t) ** 3
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const mix3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]
const bezier = (a: V3, c: V3, b: V3, t: number): V3 => {
  const u = 1 - t
  return [0, 1, 2].map(k => u * u * a[k] + 2 * u * t * c[k] + t * t * b[k]) as V3
}

/**
 * Where piece i is at t through its window: it swoops in spinning from one
 * side, turns slowly in the spotlight, and spins out the other way — toward
 * the camera, so it leaves the frame rather than shrinking in it.
 */
function flight(i: number, t: number, path: Path) {
  const side = i % 2 === 0 ? 1 : -1
  const fit = FIT[i]
  const enter: V3 = [side * path.far, -side * path.drop, -5]
  const exit: V3 = [-side * path.far, side * path.drop, 3]
  const arrive = smooth(beat(t, ...PHASE.arrive))
  const leave = easeIn(beat(t, ...PHASE.leave))
  const held = beat(t, PHASE.arrive[1], PHASE.leave[0])

  const pos =
    t < PHASE.leave[0]
      ? bezier(enter, [side * path.far * 0.2, path.lift, 1.5], path.hold, arrive)
      : bezier(path.hold, [-side * path.far * 0.15, -path.lift, 2.5], exit, leave)

  const rot: V3 = [
    0.9 * (1 - arrive) + 0.08 - 0.5 * leave,
    side * 2.4 * Math.PI * (1 - arrive) + (held * 2 - 1) * fit.turn * arrive - side * 2 * Math.PI * leave,
    side * 0.5 * (1 - arrive) - side * 0.35 * leave,
  ]

  return { pos, rot, scale: fit.scale * (0.55 + 0.45 * arrive) * (1 + 0.3 * leave) }
}

interface HeroSceneProps {
  progress: MotionValue<number>
  compact: boolean
  /** Pointer tilt — fine pointers only. */
  tilt: boolean
}

/**
 * The product line, one piece at a time. Each is printed as it arrives and
 * gets a moment — the card flips through its finishes, the sticker peels, the
 * flyer lies flat, the bag and mug turn — before it spins away. Every value is
 * damped toward the scroll position, so a wheel notch never jumps.
 */
export default function HeroScene({ progress, compact, tilt }: HeroSceneProps) {
  const rig = useRef<Group>(null)
  const groups = useRef<(Group | null)[]>([])
  const lives = useMemo(() => PIECES.map(createLive), [])

  useFrame((state, dt) => {
    const p = progress.get()
    const path = compact ? COMPACT : WIDE
    const gather = easeOut(beat(p, ...GATHER))
    const time = state.clock.elapsedTime

    PIECES.forEach((_, i) => {
      const live = lives[i]
      const t = beat(p, ...pieceWindow(i))
      live.t = t
      // In the finale everything is shown printed, whatever its own window said.
      easing.damp(live.print, 'value', Math.max(beat(t, ...PHASE.print), gather), 0.12, dt)
      easing.damp(live, 'flourish', smooth(beat(t, ...PHASE.flourish)), 0.15, dt)

      const group = groups.current[i]
      if (!group) return

      const f = flight(i, t, path)
      const slot = (compact ? SHELF_COMPACT : SHELF_WIDE)[i]
      // Each piece turns gently in place on the shelf, so its print stays in view.
      const sway = Math.sin(time * 0.6 + i * 1.3) * 0.45
      const scale = mix(f.scale * (compact ? 0.9 : 1), SHELF_SCALE[i] * (compact ? 0.85 : 1), gather)

      easing.damp3(group.position, mix3(f.pos, slot, gather), 0.18, dt)
      // Scalar damping, not dampE: the spins run past π and must not take the short way round.
      easing.damp(group.rotation, 'x', mix(f.rot[0], 0.1, gather), 0.18, dt)
      easing.damp(group.rotation, 'y', mix(f.rot[1], sway, gather), 0.18, dt)
      easing.damp(group.rotation, 'z', mix(f.rot[2], 0, gather), 0.18, dt)
      easing.damp3(group.scale, [scale, scale, scale], 0.18, dt)
    })

    if (rig.current) {
      easing.damp(rig.current.rotation, 'x', tilt ? -state.pointer.y * 0.08 : 0, 0.5, dt)
      easing.damp(rig.current.rotation, 'y', tilt ? state.pointer.x * 0.12 : 0, 0.5, dt)
    }
  })

  const slot = (i: number) => (el: Group | null) => {
    groups.current[i] = el
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={compact ? 40 : 32} />
      <StudioLighting resolution={compact ? 128 : 256} />

      <group ref={rig}>
        {[
          <BusinessCard key="card" live={lives[0]} textureScale={compact ? 1 : 2} />,
          <StickerSheet key="stickers" live={lives[1]} />,
          <Flyer key="flyer" live={lives[2]} />,
          <PaperBag key="bag" live={lives[3]} />,
          <Mug key="mug" live={lives[4]} />,
          // The tee is a model file; nothing else waits for it to load.
          <Suspense key="tee" fallback={null}>
            <Tee live={lives[5]} />
          </Suspense>,
        ].map((piece, i) => (
          <group key={PIECES[i].id} ref={slot(i)} scale={0}>
            <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.25}>
              {piece}
            </Float>
          </group>
        ))}
      </group>
    </>
  )
}
