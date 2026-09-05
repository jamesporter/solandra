/**
 * Pin the fonts used when rendering sample images.
 *
 * Text is where snapshot rendering goes wrong across machines, because
 * "sans-serif" is not a font — it is a request that each platform answers
 * differently. On a Linux CI box it means DejaVu Sans; on a Mac it means
 * Helvetica. Same sketch, different letterforms, and the images are not
 * comparable at all.
 *
 * This module makes the answer the same everywhere, in two steps:
 *
 *  1. `assets/fonts` holds the three DejaVu faces, registered with node-canvas
 *     under names nothing else can claim. `registerFont` is node-canvas's own
 *     API and works on every platform — unlike a fontconfig config, which is
 *     quietly ignored where pango is not using fontconfig (macOS, notably;
 *     this module used to do that and it did nothing there).
 *  2. `pinFonts` wraps a context so that every font declaration a sketch sets
 *     is rewritten onto one of those three faces. The platform never gets to
 *     resolve a family name, so it never gets to disagree.
 *
 * Only sample rendering uses this. Sketches in a browser resolve fonts
 * normally.
 */
import { createCanvas, registerFont } from "canvas"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))

export const fontDirectory = path.resolve(here, "../assets/fonts")

/**
 * Names to register the bundled faces under. Deliberately not the real DejaVu
 * names: if a machine happens to have DejaVu installed we still want ours, and
 * a name nothing else uses makes "did the pinning work?" answerable.
 */
export const pinnedFonts = {
  sans: "Solandra Sample Sans",
  serif: "Solandra Sample Serif",
  mono: "Solandra Sample Mono",
} as const

export type PinnedFont = keyof typeof pinnedFonts

const files: Record<PinnedFont, string> = {
  sans: "DejaVuSans.ttf",
  serif: "DejaVuSerif.ttf",
  mono: "DejaVuSansMono.ttf",
}

/** Families a sketch might ask for, and the face each should end up as. */
const serifNames = new Set([
  "serif",
  "times",
  "times new roman",
  "georgia",
  "garamond",
  "dejavu serif",
])

const monoNames = new Set([
  "monospace",
  "mono",
  "courier",
  "courier new",
  "menlo",
  "consolas",
  "dejavu sans mono",
])

let registered = false

/**
 * Register the bundled faces with node-canvas. Must happen before any canvas
 * is created. Safe to call more than once.
 */
export function registerBundledFonts() {
  if (registered) return

  for (const [kind, file] of Object.entries(files)) {
    const fontPath = path.join(fontDirectory, file)
    if (!fs.existsSync(fontPath)) {
      throw new Error(
        `Bundled font is missing: ${fontPath}. Sample images cannot be rendered reproducibly without it.`
      )
    }
    registerFont(fontPath, { family: pinnedFonts[kind as PinnedFont] })
  }

  registered = true
}

/** Strip the quotes and whitespace CSS allows around a family name. */
const normaliseFamily = (family: string) =>
  family
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .toLowerCase()

/**
 * Which bundled face a CSS font family list should render as. The first named
 * family wins, the same way a browser would use the first one it has — except
 * that here we always have all three.
 */
export function faceFor(familyList: string): PinnedFont {
  for (const family of familyList.split(",").map(normaliseFamily)) {
    if (serifNames.has(family)) return "serif"
    if (monoNames.has(family)) return "mono"
  }
  return "sans"
}

/**
 * Rewrite a CSS font shorthand so its family is one of the bundled faces,
 * keeping everything before the family (style, variant, weight, size) as it
 * was. Returns the declaration unchanged if it cannot be parsed, so an
 * unexpected shape fails the way it would have anyway rather than silently
 * becoming something else.
 */
export function pinFontSpec(spec: string): string {
  const match = /^(.*?\d*\.?\d+(?:px|pt|em|rem|%)\s+)(.+)$/.exec(spec)
  if (!match) return spec

  const [, prefix, familyList] = match
  return `${prefix}"${pinnedFonts[faceFor(familyList)]}"`
}

/**
 * Wrap a context so every font it is given is rewritten onto a bundled face.
 * Everything else passes straight through.
 */
export function pinFonts(ctx: CanvasRenderingContext2D) {
  registerBundledFonts()

  return new Proxy(ctx, {
    get(target, property) {
      const value = target[property as keyof CanvasRenderingContext2D]
      // native methods have to keep their real receiver, not the proxy
      return typeof value === "function" ? value.bind(target) : value
    },
    set(target, property, value) {
      const pinned =
        property === "font" && typeof value === "string"
          ? pinFontSpec(value)
          : value
      // assigning through the proxy would hand node-canvas's native setters
      // the proxy as `this`, which they reject
      ;(target as unknown as Record<string | symbol, unknown>)[property] =
        pinned
      return true
    },
  })
}

/**
 * What each bundled face measures, as a fingerprint of the font file itself.
 *
 * Hard coded on purpose. If a platform ignores `registerFont` and substitutes
 * its own font, every text sample silently becomes a picture of different
 * letterforms — which is not something an image comparison should be asked to
 * judge, and not something it should quietly tolerate either. Checking here
 * turns that into one clear message instead of a page of mystery diffs.
 */
const fingerprints: Record<PinnedFont, number> = {
  sans: 175.76,
  serif: 184.77,
  mono: 216.74,
}

/**
 * Throw unless this machine really is rendering with the bundled faces.
 * Cheap, so worth doing before any sample work.
 */
export function assertPinnedFontsInUse() {
  registerBundledFonts()

  const ctx = createCanvas(200, 100).getContext("2d")
  const wrong: string[] = []

  for (const [kind, family] of Object.entries(pinnedFonts)) {
    ctx.font = `40px "${family}"`
    const width = ctx.measureText("Hi there!").width
    const expected = fingerprints[kind as PinnedFont]
    // A different rasterisation of the same file moves this by a rounding
    // error; a different typeface moves it by tens of pixels.
    if (Math.abs(width - expected) > 1) {
      wrong.push(
        `  ${family}: measured ${width.toFixed(2)}, expected ~${expected}`
      )
    }
  }

  if (wrong.length > 0) {
    throw new Error(
      `This machine is not rendering with the bundled fonts, so sample images cannot be compared:\n${wrong.join(
        "\n"
      )}\n\nnode-canvas's registerFont did not take effect (see scripts/fonts.ts). Sample images render text with the faces in assets/fonts; without them every text sample is a picture of different letterforms.`
    )
  }
}
