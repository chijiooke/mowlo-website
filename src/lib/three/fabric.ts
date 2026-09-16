import { CanvasTexture, Color, MeshPhysicalMaterial, NoColorSpace, RepeatWrapping, Vector2, Vector3, type Texture } from 'three'
import type { PrintUniform } from './printMaterial'

/**
 * Cotton jersey for the tee, and the garment shader that reads the tee model's
 * baked mask (scripts/tee/build-tee.mjs):
 *   r  inner wall        g  rib neckband
 *   b  stitch lines      a  how freely the cloth hangs
 * It adds rib texture to the neckband, stitching at the hems, a small chest
 * print that follows every fold, and cloth that trails and ripples as the tee
 * moves.
 */

/** Garment units one knit tile covers. */
export const KNIT_SPAN = 0.03
/** Neckband units (arc length) per rib. */
const RIB_SPAN = 0.022

/** Where the chest mark sits, in model units: wearer's left chest. */
export const CHEST_MARK = { x: 0.42, y: 0.55, width: 0.5, height: 0.25 }

const KNIT_TILE = 512
const COLUMNS = 32
const ROWS = 40

let knit: CanvasTexture | null = null

/** Jersey knit: columns of V-shaped loops. */
export function knitNormalMap(): CanvasTexture {
  if (knit) return knit
  const size = KNIT_TILE
  const cw = size / COLUMNS
  const ch = size / ROWS
  const height = new Float32Array(size * size)
  const jitter = (c: number, r: number) => {
    let h = Math.imul(c * 73856093 ^ r * 19349663, 83492791)
    h ^= h >>> 13
    return ((h >>> 0) % 1000) / 1000
  }
  const leg = (d: number) => Math.max(0, 1 - (d / 0.2) ** 2)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const col = Math.floor(x / cw)
      const row = Math.floor(y / ch)
      const cx = x / cw - col
      const cy = y / ch - row
      // Two yarn legs leaning in to meet at the bottom of the loop.
      let h = Math.max(leg(Math.abs(cx - 0.08 - 0.42 * cy)), leg(Math.abs(cx - 0.92 + 0.42 * cy)))
      // The twist of the yarn, and no two loops quite alike.
      h *= 0.82 + 0.18 * Math.sin((cy * 2 + cx) * Math.PI * 3)
      h *= 0.88 + 0.12 * jitter(col, row)
      height[y * size + x] = h
    }
  }
  knit = normalTexture(size, size, (x, y) => height[((y + size) % size) * size + ((x + size) % size)], 2.2)
  knit.repeat.set(1 / KNIT_SPAN, 1 / KNIT_SPAN)
  return knit
}

let rib: CanvasTexture | null = null

/** Rib knit for the neckband: raised cords running across the band. */
function ribNormalMap(): CanvasTexture {
  if (rib) return rib
  const w = 64
  rib = normalTexture(w, 8, x => Math.pow(0.5 + 0.5 * Math.cos((((x + w) % w) / 16) * Math.PI * 2), 0.7), 3)
  return rib
}

