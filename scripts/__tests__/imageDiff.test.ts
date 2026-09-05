import { describe, expect, it } from "vitest"

import {
  colorDelta,
  compareImages,
  defaultCompareOptions,
  type RgbaImage,
} from "../imageDiff"

const width = 60
const height = 40

type Draw = (x: number, y: number) => [number, number, number]

const image = (draw: Draw): RgbaImage => {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = draw(x, y)
      const i = (y * width + x) * 4
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = 255
    }
  }
  return { width, height, data }
}

const white: Draw = () => [255, 255, 255]

/** A filled black square, so we can move it around. */
const square =
  (left: number, top: number, size = 10): Draw =>
  (x, y) =>
    x >= left && x < left + size && y >= top && y < top + size
      ? [0, 0, 0]
      : [255, 255, 255]

describe("colorDelta", () => {
  it("is zero for identical pixels", () => {
    const a = new Uint8ClampedArray([12, 34, 56, 255])
    expect(colorDelta(a, 0, a, 0)).toBe(0)
  })

  it("is near the top of its range for black against white", () => {
    const black = new Uint8ClampedArray([0, 0, 0, 255])
    const light = new Uint8ClampedArray([255, 255, 255, 255])
    const delta = colorDelta(black, 0, light, 0)
    expect(delta).toBeGreaterThan(0.9)
    expect(delta).toBeLessThanOrEqual(1)
  })

  it("treats transparency as the white it is composited onto", () => {
    const transparent = new Uint8ClampedArray([0, 0, 0, 0])
    const light = new Uint8ClampedArray([255, 255, 255, 255])
    expect(colorDelta(transparent, 0, light, 0)).toBe(0)
  })

  it("weights a shade or two of difference well below the tolerance", () => {
    const a = new Uint8ClampedArray([120, 120, 120, 255])
    const b = new Uint8ClampedArray([122, 121, 118, 255])
    const tolerance = defaultCompareOptions.colorTolerance ** 2
    expect(colorDelta(a, 0, b, 0)).toBeLessThan(tolerance)
  })
})

describe("compareImages", () => {
  it("reports an identical image as perfectly similar", () => {
    const a = image(square(10, 10))
    const result = compareImages(a, image(square(10, 10)))
    expect(result.similarity).toBe(1)
    expect(result.changedPixels).toBe(0)
    expect(result.passed).toBe(true)
  })

  it("ignores a difference of a shade or two everywhere", () => {
    const a = image(() => [100, 150, 200])
    const b = image(() => [102, 149, 203])
    const result = compareImages(a, b)
    expect(result.changedPixels).toBe(0)
    expect(result.passed).toBe(true)
  })

  it("ignores a sub pixel shift, which is what antialiasing looks like", () => {
    const result = compareImages(image(square(10, 10)), image(square(11, 10)))
    // Every pixel along both moved edges changed...
    expect(result.changedPixels).toBeGreaterThan(0)
    // ...but each has a match right next to it, so none of them count.
    expect(result.significantPixels).toBe(0)
    expect(result.passed).toBe(true)
  })

  it("does not forgive a shift larger than the tolerance", () => {
    const result = compareImages(image(square(10, 10)), image(square(30, 10)), {
      threshold: 0.99,
    })
    expect(result.significantPixels).toBe(200)
    expect(result.passed).toBe(false)
  })

  it("fails when a shape is a different colour", () => {
    const a = image(square(10, 10))
    const b = image((x, y) =>
      x >= 10 && x < 20 && y >= 10 && y < 20 ? [255, 0, 0] : [255, 255, 255]
    )
    const result = compareImages(a, b)
    // The inside of the square differs; only its edge is next to a match.
    expect(result.significantPixels).toBeGreaterThan(50)
    expect(result.passed).toBe(false)
  })

  it("passes a difference just under the threshold and fails one just over", () => {
    const total = width * height
    const budget = Math.floor(total * 0.005)

    const speckle = (count: number): RgbaImage => {
      const img = image(white)
      for (let i = 0; i < count; i++) {
        // Spread them out so no two are neighbours, or the shift tolerance
        // would let each excuse the other.
        const index = i * 3 * 4
        img.data[index] = 0
        img.data[index + 1] = 0
        img.data[index + 2] = 0
      }
      return img
    }

    expect(
      compareImages(image(white), speckle(budget), { threshold: 0.99 }).passed
    ).toBe(true)
    expect(
      compareImages(image(white), speckle(budget * 4), { threshold: 0.99 })
        .passed
    ).toBe(false)
  })

  it("respects a stricter threshold", () => {
    const strict = compareImages(image(white), image(square(0, 0, 6)), {
      threshold: 0.999,
      shiftTolerance: 0,
    })
    expect(strict.similarity).toBeCloseTo(1 - 36 / (width * height), 6)
    expect(strict.passed).toBe(false)
  })

  it("refuses to compare images of different sizes", () => {
    expect(() =>
      compareImages(image(white), {
        width: 10,
        height: 10,
        data: new Uint8ClampedArray(400),
      })
    ).toThrow(/sizes differ/)
  })

  it("writes a diff marking tolerated differences apart from real ones", () => {
    const coloursIn = (expected: RgbaImage, actual: RgbaImage) => {
      const diff = new Uint8ClampedArray(width * height * 4)
      compareImages(expected, actual, {}, diff)
      const colours = new Set<string>()
      for (let i = 0; i < diff.length; i += 4) {
        colours.add(`${diff[i]},${diff[i + 1]},${diff[i + 2]}`)
      }
      return colours
    }

    const shifted = coloursIn(image(square(10, 10)), image(square(11, 10)))
    expect(shifted).toContain("255,220,0")
    expect(shifted).not.toContain("255,0,0")

    const moved = coloursIn(image(square(10, 10)), image(square(30, 10)))
    expect(moved).toContain("255,0,0")
  })
})
