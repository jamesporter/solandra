/**
 * Regenerate the sample images in ./samples (and their markdown index).
 *
 * Run this whenever a change is meant to alter what the sketches draw, then
 * commit the result. `pnpm check:samples` compares fresh renders against
 * what is committed.
 */
import fs from "node:fs"
import path from "node:path"

import { assertPinnedFontsInUse } from "./scripts/fonts"
import { renderAllSamples, samplesMarkdown } from "./scripts/renderSamples"

const outputDirectory = path.resolve("./samples")

function main() {
  // A different typeface is not something the image comparison should be
  // asked to judge; say so plainly instead.
  assertPinnedFontsInUse()

  const samples = renderAllSamples(outputDirectory, ({ name }) =>
    console.log(`Done: ${name}`)
  )

  fs.writeFileSync(path.join(outputDirectory, "samples.md"), samplesMarkdown())

  // Sketches get renamed and deleted; don't leave orphaned images behind.
  const expected = new Set([...samples.map((s) => s.fileName), "samples.md"])
  for (const file of fs.readdirSync(outputDirectory)) {
    if (!expected.has(file)) {
      fs.rmSync(path.join(outputDirectory, file))
      console.log(`Removed stale sample: ${file}`)
    }
  }

  console.log(`\nWrote ${samples.length} samples to ${outputDirectory}`)
}

try {
  main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
