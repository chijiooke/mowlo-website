# Website · Creators-first redesign — proposal

| | |
|---|---|
| **Applies to** | mowlo-website |
| **Implements** | SPEC-002 §11 (Website) |
| **Status** | Proposal — for review |
| **Updated** | 2026-10-22 |

Creator drops are now the priority. The website still pitches only small-business
print, so this proposes restructuring it around Creators while keeping print one
click away.

---

## 1. Where the site is today

| Area | Today | Problem |
|---|---|---|
| Message | Hero copy: "Business cards, stickers, flyers and tees". Title, description, keywords and OG image all about small-business print | Creator drops appear once, as one row in the Quality chapter's services list |
| Hero heading | The only `h1` is `sr-only`; the first screen is the word "MOWLO." | Nothing visible says what Mowlo is |
| Audience | Start-ups · Small business · Big corporation | No creators |
| CTAs | All seven say "Download the app" and open the waitlist | Creators have nothing to apply to, though the web app has `/apply` (the spec says `/sell/apply`; the built route is `/apply`) |
| Footer | "Ecommerce Store" under *Coming soon*, linked to `/partners`; most *Coming soon* links point to `/partners` | Lists the product we now lead with as unreleased |
| Scroll length | Landing (260vh) + Parade (400vh) ≈ 6–7 screens before any explanation | Creators arrive on phones from bio links and won't wait |

---

## 2. Structure

### 2.1 Homepage becomes Creators; print moves to `/print`

The print chapters — `Audience`, `ProductsSection`, `Quality`, `HowItWorks`,
`BrandPacks` — are self-contained and move to a new `/print` page largely as they are.
The homepage keeps one print strip near the bottom linking there.

### 2.2 Homepage order

| # | Section | Reuses | Content |
|---|---|---|---|
| 1 | Hero | `Landing` | Keep the "MOWLO." fill effect, add a visible `h1` on the first screen, e.g. *"Drop merch to your audience. No stock. Nothing up front."* Swap the flying flyer and stickers for merch (`Tee.tsx`, `Mug.tsx`, `RoundSticker` exist). Primary CTA **Apply to sell**; secondary *How drops work* |
| 2 | How a drop works | `HowItWorks` layout | Four steps: pick items and upload your design → set your price and window → fans order while it's open → **orders close, then it lands** |
| 3 | What you can sell | `Parade` | Tee, mug, cap, socks, wristband, sticker. Names from one constants file (Q10) |
| 4 | Getting paid | new | Mechanics, no figures: you set the price, we cover production, the markup is yours. Half paid when the drop closes, half once every order is delivered. If the batch costs less to make than quoted, the difference goes to you (D11) |
| 5 | What we handle | `Quality` grid | Phone mock of a live drop page with countdown ("Orders close Fri 6pm · in your hands the week of 13 Oct"), plus printing, packing, delivery, customer questions |
| 6 | Who it's for | `Audience` cards | **Creators** (lead), **Artists** → `/gallery`, **Businesses** → `/print`. Doubles as the router |
| 7 | Apply | new, small | "Apply with your socials, we review every application" |
| 8 | FAQ | new | Do I buy stock? What if only a few people order? Who handles delivery? When do I get paid? Can I sell art prints too? |
| 9 | Final CTA | `FinalCTA` | Apply to sell |
| 10 | Print strip | new, small | "Running a business? We still print cards, flyers and stickers →" `/print` |

### 2.3 Nav

How drops work · What you can sell · Getting paid · FAQ · Artist's Corner ·
*For business* (→ `/print`). CTA **Apply to sell** → `NEXT_PUBLIC_APP_URL/apply`.
The waitlist can stay on `/print` (see §5).

### 2.4 Footer

Columns become Creators / Print / Company. Remove "Ecommerce Store — coming soon" and
fix the links that all point to `/partners`.

### 2.5 Metadata and SEO

Rewrite the root title, description, keywords and Twitter card around creator merch,
with a new OG image. Move the current print keywords and copy to `/print`'s metadata.

---

## 3. Design

- **Creators accent.** Pink already marks "Creator store" in the services list. Make it
  the Creators accent; amber stays the Mowlo/print colour.
- **Countdown as the signature.** "Orders close in 2d 14h" is what makes a drop a drop.
  Use it in the hero, the phone mock and the final CTA.
- **3D models over stock photos.** Current photos (shop owner, office, delivery rider)
  don't fit, and merch stock photos usually break the no-third-party-brands rule. The tee
  and mug models avoid both. Swap in real creator work once drops exist.
- **Phone first.** Cut the parade to ~200vh on mobile; put the heading and Apply button
  on the first screen.

---

## 4. Copy rules (SPEC-002 / PRD-002)

