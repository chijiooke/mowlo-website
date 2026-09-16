/**
 * Brand colourways, for scenes that let the visitor recolour a piece (the
 * "Make it yours" chapter). The hero prints Mowlo's own identity instead —
 * no invented customer brands anywhere on the site.
 */

export interface Colourway {
  id: 'amber' | 'teal' | 'pink' | 'purple' | 'sky' | 'lime'
  label: string
  /** The printed colour. */
  base: string
  /** Text and marks that sit on `base`. */
  onBase: string
  /** The colour a notch deeper, for marks on paper. */
  deep: string
}

export const COLOURWAYS: Colourway[] = [
  { id: 'amber', label: 'Amber', base: '#F5A623', onBase: '#0A0A0B', deep: '#B26A00' },
  { id: 'teal', label: 'Teal', base: '#1FB89E', onBase: '#0A0A0B', deep: '#0E7A68' },
  { id: 'pink', label: 'Pink', base: '#E8527A', onBase: '#0A0A0B', deep: '#C2264F' },
  { id: 'purple', label: 'Purple', base: '#7C5CBF', onBase: '#FFFFFF', deep: '#6845AE' },
  { id: 'sky', label: 'Sky', base: '#2A9FD6', onBase: '#0A0A0B', deep: '#1A6E98' },
  { id: 'lime', label: 'Lime', base: '#8DB82B', onBase: '#0A0A0B', deep: '#5E7D1A' },
]
