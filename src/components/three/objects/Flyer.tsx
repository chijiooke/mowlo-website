'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, MeshStandardMaterial, PlaneGeometry } from 'three'
import { faceTexture, paperBump } from '@/lib/three/brandTexture'
import { curlSheet } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

const WIDTH = 2.12
const HEIGHT = 3.02
const SEG_X = 20
const SEG_Y = 28

/**
 * An A5 flyer that arrives curled — a soft arc and a lifted corner — and lies
 * flat in its spotlight. Front is printed; the back is plain paper.
 */
export function Flyer({ live }: { live: Live }) {
  const geometry = useMemo(() => new PlaneGeometry(WIDTH, HEIGHT, SEG_X, SEG_Y), [])
  const lastCurl = useRef(-1)

  const materials = useMemo(
    () => ({
      front: createPrintMaterial(faceTexture('flyer', { printed: false }), faceTexture('flyer', { printed: true }), live.print, 'matte', {
        bumpMap: paperBump(),
        bumpScale: 0.8,
      }),
      back: new MeshStandardMaterial({ color: '#F2EFE9', roughness: 0.95, side: BackSide }),
    }),
    [live.print],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  useFrame(() => {
    const curl = 1 - 0.85 * live.flourish
    if (Math.abs(curl - lastCurl.current) < 0.002) return
    lastCurl.current = curl
    curlSheet(geometry, WIDTH, HEIGHT, SEG_X, SEG_Y, curl)
  })

  return (
    <group>
      <mesh geometry={geometry} material={materials.front} />
      <mesh geometry={geometry} material={materials.back} />
    </group>
  )
}
