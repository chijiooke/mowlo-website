'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Quaternion, Vector3, type Group, type Mesh } from 'three'
import { faceTexture } from '@/lib/three/brandTexture'
import { createGarmentMaterial } from '@/lib/three/fabric'
import type { Live } from './live'

/** Built by scripts/tee/build-tee.mjs. Re-run it after changing the shape. */
export const TEE_MODEL = '/models/tee.glb'

/** Off-white cotton. Pure white clips under the studio lights. */
const COTTON = '#EDEBE6'

interface TeeProps {
  live: Live
  /** Dev bench only: a fixed wind instead of the tee's own motion. */
  wind?: [number, number, number]
}

/**
 * A boxy cotton tee with a small Mowlo chest mark. The cloth responds to how
 * the tee moves: as it flies in, the hem and sleeves trail behind and ripple;
 * held still, they settle.
 */
export function Tee({ live, wind }: TeeProps) {
  const root = useRef<Group>(null)
  const { nodes } = useGLTF(TEE_MODEL, false, false) as unknown as { nodes: { tee: Mesh } }

  const { material, uniforms } = useMemo(
    () => createGarmentMaterial({ colour: COTTON, logo: faceTexture('tee', { printed: true }), print: live.print }),
    [live.print],
  )
  useEffect(() => () => material.dispose(), [material])

  const motion = useMemo(
    () => ({ last: new Vector3(), now: new Vector3(), delta: new Vector3(), velocity: new Vector3(), q: new Quaternion(), s: new Vector3(), primed: false }),
    [],
  )

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime
    if (wind) {
      uniforms.uWind.value.set(...wind)
      return
    }
    const group = root.current
    if (!group || dt <= 0) return

    group.getWorldPosition(motion.now)
    if (!motion.primed) {
      motion.last.copy(motion.now)
      motion.primed = true
    }
    motion.delta.copy(motion.now).sub(motion.last).divideScalar(dt)
    motion.last.copy(motion.now)
    motion.velocity.lerp(motion.delta, 1 - Math.exp(-dt * 6))

    // Into the tee's own space: the cloth trails opposite the way it's moving.
    group.getWorldQuaternion(motion.q)
    group.getWorldScale(motion.s)
    uniforms.uWind.value
      .copy(motion.velocity)
      .applyQuaternion(motion.q.invert())
      .divideScalar(Math.max(motion.s.x, 0.001))
      .multiplyScalar(-0.025)
      .clampLength(0, 0.35)

    const target = 0.012 + Math.min(motion.velocity.length() * 0.004, 0.035)
    uniforms.uFlutter.value += (target - uniforms.uFlutter.value) * (1 - Math.exp(-dt * 4))
  })

  return (
    <group ref={root}>
      <mesh geometry={nodes.tee.geometry} material={material} />
    </group>
  )
}

useGLTF.preload(TEE_MODEL, false, false)
