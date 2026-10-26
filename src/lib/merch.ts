/**
 * The Creators merch line, as the site names it. Product names are pending
 * (PRD-002 Q10): every merch name on the site reads from here, so the rename is
 * one diff. Mirrors the `merch_products` catalog in mowlo-api. Never a price.
 */
export const MERCH = {
  tee: { name: 'Tees', spec: 'Your design on the front. S–XXL.' },
  mug: { name: 'Mugs', spec: 'Glazed in your colour, your words on the side.' },
  sticker: { name: 'Stickers', spec: 'Die-cut to the shape you draw.' },
  cap: { name: 'Hats', spec: 'Five-panel, your mark on the front.' },
  socks: { name: 'Crew socks', spec: 'Printed down the leg.' },
  wristband: { name: 'Wristbands', spec: 'Silicone, with your name round it.' },
  // Shown on the site ahead of the catalog: not yet `merch_products` rows in mowlo-api.
  bottle: { name: 'Water bottles', spec: 'Insulated, full-wrap print.' },
  keyholder: { name: 'Key holders', spec: 'Your mark, on every set of keys.' },
  card: { name: 'Cards', spec: 'Thank-you notes and inserts for the box.' },
} as const

export type MerchId = keyof typeof MERCH

/** In the order the site lists them. */
export const MERCH_ORDER: MerchId[] = ['tee', 'cap', 'socks', 'bottle', 'sticker', 'keyholder', 'card', 'mug', 'wristband']
