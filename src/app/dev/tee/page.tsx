import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TeePreview } from './TeePreview'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** A tuning bench for the tee model. Never served in production. */
export default function TeePreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <TeePreview />
}
