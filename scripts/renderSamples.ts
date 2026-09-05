import { createCanvas } from "canvas"
import fs from "node:fs"
import path from "node:path"

import sketches from "../src/examples/sketches"
import { SCanvas } from "../src/lib"

export const sampleWidth = 900
export const sampleHeight = 600

/** Seed and time are fixed so a sketch renders the same picture every time. */
const seed = 42
const time = 0

/** Sketch names become file names, so strip anything awkward. */
export const fileNameFor = (name: string) =>
  `${name.replaceAll(/[^A-z0-9]/g, "-")}.png`

export type Sample = { name: string; fileName: string }

/** Every sketch that gets a sample image, in the order they are documented. */
export function listSamples(): Sample[] {
  return Object.values(sketches).flatMap(({ sketches }) =>
    sketches.map(({ name }) => ({ name, fileName: fileNameFor(name) }))
  )
}

/** Render one sketch by name to a PNG buffer. */
export function renderSample(name: string): Buffer {
  const entry = Object.values(sketches)
    .flatMap(({ sketches }) => sketches)
    .find((s) => s.name === name)

  if (!entry) throw new Error(`No sketch called "${name}"`)

  const canvas = createCanvas(sampleWidth, sampleHeight)
  const ctx = canvas.getContext("2d")

  const sC = new SCanvas(
    // supports all the basics but not fully as per modern HTML canvas
    ctx as unknown as CanvasRenderingContext2D,
    { width: sampleWidth, height: sampleHeight },
    seed,
    time
  )

  entry.sketch(sC)

  return canvas.toBuffer("image/png")
}

/**
 * Render every sketch into `directory` (created if needed). Synchronous
 * writes, so everything is on disk by the time this returns.
 */
export function renderAllSamples(
  directory: string,
  onProgress?: (sample: Sample, index: number, total: number) => void
): Sample[] {
  fs.mkdirSync(directory, { recursive: true })

  const samples = listSamples()
  samples.forEach((sample, index) => {
    fs.writeFileSync(
      path.join(directory, sample.fileName),
      renderSample(sample.name)
    )
    onProgress?.(sample, index, samples.length)
  })

  return samples
}

/** The markdown index that accompanies the images. */
export function samplesMarkdown(): string {
  let md = "# Sketches\n\n"

  Object.entries(sketches).forEach(([category, { sketches }]) => {
    md += `## ${category}\n\n`

    sketches.forEach(({ name }) => {
      md += `### ${name}\n\n`
      md += `![${name}](./${fileNameFor(name)})\n\n`
    })
  })

  // Trim the final blank line so the output stays oxfmt-clean
  return md.replace(/\n+$/, "\n")
}
