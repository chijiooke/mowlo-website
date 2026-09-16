import { MeshPhysicalMaterial, type MeshPhysicalMaterialParameters, type Texture } from 'three'
import { finishProps, type Finish } from './materials'

/** A shared uniform: 0 is blank stock, 1 is fully printed. */
export interface PrintUniform {
  value: number
}

/** A finish partway between two presets. Mutate it; the object reads it every frame. */
export interface FinishBlend {
  a: Finish
  b: Finish
  t: number
}

const INK_HEAD = 'vec3(0.96, 0.65, 0.14)' // amber, the print head's line

/**
 * Replaces three's map lookup with a print pass: the blank and the printed
 * face, wiped diagonally by uPrint, with an amber line riding the wipe edge.
 * Lighting, finishes and tone mapping are untouched.
 */
const PRINT_MAP_FRAGMENT = /* glsl */ `
float printBand = 0.0;
#ifdef USE_MAP
  float printHead = uPrint * 1.2 - 0.1;
  float printEdge = vMapUv.x * 0.8 + (1.0 - vMapUv.y) * 0.2;
  float inked = 1.0 - smoothstep(printHead - 0.04, printHead + 0.04, printEdge);
  vec4 sampledDiffuseColor = mix(texture2D(uBlank, vMapUv), texture2D(map, vMapUv), inked);
  diffuseColor *= sampledDiffuseColor;
  printBand = (1.0 - smoothstep(0.0, 0.035, abs(printEdge - printHead)))
    * step(0.001, uPrint) * step(uPrint, 0.999);
  diffuseColor.rgb = mix(diffuseColor.rgb, ${INK_HEAD}, printBand * 0.8);
#endif
`

/**
 * A printed face. `blank` and `printed` must share UVs; `print` is shared, so
 * a scene can drive several faces from one value. `params` adds anything the
 * finish doesn't set — a bump map, a side.
 */
export function createPrintMaterial(
  blank: Texture,
  printed: Texture,
  print: PrintUniform,
  finish: Finish = 'matte',
  params: MeshPhysicalMaterialParameters = {},
) {
  const material = new MeshPhysicalMaterial({ ...params, map: printed })
  blendFinish(material, finish, finish, 0)

  material.onBeforeCompile = shader => {
    shader.uniforms.uBlank = { value: blank }
    shader.uniforms.uPrint = print
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D uBlank;\nuniform float uPrint;')
      .replace('#include <map_fragment>', PRINT_MAP_FRAGMENT)
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>\ntotalEmissiveRadiance += ${INK_HEAD} * printBand * 0.9;`,
      )
  }
  // Every print material compiles to the same program.
  material.customProgramCacheKey = () => 'mowlo-print-pass'
  return material
}

const BLENDED = ['roughness', 'metalness', 'envMapIntensity', 'clearcoat', 'clearcoatRoughness', 'sheen', 'sheenRoughness', 'iridescence'] as const

/**
 * Clearcoat, sheen and iridescence switch shader features on when they leave
 * zero, which recompiles the program — a visible hitch mid-scroll. Holding
 * them just above zero keeps one program for every finish.
 */
const FLOOR: Partial<Record<(typeof BLENDED)[number], number>> = { clearcoat: 0.001, sheen: 0.001, iridescence: 0.001 }

const presets = new Map<Finish, ReturnType<typeof finishProps>>()
const preset = (f: Finish) => {
  let p = presets.get(f)
  if (!p) presets.set(f, (p = finishProps(f)))
  return p
}

/** Sets a material partway between two finishes. Cheap enough to call every frame. */
export function blendFinish(material: MeshPhysicalMaterial, a: Finish, b: Finish, t: number) {
  const pa = preset(a)
  const pb = preset(b)
  for (const key of BLENDED) {
    const va = (pa[key] as number | undefined) ?? 0
    const vb = (pb[key] as number | undefined) ?? 0
    material[key] = Math.max(va + (vb - va) * t, FLOOR[key] ?? 0)
  }
  material.iridescenceThicknessRange = (t < 0.5 ? pa : pb).iridescenceThicknessRange ?? [100, 400]
}
