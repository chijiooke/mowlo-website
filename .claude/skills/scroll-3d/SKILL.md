---
name: scroll-3d
description: How to build scroll-driven three.js / React Three Fiber scenes on the Mowlo site — single-canvas View architecture, binding scroll progress to 3D, procedural print objects, physical materials, brand textures, mobile budgets, fallbacks and disposal. Use whenever adding or changing anything under src/components/three, or any section with 3D or Apple-style scroll-scrubbed objects.
---

# Scroll-driven 3D on Mowlo

Stack: `three@0.186`, `@react-three/fiber@9`, `@react-three/drei@10`, `framer-motion` (scroll progress), `lenis` (smooth wheel). **No GSAP** on the site.

Also load `three-best-practices` and `r3f-best-practices` (installed from emalorenzo/three-agent-skills) for general Three.js and R3F performance rules: disposal, render loop, draw calls, asset compression, mobile profiles. Where they conflict with this skill (e.g. their CDN import maps, or fetching Draco decoders from a CDN), this skill wins: the site bundles three via npm and makes no third-party runtime fetches.

## 1. Architecture: one canvas, many views

- There is **exactly one** `<Canvas>` on the page: `components/three/Stage.tsx`, fixed full-viewport, `pointer-events: none`, rendering `<View.Port />`.
- A section never creates its own `<Canvas>`. It renders `<SceneView>` (a DOM box that drei `<View>` tracks) and puts its scene inside.
- Why: iOS Safari caps live WebGL contexts and each costs ~50–150MB. One context also means one shared environment map and one render loop.
- `Stage` is loaded with `next/dynamic(..., { ssr: false })` by `ImmersiveRoot`, which wraps the page once and provides `useQuality()`.
- Every scene inside a view brings its own `<PerspectiveCamera makeDefault />` (so the aspect follows the view box) and `<StudioLighting />`.

