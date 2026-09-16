---
name: motion-system
description: Mowlo's motion language — timing and easing tokens, scroll choreography (pinning, scrubbing, chapter colour switches), text reveals, micro-interactions, smooth scrolling with Lenis, reduced-motion and mobile rules. Use when adding any animation, transition, scroll effect or interaction to the website.
---

# Mowlo Motion System

Motion on Mowlo does one of three jobs: **show a transformation** (blank → brand), **pace the story** (one beat at a time), or **confirm an action** (press, hover, open). If an animation does none of these, cut it.

## 1. Tokens

Easings are defined in `globals.css` `@theme` as Tailwind `ease-*` utilities. Durations use Tailwind's numeric scale. In framer-motion, use the same numbers (seconds) and the cubic-bezier arrays.

| Token | Value | Use |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, reveals, anything arriving |
| `ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Things moving between two resting places (tabs, chapter swaps) |
| `ease-snap` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Small playful overshoot: chips, mascot, pills. Never on large surfaces |
| micro: `duration-150` | 150ms | Hover, press |
| panel: `duration-300` | 300ms | Menus, modal, chip select |
| reveal: `duration-800` / `0.8` | 800ms | Text and image reveals |

Springs for draggable/physical things stay in `lib/motion.ts` (`SETTLE`, `RECENTRE`, `EXIT`). They're tuned; reuse them, don't redefine.

## 2. Scroll choreography

### Two kinds of scroll motion, never mixed on one element
- **Triggered** (plays once when in view): text reveals, photo reveals, stagger lists. `whileInView`, `viewport={{ once: true, amount: 0.4 }}`.
- **Scrubbed** (position = scroll progress, reversible): pinned 3D beats, ground colour switches, horizontal tracks, parallax. `useScroll` + `useTransform`, or `useSectionProgress` for pinned tracks.
  - **Input ranges must stay inside `[0, 1]` and never decrease.** framer-motion hardware-accelerates `opacity`, `clipPath`, `filter` and `transform` that chain directly off `useScroll` by passing the `useTransform` input range to the Web Animations API as keyframe offsets, unclamped. A range like `[-0.02, 0.1]` or `[start - pad, …]` with `start < pad` throws `Offsets must be monotonically non-decreasing` at runtime; the build won't catch it. Keep beat windows inside a margin (the hero uses 0.02–0.98) and clamp any padded range.
  - **And pad every range to span the whole track** with `track()` from `lib/scroll/useSectionProgress`, which holds the first and last values at 0 and 1: `useTransform(progress, ...track([0, 0.06], [1, 0]))`. WAAPI fills the gap before the first offset and after the last with the element's *underlying* style. Unpadded, a fade that ends at 0.06 climbs back toward its starting value by the end of the track, and an element that fades in and starts invisible fades back out. The hero's "BLANK." word and scroll cue reappeared behind later products this way.

### Pinning
- Pin with a tall track + `sticky top-0 h-svh` frame. Use `svh`, not `vh`, so mobile browser chrome doesn't jump the frame.
- **Budget:** ≤ 900vh of pinned scroll on the whole desktop page, ≤ 750vh on mobile. The product-by-product hero takes most of it (620vh / 520vh) by the founder's choice, so every other pinned chapter must stay short (≤ 250vh). More than that feels like the page is broken.
- Every pinned chapter must show visible change within the first 10% of its track, or the user thinks scrolling stopped working.
- Leave a 10–15% tail at the end of each track where nothing new happens, so the hand-off to the next section is calm.

### Chapter ground switches
- Interpolate the ground colour across the **last 15%** of the outgoing chapter and **first 10%** of the incoming one (`useTransform(progress, [0.85, 1], [inkHex, creamHex])` on a shared page-level MotionValue driving `backgroundColor`).
- Text colour flips at the midpoint of that range, not gradually. Half-contrast text is unreadable.
- The nav reads the current ground and flips its own ink to match.

### Parallax
- Max 12% of the element's height in travel. Photos inside a clipped frame: scale 1.15 and translate inside the frame, so edges never show.

## 3. Text

- **Poster headlines:** line-by-line mask reveal. Each line in an `overflow-hidden` wrapper, inner span from `y: 110%` to `0`, 800ms, `ease-out-expo`, 80ms stagger between lines. Use `components/type/SplitReveal`.
- **Mega ghost words:** scrubbed, not triggered. Letter-spacing and `font-stretch` can animate (75% ↔ 100%); weight can too. That's the variable-font payoff.
- Word swaps (BLANK → BRAND): per-letter vertical flip, 30ms stagger, on scroll progress.
- **Never crossfade two mega words in the same place.** Mid-fade they read as one garbled word (the hero once showed "BTE…" from TEES. and BRAND. overlapping). One word must be fully gone before the next arrives. Grounds, glows and patterns may crossfade; words may not.
- **Body copy never animates beyond a simple fade-up (≤ 16px).** People need to read it.
- Don't split text into letters for screen readers: `aria-label` on the parent, `aria-hidden` on the letter spans (as `ColorSplitText` does).

## 4. Micro-interactions

- Buttons: `translate-y-[-2px]` + shadow bloom on hover (`duration-150`), `scale-[0.97]` on press. Primary amber CTAs get a subtle sheen sweep on hover (pseudo-element gradient, 600ms).
- Cards: pointer-driven 3D tilt ≤ 8°, `perspective: 1000px`, with a specular highlight following the cursor. Desktop `(hover: hover)` only.
- Chips/pills (colourway, finish): `ease-snap`, a 1.06 scale pop on select, and a shared-layout indicator (`layoutId`) sliding between options.
- Magnetic CTA (pulls ≤ 6px toward the cursor): hero and Final CTA only.

## 5. Smooth scrolling (Lenis)

- `lib/scroll/SmoothScroll.tsx`, mounted once as a sibling of the content (it renders nothing), with `lerp: 0.1`, `wheelMultiplier: 1`, `syncTouch: false` (touch stays native, which is non-negotiable on mobile).
- Disabled entirely under `prefers-reduced-motion`.
- Any element that scrolls internally (waitlist modal, lightbox, horizontal scrollers) gets `data-lenis-prevent`.
- Anchor links go through `lenis.scrollTo(target, { offset: -navHeight })`.

## 6. Reduced motion

Under `prefers-reduced-motion: reduce`:
- No pinning. Tracks collapse to natural height (`motion-reduce:h-auto`) and sticky frames become static.
- 3D views show posters (see `scroll-3d` tiers).
- Ground switches become hard cuts at the section boundary.
- Reveals become plain opacity fades ≤ 200ms, or nothing.
- The swipe deck and customizer still work (they're user-driven), but without auto-dealing or idle motion.

Use `useReduce()` from `lib/motion.ts` in JS, and Tailwind `motion-reduce:` / `motion-safe:` variants in markup.

## 7. Mobile

- Scrubbed effects stay, but shorter (see pin budgets). Triggered reveals use `amount: 0.2`, since screens are short.
- No hover-dependent motion. Anything shown on hover must also be visible, or reachable by tap, on touch.
- No parallax on elements wider than the viewport (causes horizontal overflow on iOS).
- Animate only `transform`, `opacity`, `filter` (sparingly) and colour. Never `width`, `height`, `top` or `left` in scroll handlers.

## 8. Self-check

- [ ] Each animation does one of: transformation, pacing, confirmation.
- [ ] Triggered vs scrubbed is clear, and not mixed on one element.
- [ ] Pinned total within budget; visible change in the first 10% of each track.
- [ ] Reduced-motion path checked in DevTools (Rendering → Emulate CSS prefers-reduced-motion).
- [ ] 60fps in the Performance panel while scrolling the section at 4× CPU throttle (mobile proxy: ≥ 50fps).
