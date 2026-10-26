'use client'

import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { StudioLighting } from '@/components/three/StudioLighting'
import { Bottle } from '@/components/three/objects/Bottle'
import { Cap } from '@/components/three/objects/Cap'
import { createLive } from '@/components/three/objects/live'
import { LandingSticker } from '@/components/three/objects/LandingSticker'
import { Socks } from '@/components/three/objects/Socks'

/** The landing stickers, as they rest on the word: ?style=neon|worn|burst, ?curl=radians. */
function Sticker({ live }: { live: ReturnType<typeof createLive> }) {
  const q = new URLSearchParams(window.location.search)
  const style = (['neon', 'worn', 'burst'] as const).find(s => s === q.get('style')) ?? 'neon'
  // eslint-disable-next-line react-hooks/exhaustive-deps -- read once from the URL
  const curl = useMemo(() => ({ value: Number(q.get('curl') ?? 0.9) }), [])
  return <LandingSticker live={live} style={style} curl={curl} curlAt={0.5} seed={1} />
}

const PIECES = { cap: Cap, socks: Socks, sticker: Sticker, bottle: Bottle }

/**
 * Dev only: one procedural merch piece, posed from the query string.
 *   /dev/merch?piece=cap&angle=30&tilt=10&print=1&distance=7
 */
export function MerchPreview() {
  const [pose, setPose] = useState<{ piece: keyof typeof PIECES; angle: number; tilt: number; distance: number } | null>(null)
  const live = useMemo(createLive, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const n = (key: string, fallback: number) => (q.has(key) ? Number(q.get(key)) : fallback)
    live.print.value = n('print', 1)
    setPose({ piece: (['cap', 'socks', 'sticker', 'bottle'] as const).find(p => p === q.get('piece')) ?? 'cap', angle: n('angle', 20), tilt: n('tilt', 8), distance: n('distance', 7) })
  }, [live])

  if (!pose) return null
  const Piece = PIECES[pose.piece]

  return (
    <div className="fixed inset-0 bg-[#8E8E8E]">
      <Canvas dpr={2} gl={{ preserveDrawingBuffer: true, antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, pose.distance]} fov={32} />
        <StudioLighting />
        <group rotation={[(pose.tilt * Math.PI) / 180, (pose.angle * Math.PI) / 180, 0]}>
          <Piece live={live} />
        </group>
      </Canvas>
    </div>
  )
}
