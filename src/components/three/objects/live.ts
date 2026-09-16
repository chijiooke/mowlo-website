import type { FinishBlend, PrintUniform } from '@/lib/three/printMaterial'

/**
 * A piece's state, written by its scene every frame and read by the piece.
 * Mutable on purpose: nothing here may go through React state.
 */
export interface Live {
  /** Progress through the piece's own window, 0 → 1. */
  t: number
  /** Its moment in the spotlight — a flip, a peel, an unfurl — 0 → 1. */
  flourish: number
  print: PrintUniform
  finish: FinishBlend
}

export const createLive = (): Live => ({
  t: 0,
  flourish: 0,
  print: { value: 0 },
  finish: { a: 'matte', b: 'glossy', t: 0 },
})
