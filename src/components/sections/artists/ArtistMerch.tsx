'use client'

import { ProductsSection } from '@/components/ProductsSection'
import { MERCH_PRODUCTS } from '@/components/products'
import { APPLY_URL } from '@/lib/links'

/**
 * The creators page's hand of merch cards, for artists: the same pieces, told
 * as an add-on to a print drop. Every card leads to the application.
 */
export function ArtistMerch() {
  return (
    <ProductsSection
      id="merch"
      products={MERCH_PRODUCTS}
      label="Merch, too"
      lines={['Add some', 'merch.']}
      sub="Put your art on tees, stickers, key holders, mugs and more, and add them to any drop beside your framed prints. Same deal: nothing’s printed until it sells."
      onOpen={() => window.location.assign(APPLY_URL)}
    />
  )
}
