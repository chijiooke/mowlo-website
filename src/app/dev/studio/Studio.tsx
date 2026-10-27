'use client'

import { Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { StudioLighting } from '@/components/three/StudioLighting'
import { createLive, type Live } from '@/components/three/objects/live'
import { Bottle } from '@/components/three/objects/Bottle'
import { BusinessCard } from '@/components/three/objects/BusinessCard'
import { Cap } from '@/components/three/objects/Cap'
import { Mug } from '@/components/three/objects/Mug'
import { PaperBag } from '@/components/three/objects/PaperBag'
import { RoundSticker } from '@/components/three/objects/RoundSticker'
import { Socks } from '@/components/three/objects/Socks'
import { Tee } from '@/components/three/objects/Tee'

type V3 = [number, number, number]

interface Shot {
  /** The scene: one piece, or a small arrangement of them. */
  scene: (live: Live) => ReactNode
  /** Ground colour behind it. */
  bg: string
  angle: number
  tilt: number
  distance: number
  y: number
  /** Where the floor shadow sits, or null for none (floating pieces). */
  floor: number | null
}

const R = (deg: number) => (deg * Math.PI) / 180
const at = (p: V3, r: V3, children: ReactNode, s = 1) => (
  <group position={p} rotation={[R(r[0]), R(r[1]), R(r[2])]} scale={s}>
    {children}
  </group>
)

/**
 * Product shots for the business carousel: our own procedural merch, Mowlo
 * branded, each on a single bold ground under soft studio light — the look of
 * a brand-identity mockup, with nothing in it that isn't ours.
 */
const SHOTS: Record<string, Shot> = {
  tee: { scene: live => <Tee live={live} />, bg: '#2A9FD6', angle: 14, tilt: 4, distance: 6.2, y: 0, floor: -1.45 },
  cap: { scene: live => <Cap live={live} />, bg: '#E8527A', angle: 28, tilt: 10, distance: 6.4, y: 0, floor: -1.1 },
  bottle: { scene: live => <Bottle live={live} />, bg: '#1FB89E', angle: 18, tilt: 4, distance: 5.2, y: 0, floor: -1.9 },
  mugs: {
    scene: live => (
      <>
        {at([-0.75, 0, -0.4], [0, 35, 0], <Mug live={live} colour="#7C5CBF" />)}
        {at([0.85, -0.05, 0.35], [0, -30, 0], <Mug live={live} colour="#F5A623" />)}
      </>
    ),
    bg: '#F5F2EC',
    angle: 0,
    tilt: 8,
    distance: 7,
    y: 0.2,
    floor: -1.0,
  },
  cards: {
    scene: live => (
      <>
        {at([-0.45, 0.25, 0], [-18, 14, 12], <BusinessCard live={live} />, 1.05)}
        {at([0.5, -0.35, 0.5], [-14, -16, -10], <BusinessCard live={live} />, 1.05)}
      </>
    ),
    bg: '#7C5CBF',
    angle: 0,
    tilt: 0,
    distance: 11,
    y: 0,
    floor: null,
  },
  stickers: {
    scene: live => (
      <>
        {at([-0.9, 0.55, 0], [10, -20, -12], <RoundSticker live={live} ground="pink" />, 0.95)}
        {at([0.95, 0.35, 0.4], [-8, 18, 14], <RoundSticker live={live} ground="teal" fold={0.9} />, 1.05)}
        {at([0, -0.95, 0.8], [6, 8, -6], <RoundSticker live={live} ground="ink" />, 1)}
      </>
    ),
    bg: '#8DB82B',
    angle: 0,
    tilt: 0,
    distance: 5.4,
    y: 0,
    floor: null,
  },
  bag: { scene: live => <PaperBag live={live} />, bg: '#F5A623', angle: 22, tilt: 6, distance: 6, y: 0, floor: -1.6 },
  socks: { scene: live => <Socks live={live} />, bg: '#1E1E22', angle: 20, tilt: 6, distance: 5.2, y: 0, floor: -1.6 },
}

/**
 * Dev only: one product shot, framed square, for scripts/studio/shoot.sh.
 *   /dev/studio?item=cap&angle=28&tilt=10&distance=6.4&y=0&bg=E8527A
 */
export function Studio() {
  const [shot, setShot] = useState<(Shot & { key: string }) | null>(null)
  const live = useMemo(() => {
    const l = createLive()
    // Arrived, printed, at rest.
    l.t = 1
    l.print.value = 1
    return l
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const key = q.get('item') ?? 'tee'
    const base = SHOTS[key] ?? SHOTS.tee
    const n = (k: string, fallback: number) => (q.has(k) ? Number(q.get(k)) : fallback)
    setShot({
      ...base,
      key,
      bg: q.has('bg') ? `#${q.get('bg')}` : base.bg,
      angle: n('angle', base.angle),
      tilt: n('tilt', base.tilt),
      distance: n('distance', base.distance),
      y: n('y', base.y),
    })
  }, [])

  if (!shot) return null

  return (
    <div className="fixed inset-0" style={{ background: shot.bg }}>
      <style>{'nextjs-portal { display: none !important; }'}</style>
      <Canvas dpr={2} gl={{ preserveDrawingBuffer: true, antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, shot.y, shot.distance]} fov={32} />
        <StudioLighting />
        <Suspense fallback={null}>
          <group rotation={[R(shot.tilt), R(shot.angle), 0]}>{shot.scene(live)}</group>
          {shot.floor !== null && (
            <ContactShadows position={[0, shot.floor, 0]} scale={7} blur={2.6} far={2.5} opacity={0.4} resolution={512} color="#111111" />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
