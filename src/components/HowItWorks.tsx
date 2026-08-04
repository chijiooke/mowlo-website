import { ColorSplitText } from './ColorSplitText'
import { Reveal } from './Reveal'

/**
 * Three steps, oversized numerals. This section absorbs the AI brand-kit and
 * proofing stories that previously had sections of their own.
 */
const STEPS = [
  {
    n: '01',
    title: 'Select a product or pack',
    body: 'Stickers, business cards, flyers, thank-you cards, tees — one at a time, or a curated bundle that costs less than the pieces on their own. Order 25 or 500; no minimum that eats your profit.',
    tags: ['Stickers', 'Cards', 'Flyers', 'Bundles'],
  },
  {
    n: '02',
    title: 'Add your design — or let AI do it',
    body: 'Upload the designs you already have. No designs? Answer five questions and our AI designer draws your logo, colour palette and print-ready layouts in minutes — no designer, no trip to Computer Village.',
    tags: ['Upload your own', 'AI designer', 'Saved brand profile'],
  },
  {
    n: '03',
    title: 'Track it to your door',
    body: 'Approve your proof with one tap and we go straight to print. Then follow it the whole way — from the press to the rider at your gate. 24hrs in Lagos, 2–3 days across Nigeria and Ghana.',
    tags: ['One-tap proofing', 'Live tracking', '24hr Lagos'],
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
