import { Reveal, Stagger, StaggerItem } from "./Reveal";

const steps = [
  {
    n: "01",
    icon: "🎯",
    title: "Pick your product",
    body: "Choose stickers, cards, flyers, or a brand pack (multiple brand items).",
  },
  {
    n: "02",
    icon: "🎨",
    title: "Design or upload",
    body: "Answer 5 questions — AI generates your logo, colours, and layouts, Upload your own file if you have one.",
  },
  {
    n: "03",
    icon: "🚀",
    title: "We print & deliver",
    body: "Same-day or next-day Lagos. 2–3 days nationwide. Get progress notifications via email, SMS or whatsapp.",
  },
];

export function HowItWorks() {
  return (
    <div id="how" className="section">
      <Reveal>
        <span className="sec-label">How it works</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="sec-title">
          Simple from start
          <br />
          to <span className="text-amber-400">delivery.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="sec-sub">Three steps and you&apos;re done. No wahala.</p>
      </Reveal>
      <Stagger className="steps-grid">
        {steps.map((s) => (
          <StaggerItem key={s.n}>
            <div className="step min-h-full">
              <div className="step-n">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-body">{s.body}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
