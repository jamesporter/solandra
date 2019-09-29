import { scaler, clamp, isoTransform, triTransform } from "../util"

describe("Scaler", () => {
  it("should be able to scale", () => {
    const s = scaler({ minDomain: 1, maxDomain: 3, minRange: 2, maxRange: 4 })
    expect(s(2)).toBeCloseTo(3)
    expect(s(3)).toBeCloseTo(4)

    const s2 = scaler({
      minDomain: 0,
      maxDomain: -100,
      minRange: 0,
      maxRange: 50,
    })
    expect(s2(-50)).toBeCloseTo(25)
    expect(s2(-10)).toBeCloseTo(5)
  })
})

describe("Clamp", () => {
  it("should be able to clamp", () => {
    expect(clamp({ from: 0, to: 10 }, -10)).toBeCloseTo(0)
    expect(clamp({ from: 0, to: 10 }, 20)).toBeCloseTo(10)
  })
})

describe("Isotransform", () => {
  it("should be able to be constent", () => {
    const itf = isoTransform(3.4)
    expect(itf([0, 1, 0])).toEqual(itf([1, 0, 1]))

    expect(itf([0, 2, 0])[1]).toBeCloseTo(-6.8)
    expect(itf([0, 2, 0])[0]).toBeCloseTo(0)
  })
})

describe("Describle Triangle Transform", () => {
  it("Can do up cases", () => {
    const tt = triTransform({ s: 1 })
    const r = 1 / (2 * Math.sin(Math.PI / 3))
    const h = 0.5 / Math.tan(Math.PI / 3)

    expect(tt([0, 0]).at[0]).toBeCloseTo(0)
    expect(tt([0, 0]).at[1]).toBeCloseTo(0)

    expect(tt([2, 0]).at[0]).toBeCloseTo(1)
    expect(tt([2, 0]).at[1]).toBeCloseTo(0)

    expect(tt([4, 0]).at[0]).toBeCloseTo(2)
    expect(tt([4, 0]).at[1]).toBeCloseTo(0)

    expect(tt([1, 1]).at[0]).toBeCloseTo(0.5)
    expect(tt([1, 1]).at[1]).toBeCloseTo(h + r)
  })

  it("Can do down cases", () => {
    const tt = triTransform({ s: 1 })
    const r = 1 / (2 * Math.sin(Math.PI / 3))
    const h = 0.5 / Math.tan(Math.PI / 3)

    expect(tt([1, 0]).at[0]).toBeCloseTo(0.5)
    expect(tt([1, 0]).at[1]).toBeCloseTo(h - r)
  })
})
