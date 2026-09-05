import { describe, expect, it } from "vitest"
import { commandMenuItems } from "../data/commandMenuItems"
import { fuzzyMatch, searchCommandMenu } from "../fuzzySearch"

const top = (query: string) => searchCommandMenu(query)[0]?.item.name

describe("fuzzyMatch", () => {
  it("matches a subsequence, not just a substring", () => {
    expect(fuzzyMatch("fpdp", "forPoissonDiskPoints")).not.toBeNull()
    expect(fuzzyMatch("zzz", "forPoissonDiskPoints")).toBeNull()
  })

  it("is case and whitespace insensitive", () => {
    expect(fuzzyMatch("CO lo", "Colour & Palettes")).not.toBeNull()
  })

  it("returns the matched indices for highlighting", () => {
    expect(fuzzyMatch("path", "Paths & Curves")?.indices).toEqual([0, 1, 2, 3])
  })

  it("scores a prefix above a match buried in the middle", () => {
    const prefix = fuzzyMatch("text", "Text")!
    const buried = fuzzyMatch("text", "Solandra does text")!
    expect(prefix.score).toBeGreaterThan(buried.score)
  })

  it("scores adjacent characters above scattered ones", () => {
    const adjacent = fuzzyMatch("grid", "forGrid")!
    const scattered = fuzzyMatch("grid", "generative random iteration doc")!
    expect(adjacent.score).toBeGreaterThan(scattered.score)
  })

  it("treats an empty query as a match with no highlighting", () => {
    expect(fuzzyMatch("", "anything")).toEqual({ score: 0, indices: [] })
  })
})

describe("searchCommandMenu", () => {
  it("returns everything in curated order for an empty query", () => {
    const results = searchCommandMenu("  ")
    expect(results).toHaveLength(commandMenuItems.length)
    expect(results[0].item.name).toBe("Home")
  })

  it("finds pages, docs and concepts by name", () => {
    expect(top("tiling")).toBe("forTiling")
    expect(top("release")).toBe("Release Notes")
    expect(top("withcontext")).toBe("withContext")
  })

  it("finds the newer parts of the library", () => {
    expect(top("curl")).toBe("Curl noise & flow fields")
    expect(top("flowline")).toBe("Curl noise & flow fields")
    expect(top("convex hull")).toBe("Convex hull")
    expect(top("simplif")).toBe("Simplifying paths")
    expect(top("mixcolors")).toBe("Colour schemes & mixing")
  })

  it("copes with typo-ish, partial input", () => {
    expect(top("posdisk")).toBe("forPoissonDiskPoints")
    expect(top("cmpndpth")).toBe("CompoundPath")
  })

  it("matches on hidden keywords too", () => {
    const names = searchCommandMenu("changelog").map((r) => r.item.name)
    expect(names[0]).toBe("Release Notes")

    const glsl = searchCommandMenu("glsl").map((r) => r.item.name)
    expect(glsl).toContain("Shader Playground")
  })

  it("prefers a name match over a keyword match", () => {
    const [first] = searchCommandMenu("shapes")
    expect(first.item.name).toBe("Shapes")
    expect(first.indices.length).toBeGreaterThan(0)
  })

  it("surfaces the GitHub action", () => {
    const [first] = searchCommandMenu("github")
    expect(first.item.href).toBe("https://github.com/jamesporter/solandra")
    expect(first.item.external).toBe(true)
  })

  it("drops items that don't match at all", () => {
    expect(searchCommandMenu("qqqqzzzz")).toHaveLength(0)
  })

  it("only points at hrefs that exist", () => {
    for (const item of commandMenuItems) {
      if (item.external) {
        expect(item.href.startsWith("https://")).toBe(true)
      } else {
        expect(item.href.startsWith("/")).toBe(true)
      }
    }
  })
})
