"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173";

const words = [
  { text: "hustle", color: "#F5A623" },
  { text: "business", color: "#7C5CBF" },
  { text: "grind", color: "#8DB82B" },
];

// back → middle → front rotation angles
const arcAngles: [number, number, number] = [-26, -9, 10];
const arcZ: [number, number, number] = [1, 2, 3];

const cards = [
  {
    id: "zest",
    photo: "/assets/delicious-kombucha-drink-arrangement.jpg",
    photoAlt: "Kombucha brand stickers",
    name: "Ohlah! Juices",
    label: "Product labels",
    title: "Stickers that pop",
    tags: ["Stickers", "Labels"],
    stats: [
      { val: "50+", lbl: "min order" },
      { val: "₦4.5k", lbl: "from" },
    ],
    cta: "Get labels →",
    mascot: false,
  },
  {
    id: "kara",
    photo: "/assets/vecteezy_colorful-paper-shopping-bags_27614808.jpg",
    photoAlt: "Branded shopping bags",
    name: "Kara Store",
    label: "Branded packaging",
    title: "Bags, cards & thank you notes",
    tags: ["Packaging", "Cards"],
    stats: [
      { val: "24h", lbl: "delivery" },
      { val: "₦8.5k", lbl: "starter" },
    ],
    cta: "Build my pack →",
    mascot: false,
  },
  {
    id: "ayra",
    photo: "/assets/view-male-beauty-products-with-rock-stone-display.jpg",
    photoAlt: "Ayra Beauty products",
    name: "Ayra Beauty",
    label: "Brand identity ready! Asap",
    title: "Full brand kit ready",
    tags: ["Stickers", "Cards", "Flyers"],
    stats: [
      { val: "48h", lbl: "delivery" },
      { val: "₦8.5k", lbl: "starter" },
    ],
    cta: "Ready to print!",
    mascot: true,
  },
];

