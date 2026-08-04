import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import fetch from 'node-fetch'

const notion = new Client({ auth: process.env.NOTION_TOKEN, fetch: fetch as never })

export async function POST(req: NextRequest) {
  try {
    const { ownerName, shopName, city, address, staffCount, equipment, whatsapp } =
      await req.json()

    if (!ownerName || !shopName || !city || !whatsapp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID as string },
      properties: {
        'Shop Name':    { title:      [{ text: { content: shopName } }] },
        'Owner Name':   { rich_text:  [{ text: { content: ownerName } }] },
        City:           { select:     { name: city } },
        Address:        { rich_text:  [{ text: { content: address ?? '' } }] },
        'Staff Count':  { number:     Number(staffCount) || 0 },
        Equipment:      { multi_select: (equipment ?? []).map((e: string) => ({ name: e })) },
        WhatsApp:       { phone_number: `+234${whatsapp}` },
        'Submitted At': { date:       { start: new Date().toISOString() } },
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[partner] Notion error', err)
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
