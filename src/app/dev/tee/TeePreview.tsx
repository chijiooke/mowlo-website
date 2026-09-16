'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { StudioLighting } from '@/components/three/StudioLighting'
import { createLive } from '@/components/three/objects/live'
import { Tee } from '@/components/three/objects/Tee'

interface Pose {
  angle: number
  tilt: number
  print: number
  distance: number
  y: number
  fov: number
  /** 'grey' matches the product-mockup references; anything else is the site's ink. */
  background: string
  wind: [number, number, number]
}

/**
 * Dev only: the tee on its own, posed from the query string, so it can be
 * screenshotted headlessly while the model and material are tuned.
 *   /dev/tee?angle=30&tilt=6&print=1&distance=7.5&y=0&fov=32&bg=grey&wind=0.2,0.1,-0.2
 */
export function TeePreview() {
  const [pose, setPose] = useState<Pose | null>(null)
  const live = useMemo(createLive, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const n = (key: string, fallback: number) => (q.has(key) ? Number(q.get(key)) : fallback)
    const wind = (q.get('wind') ?? '0,0,0').split(',').map(Number)
    const next: Pose = {
      angle: n('angle', 20),
      tilt: n('tilt', 6),
      print: n('print', 1),
      distance: n('distance', 7.5),
      y: n('y', 0),
      fov: n('fov', 32),
      background: q.get('bg') === 'grey' ? '#8E8E8E' : '#0A0A0B',
      wind: [wind[0] || 0, wind[1] || 0, wind[2] || 0],
    }
    live.print.value = next.print
    setPose(next)
  }, [live])

  if (!pose) return null

  return (
    <div className="fixed inset-0" style={{ background: pose.background }}>
      <Canvas dpr={2} gl={{ preserveDrawingBuffer: true, antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, pose.y, pose.distance]} fov={pose.fov} />
        <StudioLighting />
        <Suspense fallback={null}>
          <group rotation={[(pose.tilt * Math.PI) / 180, (pose.angle * Math.PI) / 180, 0]}>
            <Tee live={live} wind={pose.wind} />
          </group>
          {/* A soft shadow on the floor below, as in a product mockup. */}
          <ContactShadows position={[0, -1.45, 0]} scale={6} blur={2.8} far={2.5} opacity={0.5} resolution={512} color="#1E1E1E" />
        </Suspense>
      </Canvas>
    </div>
  )
}
