import Image from 'next/image'
import { Reveal, Stagger, StaggerItem } from './Reveal'

const values = [
  { icon: '🤖', title: 'Brand with AI', body: 'Answer 5 quick questions. Get a full logo, colour palette, and print-ready designs in seconds — no designer needed.' },
  { icon: '📦', title: 'Order what you need', body: 'Order 25 stickers or 500. We don\'t force you to buy more than you need. Start small, reorder as you grow.' },
  { icon: '⚡', title: '24hr Lagos delivery', body: 'Order by noon, get it tomorrow. Express dispatch for Lagos. 2–3 days for the rest of Nigeria and Ghana.' },
  { icon: '💬', title: 'E-flyers, seasonal greetings & ads — all covered, ma fo!', body: 'We send your proof to WhatsApp. You approve with one tap. No email, no login, no back-and-forth.' },
  { icon: '🔁', title: 'One-tap reorders', body: 'Running low? Your design is saved. Reorder in one tap from your dashboard — no redesign required.' },
  { icon: '🎯', title: 'Saved brand profile', body: 'Your logo, colours, and style are saved forever. Every new product you order starts pre-branded — ready to go. Simply change your brand style in minutes — need professional designers? We\'ve got you!' },
]

export function ValueSection() {
  return (
    <div className="value-split-wrap">
      <div className="value-split">

        {/* ── Left: full image ── */}
        <Reveal direction="left" className="value-img-panel">
          <Image
            src="/assets/happy-mowlo.jpg"
            alt="Happy customer with Mowlo print order"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="value-img"
          />
          <div className="value-img-overlay" />
          <div className="value-img-label">
            <span className="sec-label" style={{ marginBottom: 0 }}>What you get</span>
            <p className="value-img-sub">Made for the hustle.</p>
          </div>
        </Reveal>

        {/* ── Right: value props ── */}
        <div className="value-content-panel">
          <Reveal><h2 className="sec-title">Everything you need to<br />show up properly.</h2></Reveal>
          <Reveal delay={0.05}><p className="sec-sub" style={{ marginBottom: 32 }}>It&apos;s so easy — just enter your brand name, pick a vibe, splash some colors and&hellip; voilà, we got you!</p></Reveal>
          <Stagger className="value-grid">
            {values.map(v => (
              <StaggerItem key={v.title} className="value-item">
                <div className="vi-icon">{v.icon}</div>
                <div className="vi-title">{v.title}</div>
                <div className="vi-body">{v.body}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

      </div>
    </div>
  )
}