/** A tangent-space normal map from a height function, by central differences. */
function normalTexture(w: number, h: number, height: (x: number, y: number) => number, strength: number) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(w, h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (height(x + 1, y) - height(x - 1, y)) * strength
      // Canvas rows run down; texture v runs up.
      const dy = (height(x, y + 1) - height(x, y - 1)) * strength
      const len = Math.hypot(dx, dy, 1)
      const i = (y * w + x) * 4
      img.data[i] = ((-dx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = NoColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  return texture
}

export interface GarmentUniforms {
  uTime: { value: number }
  /** Model-space offset the free-hanging cloth trails by. */
  uWind: { value: Vector3 }
  /** How much the cloth ripples. */
  uFlutter: { value: number }
  uLogo: { value: Texture }
  uRib: { value: Texture }
  uPrint: PrintUniform
}

const f = (n: number) => n.toFixed(4)

/**
 * The tee's material. Expects the tee model's attributes: baked occlusion in
 * the vertex colours, `_mask`, and garment UVs (planar x/y on the body,
 * arc length round the neckband).
 */
export function createGarmentMaterial({ colour, logo, print }: { colour: string; logo: Texture; print: PrintUniform }) {
  const uniforms: GarmentUniforms = {
    uTime: { value: 0 },
    uWind: { value: new Vector3() },
    uFlutter: { value: 0.012 },
    uLogo: { value: logo },
    uRib: { value: ribNormalMap() },
    uPrint: print,
  }

  const material = new MeshPhysicalMaterial({
    color: colour,
    roughness: 0.9,
    metalness: 0,
    sheen: 0.8,
    sheenRoughness: 0.55,
    sheenColor: new Color('#FFFFFF'),
    normalMap: knitNormalMap(),
    normalScale: new Vector2(0.3, 0.3),
    envMapIntensity: 0.75,
    vertexColors: true,
  })
  material.defines = { ...material.defines, USE_UV: '' }

  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
attribute vec4 _mask;
uniform float uTime;
uniform vec3 uWind;
uniform float uFlutter;
varying vec4 vMask;
varying vec2 vPrintUv;
varying float vPrintFront;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
vMask = _mask;
vPrintUv = vec2((position.x - ${f(CHEST_MARK.x)}) / ${f(CHEST_MARK.width)} + 0.5, (position.y - ${f(CHEST_MARK.y)}) / ${f(CHEST_MARK.height)} + 0.5);
vPrintFront = step(0.35, normal.z) * (1.0 - _mask.r) * (1.0 - _mask.g);
// Cloth: the parts that hang free trail behind the motion and ripple with it;
// the shoulders, neckband and seams stay put. The trail varies across the
// cloth and a wave runs through it while it moves, so it flaps rather than
// shearing like a solid.
float hang = pow(_mask.a, 1.5);
float windy = length(uWind);
float ripple = sin(position.y * 5.0 + position.x * 2.0 - uTime * 4.0) * 0.6
  + sin(position.x * 7.0 + position.z * 3.0 - uTime * 2.7) * 0.4;
float flap = sin(position.x * 6.0 - uTime * 7.0 + position.y * 3.0);
float trail = 0.75 + 0.25 * sin(position.x * 3.1 + position.z * 4.0 + uTime * 1.7);
// Displaced along a direction every coincident point agrees on — outward from
// the body's axis — so the inner wall, rims and seams move as one sheet.
vec3 clothDir = normalize(vec3(position.x, 0.0, position.z) + vec3(0.0, 0.0, 0.0001));
transformed += uWind * hang * trail
  + clothDir * hang * (ripple * uFlutter + flap * windy * 0.12);`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform sampler2D uLogo;
uniform sampler2D uRib;
uniform float uPrint;
varying vec4 vMask;
varying vec2 vPrintUv;
varying float vPrintFront;
float inkAmount = 0.0;`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
{
  vec2 puv = vPrintUv;
  float inside = step(0.0, puv.x) * step(puv.x, 1.0) * step(0.0, puv.y) * step(puv.y, 1.0) * vPrintFront;
  vec4 ink = texture2D(uLogo, clamp(puv, 0.0, 1.0));
  // The print arrives top to bottom.
  float head = uPrint * 1.2 - 0.1;
  float wipe = 1.0 - smoothstep(head - 0.06, head + 0.06, 1.0 - puv.y);
  inkAmount = ink.a * inside * wipe;
  diffuseColor.rgb = mix(diffuseColor.rgb, ink.rgb, inkAmount);
  // Stitching: a touch darker where the thread sinks into the knit.
  diffuseColor.rgb *= 1.0 - vMask.b * 0.16;
}`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.6, inkAmount);`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
#ifdef USE_NORMALMAP_TANGENTSPACE
  if (vMask.g > 0.01) {
    vec3 ribN = texture2D(uRib, vec2(vUv.x / ${f(RIB_SPAN)}, vUv.y)).xyz * 2.0 - 1.0;
    ribN.xy *= 0.9;
    normal = normalize(mix(normal, normalize(tbn * ribN), vMask.g));
  }
#endif`,
      )
      .replace(
        '#include <lights_physical_fragment>',
        `#include <lights_physical_fragment>
#ifdef USE_SHEEN
  material.sheenColor *= 1.0 - inkAmount;
#endif`,
      )
  }
  // Registered separately so the fragment patches above stay readable.
  const compile = material.onBeforeCompile
  material.onBeforeCompile = (shader, renderer) => {
    compile(shader, renderer)
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <tonemapping_fragment>',
      `// Keep cotton's shadows neutral: the studio's cool fill otherwise tints white
// cloth blue. The ink keeps its colour.
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114))), 0.6 * (1.0 - inkAmount));
// Softbox: one big soft source up and left of the camera, fixed to the view so
// it holds still while the tee turns. Folds facing it lift and folds turned
// away fall off gently, which is how a white garment shows its drape in a
// studio shot. The site's shared lights are mostly frontal, and white cotton
// under frontal light reads as a flat cut-out.
float softFacing = dot(normal, normalize(vec3(-0.45, 0.55, 0.7)));
gl_FragColor.rgb *= mix(mix(0.76, 1.06, smoothstep(-0.35, 0.95, softFacing)), 1.0, inkAmount * 0.5);
#include <tonemapping_fragment>`,
    )
  }
  material.customProgramCacheKey = () => 'mowlo-garment'

  return { material, uniforms }
}
