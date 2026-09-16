'use client'

import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshStandardMaterial, PlaneGeometry } from 'three'
import { faceTexture, paperBump } from '@/lib/three/brandTexture'
import { bagHandle, gussetGeometry } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

const W = 1.7
const H = 2.1
const D = 0.8
/** How far each side gusset folds in. */
const FOLD = 0.2

/**
 * A kraft paper shopping bag: printed front and back panels, side gussets
 * folded to a V, a darker lining and twisted-paper rope handles.
 */
export function PaperBag({ live }: { live: Live }) {
  const geometry = useMemo(
    () => ({
      panel: new PlaneGeometry(W, H),
      gusset: gussetGeometry(H, D, FOLD),
      bottom: new PlaneGeometry(W, D),
      frontHandle: bagHandle(H, D / 2 - 0.03),
      backHandle: bagHandle(H, -D / 2 + 0.03),
    }),
    [],
  )

  const materials = useMemo(() => {
    const relief = { bumpMap: paperBump(), bumpScale: 1.2 }
    return {
      print: createPrintMaterial(faceTexture('bag', { printed: false }), faceTexture('bag', { printed: true }), live.print, 'matte', relief),
      kraft: new MeshStandardMaterial({ color: '#C49A6C', roughness: 0.93, side: DoubleSide, ...relief }),
      lining: new MeshStandardMaterial({ color: '#A07A52', roughness: 1, side: DoubleSide }),
      rope: new MeshStandardMaterial({ color: '#8E6A45', roughness: 0.85 }),
    }
  }, [live.print])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  return (
    <group position={[0, -0.25, 0]}>
      <mesh geometry={geometry.panel} material={materials.print} position={[0, 0, D / 2]} />
      <mesh geometry={geometry.panel} material={materials.print} position={[0, 0, -D / 2]} rotation={[0, Math.PI, 0]} />
      {/* Lining: the inside of each panel, seen when the bag turns. */}
      <mesh geometry={geometry.panel} material={materials.lining} position={[0, 0, D / 2 - 0.004]} rotation={[0, Math.PI, 0]} />
      <mesh geometry={geometry.panel} material={materials.lining} position={[0, 0, -D / 2 + 0.004]} />
      <mesh geometry={geometry.gusset} material={materials.kraft} position={[W / 2, 0, 0]} />
      <mesh geometry={geometry.gusset} material={materials.kraft} position={[-W / 2, 0, 0]} rotation={[0, Math.PI, 0]} />
      <mesh geometry={geometry.bottom} material={materials.kraft} position={[0, -H / 2, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={geometry.frontHandle} material={materials.rope} />
      <mesh geometry={geometry.backHandle} material={materials.rope} />
    </group>
  )
}
