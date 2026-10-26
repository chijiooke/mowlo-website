/** The web app, where creators apply and sell. Set per environment. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.mowlo.co'

/** One application covers Creator Store and Artist's Corner: the form asks which. */
export const APPLY_URL = `${APP_URL}/apply`
