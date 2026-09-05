/**
 * Regenerate the sample images in ./samples (and their markdown index).
 *
 * Run this whenever a change is meant to alter what the sketches draw, then
 * commit the result. `pnpm check:samples` compares fresh renders against
 * what is committed.
 */
import fs from "node:fs"
import path from "node:path"

import { useBundledFonts } from "./scripts/fonts"

const outputDirectory = path.resolve("./samples")

async function main() {
  // Before anything pulls in `canvas`, so text renders the same everywhere.
  useBundledFonts()
  const { renderAllSamples, samplesMarkdown } =
    await import("./scripts/renderSamples")

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

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
