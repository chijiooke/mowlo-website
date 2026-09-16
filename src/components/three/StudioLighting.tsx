'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * The lighting every product scene shares: a soft studio built from
 * lightformers (no HDR download), baked once into the environment, plus a warm
 * key and a cool fill. The amber ring is the brand in the reflections — it is
 * what makes a glossy or holographic finish read as Mowlo's.
 *
 * Finishes only show when light moves across them, so scenes should turn the
 * object with scroll rather than hold it still.
 */
export function StudioLighting({ resolution = 256 }: { resolution?: number }) {
  return (
    <>
      <Environment resolution={resolution} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#FFF6E8" position={[0, 5, 6]} scale={[12, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.1} color="#6688CC" position={[-7, 1, 2]} scale={[4, 9, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2} color="#F5A623" position={[6, 2, -1]} scale={3.5} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.6} color="#FFFFFF" position={[0, -5, 3]} scale={[12, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <directionalLight position={[2, 4, 8]} intensity={2.2} color="#FFF6E8" />
      <directionalLight position={[-4, 2, 3]} intensity={0.6} color="#6688CC" />
      {/* Rims from behind: they catch edges and bevels, which is where
          thickness shows — without them, stock reads as flat cut-outs. */}
      <directionalLight position={[-3, 3, -6]} intensity={2.4} color="#FFE2B0" />
      <directionalLight position={[4, -2, -4]} intensity={1.2} color="#9FB8FF" />
    </>
  )
}
