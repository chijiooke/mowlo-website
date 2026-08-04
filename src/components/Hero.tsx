'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { MowloLogo } from './MowloLogo'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useWaitlist } from './WaitlistForm'

const WORDS = [
  { text: 'hustle', color: 'var(--amber)' },
  { text: 'business', color: 'var(--purple)' },
  { text: 'grind', color: 'var(--lime)' },
]

/** Arc rotation for the back / middle / front card positions. */
const ARC_ANGLES = [-26, -9, 10]

const CARDS = [
  {
    id: 'zest',
    photo: '/assets/delicious-kombucha-drink-arrangement.jpg',
    photoAlt: 'Kombucha brand stickers',
    name: 'Ohlah! Juices',
    label: 'Product labels',
    title: 'Stickers that pop',
    tags: ['Stickers', 'Labels'],
    stats: [
      { val: '25+', lbl: 'min order' },
      { val: '₦8.5k', lbl: 'from' },
    ],
    cta: 'Get labels →',
  },
  {
    id: 'kara',
    photo: '/assets/vecteezy_colorful-paper-shopping-bags_27614808.jpg',
    photoAlt: 'Branded shopping bags',
    name: 'Kara Store',
    label: 'Branded packaging',
    title: 'Bags, cards & thank-you notes',
    tags: ['Packaging', 'Cards'],
    stats: [
      { val: '24h', lbl: 'delivery' },
      { val: '₦8.5k', lbl: 'starter' },
    ],
    cta: 'Build my pack →',
  },
  {
    id: 'ayra',
    photo: '/assets/view-male-beauty-products-with-rock-stone-display.jpg',
    photoAlt: 'Ayra Beauty products',
    name: 'Ayra Beauty',
    label: 'Brand identity',
    title: 'Full brand kit ready',
    tags: ['Stickers', 'Cards', 'Flyers'],
    stats: [
      { val: '48h', lbl: 'delivery' },
      { val: '₦8.5k', lbl: 'starter' },
    ],
    cta: 'Ready to print!',
    mascot: true,
  },
]

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' as const },
})

export function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [cycle, setCycle] = useState(0)
  const isNarrow = useMediaQuery('(max-width: 640px)')
  const openWaitlist = useWaitlist()

  useEffect(() => {
    const swapWord = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800)
    const swapCard = setInterval(() => setCycle(i => (i + 1) % CARDS.length), 6000)
    return () => {
      clearInterval(swapWord)
      clearInterval(swapCard)
    }
  }, [])

  return (
    <section className="hero">
      <div className="glow-tr" />
      <div className="glow-bl" />
      <div className="grid-bg" />

      {/* ── Left: the pitch ── */}
      <div className="hero-left">
        <motion.div className="hero-badge" {...rise(0.05)}>
          <span className="badge-pulse" />
          <span className="flag-emoji" aria-hidden="true">🇳🇬</span>
          <span className="flag-emoji" aria-hidden="true">🇬🇭</span>
          Built for Nigerian &amp; Ghanaian business
        </motion.div>

        <motion.h1 {...rise(0.15)}>
          Your{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIdx}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              style={{ color: WORDS[wordIdx].color, display: 'inline-block' }}
            >
              {WORDS[wordIdx].text}
            </motion.span>
          </AnimatePresence>
          <br />
          deserves to
          <br />
          look <span className="hi">this good.</span>
        </motion.h1>

        <motion.p {...rise(0.25)}>
          You do the work — we make sure people notice. Stickers, cards, flyers and full brand kits,
          designed in minutes and delivered to your door.
        </motion.p>

        <motion.div className="hero-btns flex flex-col sm:flex-row w-full sm:w-auto" {...rise(0.35)}>
          <button
            type="button"
            className="btn-hp w-full sm:w-auto text-center"
            onClick={() => openWaitlist('hero')}
          >
            Join the waitlist →
          </button>
          <a href="#products" className="btn-hs w-full sm:w-auto text-center">
            Browse products
          </a>
        </motion.div>

        <motion.div className="hero-stats" {...rise(0.45)}>
          {[
            { val: '24hrs', lbl: 'Lagos delivery' },
            { val: '25', lbl: 'minimum order' },
            { val: 'AI', lbl: 'instant brand kit' },
          ].map(s => (
            <div key={s.lbl} className="hstat">
              <span className="hstat-val">{s.val}</span>
              <span className="hstat-lbl">{s.lbl}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right: the card arc ── */}
      <div className="hero-right">
        <div className="card-cluster">
          <div className="arc-stack">
            {CARDS.map((card, i) => {
              const pos = (i - cycle + CARDS.length) % CARDS.length
              const isFront = pos === CARDS.length - 1

              return (
                <motion.div
                  key={card.id}
                  className={`arc-card ${isFront ? 'block' : 'hidden md:block'}`}
                  style={{ zIndex: pos + 1 }}
                  initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    rotate: isNarrow ? 3 : ARC_ANGLES[pos],
                    scale: isNarrow ? 0.8 : 1,
                  }}
                  transition={{ duration: 1.05, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="arc-photo-wrap">
                    <Image
                      src={card.photo}
                      alt={card.photoAlt}
                      width={300}
                      height={140}
                      priority={i === CARDS.length - 1}
                      style={{ objectFit: 'cover', width: '100%', height: 140, display: 'block' }}
                    />
                    <div className="ca-photo-overlay" />
                    <div className="ca-photo-name">{card.name}</div>
                    {card.mascot && (
                      <span style={{ position: 'absolute', top: 10, right: 14, opacity: 0.85, lineHeight: 0 }}>
                        <MowloLogo size={40} />
                      </span>
                    )}
                  </div>

                  <div className="ca-body">
                    <div className="ca-label">{card.label}</div>
                    <div className="ca-title">{card.title}</div>
                    <div className="ca-tags">
                      {card.tags.map(t => (
                        <span key={t} className="ca-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="ca-row">
                      {card.stats.map(s => (
                        <div key={s.lbl} className="ca-stat">
                          <b>{s.val}</b>
                          <span>{s.lbl}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="ca-btn"
                      tabIndex={isFront ? 0 : -1}
                      onClick={() => openWaitlist('hero-card')}
                    >
                      {card.cta}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
