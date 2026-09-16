'use client'

import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshPhysicalMaterial } from 'three'
import { faceTexture } from '@/lib/three/brandTexture'
import { MUG, mugGeometry } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

/** A glossy ceramic mug with a full-wrap print. Its turn in the spotlight shows the wrap. */
export function Mug({ live }: { live: Live }) {
  const geometry = useMemo(() => mugGeometry(), [])

  const materials = useMemo(
    () => ({
      ceramic: new MeshPhysicalMaterial({ color: '#F6F4F0', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, side: DoubleSide }),
      wrap: createPrintMaterial(faceTexture('mug', { printed: false }), faceTexture('mug', { printed: true }), live.print, 'glossy'),
    }),
    [live.print],
  )

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  return (
    <group position={[-0.15, -MUG.height / 2, 0]}>
      <mesh geometry={geometry.body} material={materials.ceramic} />
      <mesh geometry={geometry.wall} material={materials.wrap} />
      <mesh
        geometry={geometry.handle}
        material={materials.ceramic}
        position={[MUG.radius + 0.02, MUG.height * 0.51, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  )
}
