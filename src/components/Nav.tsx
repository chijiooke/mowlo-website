'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { MowloLogo } from './MowloLogo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'

const LINKS = [
  { href: '/#products', label: 'Products' },
  { href: '/#packs', label: 'Brand Packs' },
  { href: '/#how', label: 'How it works' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Print partners' },
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
          <a href={`${APP_URL}/auth/login`} className="btn-g">
            Sign in
          </a>
          <a href={`${APP_URL}/auth/register`} className="btn-a">
            Get started
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
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <a href={`${APP_URL}/auth/register`} className="btn-a">
              Get started →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
