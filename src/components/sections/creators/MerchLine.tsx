'use client'

import { ProductsSection } from '@/components/ProductsSection'
import { MERCH_PRODUCTS } from '@/components/products'
import { APPLY_URL } from '@/lib/links'

/**
 * The merch line as a hand of cards, straight after the parade's last piece:
 * it stands in for the parade's closing line — the parade shows three
 * pieces; this is the whole range. Every
 * card leads to the application, since that's how you start selling them.
 */
export function MerchLine() {
  return (
    <ProductsSection
      id="range"
      products={MERCH_PRODUCTS}
      label="The merch line"
      lines={['Pick your', 'pieces.']}
      sub="Mix and match in one drop. Nothing’s printed until it closes, and every piece lands at your buyer’s door."
      onOpen={() => window.location.assign(APPLY_URL)}
    />
  )
}