export function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Word swap every 2.8s
  useEffect(() => {
    const t = setInterval(
      () => setWordIdx((i) => (i + 1) % words.length),
      2800
    );
    return () => clearInterval(t);
  }, []);

  // Card position swap every 45s
  useEffect(() => {
    const t = setInterval(() => setCycle((i) => (i + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero">
      <div className="glow-tr" />
      <div className="glow-bl" />
      <div className="grid-bg" />

      {/* ── Left col ── */}
      <div className="hero-left">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" as const }}
        >
          <div className="badge-pulse" />
          <span className="flag-emoji">🇳🇬</span>
          <span className="flag-emoji">🇬🇭</span>
          Nigerian &amp; Ghanaian businesses launch faster with Mowlo
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" as const }}
        >
          Your{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIdx}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: "easeOut" as const }}
              style={{ color: words[wordIdx].color, display: "inline-block" }}
            >
              {words[wordIdx].text}
            </motion.span>
          </AnimatePresence>
          <br />
          deserves to
          <br />
          look <span className="hi">this good.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" as const }}
        >
          You do the work. We make sure people notice. Stickers, cards, flyers,
          brand kits — designed by AI, printed fast, delivered to your door.
        </motion.p>

        <motion.div
          // Added flex-col (vertical stack) on mobile, flex-row on small screens and up
          className="hero-btns flex flex-col sm:flex-row w-full sm:w-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" as const }}
        >
          {/* Added text-center to center content when wide */}
          <a
            href={`${APP_URL}/auth/register`}
            className="btn-hp w-full sm:w-auto text-center"
          >
            Start your brand →
          </a>
          <a href="#products" className="btn-hs w-full sm:w-auto text-center">
            Browse products
          </a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" as const }}
        >
          <div className="hstat">
            <h3>12k+</h3>
            <span>businesses launched</span>
          </div>
          <div className="hstat">
            <h3>24hrs</h3>
            <span>Lagos delivery</span>
          </div>
          <div className="hstat">
            <h3>AI</h3>
            <span>instant brand kit</span>
          </div>
        </motion.div>
      </div>

      {/* ── Right col ── */}
      <div className="hero-right">
        <div className="card-cluster">
          {/* Sticker chip */}
          <motion.div
            className="sticker-chip hidden md:flex"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0, y: [0, -11, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 1.4 },
              x: { duration: 0.5, delay: 1.4 },
              y: {
                duration: 4.5,
                delay: 1.9,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M40 8C58 6 72 16 76 32C80 48 72 66 56 74C40 82 22 76 12 62C2 48 4 28 14 18C24 8 22 10 40 8Z"
                fill="rgba(0,0,0,0.22)"
              />
              <circle cx="29" cy="34" r="7" fill="white" opacity="0.9" />
              <circle cx="51" cy="34" r="7" fill="white" opacity="0.9" />
              <circle cx="30" cy="33" r="3.5" fill="#0a5248" />
              <circle cx="52" cy="33" r="3.5" fill="#0a5248" />
              <path
                d="M28 48Q40 57 52 48"
                stroke="#0a5248"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            Stickers from ₦8,500
          </motion.div>

          {/* Card B: Brand Kit */}
          <motion.div
            className="card-b hidden md:block"
            initial={{ opacity: 0, x: -28, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{
              duration: 0.75,
              delay: 1.1,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <div className="cb-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 80 80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 8C62 4 78 18 78 42C78 66 60 78 40 78C20 78 4 62 4 38C4 16 18 12 40 8Z"
                  fill="rgba(255,255,255,0.22)"
                />
                <path
                  d="M22 14L16 4L28 8"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M60 10L68 0L58 6"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="28" cy="36" r="8" fill="white" opacity="0.9" />
                <circle cx="52" cy="36" r="8" fill="white" opacity="0.9" />
                <circle cx="29" cy="35" r="4" fill="#2d1b69" />
                <circle cx="53" cy="35" r="4" fill="#2d1b69" />
                <path
                  d="M26 52Q40 62 54 52"
                  stroke="#2d1b69"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="cb-title">Brand Kit</div>
            <div className="cb-sub">
              AI logo + colours + print assets generated instantly.
            </div>
            <div className="cb-dots">
              {["#F5A623", "#E8527A", "#1FB89E", "#8DB82B"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Arc card stack */}
          <div className="arc-stack">
            {cards.map((card, i) => {
              // Which arc position (0=back, 1=mid, 2=front) this card occupies
              const pos = (i - cycle + 3) % 3;
              const isFrontCard = pos === 2;

              return (
                <motion.div
                  key={card.id}
                  // Tailwind/CSS handles visibility: hide completely if it's a back card on small screens
                  className={`arc-card ${
                    isFrontCard ? "block" : "hidden md:block"
                  }`}
                  style={{
                    transformOrigin: "center bottom",
                    zIndex: arcZ[pos],
                  }}
                  initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    // Force 0 rotation on mobile for the single centered card, use arcAngles on desktop
                    rotate:
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? 3
                        : arcAngles[pos],
                    scale:
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? 0.8
                        : 1,
                  }}
                  transition={{
                    duration: 1.05,
                    delay: i * 0.18,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                >
                  <div
                    className="arc-photo-wrap"
                    style={{ position: "relative" }}
                  >
                    <Image
                      src={card.photo}
                      alt={card.photoAlt}
                      width={260}
                      height={110}
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "100%",
                        height: "var(--card-img-height, 140px)",
                        display: "block",
                      }}
                    />
                    <div className="ca-photo-overlay" />
                    <div className="ca-photo-name">{card.name}</div>
                    {card.mascot && (
                      <svg
                        className="arc-mascot-svg"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 14,
                          opacity: 0.75,
                        }}
                        width="40"
                        height="40"
                        viewBox="0 0 80 80"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M40 6C62 4 76 18 76 40C76 62 60 76 40 76C20 76 4 62 4 40C4 18 18 6 40 6Z"
                          fill="rgba(245,166,35,0.9)"
                        />
                        <circle
                          cx="28"
                          cy="36"
                          r="8"
                          fill="white"
                          opacity="0.95"
                        />
                        <circle
                          cx="52"
                          cy="36"
                          r="8"
                          fill="white"
                          opacity="0.95"
                        />
                        <circle cx="29" cy="35" r="4" fill="#0E0E0F" />
                        <circle cx="53" cy="35" r="4" fill="#0E0E0F" />
                        <circle cx="31" cy="33" r="1.6" fill="white" />
                        <circle cx="55" cy="33" r="1.6" fill="white" />
                        <path
                          d="M27 52Q40 62 53 52"
                          stroke="#0E0E0F"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ca-body">
                    <div className="ca-label">{card.label}</div>
                    <div className="ca-title">{card.title}</div>
                    <div className="ca-tags">
                      {card.tags.map((t) => (
                        <span key={t} className="ca-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="ca-row">
                      {card.stats.map((s) => (
                        <div key={s.lbl} className="ca-stat">
                          <h4>{s.val}</h4>
                          <span>{s.lbl}</span>
                        </div>
                      ))}
                    </div>
                    <a href={`${APP_URL}/auth/register`} className="ca-btn">
                      {card.cta}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
