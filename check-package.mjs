// Smoke test for the built npm package (run `pnpm build:package` first).
// Verifies both entry points load in Node, export the same API surface, and
// that a couple of representative exports actually work.
import { createRequire } from "node:module"
import { readFileSync } from "node:fs"

const require = createRequire(import.meta.url)

const cjs = require("./package/cjs/index.js")
const esm = await import("./package/esm/index.js")

const cjsKeys = Object.keys(cjs).sort()
const esmKeys = Object.keys(esm)
  .filter((k) => k !== "default")
  .sort()

if (cjsKeys.length === 0) {
  throw new Error("CJS build has no exports")
}

const missingFromEsm = cjsKeys.filter((k) => !esmKeys.includes(k))
const missingFromCjs = esmKeys.filter((k) => !cjsKeys.includes(k))
if (missingFromEsm.length > 0 || missingFromCjs.length > 0) {
  throw new Error(
    `Export mismatch between builds. Missing from ESM: [${missingFromEsm.join(", ")}]. Missing from CJS: [${missingFromCjs.join(", ")}]`
  )
}

for (const mod of [cjs, esm]) {
  for (const name of ["SCanvas", "RNG", "v", "SimplePath", "Circle"]) {
    if (mod[name] === undefined) {
      throw new Error(`Expected export "${name}" is missing`)
    }
  }
  const rng = new mod.RNG(42)
  const n = rng.number()
  if (!(n >= 0 && n < 1)) {
    throw new Error(`RNG.number() returned ${n}, expected [0, 1)`)
  }
  const sum = mod.v.add([1, 2], [3, 4])
  if (sum[0] !== 4 || sum[1] !== 6) {
    throw new Error(
      `v.add([1,2],[3,4]) returned ${JSON.stringify(sum)}, expected [4, 6]`
    )
  }
}

const pkg = JSON.parse(readFileSync("./package/package.json", "utf8"))
for (const field of ["exports", "main", "module", "types"]) {
  if (!pkg[field]) {
    throw new Error(`package.json is missing "${field}"`)
  }
}

console.log(
  `Package OK: ${cjsKeys.length} exports, CJS and ESM builds both load and agree`
)
