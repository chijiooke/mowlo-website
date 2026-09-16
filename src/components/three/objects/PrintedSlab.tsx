'use client'

import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three'
import { faceTexture, paperBump, type Face } from '@/lib/three/brandTexture'
import { printedExtrude, roundedRectShape } from '@/lib/three/geometry'
import type { Finish } from '@/lib/three/materials'
import { blendFinish, createPrintMaterial, type FinishBlend, type PrintUniform } from '@/lib/three/printMaterial'

interface PrintedSlabProps {
  width: number
  height: number
  depth?: number
  radius?: number
  /** Rounds the edges — without it, thick stock looks machined. */
  bevel?: number
  front: Face
  /** Omit for stock printed on one side only: the back stays blank. */
  back?: Face
  /** Edge colour. Painted edges are what make thick stock read as premium. */
  edge?: string
  print: PrintUniform
  /** A fixed finish, or a blend the scene mutates over time. */
  finish?: Finish | FinishBlend
  textureScale?: 1 | 2
}

/** Flat printed stock with real thickness: a business card, a sticker sheet. */
export function PrintedSlab({
  width,
  height,
  depth = 0.03,
  radius = 0.06,
  bevel = 0,
  front,
  back,
  edge = '#EDE9E2',
  print,
  finish = 'matte',
  textureScale = 1,
}: PrintedSlabProps) {
  const anisotropy = useThree(s => s.gl.capabilities.getMaxAnisotropy())
  const geometry = useMemo(
    () => printedExtrude(roundedRectShape(width, height, radius), { depth, bevel }),
    [width, height, depth, radius, bevel],
  )
  const startFinish = typeof finish === 'string' ? finish : finish.a

  const materials = useMemo(() => {
    const texture = (face: Face, printed: boolean) => {
      const t = faceTexture(face, { printed, scale: textureScale })
      t.anisotropy = anisotropy
      return t
    }
    const relief = { bumpMap: paperBump(), bumpScale: 0.6 }
    const frontMat = createPrintMaterial(texture(front, false), texture(front, true), print, startFinish, relief)
    const backMat = back
      ? createPrintMaterial(texture(back, false), texture(back, true), print, startFinish, relief)
      : new MeshStandardMaterial({ map: texture(front, false), roughness: 0.95 })
    return [backMat, frontMat, new MeshStandardMaterial({ color: edge, roughness: 0.75 })]
  }, [anisotropy, back, edge, front, print, startFinish, textureScale])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => materials.forEach(m => m.dispose()), [materials])

  useFrame(() => {
    if (typeof finish === 'string') return
    for (const m of materials.slice(0, 2)) {
      if (m instanceof MeshPhysicalMaterial) blendFinish(m, finish.a, finish.b, finish.t)
    }
  })

  return <mesh geometry={geometry} material={materials} />
}
