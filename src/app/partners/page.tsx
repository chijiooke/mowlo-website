import type { Metadata } from "next";
import Link from "next/link";
import { MowloLogo } from "@/components/MowloLogo";
import { PartnerForm } from "@/components/PartnerForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mowlo.co";

export const metadata: Metadata = {
  title: "Print Partners — Join the Mowlo Network",
  description:
    "Partner with Mowlo to print for small businesses in your city. Earn extra income, steady clients, print-ready files every time.",
  alternates: { canonical: `${SITE_URL}/partners` },
  openGraph: {
    title: "Print Partners — Join the Mowlo Network",
    description:
      "We send you clients. You print. Earn extra income by joining Mowlo's print partner network in Nigeria.",
    url: `${SITE_URL}/partners`,
    images: [
      {
        url: `${SITE_URL}/og-partners.png`,
        width: 1200,
        height: 630,
        alt: "Mowlo Print Partners",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Print Partners — Join the Mowlo Network",
    description:
      "We send you clients. You print. Join Mowlo's print partner network.",
    images: [`${SITE_URL}/og-partners.png`],
  },
};

const benefits = [
  {
    icon: "💰",
    color: "rgba(245,166,35,0.1)",
    title: "Steady extra income",
    body: "Receive Mowlo orders directly — no more slow periods waiting for walk-ins.",
  },
  {
    icon: "📦",
    color: "rgba(31,184,158,0.1)",
    title: "Jobs matched to your equipment",
    body: "We only send you orders your machine can handle — no awkward declines.",
  },
  {
    icon: "🎨",
    color: "rgba(124,92,191,0.1)",
    title: "Print-ready files, always",
    body: "Every job comes with professional, pre-approved designs — straight to print.",
  },
  {
    icon: "💬",
    color: "rgba(42,159,214,0.1)",
    title: "Managed on WhatsApp",
    body: "Orders, payments, and delivery — all coordinated through WhatsApp. Simple.",
  },
];

export default function PartnersPage() {
  return (
    <>
      {/* ── Nav ── */}
      <nav>
        <Link href="/" className="logo">
          <MowloLogo size={32} />
          <span className="logo-text">Mowlo</span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color .2s",
          }}
        >
          ← Back to home
        </Link>
      </nav>

      {/* ── Page grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
          paddingTop: 68,
        }}
      >
        {/* ── Left info panel ── */}
        <div
          style={{
            background: "var(--ink2)",
            borderRight: "1px solid var(--border)",
            padding: "60px 6% 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "sticky",
            top: 68,
            height: "calc(100vh - 68px)",
            overflow: "hidden",
          }}
        >
          {/* glows */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -40,
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle,rgba(245,166,35,0.1) 0%,transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -20,
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle,rgba(31,184,158,0.06) 0%,transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <span className="sec-label" style={{ position: "relative" }}>
            Print Partner Network
          </span>
          <h1
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(32px,4vw,52px)",
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.06,
              color: "#F0EDE8",
              marginBottom: 16,
              position: "relative",
            }}
          >
            Print for
            <br />
            Mowlo. <span style={{ color: "var(--amber)" }}>Earn more.</span>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--muted)",
              lineHeight: 1.7,
              maxWidth: 400,
              marginBottom: 40,
              position: "relative",
            }}
          >
            We&apos;re building a network of trusted print shops across Nigeria.
            You print. We send you clients. Everyone wins.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 40,
              position: "relative",
            }}
          >
            {benefits.map((b) => (
              <div
                key={b.title}
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: b.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {b.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#F0EDE8",
                      marginBottom: 2,
                    }}
                  >
                    {b.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {b.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              boxSizing: "border-box",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 100,
              background: "rgba(245,166,35,0.08)",
              border: "1px solid rgba(245,166,35,0.2)",
              fontSize: 13,
              color: "var(--amber)",
              fontWeight: 500,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--amber)",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            Currently accepting applications in Lagos, Abuja &amp; Accra
          </div>

          {/* decorative blob */}
          <svg
            style={{
              position: "absolute",
              bottom: 32,
              right: 32,
              opacity: 0.1,
            }}
            width="160"
            height="160"
            viewBox="0 0 80 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 6C58 4 72 14 76 30C80 46 72 64 56 72C40 80 22 74 12 60C2 46 4 26 14 16C24 6 22 8 40 6Z"
              fill="#F5A623"
            />
            <circle cx="29" cy="34" r="9" fill="white" opacity="0.95" />
            <circle cx="51" cy="34" r="9" fill="white" opacity="0.95" />
            <circle cx="30" cy="33" r="4.5" fill="#0E0E0F" />
            <circle cx="52" cy="33" r="4.5" fill="#0E0E0F" />
            <circle cx="32" cy="31" r="1.8" fill="white" />
            <circle cx="54" cy="31" r="1.8" fill="white" />
            <path
              d="M28 50Q40 60 52 50"
              stroke="#0E0E0F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* ── Right form panel ── */}
        <div
          style={{
            padding: "52px 6%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 540 }}>
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: "#F0EDE8",
                  marginBottom: 6,
                }}
              >
                Join as a print partner
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                Fill in your details and we&apos;ll be in touch within 48 hours.
              </p>
            </div>
            <PartnerForm />
          </div>
        </div>
      </div>
    </>
  );
}
