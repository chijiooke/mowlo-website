/**
 * How much 3D this device gets. Decided once, on the client.
 *
 * Not drei's useDetectGPU: it fetches benchmark tables from a third-party CDN
 * at runtime, which is a network dependency on first paint and a request we
 * would rather not send from every visitor.
 */
export type QualityTier = 'high' | 'mid' | 'poster'

export const TIER_DPR: Record<QualityTier, number> = { high: 2, mid: 1.5, poster: 1 }

export function detectTier(): QualityTier {
  if (typeof window === 'undefined') return 'poster'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'poster'

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }
  if (nav.connection?.saveData) return 'poster'

  // three.js needs WebGL2. Probe, then release the context straight away.
  const gl = document.createElement('canvas').getContext('webgl2')
  if (!gl) return 'poster'
  gl.getExtension('WEBGL_lose_context')?.loseContext()

  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  if (cores <= 2 || memory <= 2) return 'poster'

  const wide = window.matchMedia('(min-width: 1024px)').matches
  return wide && cores >= 4 && memory >= 4 ? 'high' : 'mid'
}
