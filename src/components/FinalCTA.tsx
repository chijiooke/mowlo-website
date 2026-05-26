import { Reveal } from "./Reveal";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173";

export function FinalCTA() {
  return (
    <div className="final flex flex-col items-center text-center">
      <div className="final-glow " />
      <svg
        style={{ marginBottom: 20, animation: 'floatMascot 4s ease-in-out infinite' }}
        width="96" height="88" viewBox="14 12 108 98"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M70 14 C88 10 108 20 114 42 C120 64 110 86 92 96 C74 108 48 106 32 92 C16 78 16 54 26 38 C36 22 52 18 70 14Z" fill="#2A9FD6"/>
        <path d="M86 22 C96 12 114 12 112 22" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="53" cy="52" r="11" fill="white" opacity="0.95"/>
        <circle cx="83" cy="52" r="11" fill="white" opacity="0.95"/>
        <circle cx="54" cy="51" r="5.5" fill="#0b4a6b"/>
        <circle cx="84" cy="51" r="5.5" fill="#0b4a6b"/>
        <circle cx="56" cy="49" r="2.2" fill="white"/>
        <circle cx="86" cy="49" r="2.2" fill="white"/>
        <path d="M51 70 Q67 80 83 70" stroke="#0b4a6b" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      </svg>
      <Reveal>
        <h2>
          Your brand is waiting.
          <br />
          Let&apos;s build it.
        </h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p>Join thousands of founders printing with Mowlo.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          style={{
            display: "flex",
            gap: 13,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href={`${APP_URL}/auth/register`} className="btn-hp">
            Start for free →
          </a>
          <a href={`${APP_URL}/auth/login`} className="btn-hs">
            Sign in
          </a>
        </div>
      </Reveal>
    </div>
  );
}
