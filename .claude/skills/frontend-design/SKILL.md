---
name: frontend-design
description: Use when building or refining UI for this website — new pages, sections, components, layouts, or visual polish. Covers the project's stack conventions (Next.js App Router, Tailwind 4, Framer Motion, Iconify) and a design checklist for producing consistent, responsive, accessible frontend work.
---

# Frontend Design

Guidance for building and refining UI in the mowlo-website project.

## Stack conventions

- **Next.js 16 App Router** — components live under `src/app` (routes) and `src/components` (reusable UI). Default to Server Components; add `"use client"` only when a component needs state, effects, or browser APIs.
- **React 19** — use function components and hooks. Prefer composition over prop drilling.
- **Tailwind CSS 4** — style with utility classes. Global tokens and theme live in `src/app/globals.css` (`@theme` / CSS variables). Reuse existing custom colors, spacing, and fonts rather than hardcoding new hex values. Use `clsx` for conditional classes.
- **Framer Motion** (`framer-motion`) — for entrance animations, scroll reveals, and micro-interactions. Keep motion subtle and respect `prefers-reduced-motion`.
- **Iconify** (`@iconify/react`) — use `<Icon icon="..." />` for icons instead of inline SVG or new icon dependencies.
- **Forms** — use Formik + Yup (already in the project) for validated forms.

## Design checklist

Before finishing any UI work, verify:

1. **Consistency** — matches existing components' spacing scale, color tokens, typography, and border radii. Read a nearby component first and mirror its idioms.
2. **Responsive** — works from mobile (`base`) up through `sm md lg xl`. No horizontal overflow. Test that text, images, and grids reflow.
3. **Accessibility** — semantic HTML (`button`, `nav`, `header`, headings in order), `alt` text on images, labels on inputs, sufficient color contrast, visible focus states, and keyboard operability.
4. **Dark/light** — if the site supports theming, style both modes using the project's tokens.
5. **Performance** — use `next/image` for images, lazy-load below-the-fold content, avoid unnecessary client components.
6. **Polish** — consistent hover/active/disabled states, smooth transitions, aligned optical spacing, and no layout shift.

## Workflow

1. Locate similar existing components in `src/components` and reuse their patterns and tokens.
2. Build with Tailwind utilities; only add global CSS when a token or primitive is genuinely shared.
3. Keep components small and composable; extract repeated markup.
4. Add motion last, and keep it purposeful.
5. When possible, run the dev server (`npm run dev`) and check the result at multiple viewport widths.
