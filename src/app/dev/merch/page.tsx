import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MerchPreview } from './MerchPreview'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** A tuning bench for the procedural merch. Never served in production. */
export default function MerchPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <MerchPreview />
}
