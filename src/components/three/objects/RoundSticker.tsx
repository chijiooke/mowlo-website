'use client'

import { useEffect, useMemo } from 'react'
import { MeshPhysicalMaterial, RingGeometry } from 'three'
import { faceTexture, type BadgeGround } from '@/lib/three/brandTexture'
import { foldEdge } from '@/lib/three/geometry'
import { createPrintMaterial } from '@/lib/three/printMaterial'
import type { Live } from './live'

const RADIUS = 0.5
/** The white vinyl that shows round the print. */
const BORDER = 0.58
/**
 * Where the curl starts, as a share of the border radius — the same chord for
 * every layer, so they bend together. Starting it near the rim leaves too short
 * a reach to lift anything: the edge moved by a few pixels on screen and the
 * sticker still read as flat.
 */
const FOLD_FROM = 0.68

interface RoundStickerProps {
  live: Live
  /** Radians the leading edge curls up. Omit for a flat sticker. */
  fold?: number
  /** The printed ground. Default pink, as on the sticker sheet. */
  ground?: BadgeGround
}

/**
 * A single round sticker, cut clean: glossy print on a die-cut disc standing
 * proud of its white vinyl border. The sticker sheet carries the same badge —
 * this is one on its own, for stickers that fly rather than sit on a backing.
 *
 * Built from rings rather than an extruded outline: an extruded disc has no
 * vertices between its centre and its rim, so a curled edge would crease into
 * flat facets instead of bending.
 */
export function RoundSticker({ live, fold = 0, ground = 'pink' }: RoundStickerProps) {
  const geometry = useMemo(() => {
    const print = new RingGeometry(0, RADIUS, 64, 10)
    print.translate(0, 0, 0.009)
    const backing = new RingGeometry(0, RADIUS, 64, 10)
    // Turned to face the other way first, so the curl below lifts the same
    // edge on both faces.
    backing.rotateY(Math.PI)
    backing.translate(0, 0, -0.009)
    const border = new RingGeometry(0, BORDER, 64, 10)
    border.translate(0, 0, -0.014)
    for (const g of [print, backing, border]) foldEdge(g, BORDER, FOLD_FROM, fold)
    return { print, backing, border }
  }, [fold])

  const materials = useMemo(() => {
    const vinyl = new MeshPhysicalMaterial({ color: '#FBFBF9', roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2 })
    // The blank stays white: an unprinted sticker is bare vinyl whatever the ink.
    const print = createPrintMaterial(faceTexture('badge', { printed: false }), faceTexture('badge', { printed: true, ground }), live.print, 'glossy')
    return { vinyl, print }
  }, [live.print, ground])

  useEffect(() => () => Object.values(geometry).forEach(g => g.dispose()), [geometry])
  useEffect(() => () => Object.values(materials).forEach(m => m.dispose()), [materials])

  return (
    <group>
      <mesh geometry={geometry.border} material={materials.vinyl} />
      <mesh geometry={geometry.backing} material={materials.vinyl} />
      <mesh geometry={geometry.print} material={materials.print} />
    </group>
  )
}
