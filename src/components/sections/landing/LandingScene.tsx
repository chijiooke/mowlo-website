'use client'

import { useMemo, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { easing } from 'maath'
import type { Group } from 'three'
import { beat } from '@/lib/scroll/useSectionProgress'
import { StudioLighting } from '@/components/three/StudioLighting'
import { Flyer } from '@/components/three/objects/Flyer'
import { RoundSticker } from '@/components/three/objects/RoundSticker'
import { createLive } from '@/components/three/objects/live'
import { FLIGHTS, type LandingVariant } from './beats'
import { MerchScene } from './MerchScene'

/** How far off screen a piece starts and ends. A phone sees a narrower slice. */
const REACH = { wide: 9 * 1.25, compact: 5.5 * 0.95 }

const mix = (a: number, b: number, t: number) => a + (b - a) * t

interface LandingSceneProps {
  variant: LandingVariant
  progress: MotionValue<number>
  compact: boolean
  /** Pointer tilt — fine pointers only. */
  tilt: boolean
}

/**
 * The landing's 3D: for Print, printed paper crossing the screen behind the
 * brand name, one at a time, each making a single slow pass; for Creators,
 * the merch choreography (MerchScene). Both share the camera, the lights and
 * the pointer tilt.
 */
export default function LandingScene({ variant, progress, compact, tilt }: LandingSceneProps) {
  const pieces = variant === 'print' ? FLIGHTS : []
  const rig = useRef<Group>(null)
  const flights = useRef<(Group | null)[]>([])
  // Printed, and part-uncurled, so the paper reads as real as it tumbles past.
  const live = useMemo(() => {
    const it = createLive()
    it.print.value = 1
    it.flourish = 0.35
    return it
  }, [])

  useFrame((state, dt) => {
    const p = progress.get()
    const reach = compact ? REACH.compact : REACH.wide

    pieces.forEach((flight, i) => {
      const group = flights.current[i]
      if (!group) return
      const t = beat(p, flight.from, flight.to)
      group.visible = t > 0 && t < 1
      if (!group.visible) return

      group.position.set(
        flight.dir * mix(-reach, reach, t),
        // On a phone the flock crosses above the word rather than over it.
        mix(flight.lane[0], flight.lane[1], t) + Math.sin(Math.PI * t) * 0.5 + (compact ? 1.5 : 0),
        mix(flight.depth[0], flight.depth[1], t),
      )
      // Everything here is printed on one side, so it stays within half a radian
      // of front-on and tumbles about the view axis instead: turned further, a
      // flyer shows its blank back and a sticker thins to an edge-on sliver.
      group.rotation.set(0.35 - t * 0.5, flight.dir * (t - 0.5), 0.6 - t * flight.spin * 0.5)
      group.scale.setScalar(flight.scale * (compact ? 0.6 : 1))
    })

    if (rig.current) {
      easing.damp(rig.current.rotation, 'x', tilt ? -state.pointer.y * 0.08 : 0, 0.5, dt)
      easing.damp(rig.current.rotation, 'y', tilt ? state.pointer.x * 0.12 : 0, 0.5, dt)
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={compact ? 40 : 32} />
      <StudioLighting resolution={compact ? 128 : 256} />

      <group ref={rig}>
        {variant === 'merch' && <MerchScene progress={progress} compact={compact} />}
        {pieces.map((flight, i) => (
          <group
            key={flight.id}
            ref={el => {
              flights.current[i] = el
            }}
            visible={false}
          >
            {flight.sticker ? <RoundSticker live={live} fold={flight.fold} ground="teal" /> : <Flyer live={live} />}
          </group>
        ))}
      </group>
    </>
  )
}

