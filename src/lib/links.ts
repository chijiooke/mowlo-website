/**
 * The web app, where creators apply and sell and businesses order print. Set
 * per environment by NEXT_PUBLIC_WEB_APP_URL (inlined at build time, so a
 * change needs a redeploy); NEXT_PUBLIC_APP_URL is the older name, still honoured.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_WEB_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://app.mowlo.co'

/** One application covers Creator Store and Artist's Corner: the form asks which. */
export const APPLY_URL = `${APP_URL}/apply`

/** Where a business starts a print order. */
export const PRINT_URL = `${APP_URL}/print`
