import { ColorSplitText } from './ColorSplitText'
import { Reveal } from './Reveal'

/**
 * Three steps, oversized numerals. This section absorbs the AI brand-kit and
 * proofing stories that previously had sections of their own.
 */
const STEPS = [
  {
    n: '01',
    title: 'Pick your product',
    body: 'Stickers, business cards, flyers, thank-you cards — or a full Brand Pack in one order. Order 25 or 500; there is no minimum that eats your profit.',
    tags: ['Stickers', 'Cards', 'Flyers', 'Brand Packs'],
  },
  {
    n: '02',
    title: 'Answer 5 questions',
    body: 'That is the whole brief. You get a logo, a colour palette and print-ready layouts in minutes — no designer, no trip to Computer Village. Already have a file? Upload it instead.',
    tags: ['AI brand kit', 'Saved brand profile', 'Or upload your own'],
  },
  {
    n: '03',
    title: 'Approve your proof',
    body: 'Your proof is ready in minutes — approve it with one tap and we go straight to print. Then we deliver: 24hrs in Lagos, 2–3 days across Nigeria and Ghana, with status the whole way.',
    tags: ['One-tap proofing', '24hr Lagos', 'Delivery tracking'],
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <Reveal>
        <span className="sec-label">How it works</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="sec-title">
          Three steps.
          <br />
          <ColorSplitText text="No wahala." delay={0.15} />
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="sec-sub">
          A three-day, four-person errand collapsed into a phone flow.
        </p>
      </Reveal>

      <div className="steps">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="step">
              <div className="step-n" aria-hidden="true">
                {s.n}
              </div>
              <div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
                <div className="step-tags">
                  {s.tags.map(t => (
                    <span key={t} className="step-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
