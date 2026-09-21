import { Reveal } from './Reveal'
import { MowloLogo } from './MowloLogo'
import { WaitlistCTA } from './WaitlistForm'

export function FinalCTA() {
  return (
    <section className="final">
      <div className="final-glow" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 24,
          animation: 'floatMascot 4s ease-in-out infinite',
        }}
      >
        <MowloLogo size={88} />
      </div>

      <Reveal>
        <h2>
          Small business.
          <br />
          Big brand energy.
        </h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p>Your customer should never guess how small you are.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ display: 'flex', gap: 13, justifyContent: 'center', flexWrap: 'wrap' }}>
          <WaitlistCTA className="btn-hp" label="Download the app →" source="final-cta" />
        </div>
      </Reveal>
    </section>
  )
}
