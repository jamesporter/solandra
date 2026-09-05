/**
 * Snapshot test for the sample images: renders every sketch and compares it
 * against the version committed in ./samples.
 *
 * Renders are not reproducible byte for byte across machines (node-canvas
 * draws through cairo/pango, whose versions, fonts and rounding all vary), so
 * this compares them perceptually and passes when they are similar enough.
 * See ./scripts/imageDiff.ts for how that comparison works.
 *
 * Usage:
 *   pnpm check:samples
 *   pnpm check:samples --threshold 0.995   # stricter
 *   pnpm check:samples --diff-output ./out # write diff images for failures
 *   pnpm check:samples --filter Bokeh      # only samples matching a substring
 *   pnpm check:samples --color-tolerance 0.05  # stricter per pixel
 *   pnpm check:samples --shift-tolerance 0     # no allowance for shifted edges
 *   pnpm check:samples --structure-radius 0    # per pixel only
 *
 * A few samples are rendered but not compared; see `unverifiedSamples` in
 * ./scripts/renderSamples.ts. Naming one with --filter compares it anyway.
 */
import fs from "node:fs"
import path from "node:path"

import { assertPinnedFontsInUse } from "./scripts/fonts"
import {
  compareImages,
  defaultCompareOptions,
  type CompareResult,
} from "./scripts/imageDiff"
import { decodePng, readPng, writePng } from "./scripts/png"
import {
  listSamples,
  renderSample,
  samplesMarkdown,
  unverifiedSamples,
} from "./scripts/renderSamples"

const args = process.argv.slice(2)

const flag = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? undefined : args[index + 1]
}

const numericFlag = (name: string, fallback: number, max: number): number => {
  const given = flag(name)
  const value = given === undefined ? fallback : Number(given)
  if (!Number.isFinite(value) || value < 0 || value > max) {
    console.error(`Invalid --${name}: ${given} (expected 0 to ${max})`)
    process.exit(2)
  }
  return value
}

const threshold = numericFlag("threshold", defaultCompareOptions.threshold, 1)
const colorTolerance = numericFlag(
  "color-tolerance",
  defaultCompareOptions.colorTolerance,
  1
)
const shiftTolerance = numericFlag(
  "shift-tolerance",
  defaultCompareOptions.shiftTolerance,
  16
)
const structureRadius = numericFlag(
  "structure-radius",
  defaultCompareOptions.structureRadius,
  64
)
const structureTolerance = numericFlag(
  "structure-tolerance",
  defaultCompareOptions.structureTolerance,
  1
)
const filter = flag("filter")
const diffOutput = flag("diff-output")

const samplesDirectory = path.resolve("./samples")

type Failure = { name: string; fileName: string; reason: string }

const percent = (value: number) => `${(value * 100).toFixed(3)}%`

async function main() {
  // A different typeface is not something the image comparison should be
  // asked to judge; say so plainly instead.
  assertPinnedFontsInUse()

  const all = listSamples()

  // Naming a sample explicitly means you want it compared, skip list or not.
  const samples = filter
    ? all.filter((s) => s.name.toLowerCase().includes(filter.toLowerCase()))
    : all.filter((s) => !(s.name in unverifiedSamples))

  if (samples.length === 0) {
    console.error(filter ? `No samples match "${filter}"` : "No samples found")
    process.exit(2)
  }

  // A skip list that has drifted away from the sketches is worse than none.
  const unknown = Object.keys(unverifiedSamples).filter(
    (name) => !all.some((s) => s.name === name)
  )
  if (unknown.length > 0) {
    console.error(
      `Not compared, but no sketch renders them: ${unknown.join(", ")}\nRemove them from unverifiedSamples in scripts/renderSamples.ts.`
    )
    process.exit(2)
  }

  if (diffOutput) fs.mkdirSync(diffOutput, { recursive: true })

  const failures: Failure[] = []
  const results: { name: string; result: CompareResult }[] = []

  for (const { name, fileName } of samples) {
    const committedPath = path.join(samplesDirectory, fileName)

    if (!fs.existsSync(committedPath)) {
      failures.push({
        name,
        fileName,
        reason: "no committed image (run `pnpm build:samples`)",
      })
      continue
    }

    const [expected, actual] = await Promise.all([
      readPng(committedPath),
      decodePng(renderSample(name)),
    ])

    let result: CompareResult
    const diff = diffOutput
      ? new Uint8ClampedArray(expected.width * expected.height * 4)
      : undefined

    try {
      result = compareImages(
        expected,
        actual,
        {
          threshold,
          colorTolerance,
          shiftTolerance,
          structureRadius,
          structureTolerance,
        },
        diff
      )
    } catch (error) {
      failures.push({
        name,
        fileName,
        reason: error instanceof Error ? error.message : String(error),
      })
      continue
    }

    results.push({ name, result })

    if (result.passed) {
      // Only worth a line each when something moved at all.
      if (result.changedPixels > 0) {
        console.log(`  ok   ${name} (${percent(result.similarity)})`)
      }
      continue
    }

    if (diff && diffOutput) {
      const diffPath = path.join(diffOutput, fileName)
      writePng(diffPath, {
        width: expected.width,
        height: expected.height,
        data: diff,
      })
      writePng(path.join(diffOutput, `actual-${fileName}`), actual)
      console.log(`  wrote ${diffPath}`)
    }

    failures.push({
      name,
      fileName,
      reason: `${percent(result.similarity)} similar (need ${percent(
        threshold
      )}); ${result.significantPixels} of ${
        result.totalPixels
      } pixels differ, worst by ${percent(result.maxDelta)}`,
    })
  }

  // Images nothing renders any more are just as wrong as missing ones. Only
  // meaningful over the whole set, so skipped when checking a subset.
  const known = new Set([...listSamples().map((s) => s.fileName), "samples.md"])
  const stale = filter
    ? []
    : fs.readdirSync(samplesDirectory).filter((file) => !known.has(file))

  const markdownPath = path.join(samplesDirectory, "samples.md")
  const markdownStale =
    !filter &&
    (!fs.existsSync(markdownPath) ||
      fs.readFileSync(markdownPath, "utf8") !== samplesMarkdown())

  const worst = [...results].sort(
    (a, b) => a.result.similarity - b.result.similarity
  )[0]

  const skipped = filter
    ? []
    : Object.keys(unverifiedSamples).filter((name) =>
        all.some((s) => s.name === name)
      )

  for (const name of skipped) {
    console.log(`  not compared: ${name} — ${unverifiedSamples[name]}`)
  }

  console.log(
    `\nChecked ${samples.length} samples against ${samplesDirectory}` +
      (worst
        ? `\nLowest similarity: ${worst.name} at ${percent(
            worst.result.similarity
          )}`
        : "")
  )

  if (failures.length === 0 && stale.length === 0 && !markdownStale) {
    console.log("All samples match the committed images.")
    return
  }

  console.error("\nSample images do not match:\n")
  for (const failure of failures) {
    console.error(`  ${failure.name} (${failure.fileName}): ${failure.reason}`)
  }
  for (const file of stale) {
    console.error(`  ${file}: committed but no sketch renders it`)
  }
  if (markdownStale) {
    console.error("  samples.md: out of date")
  }
  console.error(
    "\nIf these changes are intended, run `pnpm build:samples` and commit the result."
  )
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
