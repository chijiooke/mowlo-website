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
import { createLive } from '@/components/three/objects/live'
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
  { scale: 0.95, turn: 0.55 }, // tee
]

const smooth = (t: number) => t * t * (3 - 2 * t)
const easeIn = (t: number) => t * t * t
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

interface ParadeSceneProps {
  progress: MotionValue<number>
  compact: boolean
  /** Pointer tilt — fine pointers only. */
  tilt: boolean
}

/**
 * The product line, one piece at a time. Each is printed as it arrives and
 * gets a moment — the card flips through its finishes, the sticker peels, the
 * tee turns — before it spins away. Every value is
 * damped toward the scroll position, so a wheel notch never jumps.
 */
export default function ParadeScene({ progress, compact, tilt }: ParadeSceneProps) {
  const rig = useRef<Group>(null)
  const groups = useRef<(Group | null)[]>([])
  const lives = useMemo(() => PIECES.map(createLive), [])

  useFrame((state, dt) => {
    const p = progress.get()
    const path = compact ? COMPACT : WIDE

    PIECES.forEach((_, i) => {
      const live = lives[i]
      const t = beat(p, ...pieceWindow(i))
      live.t = t
      easing.damp(live.print, 'value', beat(t, ...PHASE.print), 0.12, dt)
      easing.damp(live, 'flourish', smooth(beat(t, ...PHASE.flourish)), 0.15, dt)

      const group = groups.current[i]
      if (!group) return

      const f = flight(i, t, path)
      const scale = f.scale * (compact ? 0.9 : 1)

      easing.damp3(group.position, f.pos, 0.18, dt)
      // Scalar damping, not dampE: the spins run past π and must not take the short way round.
      easing.damp(group.rotation, 'x', f.rot[0], 0.18, dt)
      easing.damp(group.rotation, 'y', f.rot[1], 0.18, dt)
      easing.damp(group.rotation, 'z', f.rot[2], 0.18, dt)
      easing.damp3(group.scale, [scale, scale, scale], 0.18, dt)
      // Only on stage inside its own window, and never under the closing line.
      // Visibility follows scroll directly, not the damped position: a fast
      // scroll can land in the finale while a piece is still easing out, and it
      // would otherwise hang mid-flight behind the text.
      group.visible = t > 0 && t < 1 && p < FINALE[0]
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
          // The tee is a model file; nothing else waits for it to load.
          <Suspense key="tee" fallback={null}>
            <Tee live={lives[2]} />
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
