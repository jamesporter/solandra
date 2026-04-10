import { describe, it, expect } from "vitest"
import { poissonDiskPoints, PoissonDiskSampling } from "../poissonDisk"
import { distance } from "../vectors"

// Deterministic RNG for testing
function makeSeededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

describe("poissonDiskPoints", () => {
  it("returns an array of points", () => {
    const rng = makeSeededRng(42)
    const points = poissonDiskPoints({ width: 1, height: 1, minDist: 0.1, rng, k: 30 })
    expect(Array.isArray(points)).toBe(true)
    expect(points.length).toBeGreaterThan(0)
  })

  it("all points are within the specified bounds", () => {
    const rng = makeSeededRng(123)
    const width = 2
    const height = 3
    const points = poissonDiskPoints({ width, height, minDist: 0.3, rng, k: 30 })

    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(width)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThan(height)
    }
  })

  it("all points are at least minDist apart", () => {
    const rng = makeSeededRng(99)
    const minDist = 0.15
    const points = poissonDiskPoints({ width: 1, height: 1, minDist, rng, k: 30 })

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const d = distance(points[i], points[j])
        expect(d).toBeGreaterThanOrEqual(minDist - 1e-10)
      }
    }
  })

  it("produces more points with a smaller minDist", () => {
    const points1 = poissonDiskPoints({ width: 1, height: 1, minDist: 0.3, rng: makeSeededRng(42), k: 30 })
    const points2 = poissonDiskPoints({ width: 1, height: 1, minDist: 0.05, rng: makeSeededRng(42), k: 30 })
    expect(points2.length).toBeGreaterThan(points1.length)
  })
})

describe("PoissonDiskSampling", () => {
  it("constructs with correct initial state", () => {
    const pds = new PoissonDiskSampling(1, 1, 0.1, 30)
    expect(pds.points).toEqual([])
  })

  it("generatePoints returns the same array as pds.points", () => {
    const pds = new PoissonDiskSampling(1, 1, 0.2, 30)
    const rng = makeSeededRng(7)
    const returned = pds.generatePoints(rng)
    expect(returned).toBe(pds.points)
  })

  it("generatePoints produces at least one point", () => {
    const pds = new PoissonDiskSampling(1, 1, 0.2, 30)
    pds.generatePoints(makeSeededRng(1))
    expect(pds.points.length).toBeGreaterThan(0)
  })

  it("all generated points are within bounds", () => {
    const width = 1.5
    const height = 2
    const pds = new PoissonDiskSampling(width, height, 0.25, 30)
    pds.generatePoints(makeSeededRng(42))

    for (const [x, y] of pds.points) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(width)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThan(height)
    }
  })

  it("all points maintain minimum distance", () => {
    const minDist = 0.2
    const pds = new PoissonDiskSampling(1, 1, minDist, 30)
    pds.generatePoints(makeSeededRng(42))

    const pts = pds.points
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = distance(pts[i], pts[j])
        expect(d).toBeGreaterThanOrEqual(minDist - 1e-10)
      }
    }
  })
})
