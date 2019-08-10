import { scaler, clamp, isoTransform } from "../util"

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
