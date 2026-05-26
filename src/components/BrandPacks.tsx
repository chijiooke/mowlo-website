'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Reveal } from './Reveal'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'

const packs = [
  {
    tier: 'Starter', name: 'The Launch Pack', price: '₦8,500', note: 'New hustle, first event, side income',
    items: ['50 business cards', '25 A5 flyers', 'AI brand identity setup', 'Logo — text or monogram', 'Saved Brand Profile', 'Lagos delivery in 48hrs'],
    hot: false, color: 'teal', from: 'left',
  },
  {
    tier: 'Growing', name: 'The Hustle Pack', price: '₦18,500', note: 'Growing IG business, pop-up market, events',
    items: ['100 business cards', '50 product stickers', '2 A5 flyer designs (50 each)', 'Packaging insert cards (50)', 'Full AI brand identity', 'Lagos delivery in 24hrs'],
    hot: true, color: 'amber', from: 'up',
  },
  {
    tier: 'Scaling', name: 'The Brand Pack', price: '₦38,000', note: 'Established micro-brand, team, retail',
    items: ['250 business cards', '100 stickers (2 designs)', '100 flyers (2 designs)', '50 thank-you cards', 'Full brand identity suite', '3 free top-up orders'],
    hot: false, color: 'purple', from: 'right',
  },
]

const fromVariants = {
  left:  { hidden: { opacity: 0, x: -56, rotate: -2 }, visible: { opacity: 1, x: 0, rotate: 0 } },
  up:    { hidden: { opacity: 0, y: 56, scale: 0.94 },  visible: { opacity: 1, y: 0, scale: 1  } },
  right: { hidden: { opacity: 0, x: 56, rotate: 2 },  visible: { opacity: 1, x: 0, rotate: 0 } },
}

export function BrandPacks() {
  return (
    <div id="packs" className="packs-bg">
      <div className="packs-inner">
        <Reveal><span className="sec-label">Brand Packs</span></Reveal>
        <Reveal delay={0.05}><h2 className="sec-title">Your launch kit,<br />all in one order.</h2></Reveal>
        <Reveal delay={0.1}><p className="sec-sub">Named after the journey. Start small. Scale up.</p></Reveal>

        <motion.div
          className="packs-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {packs.map(p => (
            <motion.div
              key={p.name}
              variants={fromVariants[p.from as keyof typeof fromVariants]}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`pack pack-${p.color}${p.hot ? ' hot' : ''}`}>
                <div className={`pack-stripe pack-stripe-${p.color}`} />
                <div className="pack-tier">{p.tier}</div>
                <div className="pack-name">{p.name}</div>
                <div className={`pack-price pack-price-${p.color}`}>{p.price}</div>
                <div className="pack-note">{p.note}</div>
                <div className="pack-hr" />
                <ul className={`pack-list pack-list-${p.color}`}>{p.items.map(i => <li key={i}>{i}</li>)}</ul>
                <a href={`${APP_URL}/auth/register`} className={`pack-btn pack-btn-${p.color}`}>Order {p.name.replace('The ', '')} →</a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming soon strip */}
        <Reveal delay={0.1}>
          <div className="cs-strip">
            <div className="cs-title">More coming to Mowlo — get early access</div>
            <div className="cs-items">
              {['Brand Personalisation Studio', 'Mowlo Ecommerce Store', 'Event Notifications & Invites'].map(item => (
                <div key={item} className="cs-pill"><span className="cs-dot" />{item}</div>
              ))}
            </div>
            <Link href="/partners" className="cs-waitlist">Join waitlist →</Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
