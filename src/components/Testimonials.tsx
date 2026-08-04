import { Reveal, Stagger, StaggerItem } from './Reveal'

const TESTIMONIALS = [
  {
    q: 'I ordered my wig business cards on Monday and they were at my door Tuesday evening. Everyone at the market was asking where I got them from.',
    initials: 'AT',
    name: 'Adaeze T.',
    handle: '@adaeze.wigs · Lagos',
    color: '#F5A623',
  },
  {
    q: 'The AI brand wizard sha understood my vibe. My skincare packaging went from looking like it was made at home to looking like a real international brand.',
    initials: 'FK',
    name: 'Funmi K.',
    handle: '@funksglow · Abuja',
    color: '#1FB89E',
  },
  {
    q: "My reading club ordered matching bookmarks and postcards. Everyone was obsessed. We're already on our second order and telling every group we know.",
    initials: 'ZB',
    name: 'Zainab B.',
    handle: '@lagosbookclub · Lagos',
    color: '#7C5CBF',
    onDark: true,
  },
]

export function Testimonials() {
  return (
    <section className="testi">
      <Reveal>
        <h2 className="testi-h">
          What the streets
          <br />
          are saying 🔥
        </h2>
      </Reveal>
      <Stagger className="testi-grid">
        {TESTIMONIALS.map(t => (
          <StaggerItem key={t.name} className="h-full">
            <figure className="testi-card">
              <blockquote className="tq">{t.q}</blockquote>
              <figcaption className="tw">
                <span className="tav" style={{ background: t.color, color: t.onDark ? '#FFFFFF' : 'var(--ink)' }}>
                  {t.initials}
                </span>
                <span>
                  <span className="tnm">{t.name}</span>
                  <span className="thn" style={{ display: 'block' }}>
                    {t.handle}
                  </span>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
