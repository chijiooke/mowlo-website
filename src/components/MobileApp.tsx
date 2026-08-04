'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Reveal } from './Reveal'
import { MowloLogo } from './MowloLogo'
import { WaitlistForm } from './WaitlistForm'

const FEATURES = [
  {
    icon: 'lucide:wand-sparkles',
    title: 'A brand in 60 seconds',
    body: 'Type your business name, answer five questions, and watch your logo, colours and layouts draw themselves.',
  },
  {
    icon: 'lucide:scan-eye',
    title: 'See it before you print',
    body: 'Point your camera at your product and preview the sticker or label sitting on it — then send it to press.',
  },
  {
    icon: 'lucide:map-pin',
    title: 'Watch it come to you',
    body: 'Live tracking from the press to the rider at your gate. No more calling to ask where your order reached.',
  },
  {
    icon: 'lucide:bike',
    title: 'At your gate in 24hrs',
    body: 'Approve today, a rider brings it tomorrow — 24hrs across Lagos, 2–3 days nationwide.',
  },
]

const PUSHES = [
  { icon: 'lucide:package-check', color: 'var(--teal)', title: 'Out for delivery', body: '100 stickers · arriving today', top: '13%', right: '-6%', delay: 0.5 },
  { icon: 'lucide:check-check', color: 'var(--amber)', title: 'Proof ready', body: 'Tap to approve — 100 stickers', bottom: '15%', left: '-4%', delay: 0.9 },
]

export function MobileApp() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="app" className="app-bg">
      <div className="app-inner">
        {/* ── Left: the pitch ── */}
        <div>
          <Reveal>
            <span className="app-badge">
              <Icon icon="lucide:smartphone" width={15} />
              Mowlo app · coming soon
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="app-title">
              Your brand,
              <br />
              <em>in your pocket.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="app-sub">
              Everything you can do on Mowlo today — reordering, proofing, tracking — built for the
              phone you already run your business from. Android first, iOS right behind it.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="app-feats">
              {FEATURES.map(f => (
                <div key={f.title} className="app-feat">
                  <span className="app-feat-icon">
                    <Icon icon={f.icon} width={18} />
                  </span>
                  <div>
                    <div className="app-feat-title">{f.title}</div>
                    <p className="app-feat-body">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <WaitlistForm />
          </Reveal>
        </div>

        {/* ── Right: the phone ── */}
        <div className="phone-stage">
          <div className="phone-glow" />

          <motion.div
            className="phone"
            initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-head">
                <div className="phone-hello">Welcome back, Adaeze</div>
                <div className="phone-brand">Adaeze Wigs</div>
              </div>

              <div className="phone-body">
                <div className="phone-card">
                  <div className="phone-card-label">Order #4192</div>
                  <div className="phone-card-title">100 product stickers</div>
                  <div className="phone-steps">
                    {['received', 'printing', 'packed', 'delivery'].map((s, i) => (
                      <span key={s} className={`phone-step${i < 3 ? ' on' : ''}`} />
                    ))}
                  </div>
                </div>

                <div className="phone-card">
                  <div className="phone-card-label">Reorder</div>
                  <div className="phone-card-title">250 business cards</div>
                  <div className="phone-steps">
                    <span className="phone-step on" />
                  </div>
                </div>

                <div className="phone-card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MowloLogo size={26} />
                  <div className="phone-card-title" style={{ fontSize: 12 }}>
                    Your brand kit is saved
                  </div>
                </div>
              </div>

              <div className="phone-tabs">
                <span className="phone-tab on"><Icon icon="lucide:house" width={19} /></span>
                <span className="phone-tab"><Icon icon="lucide:image" width={19} /></span>
                <span className="phone-fab"><Icon icon="lucide:plus" width={21} /></span>
                <span className="phone-tab"><Icon icon="lucide:receipt-text" width={19} /></span>
                <span className="phone-tab"><Icon icon="lucide:user" width={19} /></span>
              </div>
            </div>
          </motion.div>

          {/* Floating push notifications */}
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
              <span className="push-icon" style={{ background: `color-mix(in srgb, ${p.color} 18%, transparent)`, color: p.color }}>
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
