'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { APPLY_URL } from '@/lib/links'
import { MowloLogo } from './MowloLogo'

/* Print partners is hidden from the nav for now — the page is still reachable
   by URL and from the footer. Links run in the order the sections appear on
   the home page, then the other sides of the site. One nav for every page. */
const LINKS = [
  { href: '/#drops', label: 'How drops work' },
  { href: '/#merch', label: 'What you can sell' },
  { href: '/#paid', label: 'Getting paid' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/artists', label: "Artist's Corner" },
  { href: '/print', label: 'For business' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const links = LINKS

  return (
    <>
      <nav>
        <Link href="/" className="logo">
          <MowloLogo size={32} />
          <span className="logo-text">Mowlo</span>
        </Link>

        <div className="nav-links">
          {links.map(l => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <a className="btn-a" href={APPLY_URL}>
            Use Mowlo
          </a>
          <button
            type="button"
            className="nav-burger"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <Icon icon={open ? 'lucide:x' : 'lucide:menu'} width={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <a className="btn-a" href={APPLY_URL}>
              Use Mowlo →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