- No prices (guardrail 3).
- No invented or third-party brands in imagery (guardrail 4).
- Close first, then land: "orders close …, in your hands …" (guardrail 5).
- No "proof", "approve your proof" or "sign-off" anywhere.
- Don't promise a verified badge or NIN checks — IDV isn't built (Q13).
- Every merch product name in one constants file, so the Q10 rename is one diff.

---

## 5. Open decisions

| # | Decision | Recommendation |
|---|---|---|
| 1 | Swap the homepage, or add a separate `/creators` page | Swap — a `/creators` page leaves print leading |
| 2 | Markup share is unset (Q1), so "Getting paid" can't say "you keep X%" | Launch with mechanics only; add the figure when Q1 closes |
| 3 | Keep the waitlist for print, or drop it | — |
| 4 | Real creators whose work and permission we can feature | — strongest proof on the page |

---

## 6. Progress — branch `feat/creators-website`

Started 2026-10-22 from `feat/website-redesign`. Decision 1 taken as recommended (homepage
swap); decision 2 as recommended (mechanics only, no markup figure).

**Built**
- `/` is Creators: Landing (choreographed merch, `MerchScene` + `MERCH_TURNS`: tee eases in and
  fades, cap spins in from the left and off, a water bottle rises, turns and sinks, three stickers (`LandingSticker`: neon with rim type and a rolled peel, worn and crumpled, a scalloped vinyl burst) slap onto
  the word and peel away with it; visible `h1` with
  *merch* / *audience* in the Dancing Script accent — ink on cream, amber on ink) → DropSteps `#drops` ("You drop it. They
  cop it. We ship it.", then a pinned in-place sequence: one step at a time, photo wipes, 180vh / 240vh) → Parade (merch: tee, mug, stickers) `#merch` → MerchLine `#range` (the print site's card fan, nine merch cards: tees, hats, crew socks, water bottles, stickers, key holders, cards, mugs, and more) → Quality
  (creators variant: "Premium quality. Guaranteed.", live drop page mock, everything we handle)
  → TrustBar (creators tape) → Earnings `#paid` ("Your clout. Your cut.", Quality-style grid:
  creator's live-drop phone, audience photo + socials, payout timeline, buyer photo) → Community
  `#community` (ink: wide photo with live-drop chips, "Every drop grows the crew" row) → WhoFor `#who` (cream; photo cards: name on top, photo to the edges, inset caption) → Faq `#faq`
  (ink-2) → FinalCTA (Apply to sell). Grounds alternate cream / ink.
- Pattern: `ui/PillPattern` (bold diagonal capsules) on panels only — Quality's phone card (teal),
  Earnings' phone card (pink), the closing `DropBadges` panel (purple, mascot + tee badges).
- Voice: relaxed, Gen Z / millennial, plain words ("cop", "your people", "no money down").
- Drop steps: blank tee / blank cap (from mowlo-web-app's merch photos) with the Mowlo mark
  printing onto them on scroll, then `creators-drop-crew.jpg` (web app's drops-hero) and the
  doorstep delivery.
- Creator photos (`public/assets/creators-*.jpg`) are resized from the founder's Downloads; the
  rest are from the existing library. None yet shows Mowlo merch being worn. Real creator /
  merch photography (or licensed stock, cleared for no third-party brands) is the next ask.
- `/print` holds the previous homepage unchanged, with its own nav and metadata.
- `Landing`, `Parade`, `FinalCTA` and `Nav` take a variant / props instead of being copied.
- Nav, footer, root metadata and the gallery CTA point creators at `NEXT_PUBLIC_APP_URL/apply`.
- `src/lib/merch.ts` holds every merch name (Q10); `src/lib/links.ts` the app URLs.

**Still to do**
- Water bottles, key holders and cards are on the site but not in mowlo-api's `merch_products` catalog yet (`lib/merch.ts` marks them).
- OG image: `og-image.jpg` still shows a print order (TODO in `layout.tsx`).
- Separate print strip above the footer was folded into WhoFor's Businesses card — add it
  back if WhoFor isn't enough.
- Cap and socks are procedural (`Cap.tsx`, `Socks.tsx`; tune on `/dev/merch`). Wristbands have no model yet; the parade still shows tee, mug, stickers.
- Pin budget: landing (merch 420vh) + parade + drop steps = 1060vh desktop, 860vh phone — over the motion-system budget (900 / 750) by choice, to slow the landing pieces. Parade on mobile is still 340vh — §3 asks for ~200vh.
- Pink as the Creators accent is used on objects/icons only; CTAs stay amber per art direction.
- Replace the mock drop with a real creator's drop once one exists, with permission (§5.4).
- Waitlist (decision 3) is untouched and still lives on `/print`.
