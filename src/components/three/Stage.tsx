'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { TIER_DPR, type QualityTier } from '@/lib/three/quality'

/**
 * Wipes the canvas at the top of every frame.
 *
 * Nothing in three.js erases this canvas: a drei <View> renders its region with
 * autoClear off, and only clears a region on the way *in*, never on the way
 * out. What actually erases it is the browser, which drops the drawing buffer
 * once it has composited a frame — and it only composites a frame in which
 * something was drawn. So a frame where every view has nothing to draw (a
 * product between beats, the parade after the last one has flown out) issues no
 * GL call at all, nothing is composited, and the last frame that *did* draw
 * stays on screen: a product frozen over whatever scrolls under the fixed
 * canvas. Clearing here makes every frame start from nothing, and makes every
 * frame a frame the browser composites.
 *
 * Priority 0 runs before the views, which subscribe at 1, and leaves r3f's
 * manual-render flag to them.
 */
function ClearFrame() {
  const gl = useThree(state => state.gl)

  useFrame(() => {
    // A render target left bound by a view would swallow the clear.
    gl.setRenderTarget(null)
    gl.setScissorTest(false)
    gl.clear(true, true)
  }, 0)

  return null
}

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
      <ClearFrame />
      <View.Port />
    </Canvas>
  )
}
