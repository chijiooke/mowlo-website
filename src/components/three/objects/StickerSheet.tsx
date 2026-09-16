'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { CircleGeometry, MeshPhysicalMaterial, type Group } from 'three'
import { faceTexture } from '@/lib/three/brandTexture'
import { circleShape, mascotGeometry, printedExtrude, roundedRectShape } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

/**
 * A kiss-cut sticker sheet: a die-cut mascot and a round badge standing proud
 * of the backing, each with its white vinyl border. In its spotlight the
 * mascot peels off the sheet on a hinge along its left edge.
 *
 * Sticker positions are mirrored by the kiss-cut guides in the sheet texture.
 */
export function StickerSheet({ live }: { live: Live }) {
  const peel = useRef<Group>(null)

  const geometry = useMemo(
    () => ({
      sheet: printedExtrude(roundedRectShape(2.6, 3.2, 0.14), { depth: 0.02, bevel: 0.006 }),
      mascot: mascotGeometry(1.7, 0.02, 0.006),
      mascotBorder: mascotGeometry(1.87, 0.012, 0.004),
      badge: printedExtrude(circleShape(0.5), { depth: 0.018, bevel: 0.005, curveSegments: 48 }),
      badgeBorder: new CircleGeometry(0.56, 64),
    }),
    [],
  )

  const materials = useMemo(() => {
    const vinyl = new MeshPhysicalMaterial({ color: '#FBFBF9', roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2 })
    const print = (face: 'sheet' | 'mascot' | 'badge', finish: 'soft_touch' | 'glossy') =>
      createPrintMaterial(faceTexture(face, { printed: false }), faceTexture(face, { printed: true }), live.print, finish)
    return {
      vinyl,
      sheet: [vinyl, print('sheet', 'soft_touch'), vinyl],
      mascot: [vinyl, print('mascot', 'glossy'), vinyl],
      badge: [vinyl, print('badge', 'glossy'), vinyl],
    }
  }, [live.print])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(
    () => () => new Set([materials.vinyl, ...materials.sheet, ...materials.mascot, ...materials.badge]).forEach(m => m.dispose()),
    [materials],
  )

  useFrame((_, dt) => {
    if (!peel.current) return
    easing.damp(peel.current.rotation, 'y', -1.05 * live.flourish, 0.12, dt)
    easing.damp(peel.current.position, 'z', 0.03 + 0.25 * live.flourish, 0.12, dt)
  })

  return (
    <group>
      <mesh geometry={geometry.sheet} material={materials.sheet} />

      {/* Hinged on the mascot's left edge, so the peel lifts from the right. */}
      <group ref={peel} position={[-0.85, 0.45, 0.03]}>
        <group position={[0.85, 0, 0]}>
          <mesh geometry={geometry.mascotBorder} material={materials.vinyl} position={[0, 0, -0.008]} />
          <mesh geometry={geometry.mascot} material={materials.mascot} position={[0, 0, 0.004]} />
        </group>
      </group>

      <group position={[-0.62, -0.95, 0.028]}>
        <mesh geometry={geometry.badgeBorder} material={materials.vinyl} position={[0, 0, -0.006]} />
        <mesh geometry={geometry.badge} material={materials.badge} position={[0, 0, 0.006]} />
      </group>
    </group>
  )
}
