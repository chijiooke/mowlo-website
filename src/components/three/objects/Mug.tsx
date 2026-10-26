'use client'

import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshPhysicalMaterial } from 'three'
import { glazeTexture } from '@/lib/three/brandTexture'
import { MUG, mugGeometry } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

/** A stubby mug: nearly as wide as it is tall, like the reference flat-lays. */
export const STUBBY = 1.55

/**
 * A ceramic mug glazed one colour all over — inside, body and handle — with
 * "main character energy" printed small in white on the front.
 */
export function Mug({ live, colour, height = STUBBY }: { live: Live; colour: string; height?: number }) {
  const geometry = useMemo(() => mugGeometry(height), [height])

  const materials = useMemo(() => {
    // Satin glaze: a soft sheen, not a mirror.
    const glaze = { color: colour, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.25 }
    // The wrap's width over its height, so the type isn't stretched.
    const aspect = (2 * Math.PI * MUG.radius) / (height - 0.19)
    return {
      ceramic: new MeshPhysicalMaterial({ ...glaze, side: DoubleSide }),
      wrap: createPrintMaterial(glazeTexture(colour, false, aspect), glazeTexture(colour, true, aspect), live.print, 'glossy', {
        roughness: 0.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
    }
  }, [live.print, colour, height])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  return (
    <group position={[-0.15, -height / 2, 0]}>
      <mesh geometry={geometry.body} material={materials.ceramic} />
      <mesh geometry={geometry.wall} material={materials.wrap} />
      <mesh
        geometry={geometry.handle}
        material={materials.ceramic}
        position={[MUG.radius + 0.02, height * 0.51, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  )
}