### Layering (read this or your copy disappears)
- The canvas is `position: fixed; z-index: 5`, above everything that isn't positioned with a higher z-index.
- Chapter grounds and patterns paint **below** it (that's what you want).
- Copy, buttons and anything that must sit **in front of** a 3D object: `relative z-10`.
- A ghost word that sits **behind** an object: `relative z-0` (or no z-index).
- Never give a `Chapter` or other section wrapper a z-index or `transform`. That creates a stacking context, and everything inside it (copy included) lands under the canvas.
- **`position: sticky` always creates a stacking context.** Inside a pinned frame, `z-10` on the copy does nothing against the canvas. Use **two sticky layers** in the same track: a scene layer (no z-index: ghost type + `SceneView`) and a copy layer (`sticky top-0 z-10 -mt-[100svh] h-svh pointer-events-none`, with `pointer-events` restored on the controls). `components/sections/hero/Hero.tsx` is the reference.

```tsx
<Chapter ref={trackRef} className="h-[300vh]">
  <div className="sticky top-0 h-svh">
    <SceneView className="absolute inset-0" poster="/posters/hero-0.avif" posterAlt="">
      <HeroScene progress={progress} />
    </SceneView>
    {/* copy lives in the DOM, above the view, never inside the canvas */}
  </div>
</Chapter>
```

## 2. Binding scroll to 3D

1. Pin with CSS: a tall track (`h-[300vh]`) containing a `sticky top-0 h-svh` frame.
2. Get progress with `useSectionProgress(trackRef)`, which returns a framer `MotionValue<number>` in 0–1.
3. Inside the scene, **read it in `useFrame`** and damp toward it:

```tsx
useFrame((_, dt) => {
  const p = progress.get()
  const k = remap(p, 0.0, 0.3)              // local 0–1 for a beat
  easing.damp(group.current.rotation, 'y', lerp(-0.6, 0, k), 0.25, dt)
  material.uniforms.uPrint.value = k
})
```

Rules:
- **Never `setState` from scroll or `useFrame`.** Mutate refs, uniforms and material props.
- Damp everything (`maath/easing.damp`, `damp3`, `dampE`). Raw progress looks jittery with wheel steps.
- Express the timeline as **named beats with ranges** (`BEATS = { print: [0, .3], flip: [.3, .6], … }`) in one constant at the top of the scene file, mirroring the plan's timeline table.
- Keep the camera fixed on mobile; move objects instead. Camera moves on small screens feel like motion sickness.

## 3. Procedural print objects (`components/three/objects`)

Model real products at real proportions (1 unit = 25mm):

| Object | Geometry | Notes |
|---|---|---|
| Business card | `RoundedBox` 3.4 × 2.2 × 0.02, radius 0.06 | Front/back textures on faces 4/5 |
| Sticker | `ExtrudeGeometry` from a circle/die-cut `Shape`, depth 0.01 | Corner peel = vertex bend in a tiny shader or a second mesh |
| A5 flyer | `PlaneGeometry` 5.9 × 8.4 with 20×20 segments | Bend in the vertex shader (`uBend`) |
| Paper bag | Box body + two `TubeGeometry` handles | Kraft or white base, brand print on the front face |

- Keep every object a component with the props `{ brand, finish, print }`, where `print` is a 0–1 value or MotionValue.
- No GLB unless a procedural version looks cheap. If a GLB is needed: < 1MB, in `public/models`, loaded with `useGLTF(url, false, false)` (no Draco/meshopt decoder fetch) and preloaded.
- **The tee is generated, not downloaded.** `scripts/tee/build-tee.mjs` builds it the way a garment is made: front and back panels, sleeves lofted from the armholes, a rib neckband swept round the neck edge, turned hems with double-needle stitching. It writes `public/models/tee.glb` (~0.9MB) with baked occlusion and a `_MASK` attribute (inner wall, rib, stitch, how freely the cloth hangs). Change the shape there, never by hand-editing the GLB. The earlier signed-distance-field version looked blobby next to real garment references; don't go back to it.
  - **Folds come from a cloth simulation, not by hand.** The panels are welded into one sheet and draped under gravity over an invisible mannequin (position-based dynamics: stretch and bend constraints, body collision with friction). Only the neck edge is pinned; pinning the shoulder seams too left a hard ridge. The knit gets more give across than along (`SIM.weft`), which is what buckles into vertical folds. Hand-placed folds read as fake; don't add them back.
  - **The neckband is a ring round the opening.** Its width runs from the neck edge *inward*, toward the middle of the hole, square to the edge and lying in the cloth's surface (the direction is turned to face the hole's centroid — aiming it straight at the centroid collapses at the back of the neck and knots the band there). Taken square to the edge with a carried sign, it fans into a flat brim at the sides and fins above the back. The neckline must also meet the shoulder seam smoothly (`tops` gets nine easing passes); a kink there becomes a tab of band sticking out at each shoulder.
  - **Shoulders must rest easy.** The pattern's shoulder line (`ridgeY`) drops ~0.42 from the neck edge and keeps falling through the shoulder point into the sleeve; a curve that levels off there (a smoothstep) squares the shoulders into pads. The mannequin follows the same line all the way out (never clamped flat), sits just under it (`SHOULDER_REST`), and rounds its shoulders generously, or the cloth tents over a corner. Sleeves fall ~43° from vertical so their top edge continues the shoulder. Reference: a boxy drop-shoulder flat-lay, wide crew neck (`NECK_HALF` 0.44).
  - **The shoulder seam must weld.** Front and back top rows outside the neck must be identical points, so the neck-depth easing runs only inside the neck opening; leaking it onto the seam split it into flaps. The neckband rounds the resulting corner itself (`BAND_ROUND` passes on its loop) and is sewn *over* the edge (`OVERLAP`), which keeps the cut edge covered.
  - **After the drape:** a height-weighted Taubin pass (`relax`) softens shoulder creases without touching the lower folds; `fixWinding` turns round any face wound inside-out against its neighbours (each one renders as a pinhole); shared seam points take one averaged normal so inner walls can't poke through at the joins.
 (a uniform grid with Möller–Trumbore). Hits nearer than the cloth's own thickness are ignored, or every hem gets a black outline, and inner walls keep a floor so sleeves aren't black inside.
