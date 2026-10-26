'use client'

import { useEffect, useMemo } from 'react'
import { CanvasTexture, DoubleSide, MeshPhysicalMaterial } from 'three'
import { faceTexture } from '@/lib/three/brandTexture'
import { finishProps } from '@/lib/three/materials'
import { CAP, capGeometry } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

/** The cap's twill — matches the `cap` face's ground, so the print patch has no edge. */
const TWILL = '#5E43A3'

/**
 * The back opening's outline, as an alpha mask over its patch (u across, v up):
 * straight sides rising from the rim into a round top — an arch.
 */
function archMask() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#fff'
  const w = size * 0.92
  const left = (size - w) / 2
  const r = w / 2
  // Unflipped, the canvas's top row is the patch's v = 0 — the rim — so the
  // arch is drawn upside down: straight sides from the top, round end below.
  ctx.beginPath()
  ctx.moveTo(left, 0)
  ctx.lineTo(left, size - r)
  ctx.arc(size / 2, size - r, r, Math.PI, 0, true)
  ctx.lineTo(left + w, 0)
  ctx.closePath()
  ctx.fill()
  const texture = new CanvasTexture(canvas)
  texture.flipY = false
  return texture
}

/**
 * A purple five-panel camp cap with the mascot printed on its front panel,
 * after a flat-sketch tech pack: flat front, a strip over the crown, eyelets on
 * the side panels, a strap and slide buckle across the back, and a flat brim.
 */
export function Cap({ live }: { live: Live }) {
  const geometry = useMemo(() => capGeometry(), [])

  const { materials, mask } = useMemo(() => {
    // The same finish as the print patch, so the patch's edge doesn't show.
    const twill = { ...finishProps('soft_touch'), color: TWILL }
    const mask = archMask()
    return {
      mask,
      materials: {
        // Double-sided: the crown is open underneath and the brim's underside shows.
        cloth: new MeshPhysicalMaterial({ ...twill, side: DoubleSide }),
        seam: new MeshPhysicalMaterial({ ...twill, color: '#4A3488' }),
        // Where the head shows through: near-black, matte, cut to an arch.
        opening: new MeshPhysicalMaterial({ color: '#17112A', roughness: 1, alphaMap: mask, alphaTest: 0.5, side: DoubleSide }),
        strap: new MeshPhysicalMaterial({ ...twill, color: '#3F2C78' }),
        metal: new MeshPhysicalMaterial({ color: '#C9C6C0', metalness: 0.9, roughness: 0.3, clearcoat: 0.4 }),
        print: createPrintMaterial(faceTexture('cap', { printed: false }), faceTexture('cap', { printed: true }), live.print, 'soft_touch', {
          polygonOffset: true,
          polygonOffsetFactor: -1,
        }),
      },
    }
  }, [live.print])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(
    () => () => {
      Object.values(materials).forEach(m => m.dispose())
      mask.dispose()
    },
    [materials, mask],
  )

  // Centred on the whole cap, crown and brim together, and tipped forward a
  // touch so the front panel faces the camera.
  return (
    <group rotation={[0.22, 0, 0]} position={[0, -CAP.height / 2 + 0.05, -CAP.bill * 0.35]}>
      <mesh geometry={geometry.crown} material={materials.cloth} />
      <mesh geometry={geometry.patch} material={materials.print} />
      <mesh geometry={geometry.seams} material={materials.seam} />
      <mesh geometry={geometry.opening} material={materials.opening} />
      <mesh geometry={geometry.strap} material={materials.strap} />
      <mesh geometry={geometry.buckle} material={materials.metal} />
      <mesh geometry={geometry.eyelets} material={materials.metal} />
      <mesh geometry={geometry.bill} material={materials.cloth} />
    </group>
  )
}
