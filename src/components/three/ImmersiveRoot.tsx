'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { detectTier, type QualityTier } from '@/lib/three/quality'

const Stage = dynamic(() => import('./Stage'), { ssr: false })

const QualityContext = createContext<QualityTier>('poster')

/** The device's 3D tier. 'poster' until the client has decided. */
export const useQuality = () => useContext(QualityContext)

/**
 * Decides the 3D tier and mounts the page's one WebGL canvas beside the
 * content. Everything renders as posters first, so the server markup and the
 * first client render always match and the LCP is a plain image.
 */
export function ImmersiveRoot({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<QualityTier>('poster')

  useEffect(() => setTier(detectTier()), [])

  return (
    <QualityContext.Provider value={tier}>
      {children}
      {tier !== 'poster' && <Stage tier={tier} />}
    </QualityContext.Provider>
  )
}
