'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Reveal } from './Reveal'
import { MowloLogo } from './MowloLogo'
import { WaitlistCTA } from './WaitlistForm'

/* Play first — the copy says Android first, and it is the bigger platform in
   both markets. Markers, not links: there is nothing to point at yet. */
const STORES = [
  { icon: 'logos:google-play-icon', name: 'Google Play' },
  { icon: 'logos:apple-app-store', name: 'App Store' },
]

/* Sample account figures for the mock screen. */
const STATS = [
  { value: '₦1.86m', label: 'Printed with Mowlo' },
  { value: '940', label: 'Items delivered' },
]

const STEPS = ['Received', 'Printing', 'Packed', 'Delivery']

const PAST_ORDERS = [
  { name: '250 business cards', meta: 'Delivered 12 Mar', color: 'var(--teal)' },
  { name: '50 A5 flyers', meta: 'Delivered 28 Feb', color: 'var(--pink)' },
]

const PUSHES = [
  { icon: 'lucide:package-check', color: 'var(--teal)', title: 'Out for delivery', body: '100 stickers · arriving today', top: '11%', right: '-5%', delay: 0.5 },
  { icon: 'lucide:repeat-2', color: 'var(--amber)', title: 'Reorder in one tap', body: '250 business cards · running low?', bottom: '13%', left: '-4%', delay: 0.9 },
]

export function MobileApp() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="app" className="app-bg">
      {/* Boundary shapes: scalloped against Brand Packs above, ticket-notched
          against the testimonials below. */}
      <span className="edge edge-scallop" style={{ ['--edge' as string]: 'var(--ink2)' }} aria-hidden="true" />
      <span className="edge edge-ticket" style={{ ['--edge' as string]: 'var(--ink)' }} aria-hidden="true" />

      <div className="app-inner">
        {/* ── Left: the pitch ── */}
        <div className="app-pitch">
          <Reveal>
            <span className="sec-label">Mobile app</span>
          </Reveal>

          <Reveal delay={0.05}>
            {/* Three hand-set lines, each sized to span the same width. */}
            <h2 className="app-title">
              <span className="app-title-line l1">The</span>
              <span className="app-title-line l2">Mowlo app</span>
              <span className="app-title-line l3 app-title-hi">is coming.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="app-sub">
              Everything you run on Mowlo today — reordering, proofing, tracking — built for the
              phone you already run your business from.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="app-stores">
              {STORES.map(s => (
                <span key={s.name} className="app-store">
                  <Icon icon={s.icon} width={24} />
                  <span>
                    <small>Coming soon to</small>
                    {s.name}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="app-cta">
              <WaitlistCTA />
              <p className="app-cta-note">
                Android first, iOS right behind it. One message the day it drops — nothing else.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Right: the phone. Decorative — the pitch above carries the meaning. ── */}
        <div className="phone-stage" aria-hidden="true">
          <motion.div
            className="phone"
            initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-statusbar">
                <span>9:41</span>
                <span className="phone-statusbar-icons">
                  <Icon icon="lucide:signal-high" width={11} />
                  <Icon icon="lucide:wifi" width={11} />
                  <Icon icon="lucide:battery-full" width={13} />
                </span>
              </div>

              <div className="phone-head">
                <div className="phone-hello">Welcome back, Adaeze</div>
                <div className="phone-brand">Adaeze Wigs</div>
              </div>

              <div className="phone-body">
                <div className="phone-stats">
                  {STATS.map(s => (
                    <div key={s.label} className="phone-stat">
                      <div className="phone-stat-val">{s.value}</div>
                      <div className="phone-stat-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="phone-card live">
                  <div className="phone-card-label">Order #4192</div>
                  <div className="phone-card-title">100 product stickers</div>
                  <div className="phone-steps">
                    {STEPS.map((s, i) => (
                      <span key={s} className={`phone-step${i < 3 ? ' on' : ''}`} />
                    ))}
                  </div>
                  <div className="phone-steplabels">
                    {STEPS.map((s, i) => (
                      <span key={s} className={i === 2 ? 'now' : undefined}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="phone-card">
                  <div className="phone-card-label">Order again</div>
                  <ul className="phone-orders">
                    {PAST_ORDERS.map(o => (
                      <li key={o.name} className="phone-order">
                        <span className="phone-order-dot" style={{ background: o.color }} />
                        <div className="phone-order-text">
                          <div className="phone-order-name">{o.name}</div>
                          <div className="phone-order-meta">{o.meta}</div>
                        </div>
                        <span className="phone-reorder">Reorder</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="phone-tabs">
                <span className="phone-tab on"><Icon icon="lucide:house" width={19} /></span>
                <span className="phone-tab"><Icon icon="lucide:image" width={19} /></span>
                <span className="phone-fab"><Icon icon="lucide:plus" width={21} /></span>
                <span className="phone-tab"><Icon icon="lucide:receipt-text" width={19} /></span>
                <span className="phone-tab"><Icon icon="lucide:user" width={19} /></span>
              </div>

              {/* Overlays the content, the way a real toast does. */}
              <motion.div
                className="phone-toast"
                initial={reduceMotion ? false : { opacity: 0, y: -16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <MowloLogo size={18} />
                <div className="phone-toast-text">Your brand kit is saved</div>
              </motion.div>
            </div>
          </motion.div>

          {PUSHES.map(p => (
            <motion.div
              key={p.title}
              className="push"
              style={{ top: p.top, bottom: p.bottom, left: p.left, right: p.right }}
              initial={reduceMotion ? false : { opacity: 0, x: p.left ? -30 : 30, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="push-icon" style={{ background: `color-mix(in srgb, ${p.color} 16%, transparent)`, color: p.color }}>
                <Icon icon={p.icon} width={16} />
              </span>
              <div>
                <div className="push-title">{p.title}</div>
                <div className="push-body">{p.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
