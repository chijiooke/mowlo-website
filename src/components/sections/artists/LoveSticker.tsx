import { useId } from 'react'
import clsx from 'clsx'
import { MOWLO_BODY_PATH } from '@/components/MowloLogo'

/**
 * The neon sticker's stock, from STICKER_INK in lib/three/brandTexture —
 * copied, not imported, so this page doesn't pull three.js in with it.
 */
const STOCK = { ground: '#A6D93A', back: '#CBE98A' }

/** The disc: centre and radius in the 200-unit box, and how far in the fold sits. */
const C = 100
const R = 96
const FOLD = 64

/**
 * The drops page's neon sticker, flat: lime disc, type round the rim, the
 * mascot drawn in ink, and the top-right corner peeling back off the page.
 *
 * The peel works in a frame turned 45°, where the corner is straight up: the
 * disc is clipped below the fold line, and the flap is the cut-off cap
 * mirrored across that line, in the paper's paler backing. The contents turn
 * back −45° inside it, so the type and the face sit upright.
 */
export function LoveSticker({ text = 'WITH LOVE · MOWLO · WITH LOVE · MOWLO · ', className }: { text?: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const fold = C - FOLD
  // The cap above the fold, mirrored below it: a circle with its centre reflected across y = fold.
  const mirrored = 2 * fold - C
  const ring = 74

  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={clsx('overflow-visible', className)}>
      <defs>
        <clipPath id={`${id}-below`}>
          <rect x="-50" y={fold} width="300" height="300" />
        </clipPath>
        <clipPath id={`${id}-flap`}>
          <circle cx={C} cy={C} r={R} />
        </clipPath>
        <path id={`${id}-ring`} d={`M ${C} ${C - ring} a ${ring} ${ring} 0 1 1 -0.01 0`} />
        <linearGradient id={`${id}-curl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-lift`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0A0A0B" floodOpacity="0.35" />
        </filter>
      </defs>

      <g transform={`rotate(45 ${C} ${C})`}>
        {/* The sticker, cut at the fold. */}
        <g clipPath={`url(#${id}-below)`}>
          <g transform={`rotate(-45 ${C} ${C})`}>
            <circle cx={C} cy={C} r={R} fill={STOCK.ground} />
            <text className="fill-ink font-display text-[17px] font-extrabold tracking-[1px]">
              <textPath href={`#${id}-ring`} textLength={2 * Math.PI * ring - 4} lengthAdjust="spacing">
                {text}
              </textPath>
            </text>
            {/* The mascot as an ink drawing: outline, eyes, smile. */}
            <g transform={`translate(${C - 38} ${C - 36}) scale(0.95)`} fill="none" strokeLinecap="round" className="stroke-ink">
              <path d={MOWLO_BODY_PATH} strokeWidth="5" />
              <ellipse cx="26" cy="34" rx="4.6" ry="6.4" stroke="none" className="fill-ink" />
              <ellipse cx="52" cy="34" rx="4.6" ry="6.4" stroke="none" className="fill-ink" />
              <path d="M23 51 Q39 66 55 50" strokeWidth="5" />
            </g>
          </g>
        </g>

        {/* The flap: the cut-off cap, folded back over the face of the sticker. */}
        <g filter={`url(#${id}-lift)`}>
          <g clipPath={`url(#${id}-below)`}>
            <circle cx={C} cy={mirrored} r={R} fill={STOCK.back} clipPath={`url(#${id}-flap)`} />
            <circle cx={C} cy={mirrored} r={R} fill={`url(#${id}-curl)`} clipPath={`url(#${id}-flap)`} />
          </g>
        </g>
      </g>
    </svg>
  )
}
