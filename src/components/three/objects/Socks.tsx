'use client'

import { useEffect, useMemo } from 'react'
import { Color, DoubleSide, Vector2 } from 'three'
import { faceTexture } from '@/lib/three/brandTexture'
import { knitNormalMap } from '@/lib/three/fabric'
import { sockGeometry } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

/**
 * A pair of crew socks printed down the leg: one in front, its partner behind
 * and a little up and back, the way a pair is shown flat.
 */
export function Socks({ live }: { live: Live }) {
  const geometry = useMemo(() => sockGeometry(), [])

  const { material, knit } = useMemo(() => {
    // The tee's jersey knit (each tile is 32 stitch columns by 40 rows),
    // turned so the columns run down the leg the way a sock is knitted, and
    // tiled a few times along it and round it. A clone, so none of this
    // changes the tee's shared texture.
    const knit = knitNormalMap().clone()
    knit.center.set(0.5, 0.5)
    knit.rotation = Math.PI / 2
    knit.repeat.set(2.5, 6)
    knit.needsUpdate = true
    // Double-sided so the open cuff shows its inside rather than nothing.
    const material = createPrintMaterial(faceTexture('sock', { printed: false }), faceTexture('sock', { printed: true }), live.print, 'soft_touch', {
      side: DoubleSide,
      normalMap: knit,
      normalScale: new Vector2(0.75, 0.75),
    })
    // Cotton, not card: no gloss at all, and the soft sheen the tee's cloth has.
    Object.assign(material, { roughness: 1, clearcoat: 0, envMapIntensity: 0.7, sheen: 0.9, sheenRoughness: 0.6 })
    material.sheenColor = new Color('#FFFFFF')
    return { material, knit }
  }, [live.print])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(
    () => () => {
      material.dispose()
      knit.dispose()
    },
    [material, knit],
  )

  return (
    <group scale={0.82}>
      <mesh geometry={geometry} material={material} position={[0.42, 0.22, -0.32]} rotation={[0, 0, -0.08]} />
      <mesh geometry={geometry} material={material} position={[-0.12, -0.1, 0.12]} rotation={[0, 0, 0.04]} />
    </group>
  )
}
