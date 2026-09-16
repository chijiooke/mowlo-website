import type { MeshPhysicalMaterialParameters } from 'three'

/**
 * Print finishes as physical materials — ported from `materialPresets` in
 * mowlo-web-app/src/tokens/index.ts so a "holographic" card on the site looks
 * like the one in the product. Change them there first, then here.
 *
 * Two deliberate differences: no normal-map strength (the site has no emboss
 * pass) and no transmission on holographic — 2% transmission costs a whole
 * extra render of the scene for a difference nobody can see at page scale.
 */
export type Finish = 'matte' | 'glossy' | 'soft_touch' | 'metallic' | 'holographic' | 'ink'

interface FinishPreset extends MeshPhysicalMaterialParameters {
  label: string
}

export const FINISHES: Record<Finish, FinishPreset> = {
  matte: {
    label: 'Matte',
    roughness: 0.94, metalness: 0.02, envMapIntensity: 0.45,
    clearcoat: 0, clearcoatRoughness: 0, sheen: 0,
  },
  glossy: {
    label: 'Glossy',
    roughness: 0.12, metalness: 0.04, envMapIntensity: 1.15,
    clearcoat: 1, clearcoatRoughness: 0.04, sheen: 0,
  },
  soft_touch: {
    label: 'Soft touch',
    roughness: 0.96, metalness: 0.01, envMapIntensity: 0.35,
    clearcoat: 0.08, clearcoatRoughness: 0.9, sheen: 0.45, sheenRoughness: 0.85,
  },
  metallic: {
    label: 'Metallic',
    roughness: 0.24, metalness: 0.92, envMapIntensity: 1.8,
    clearcoat: 0.65, clearcoatRoughness: 0.12, sheen: 0,
  },
  holographic: {
    label: 'Holographic',
    roughness: 0.18, metalness: 0.72, envMapIntensity: 2.4,
    clearcoat: 1, clearcoatRoughness: 0.02, sheen: 0,
    iridescence: 1, iridescenceIOR: 1.3, iridescenceThicknessRange: [100, 800],
  },
  /** Site only, not an app finish: print ink on fabric — no sheen, a faint gloss. */
  ink: {
    label: 'Ink',
    roughness: 0.62, metalness: 0, envMapIntensity: 0.6,
    clearcoat: 0.12, clearcoatRoughness: 0.55, sheen: 0,
  },
}

export const FINISH_ORDER: Finish[] = ['matte', 'glossy', 'soft_touch', 'metallic', 'holographic']

/**
 * Material parameters for a finish. Every key is always set, so switching
 * finish on a live material never leaves the previous one's iridescence or
 * sheen behind.
 */
export function finishProps(finish: Finish): MeshPhysicalMaterialParameters {
  const { label: _label, ...p } = FINISHES[finish]
  return {
    sheenRoughness: 1,
    iridescence: 0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    ...p,
  }
}

/** Unprinted paper core — the edges of every card, flyer and sticker. */
export const PAPER_EDGE = { color: '#EDE9E2', roughness: 0.95, metalness: 0 } as const
