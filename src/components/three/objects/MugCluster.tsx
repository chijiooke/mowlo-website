'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import type { Group } from 'three'
import { Mug } from './Mug'
import type { Live } from './live'

type V3 = [number, number, number]

/**
 * Where each mug rests in the cluster, its tumble, and its glaze — a loose
 * diagonal scatter after the reference flat-lay, with one mug brought right up
 * to the camera for depth.
 * Brand purple, amber and pink, and one pastel blue for air.
 */
const MUGS: { colour: string; at: V3; rot: V3; scale: number }[] = [
  { colour: '#7C5CBF', at: [-2.2, 1.0, -0.6], rot: [0.25, -0.5, 0.18], scale: 0.86 },
  { colour: '#F5A623', at: [2.0, 0.95, 0.2], rot: [-0.15, 0.6, -0.22], scale: 0.92 },
  { colour: '#E8527A', at: [2.3, -1.15, -0.3], rot: [-0.3, -0.2, -0.35], scale: 0.84 },
  // The hero: dead centre and right up at the camera, so the rest read as
  // far behind it, round its edges. It rises last.
  { colour: '#8FCFDF', at: [0, -0.15, 5.2], rot: [0.3, -0.6, -0.15], scale: 1.05 },
]

/** How far below its resting place each mug starts, and how much of the arrival the stagger takes. */
const RISE = 7
const STAGGER = 0.12

const outBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/**
 * A handful of mugs that rise from the bottom one after another, each
 * overshooting a little and settling at its own tumble, then drift while the
 * cluster holds. Reads the piece's own progress (`live.t`), so it scrubs with
 * the parade in both directions.
 */
export function MugCluster({ live }: { live: Live }) {
  const groups = useRef<(Group | null)[]>([])

  useFrame((state, dt) => {
    // The piece's arrival is the first 30% of its window (parade PHASE.arrive).
    const arrive = clamp01(live.t / 0.34)
    const time = state.clock.elapsedTime
    MUGS.forEach((mug, k) => {
      const g = groups.current[k]
      if (!g) return
      const own = clamp01((arrive - k * STAGGER) / (1 - (MUGS.length - 1) * STAGGER))
      const up = own === 0 ? 0 : outBack(own)
      const [x, y, z] = mug.at
      easing.damp3(g.position, [x, y - (1 - up) * RISE + Math.sin(time * 0.8 + k * 1.9) * 0.05, z], 0.12, dt)
      // Tumbling on the way up, settling to its own angle.
      easing.damp(g.rotation, 'x', mug.rot[0] + (1 - own) * 1.2, 0.12, dt)
      easing.damp(g.rotation, 'y', mug.rot[1] + (1 - own) * 2.4 * (k % 2 ? 1 : -1) + Math.sin(time * 0.5 + k) * 0.08, 0.12, dt)
      easing.damp(g.rotation, 'z', mug.rot[2] - (1 - own) * 0.6 * (k % 2 ? 1 : -1), 0.12, dt)
      g.scale.setScalar(mug.scale * 0.74)
    })
  })

  return (
    <>
      {MUGS.map((mug, k) => (
        <group
          key={mug.colour}
          ref={el => {
            groups.current[k] = el
          }}
        >
          <Mug live={live} colour={mug.colour} />
        </group>
      ))}
    </>
  )
}
