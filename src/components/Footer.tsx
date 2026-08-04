import Link from 'next/link'
import { MowloLogo } from './MowloLogo'

const COLUMNS = [
  {
    title: 'Products',
    links: [
      { href: '/#products', label: 'Stickers' },
      { href: '/#products', label: 'Business Cards' },
      { href: '/#products', label: 'Flyers' },
      { href: '/#packs', label: 'Brand Packs' },
      { href: '/partners', label: 'Print your own files' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: '/#how', label: 'How it works' },
      { href: '/gallery', label: "Artist's Corner" },
      { href: '/#app', label: 'Mowlo app' },
      { href: '/partners', label: 'Print partners' },
    ],
  },
  {
    title: 'Coming soon',
    links: [
      { href: '/#app', label: 'Mobile app' },
      { href: '/partners', label: 'Brand Studio' },
      { href: '/partners', label: 'Ecommerce Store' },
      { href: '/partners', label: 'Event invites' },
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
              Designed, printed and delivered — for small businesses in Nigeria and Ghana.
            </p>
          </div>

          {COLUMNS.map(col => (
            <div key={col.title}>
              <div className="fc-title">{col.title}</div>
              <ul className="fc-links">
                {col.links.map(l => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="fc">© 2026 Mowlo. All rights reserved.</div>
          <div className="fc">
            Made with <span style={{ color: 'var(--pink)' }}>♥</span> for small businesses in Nigeria
            and Ghana
          </div>
        </div>
      </footer>
    </div>
  )
}
