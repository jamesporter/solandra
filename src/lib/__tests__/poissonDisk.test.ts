import { describe, expect, it } from "vitest"
import { PoissonDiskSampling, poissonDiskPoints } from "../poissonDisk"
import { RNG } from "../rng"
import { distance } from "../vectors"

const seededRng = (seed: number) => {
  const rng = new RNG(seed)
  return () => rng.number()
}

describe("poissonDiskPoints", () => {
  it("keeps every point at least minDist from every other", () => {
    const minDist = 0.1
    const points = poissonDiskPoints({
      width: 1,
      height: 1,
      minDist,
      rng: seededRng(42),
      k: 30,
    })

    expect(points.length).toBeGreaterThan(10)
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        expect(distance(points[i], points[j])).toBeGreaterThanOrEqual(minDist)
      }
    }
  })

  it("keeps every point inside the region", () => {
    const points = poissonDiskPoints({
      width: 1,
      height: 0.5,
      minDist: 0.08,
      rng: seededRng(7),
      k: 30,
    })

    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(1)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThan(0.5)
    }
  })

  it("is reproducible for a given seed", () => {
    const config = { width: 1, height: 1, minDist: 0.15, k: 20 }
    const a = poissonDiskPoints({ ...config, rng: seededRng(1) })
    const b = poissonDiskPoints({ ...config, rng: seededRng(1) })
    const c = poissonDiskPoints({ ...config, rng: seededRng(2) })

    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it("packs more points in as minDist shrinks", () => {
    const sparse = poissonDiskPoints({
      width: 1,
      height: 1,
      minDist: 0.2,
      rng: seededRng(3),
      k: 30,
    })
    const dense = poissonDiskPoints({
      width: 1,
      height: 1,
      minDist: 0.05,
      rng: seededRng(3),
      k: 30,
    })

    expect(dense.length).toBeGreaterThan(sparse.length)
  })
})

describe("PoissonDiskSampling", () => {
  it("returns the same points it stores", () => {
    const sampler = new PoissonDiskSampling(1, 1, 0.2, 30)
    const returned = sampler.generatePoints(seededRng(9))
    expect(returned).toBe(sampler.points)
  })
})
