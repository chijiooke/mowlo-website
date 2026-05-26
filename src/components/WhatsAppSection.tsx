import { Reveal } from './Reveal'

export function WhatsAppSection() {
  return (
    <div style={{ padding: '0 6% 80px', maxWidth: 1200, margin: '0 auto' }}>
      <Reveal>
        <div className="wa-wrap">
          <div>
            <span className="sec-label">Design it, upload it, or let us make it ✦</span>
            <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3.5vw,44px)' }}>
              From your phone<br />to your doorstep.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 22 }}>
              Already have a design? Send us the file and we&apos;ll print it. Need one made? Mowlo generates seasonal flyers, greeting cards and promos in your brand colours — automatically. Either way, you review the proof right here on WhatsApp and we ship it the same day.
            </p>
            <div className="pill-row">
              {['Upload your own file', 'Auto-generated promos', 'Seasonal greetings', 'Same-day dispatch', 'Delivery updates'].map(p => (
                <span key={p} className="pill">{p}</span>
              ))}
            </div>
          </div>

          <div className="wa-chat">
            <div className="wa-top">
              <div className="wa-av">M</div>
              <div><div className="wa-nm">Mowlo</div><div className="wa-st">Online</div></div>
            </div>
            <div className="wa-msgs">
              {/* Customer uploads their own file */}
              <div className="bub bub-out" style={{ padding: 6 }}>
                <div style={{ background: '#014e3a', borderRadius: 6, padding: 10, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 7, background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>📄</div>
                  <div style={{ fontSize: 11, color: '#d0d8d4', lineHeight: 1.5 }}>
                    Adaeze_Val_Flyer.pdf<br /><span style={{ color: 'rgba(255,255,255,0.4)' }}>1.2 MB</span>
                  </div>
                </div>
                <span style={{ fontSize: 13 }}>Please print 150 copies, A5 size 🙏</span>
              </div>
              {/* Mowlo confirms + sends preview */}
              <div className="bub bub-in">Got it! 👀 150 × A5. Total: ₦9,000. Here&apos;s your print preview 👇</div>
              <div className="bub bub-in" style={{ padding: 6 }}>
                <div style={{ background: '#2a4a3a', borderRadius: 6, padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 7, background: '#E8527A', opacity: .85, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, color: '#8696A0', lineHeight: 1.5 }}>
                    Print_Preview.pdf · 0.8 MB<br /><span style={{ color: '#25D366' }}>Tap to review</span>
                  </div>
                </div>
              </div>
              <div className="bub bub-out">Perfect, go ahead! 🙌</div>
              <div className="bub bub-in">Confirmed ✅ Printing now. Delivering <strong style={{ color: '#25D366' }}>tomorrow before 5pm</strong> 🚀</div>
              <div className="wa-time">Today, 2:17 PM · ✓✓</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
