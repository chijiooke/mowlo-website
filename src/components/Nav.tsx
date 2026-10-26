'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { APPLY_URL } from '@/lib/links'
import { MowloLogo } from './MowloLogo'
import { WaitlistCTA } from './WaitlistForm'

/* Print partners is hidden from the nav for now — the page is still reachable
   by URL and from the footer. Links run in the order the sections appear on
   the page, then the other side of the site. */
const LINKS = {
  creators: [
    { href: '/#drops', label: 'How drops work' },
    { href: '/#merch', label: 'What you can sell' },
    { href: '/#paid', label: 'Getting paid' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/gallery', label: "Artist's Corner" },
    { href: '/print', label: 'For business' },
  ],
  print: [
    { href: '/print#how', label: 'How it works' },
    { href: '/print#products', label: 'Products' },
    { href: '/print#packs', label: 'Brand Packs' },
    { href: '/print#app', label: 'Mobile app' },
    { href: '/', label: 'For creators' },
  ],
}

/** Creators is the default side of the site; `/print` passes `print`. */
export function Nav({ variant = 'creators' }: { variant?: keyof typeof LINKS }) {
  const [open, setOpen] = useState(false)
  const links = LINKS[variant]

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
          {variant === 'creators' ? (
            <a className="btn-a" href={APPLY_URL}>
              Apply to sell
            </a>
          ) : (
            <WaitlistCTA className="btn-a" label="Download the app" source="nav" />
          )}
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
            {variant === 'creators' ? (
              <a className="btn-a" href={APPLY_URL}>
                Apply to sell →
              </a>
            ) : (
              <WaitlistCTA className="btn-a" label="Download the app →" source="nav-drawer" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
