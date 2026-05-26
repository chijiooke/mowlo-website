import { Reveal } from "./Reveal";

export function WhatsAppSection() {
  return (
    <div style={{ padding: "0 6% 80px", maxWidth: 1200, margin: "0 auto" }}>
      <Reveal>
        <div className="wa-wrap">
          <div>
            <span className="sec-label">
              Social Media Marketing, Automated ✦
            </span>

            <h2
              className="sec-title"
              style={{ fontSize: "clamp(24px,3.5vw,44px)" }}
            >
              From your brand assets
              <br />
              to your WhatsApp.
            </h2>

            <p
              style={{
                fontSize: 15,
                color: "var(--muted)",
                lineHeight: 1.65,
                marginBottom: 22,
              }}
            >
              We auto-generate 3 fresh social media flyers customized with your
              logo, brand style, and colors, then drop them directly into your
              WhatsApp. Ready to post and power up your marketing instantly.
            </p>

            <div className="pill-row">
              {[
                "3 unique flyer variations",
                "Your brand colors & style",
                "Automated seasonal promos",
                "Ready for WhatsApp Status",
                "Zero design experience needed",
              ].map((p) => (
                <span key={p} className="pill">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="wa-chat">
            <div className="wa-top">
              <div className="wa-av">M</div>

              <div>
                <div className="wa-nm">Mowlo</div>
                <div className="wa-st">Online</div>
              </div>
            </div>

            <div className="wa-msgs">
              {/* Message 1: The Delivery */}
              <div className="bub bub-in" style={{ padding: 6 }}>
                <div
                  style={{
                    background: "#2a4a3a",
                    borderRadius: 6,
                    padding: 10,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 7,
                      background: "#E8527A",
                      opacity: 0.85,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    🖼️
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "#d0d8d4",
                      lineHeight: 1.5,
                    }}
                  >
                    Seasonal_Promo_Pack.zip · 4.2 MB
                    <br />
                    <span style={{ color: "#25D366", fontWeight: "bold" }}>
                      Tap to save your 3 flyers
                    </span>
                  </div>
                </div>
              </div>

              {/* Message 2: Explanation */}
              <div className="bub bub-in">
                Hey Adaeze! Here are 3 fresh flyer variations tailored to your
                brand colors and logo, ready to post for the upcoming holiday
                season. 🚀
              </div>

              {/* Message 3: Customer Feedback */}
              <div className="bub bub-out">
                Oh wow, these are amazing! 😍
              </div>

              <div className="wa-time">Today, 2:17 PM · ✓✓</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
