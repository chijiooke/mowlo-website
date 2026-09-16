---
name: frontend-design
description: Use when building or refining UI for this website — new pages, sections, components, layouts, or visual polish. Covers the project's stack conventions (Next.js App Router, Tailwind 4, Framer Motion, Iconify, three.js via React Three Fiber), the styling contract that replaces the old globals.css classes, and a design checklist for consistent, responsive, accessible frontend work.
---

# Frontend Design

Guidance for building and refining UI in the mowlo-website project.

**The home page is mid-redesign.** Read `plans/LANDING_REDESIGN_PLAN.md` (repo root) for the chapter order and task list. Load the companion skills when they apply:
- `art-direction`: grounds, patterns, type, photos, illustration rules, showing customization
- `motion-system`: any animation, scroll effect or interaction
- `scroll-3d`: anything with three.js / a `SceneView`

## Stack conventions

- **Next.js 16 App Router**: routes in `src/app`, UI in `src/components`. Default to Server Components; add `"use client"` only for state, effects, browser APIs or motion.
- **React 19**: function components and hooks; `ref` is a normal prop (no `forwardRef`).
- **Tailwind CSS 4**: tokens live in `@theme` in `src/app/globals.css`. Use `clsx` for conditional classes.
- **Framer Motion** (`framer-motion`): reveals, scroll-linked values (`useScroll`, `useTransform`), gestures. Shared springs in `src/lib/motion.ts`.
- **three.js** via `@react-three/fiber` + `@react-three/drei`: only through `SceneView` (see `scroll-3d`).
- **Lenis**: smooth wheel scrolling, `src/lib/scroll/SmoothScroll.tsx`.
- **Iconify** (`@iconify/react`): `<Icon icon="lucide:…" />`, never inline SVG icons or new icon packages.
- **Forms**: Formik + Yup.

## Styling contract

The old site mixed ~250 bespoke classes in `globals.css`, Tailwind utilities, and inline style objects. New work follows one system:

1. **Tailwind utilities only** in new or rebuilt components. No new classes in `globals.css`.
2. **Tokens, never raw values.** Colours: `ink`, `ink-2`, `ink-3`, `bone`, `cream`, `paper`, `muted`, `amber`, `amber-hi`, `amber-deep`, `teal(-deep)`, `pink(-deep)`, `purple(-deep)`, `sky`, `lime`. Type: `text-mega`, `text-poster`, `text-title`, `text-lead`, `text-eyebrow` + `font-display` / `font-body` + `font-condensed`. Easing: `ease-out-expo`, `ease-in-out-quart`, `ease-snap`. Layout: `max-w-page`, `px-gutter`, `py-section`. Patterns: `bg-halftone`, `bg-grain`, `bg-diecut`, `bg-cropmarks`, `pattern-fade`. An arbitrary value (`text-[clamp(...)]`) is fine for a one-off size; an arbitrary **colour** is not.
3. **Inline `style` only for MotionValues and CSS custom properties.** Static layout never goes in `style`.
4. `globals.css` holds only: `@import "tailwindcss"`, `@theme`, `@utility` patterns shared by several sections, base resets, and (until Phase 7) the legacy classes still used by unmigrated sections.
5. **Delete legacy CSS in the same change that replaces its section.** Before deleting a class, `grep -r` it across `src/`, since the gallery and partners pages share some.
6. Repeated class sets become a primitive, not a copy-paste: `components/layout` (`Container`, `Chapter`), `components/type` (`Eyebrow`, `Mega`, `SplitReveal`), `components/ui/button.ts` (`button.primary | ghost | ink`).

### Where things go

```
src/components/
  layout/     Container, Chapter (ground + pattern)
  type/       Eyebrow, Mega, SplitReveal
  ui/         button styles, chips, small controls
  three/      ImmersiveRoot, Stage, SceneView, StudioLighting, objects/
  sections/   one folder per rebuilt chapter (hero/, customize/, …)
src/lib/
  scroll/     SmoothScroll, useSectionProgress
  three/      materials, printMaterial, brandTexture, colourways, geometry, quality
```

Legacy section components still sit flat in `src/components/`. Move each into `sections/` as it's rebuilt.

## Design checklist

Before finishing any UI work, verify:

1. **Consistency**: tokens and primitives only, and it follows the art-direction chapter rules.
2. **Responsive**: check at 390, 768, 1024, 1280 and 1920px. No horizontal overflow. Hand-set headline breaks hold at every width. Mobile gets its own layout where the desktop idea doesn't fit (a deck instead of a fan, stacked panels instead of a horizontal pin), not a squashed desktop.
3. **Accessibility**: semantic HTML, headings in order (one `h1`: the hero), `alt` text (empty for decorative), labels on inputs, contrast ≥ 4.5:1 for body text on every ground, visible focus, keyboard operable. Decorative motion layers are `aria-hidden`.
4. **Reduced motion**: the page reads fully with `prefers-reduced-motion` emulated.
5. **Performance**: `next/image` with real `sizes`; three.js only behind `next/dynamic`; nothing that `setState`s on scroll.
6. **Polish**: hover/active/disabled/focus states, and no layout shift (reserve heights for anything that swaps on the client).

## Workflow

1. Read the plan task and the relevant skills. Find the nearest rebuilt section and mirror it.
2. Build the static layout with Tailwind at mobile width first, then desktop.
3. Add motion and 3D last, following `motion-system` and `scroll-3d`.
4. Run `yarn dev` and check the section at the widths above, plus reduced motion.
5. Delete the legacy component and its CSS, and tick the task in the plan.
