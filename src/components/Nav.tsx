'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { MowloLogo } from './MowloLogo'
import { WaitlistCTA } from './WaitlistForm'

/* Gallery and Print partners are hidden from the nav for now — the pages are
   still reachable by URL and from the footer. */
const LINKS = [
  { href: '/#products', label: 'Products' },
  { href: '/#packs', label: 'Brand Packs' },
  { href: '/#how', label: 'How it works' },
  { href: '/#app', label: 'Mobile app' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav>
        <Link href="/" className="logo">
          <MowloLogo size={32} />
          <span className="logo-text">Mowlo</span>
        </Link>

        <div className="nav-links">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <WaitlistCTA className="btn-a" label="Join waitlist" source="nav" />
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
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <WaitlistCTA className="btn-a" label="Join waitlist →" source="nav-drawer" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
