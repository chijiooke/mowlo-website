import { NextRequest, NextResponse } from 'next/server'
import { getGalleryPage } from '@/lib/gallery'

/** GET /api/gallery?page=1&category=Stickers → { items, nextPage, total } */
export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const category = searchParams.get('category')

  return NextResponse.json(getGalleryPage(page, category))
}
