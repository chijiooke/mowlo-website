import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import fetch from 'node-fetch'

const notion = new Client({ auth: process.env.NOTION_TOKEN, fetch: fetch as never })

const DATABASE_ID = process.env.NOTION_WAITLIST_DATABASE_ID

/** POST /api/waitlist — capture a phone number for the mobile app launch. */
export async function POST(req: NextRequest) {
  try {
    const { whatsapp, source } = await req.json()

    if (typeof whatsapp !== 'string' || !/^\d{10}$/.test(whatsapp)) {
      return NextResponse.json({ error: 'A valid 10-digit WhatsApp number is required' }, { status: 400 })
    }

    if (!DATABASE_ID) {
      // Not configured yet — don't fail the visitor, but make it visible in logs.
      console.warn('[waitlist] NOTION_WAITLIST_DATABASE_ID is unset; signup not persisted')
      return NextResponse.json({ success: true, persisted: false }, { status: 200 })
    }

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        WhatsApp: { title: [{ text: { content: `+234${whatsapp}` } }] },
        Source: { select: { name: typeof source === 'string' ? source : 'mobile-app' } },
        'Submitted At': { date: { start: new Date().toISOString() } },
      },
    })

    return NextResponse.json({ success: true, persisted: true }, { status: 200 })
  } catch (err) {
    console.error('[waitlist] Notion error', err)
    return NextResponse.json({ error: 'Could not save signup' }, { status: 500 })
  }
}
