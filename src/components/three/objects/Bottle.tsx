'use client'

import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshPhysicalMaterial } from 'three'
import { faceTexture } from '@/lib/three/brandTexture'
import { BOTTLE, bottleGeometry } from '@/lib/three/geometry'
import { finishProps } from '@/lib/three/materials'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

/** The cap: the brand purple, in a soft-touch plastic. */
const CAP = '#7C5CBF'

/**
 * An insulated water bottle in Mowlo pink with a full-wrap print, a steel
 * collar and a purple screw cap with a carry loop. Matte powder coat, like the
 * reference flat-lays: the light rolls round it rather than glinting.
 */
export function Bottle({ live }: { live: Live }) {
  const geometry = useMemo(() => bottleGeometry(), [])

  const materials = useMemo(() => {
    const coat = { ...finishProps('soft_touch'), sheen: 0.2, sheenRoughness: 0.6 }
    return {
      // The foot and shoulder, unprinted, in the wrap's own ground colour.
      body: new MeshPhysicalMaterial({ ...coat, color: '#E0466F', side: DoubleSide }),
      print: createPrintMaterial(faceTexture('bottle', { printed: false }), faceTexture('bottle', { printed: true }), live.print, 'soft_touch', {
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
      // Brushed steel: rough enough to pick up the studio light rather than mirror the dark.
      steel: new MeshPhysicalMaterial({ color: '#E4E1DC', metalness: 0.75, roughness: 0.42, side: DoubleSide }),
      cap: new MeshPhysicalMaterial({ ...finishProps('soft_touch'), color: CAP }),
    }
  }, [live.print])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  // Centred on its own height, so it turns about its middle.
  const height = BOTTLE.shoulder + BOTTLE.collar + BOTTLE.cap
  return (
    <group position={[0, -height / 2, 0]}>
      <mesh geometry={geometry.body} material={materials.body} />
      <mesh geometry={geometry.print} material={materials.print} />
      <mesh geometry={geometry.ring} material={materials.steel} />
      <mesh geometry={geometry.cap} material={materials.cap} />
      <mesh geometry={geometry.loop} material={materials.cap} />
    </group>
  )
}
