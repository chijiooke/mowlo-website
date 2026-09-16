---
name: art-direction
description: Mowlo's visual language for the marketing site — chapter grounds and patterns, exaggerated type, photo usage and mapping, allowed/banned illustration, and how to show customization. Use before designing or restyling any section, choosing imagery, or picking colours/patterns for a page area.
---

# Mowlo Art Direction

The site tells one story: **watch a blank become a brand.** Every design choice should serve that story or get out of its way. Full plan: `../plans/LANDING_REDESIGN_PLAN.md` (from the repo root, `plans/LANDING_REDESIGN_PLAN.md`).

## 1. The one-idea-per-viewport rule

Each viewport carries exactly **one** dominant idea: a mega headline, a 3D object, or a full photo. Never two of those at equal weight. Supporting copy is small and quiet, and **the contrast in scale is the effect.** If a screen looks busy, delete, don't shrink.

## 2. Type

One family (Bricolage Grotesque, variable) for display. DM Sans for everything else.

- **Mega** (`text-mega`): condensed via `font-stretch: 75%`, wght 800, lh 0.82. For the ghost word behind a hero object, or chapter numerals. At most one per viewport. Set it in a low-contrast tone (`text-bone/10` on ink, `text-ink/8` on cream) when it sits behind an object; full contrast when it *is* the object.
- **Poster** (`text-poster`): section headlines, 2–4 words per line, hand-broken lines (`<br />` or block spans). Never let a poster headline wrap by itself; set the breaks.
- Headlines are statements, not labels: "Show up properly." not "Our Products".
- Eyebrows are the only uppercase body text. No all-caps paragraphs.

## 3. Chapter grounds and patterns

Each section is a **chapter** with its own ground. Grounds change by scroll-scrubbed interpolation, never a hard cut (see `motion-system`).

| Ground | Token | Pairs with | Pattern |
|---|---|---|---|
| Ink | `bg-ink` | `text-bone`, amber accents | `bg-grain` + registration marks |
| Ink 2 | `bg-ink-2` | `text-bone` | `bg-diecut` dashed lines |
| Cream | `bg-cream` | `text-ink`, deep brand tones | `bg-halftone` |
| Amber | `bg-amber` | `text-ink` only (never white on amber) | `bg-cropmarks` |

Patterns are **print-shop vocabulary**: halftone dots, crop and registration marks, die-cut dashed lines, CMYK swatch strips, paper grain. They sit at 4–10% contrast and fade out under a radial mask. If you notice a pattern before the content, it's too strong.

Never introduce a ground outside this table. Brand accents (teal, pink, purple, sky, lime) are for **objects and colourways**, not section grounds.

## 4. Photography

- Photos are **heroes or tiles, never thumbnails**: ≥ 40% of viewport width on desktop, full width on mobile, `rounded-[2rem]` (or full-bleed with no radius).
- Always `next/image` with explicit `sizes`. Source files are huge (5–8k px); `sizes` is what keeps mobile fast.
- Crop to the **subject's eyes or hands**. Set `object-position` deliberately; never trust the centre crop.
- Overlaid text needs a scrim gradient from the text side, or put the text beside the photo instead.
- Grade: warm. If a photo looks cold next to the amber, add a `mix-blend-multiply` warm overlay at 8–12% rather than reaching for filters.

### Asset mapping (`public/assets`)

| File | Use it for | Notes |
|---|---|---|
| `ayra-beauty.jpg`, `cosmetic-male-beauty-products-with-display.jpg`, `view-male-beauty-products-with-rock-stone-display.jpg` | **Make it yours**: blank labels that get branded on scroll | The blank white labels are the point. Map the overlay to the biggest label. |
| `happy-mowlo.jpg` | Brand Packs / Final CTA: "the owner" moment | Market vendor, genuine joy. Crop to face + jar. |
| `delivery-man.jpeg` | How it works, step 3 (Delivered) | Box in hand is the story; keep it in frame. |
| `side-hustle.jpg` | Testimonials bento photo tile | Two people, clothing store. |
| `side-view-man-garage-sale.jpg` | Hero or How-it-works step 1: "the hustle before the brand" | Works well desaturated slightly as the "before". |
| `man-working-animation-studio.jpg`, `woman-home-using-generative-artificial-intelligence-…jpg` | How it works, step 2 (Design / AI) | Verify crop; avoid screens full of unreadable UI. |
| `delicious-kombucha-drink-arrangement.jpg`, `vecteezy_colorful-paper-shopping-bags_…jpg` | Products hover / packaging moments | |
| `night-booth.png` | **Style reference** for 3D illustration; Pop-Up Seller Kit | Soft 3D render, the illustration style we allow. |
| `computer-scientist-updating-artificial-intelligence-…jpg` | Don't use | Stock "AI" cliché. |

## 5. Illustration

**Allowed**
- Soft 3D renders in the `night-booth.png` style: rounded, lit, tactile.
- Our own product renders exported from the three.js scene (posters, OG images).
- Print-production motifs as graphic devices: crop marks framing a photo, a die-cut line threading between sections, halftone fades, swatch strips.
- The Mowlo mascot: amber body, the four expressions from the brand guide, never recoloured.

**Banned**
- Humaaans, Open Peeps, Blush, or any flat "corporate people" illustration.
- Generic vector blobs, confetti squiggles as filler, isometric SaaS dashboards.
- Decorative emoji in headings or quotes.
- Mockups of UI the product doesn't have.

## 6. Showing customization (the core job)

Every chapter that mentions "your brand" must **show a brand being applied**, not describe it:

1. **Before → after in the same frame.** Blank stock becomes printed stock; a blank label becomes a labelled bottle. The same object, transformed.
2. **The visitor's input changes the output.** Colourway chips, finish pills, their business name on the card. Real controls, not a looping video.
3. **Finishes are physical.** Matte, glossy, soft-touch, metallic and holographic must *look* different under moving light. That's why they're real PBR materials, not colour swaps.
4. **Consistency is the proof of intentionality.** One identity appears across every piece (card, sticker, flyer, bag, mug, tee) so the visitor sees a *system*, not a one-off. That identity is **Mowlo's own**: mascot, wordmark, brand colours, print patterns. **Never invent a customer brand** (the founder ruled out "Ayra Beauty"); use a real customer only with their permission.
5. **No prices.** Pricing isn't concluded: no ₦ figures, "from" prices or saving percentages in copy, mock UI or print textures. Show what a product is (sizes, finishes, "no minimum order"), not what it costs.
6. **Colour by default, not on hover.** Steps, pills and product moments carry their brand colour from the moment they reveal. Hover can intensify colour, never introduce it.

## 7. Colour usage

- Amber is the brand and the primary CTA. One amber CTA per decision.
- Text on amber is always `text-ink`.
- Colourways for customization demos: amber, teal, pink, purple, sky, in that order.
- On cream, use the deeper brand tones (`amber-deep`, `teal-deep`, `pink-deep`) for text and small marks; the bright ones fail contrast.

## 8. Self-check before shipping a section

- [ ] One dominant idea per viewport, at desktop and at 390px.
- [ ] Ground and pattern are from the table in §3.
- [ ] Every photo is ≥ 40vw (desktop) with a deliberate crop and `sizes`.
- [ ] No banned illustration or emoji.
- [ ] If the section mentions customization, something visibly transforms.
- [ ] Headline line breaks are hand-set and hold at 390, 768, 1280 and 1920px.
