'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Reveal, Stagger, StaggerItem } from './Reveal'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'

const items = [
  { icon: '📋', title: 'Pricing displays', desc: 'Clean, professional price cards for your table.' },
  { icon: '🏷️', title: 'Product stickers', desc: 'Label everything — products, packaging, bags.' },
  { icon: '📄', title: 'Event flyers', desc: 'Promote your spot at the market in advance.' },
  { icon: '🛍️', title: 'Branded bags', desc: 'Send customers away carrying your brand.' },
  { icon: '💌', title: 'Thank-you inserts', desc: 'A small card that creates big loyalty.' },
  { icon: '📇', title: 'Business cards', desc: 'Never miss a networking moment at a pop-up.' },
]

export function PopupSection() {
  return (
    <div id="popup" className="section">
      <div className="popup-layout">

        {/* ── Left: content ── */}
        <div className="popup-left">
          <Reveal><span className="sec-label">Pop-up sellers</span></Reveal>
          <Reveal delay={0.05}><h2 className="sec-title">Ready for your<br />next market stall?</h2></Reveal>
          <Reveal delay={0.1}><p className="sec-sub">Everything for a proper pop-up — printed and at your door before your event.</p></Reveal>
          <Stagger className="popup-grid">
            {items.map(i => (
              <StaggerItem key={i.title}>
                <div className="popup-item">
                  <div className="pi-icon">{i.icon}</div>
                  <div className="pi-title">{i.title}</div>
                  <div className="pi-desc">{i.desc}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div style={{ marginTop: 32 }}>
            <a href={`${APP_URL}/auth/register`} className="btn-hp">Get my pop-up kit →</a>
          </div>
        </div>

        {/* ── Right: night-booth image ── */}
        <motion.div
          className="popup-right"
          initial={{ opacity: 0, x: 70, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Image
            src="/assets/night-booth.png"
            alt="Night market stall lit up at dusk"
            fill
            sizes="(max-width: 900px) 100vw, 560px"
            className="night-booth-img"
          />
          <div className="night-booth-overlay" />
          <div className="night-booth-badge">✦ let's go!</div>
          <div className="night-booth-caption">
            <span className="night-booth-tag">Pop-up ready</span>
            <p>Print. Pack. Show up.</p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
