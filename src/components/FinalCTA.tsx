import { Reveal } from './Reveal'
import { MowloLogo } from './MowloLogo'
import { WaitlistCTA } from './WaitlistForm'
import { PRINT_URL } from '@/lib/links'

interface FinalCTAProps {
  /** Two hand-broken lines. */
  lines?: [string, string]
  body?: string
  /** A link out, or the waitlist (tagged with its source). */
  cta?: { label: string } & ({ href: string } | { waitlist: string })
  /** Replaces the floating mascot with a panel above the headline. */
  panel?: React.ReactNode
}

/** The print closing line is the default; the Creators page passes its own. */
export function FinalCTA({
  lines = ['Small business.', 'Big brand energy.'],
  body = 'Your customer should never guess how small you are.',
  cta = { label: 'Start printing →', href: PRINT_URL },
  panel,
}: FinalCTAProps) {
  return (
    <section className="final">
      <div className="final-glow" />

      {panel ?? (
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
      )}

      <Reveal>
        <h2>
          {lines[0]}
          <br />
          {lines[1]}
        </h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p>{body}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ display: 'flex', gap: 13, justifyContent: 'center', flexWrap: 'wrap' }}>
          {'href' in cta ? (
            <a className="btn-hp" href={cta.href}>
              {cta.label}
            </a>
          ) : (
            <WaitlistCTA className="btn-hp" label={cta.label} source={cta.waitlist} />
          )}
        </div>
      </Reveal>
    </section>
  )
}
