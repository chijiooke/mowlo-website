'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { beat } from '@/lib/scroll/useSectionProgress'
import { PrintedSlab } from './PrintedSlab'
import type { Live } from './live'

/**
 * A business card with painted amber edges, at about real stock thickness. In its spotlight it flips to
 * the back while the finish runs matte → glossy → holographic, so the light
 * sweeping across it shows each one.
 */
export function BusinessCard({ live, textureScale = 1 }: { live: Live; textureScale?: 1 | 2 }) {
  const flip = useRef<Group>(null)

  useFrame(() => {
    if (flip.current) flip.current.rotation.y = live.flourish * Math.PI
    const holo = beat(live.t, 0.5, 0.72)
    if (holo > 0) {
      live.finish.a = 'glossy'
      live.finish.b = 'holographic'
      live.finish.t = holo
    } else {
      live.finish.a = 'matte'
      live.finish.b = 'glossy'
      live.finish.t = beat(live.t, 0.28, 0.5)
    }
  })

  return (
    <group ref={flip}>
      <PrintedSlab
        width={3.4}
        height={2.2}
        depth={0.02}
        radius={0.1}
        bevel={0.005}
        front="card-front"
        back="card-back"
        edge="#F5A623"
        print={live.print}
        finish={live.finish}
        textureScale={textureScale}
      />
    </group>
  )
}
