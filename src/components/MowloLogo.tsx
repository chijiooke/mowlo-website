/**
 * The Mowlo mark — the friendly amber blob.
 *
 * Redrawn 2026-07-24 from the supplied artwork as clean vector geometry (the
 * source file was a screenshot trace: 390 paths and baked-in anti-aliasing).
 * Body stays amber in every context — it never takes a tenant's brand accent.
 *
 * Kept identical with mowlo-website/src/components/MowloLogo.tsx.
 */
export const MOWLO_BODY_PATH =
  'M78.10 40.00C78.36 42.86 78.59 45.82 78.31 48.74C78.02 51.66 77.52 54.79 76.39 57.53' +
  'C75.26 60.26 73.55 62.98 71.54 65.15C69.53 67.31 66.90 69.12 64.33 70.51' +
  'C61.77 71.91 58.88 72.83 56.15 73.54C53.42 74.24 50.62 74.54 47.93 74.76' +
  'C45.24 74.97 42.61 74.93 40.00 74.80C37.39 74.67 34.82 74.42 32.24 73.98' +
  'C29.66 73.54 27.07 73.00 24.51 72.16C21.96 71.32 19.34 70.31 16.92 68.94' +
  'C14.51 67.56 12.04 65.91 10.01 63.92C7.98 61.93 6.08 59.52 4.74 56.98' +
  'C3.39 54.44 2.45 51.52 1.95 48.68C1.45 45.85 1.45 42.83 1.74 40.00' +
  'C2.03 37.17 2.75 34.33 3.69 31.71C4.62 29.09 5.90 26.57 7.34 24.27' +
  'C8.79 21.98 10.51 19.84 12.36 17.96C14.20 16.07 16.29 14.39 18.43 12.95' +
  'C20.58 11.52 22.89 10.33 25.23 9.32C27.56 8.32 29.99 7.53 32.45 6.91' +
  'C34.91 6.29 37.42 5.85 40.00 5.59C42.58 5.33 45.23 5.19 47.90 5.37' +
  'C50.58 5.54 53.41 5.85 56.07 6.64C58.72 7.43 61.48 8.57 63.82 10.13' +
  'C66.16 11.68 68.36 13.76 70.11 15.99C71.86 18.21 73.21 20.87 74.31 23.48' +
  'C75.42 26.08 76.12 28.86 76.75 31.61C77.38 34.37 77.84 37.14 78.10 40.00Z'

export function MowloLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={MOWLO_BODY_PATH} fill="#F5A623" />
      <circle cx="25.92" cy="35.86" r="11.63" fill="#FFFFFF" />
      <circle cx="52.07" cy="35.86" r="11.63" fill="#FFFFFF" />
      <circle cx="26.09" cy="36.05" r="6.18" fill="#0E0E0F" />
      <circle cx="52.13" cy="36.05" r="6.18" fill="#0E0E0F" />
      <circle cx="28.74" cy="33.30" r="1.39" fill="#FFFFFF" />
      <circle cx="54.78" cy="33.30" r="1.39" fill="#FFFFFF" />
      <path
        d="M26.48 54.58Q38.61 65.26 50.74 54.58"
        stroke="#0E0E0F"
        strokeWidth="2.23"
        strokeLinecap="round"
      />
    </svg>
  )
}
