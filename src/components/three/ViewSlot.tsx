'use client'

import { useEffect, useRef } from 'react'
import { View } from '@react-three/drei'
import { invalidate, useFrame } from '@react-three/fiber'

/** Reports the first frame this view actually drew. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    // After the frame is on screen, not before — or the poster fades early.
    requestAnimationFrame(onReady)
  })
  return null
}

/**
 * The DOM box a scene is drawn into. Loaded lazily by SceneView, so three.js
 * stays out of the first bundle.
 */
export default function ViewSlot({
  className,
  onReady,
  children,
}: {
  className?: string
  onReady: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  // The canvas renders on demand; keep frames coming only while this box is on
  // screen. Off screen, nothing asks and the GPU idles.
  //
  // Stopping the loop is what leaves a frame on screen, so every stop — going
  // off screen, and unmounting — asks for one more frame after it. Stage clears
  // the canvas at the top of every frame, so that last frame is what wipes what
  // this view was drawing and redraws the views still on screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const loop = () => {
      invalidate()
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      invalidate()
      if (entry.isIntersecting) loop()
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      invalidate()
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      <View className="absolute inset-0">
        <FirstFrame onReady={onReady} />
        {children}
      </View>
    </div>
  )
}