- **Its material is a garment shader** (`createGarmentMaterial` in `lib/three/fabric.ts`): a white cotton knit, a rib texture on the neckband, darker stitch lines, the small chest logo printed in the shader (so it folds and moves with the cloth), neutral shadows, a view-fixed softbox term that shades folds by which way they face (the site's shared lights are too frontal for white cloth), and cloth motion. Cloth trails and ripples from the tee's own velocity, weighted by hang, along a direction all layers share so the shell never splits.
- Judge the tee on the grey bench (`bg=grey`, with its contact shadow) against real mockups, and in the hero at p≈0.80.
- **Judge 3D by rendering it, not by reading code.** `/dev/tee` is a dev-only bench that poses the tee from the query string. `scripts/tee/shoot.sh <out-dir>` screenshots it headlessly from five angles (it works even when the Chrome automation tab is hidden). Look at every angle after each change: the defects that mattered (torn hem, floating collar, shoulder pads, crumpled-paper texture, tiling seams) were all invisible in code.

## 4. Materials

- Use `lib/three/materials.ts`. It ports `materialPresets` from `mowlo-web-app/src/tokens/index.ts`, so a "holographic" card on the site matches the app. **Don't invent finish values in a scene.**
- Always `MeshPhysicalMaterial` for printed faces; `MeshStandardMaterial` for edges (paper core `#EDE9E2`, roughness 0.95).
- Lighting recipe: `Environment` from `RoomEnvironment` (PMREM), one warm key `DirectionalLight` (`#FFF6E8`, 3), a cool fill (`#6688CC`, 0.9), `toneMapping: ACESFilmic`, exposure ~1.2. Finishes only read when light *moves across them*, so rotate the object or the env slightly with scroll.
- Holographic/iridescent needs the env map; test it on ink **and** cream grounds.

## 5. Brand textures

- `lib/three/brandTexture.ts` draws faces on a canvas from `{ name, colour, mark }` and returns a `CanvasTexture` (`colorSpace = SRGBColorSpace`, `anisotropy = max`).
- Sizes: 1024×662 card (2048 on DPR ≥ 2 desktop), 1024 sticker, 1024×1448 flyer. Mobile halves them.
- Cache by key (`${face}-${name}-${colour}`). Regenerate on name input **debounced 150ms**, updating `texture.needsUpdate = true`, never a new texture per keystroke.
- Print-pass effect: a blank texture and a branded texture in one material, mixed by a `uPrint` uniform with a soft diagonal wipe edge (`smoothstep` on `uv.x + uv.y * 0.3`). Inject via `onBeforeCompile`, keeping the physical lighting.

## 6. Budgets and quality tiers

The tier is picked once by `lib/three/quality.ts` (`detectTier`) and read with `useQuality()`. **Don't use drei's `useDetectGPU`**: it fetches benchmark data from a third-party CDN at runtime.

| Tier | Who | DPR | Env res | Shadows | Objects |
|---|---|---|---|---|---|
| `high` | WebGL2, ≥ 4 cores, ≥ 4GB, width ≥ 1024 | `[1, 2]` | 256 | `ContactShadows` frames={1} | all |
| `mid` | WebGL2, otherwise capable, narrower or smaller device | `[1, 1.5]` | 128 | blob shadow texture | max 3 per view |
| `poster` | no WebGL2, ≤ 2 cores or ≤ 2GB, `prefers-reduced-motion`, save-data | — | — | — | posters only |

- `frameloop="demand"` on the Canvas. `ViewSlot` keeps calling `invalidate()` while its box is on screen (IntersectionObserver) and stops when it leaves, so an idle page doesn't burn battery.
- Views outside the viewport don't render (drei `View` scissors them), and no frames are requested when no view is visible.
- Target 60fps desktop, ≥ 50fps on a mid Android. Check with `<Perf />` locally only (never shipped).

## 7. Fallbacks and SSR

- `SceneView` always renders its `poster` (`next/image`, `priority` for the hero) **underneath** the view. The canvas fades in over it after its first frame. That makes the LCP a normal image, and a WebGL failure invisible.
- Posters are exported from the real scene (`gl.domElement.toDataURL()` at key beats, via a dev-only route), saved as AVIF in `public/posters`.
- Copy, CTAs and meaning never live in the canvas. Screen readers get the DOM; the canvas is `aria-hidden`.

## 8. Cleanup

- R3F disposes geometries/materials declared in JSX on unmount. You must dispose anything created imperatively: `CanvasTexture`, render targets, `PMREMGenerator` outputs.
- Remove window listeners in effect cleanups; prefer R3F's `events` and `pointer` state over new listeners.

## 9. Mobile checklist

- [ ] Tier `mid` or `poster` chosen correctly at 390px on a mid Android.
- [ ] Pin lengths within the motion-system budget; every beat shows visible change within its first 10%, so the page never feels "stuck".
- [ ] One piece on stage at a time. The founder rejected scattered clusters; a group shot is only for a finale.
- [ ] Printed stock has visible thickness: depth, bevels, a bend or a peel, lit by the rim lights in `StudioLighting`.
- [ ] No pointer-tilt code paths run on touch (`matchMedia('(hover: hover)')`).
- [ ] Canvas doesn't block native scroll (`pointer-events: none` except explicit drag targets, which use `touch-action: pan-y`).
- [ ] Copy sits above or below the object on mobile, never overlapping it.
- [ ] Rotating the phone (orientation change) resizes without a black frame.
