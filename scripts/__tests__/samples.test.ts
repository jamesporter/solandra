import { describe, expect, it } from "vitest"

import { listSamples, unverifiedSamples } from "../renderSamples"

describe("the samples", () => {
  it("all have distinct file names", () => {
    const names = listSamples().map((s) => s.fileName)
    expect(new Set(names).size).toBe(names.length)
  })

  it("do not all get compared for nothing", () => {
    // If this ever gets long, the check has stopped being a check.
    expect(Object.keys(unverifiedSamples).length).toBeLessThan(5)
  })
})

describe("the not-compared list", () => {
  it("names sketches that exist", () => {
    const names = new Set(listSamples().map((s) => s.name))
    for (const name of Object.keys(unverifiedSamples)) {
      expect(names).toContain(name)
    }
  })

  it("says why for each", () => {
    for (const [name, reason] of Object.entries(unverifiedSamples)) {
      expect(reason.length, `${name} needs a reason`).toBeGreaterThan(20)
    }
  })
})
