import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import fetch from 'node-fetch'

const notion = new Client({ auth: process.env.NOTION_TOKEN, fetch: fetch as never })

const DATABASE_ID = process.env.NOTION_WAITLIST_DATABASE_ID

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Local number length differs by market, so the dial code drives validation. */
const COUNTRIES: Record<string, { name: string; dial: string; digits: number }> = {
  NG: { name: 'Nigeria', dial: '+234', digits: 10 },
  GH: { name: 'Ghana', dial: '+233', digits: 9 },
}

/** POST /api/waitlist — capture a signup for the mobile app launch. */
export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, country, phone, location, source } = await req.json()

    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    const first = str(firstName)
    const last = str(lastName)
    const mail = str(email)
    const tel = str(phone)
    const city = str(location)
    const market = COUNTRIES[str(country)]

    if (first.length < 2) {
      return NextResponse.json({ error: 'A first name is required' }, { status: 400 })
    }
    if (last.length < 2) {
      return NextResponse.json({ error: 'A last name is required' }, { status: 400 })
    }
    if (!EMAIL.test(mail)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (!market) {
      return NextResponse.json({ error: 'Select a country we deliver to' }, { status: 400 })
    }
    if (!new RegExp(`^\\d{${market.digits}}$`).test(tel)) {
      return NextResponse.json(
        { error: `A valid ${market.digits}-digit ${market.name} phone number is required` },
        { status: 400 },
      )
    }
    if (city.length < 2) {
      return NextResponse.json({ error: 'A city is required' }, { status: 400 })
    }

    const name = `${first} ${last}`

    if (!DATABASE_ID) {
      // Not configured yet — don't fail the visitor, but make it visible in logs.
      console.warn('[waitlist] NOTION_WAITLIST_DATABASE_ID is unset; signup not persisted')
      return NextResponse.json({ success: true, persisted: false }, { status: 200 })
    }

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: mail },
        Phone: { phone_number: `${market.dial}${tel}` },
        Country: { select: { name: market.name } },
        Location: { rich_text: [{ text: { content: city } }] },
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
