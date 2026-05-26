import { Reveal, Stagger, StaggerItem } from './Reveal'

const testimonials = [
  { q: 'I ordered my wig business cards on Monday and they were at my door Tuesday evening. Everyone at the market was asking where I got them from.', initials: 'AT', name: 'Adaeze T.', handle: '@adaeze.wigs · Lagos', color: '#F5A623' },
  { q: 'The AI brand wizard sha understood my vibe. My skincare packaging went from looking like it was made at home to looking like a real international brand.', initials: 'FK', name: 'Funmi K.', handle: '@funksglow · Abuja', color: '#1FB89E' },
  { q: 'My reading club ordered matching bookmarks and postcards. Everyone was obsessed. We\'re already on our second order and telling every group we know.', initials: 'ZB', name: 'Zainab B.', handle: '@lagosbookclub · Lagos', color: '#7C5CBF', light: true },
]

export function Testimonials() {
  return (
    <div className="testi-bg">
      <div className="testi-inner">
        <Reveal><div className="testi-h">Here&apos;s what the streets<br />are saying 🔥</div></Reveal>
        <Stagger className="testi-grid">
          {testimonials.map(t => (
            <StaggerItem key={t.name}>
              <div className="testi-card">
                <div className="tq">{t.q}</div>
                <div className="tw">
                  <div className="tav" style={{ background: t.color, color: t.light ? 'white' : 'var(--ink)' }}>{t.initials}</div>
                  <div>
                    <div className="tnm">{t.name}</div>
                    <div className="thn">{t.handle}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  )
}
