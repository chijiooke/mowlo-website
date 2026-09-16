'use client'

import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { TIER_DPR, type QualityTier } from '@/lib/three/quality'

/**
 * The page's only WebGL canvas. Fixed over the viewport and click-through;
 * every section's scene is drawn into it through a drei <View>.
 *
 * Layering: the canvas sits at z-5. Chapter grounds and patterns paint below
 * it; copy that must sit in front of a 3D object needs `relative z-10`.
 *
 * The frame loop is on demand — a SceneView that is on screen keeps asking for
 * frames, so a page scrolled past all its 3D costs nothing.
 */
export default function Stage({ tier }: { tier: Exclude<QualityTier, 'poster'> }) {
  return (
    <Canvas
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none' }}
      eventSource={document.body}
      eventPrefix="client"
      dpr={[1, TIER_DPR[tier]]}
      frameloop="demand"
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
    >
      <View.Port />
    </Canvas>
  )
}
