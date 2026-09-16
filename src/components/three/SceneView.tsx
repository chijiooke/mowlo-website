'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import clsx from 'clsx'
import { useQuality } from './ImmersiveRoot'

const ViewSlot = dynamic(() => import('./ViewSlot'), { ssr: false })

interface SceneViewProps {
  className?: string
  /** Still frame of the scene: shown first, and instead of it on poster tier. */
  poster?: string
  /** Empty for decorative scenes — the copy beside them carries the meaning. */
  posterAlt?: string
  /** Set on the hero, where the poster is the LCP element. */
  priority?: boolean
  sizes?: string
  children: React.ReactNode
}

/**
 * Where a section puts its 3D. Always renders the poster; on a capable device
 * the live scene draws over it and the poster fades out after the first frame.
 * A WebGL failure therefore looks exactly like the poster tier.
 */
export function SceneView({ className, poster, posterAlt = '', priority, sizes = '100vw', children }: SceneViewProps) {
  const tier = useQuality()
  const [ready, setReady] = useState(false)
  const live = tier !== 'poster'

  return (
    // The caller positions the box (absolute, sized by its insets, or relative
    // with a height). A default `relative` here would override an `absolute`
    // from the caller and collapse the box to nothing.
    <div className={className ?? 'relative'} aria-hidden={posterAlt ? undefined : true}>
      {poster && (
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority={priority}
          sizes={sizes}
          className={clsx(
            'object-contain transition-opacity duration-500 ease-out-expo',
            live && ready && 'opacity-0',
          )}
        />
      )}
      {live && (
        <ViewSlot className="absolute inset-0" onReady={() => setReady(true)}>
          {children}
        </ViewSlot>
      )}
    </div>
  )
}
