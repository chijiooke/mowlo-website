import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Studio } from './Studio'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Product shots of our own merch for the business carousel. Never served in production. */
export default function StudioPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <Studio />
}
