export interface PartnerPayload {
  ownerName: string
  shopName: string
  city: string
  address: string
  staffCount: number
  equipment: string[]
  whatsapp: string
}

export type PartnerFormValues = Omit<PartnerPayload, 'staffCount' | 'equipment'> & {
  staffCount: string
  equipment: string[]
}
