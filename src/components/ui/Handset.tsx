'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

/**
 * A photographed handset around the app screen. The frame image is transparent
 * where the glass is, so the screen sits underneath it and the metal edge
 * covers the join. Insets and corner radii are measured off the PNG: the glass
 * starts 6% in from each side and 2.5% down from the top, with corners about
 * 12% of its width.
 */
export function Handset({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'relative h-[529px] w-[254px] drop-shadow-[0_1px_2px_rgba(10,10,11,0.18)] drop-shadow-[0_12px_18px_rgba(10,10,11,0.12)] md:h-[595px] md:w-[286px]',
        className,
      )}
    >
      {/* A hair larger than the glass on every side, so no cream shows at the edge. */}
      <div className="absolute top-[2.3%] right-[5.8%] bottom-[2.5%] left-[5.9%] overflow-hidden rounded-[12.5%/5.6%] bg-ink">
        {children}
      </div>
      <Image src="/assets/phone-frame.png" alt="" fill sizes="(max-width: 767px) 320px, 450px" className="pointer-events-none select-none" />
    </div>
  )
}
