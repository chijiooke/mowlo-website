import Link from 'next/link'
import { APPLY_URL } from '@/lib/links'
import { MowloLogo } from './MowloLogo'

/** `external` links leave the site for the web app, so they skip next/link. */
const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Creators',
    links: [
      { href: '/#drops', label: 'How drops work' },
      { href: '/#merch', label: 'What you can sell' },
      { href: '/#paid', label: 'Getting paid' },
      { href: '/#faq', label: 'FAQ' },
      { href: APPLY_URL, label: 'Apply to sell', external: true },
    ],
  },
  {
    title: 'Print',
    links: [
      { href: '/print#products', label: 'Stickers' },
      { href: '/print#products', label: 'Business Cards' },
      { href: '/print#products', label: 'Flyers' },
      { href: '/print#packs', label: 'Brand Packs' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: '/artists', label: "Artist's Corner" },
      { href: '/partners', label: 'Print partners' },
      { href: '/partners', label: 'Print your own files' },
    ],
  },
]

export function Footer() {
  return (
    <div className="footer-wrap">
      <footer>
        <div className="footer-grid">
          <div>
            <div className="fb-name">
              <MowloLogo size={22} />
              Mowlo
            </div>
            <p className="fb-tag">
              Merch drops for creators, print for small businesses. Designed, printed and delivered in
              Nigeria and Ghana.
            </p>
          </div>

          {COLUMNS.map(col => (
            <div key={col.title}>
              <div className="fc-title">{col.title}</div>
              <ul className="fc-links">
                {col.links.map(l => (
                  <li key={`${col.title}-${l.label}`}>
                    {l.external ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="fc">© 2026 Mowlo. All rights reserved.</div>
          <div className="fc">
            Made with <span style={{ color: 'var(--pink)' }}>♥</span> for creators and small businesses in
            Nigeria and Ghana
          </div>
        </div>
      </footer>
    </div>
  )
}
