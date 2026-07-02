import { describe, it, expect } from "vitest"
import { pairWise, tripleWise, zip2, sum, arrayOf } from "../collectionOps"

describe("Pairwise", () => {
  it("should be able to do pairwise on simple array", () => {
    expect(pairWise([1, 2, 3, 4, 5])).toMatchSnapshot()
  })

  it("should give empty array when not long enough", () => {
    expect(pairWise([1])).toEqual([])
  })

  it("should handle exactly two elements", () => {
    expect(pairWise([1, 2])).toEqual([[1, 2]])
  })

  it("should handle empty array", () => {
    expect(pairWise([])).toEqual([])
  })
})

describe("Triplewise", () => {
  it("should be able to do triplewise on simple array", () => {
    expect(tripleWise([1, 2, 3, 4, 5])).toMatchSnapshot()
  })

  it("should give empty array when not long enough", () => {
    expect(tripleWise([1, 2])).toEqual([])
  })

  it("should handle exactly three elements", () => {
    expect(tripleWise([1, 2, 3])).toEqual([[1, 2, 3]])
  })

  it("should handle looped mode", () => {
    const result = tripleWise([1, 2, 3, 4], true)
    // For looped mode, it should wrap around
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContainEqual([1, 2, 3])
    expect(result).toContainEqual([2, 3, 4])
  })

  it("should handle empty array", () => {
    expect(tripleWise([])).toEqual([])
  })
})

describe("zip2", () => {
  it("should zip two arrays of equal length", () => {
    expect(zip2([1, 2, 3], ["a", "b", "c"])).toEqual([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ])
  })

  it("should stop at shorter array (first shorter)", () => {
    expect(zip2([1, 2], ["a", "b", "c", "d"])).toEqual([
      [1, "a"],
      [2, "b"],
    ])
  })

  it("should stop at shorter array (second shorter)", () => {
    expect(zip2([1, 2, 3, 4], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ])
  })

  it("should handle empty arrays", () => {
    expect(zip2([], [])).toEqual([])
    expect(zip2([1, 2], [])).toEqual([])
    expect(zip2([], ["a", "b"])).toEqual([])
  })

  it("should work with different types", () => {
    expect(zip2([1, 2], [true, false])).toEqual([
      [1, true],
      [2, false],
    ])
  })

  it("should work with single elements", () => {
    expect(zip2([1], ["a"])).toEqual([[1, "a"]])
  })
})

describe("sum", () => {
  it("should sum an array of numbers", () => {
    expect(sum([1, 2, 3, 4])).toBe(10)
  })

  it("should return 0 for empty array", () => {
    expect(sum([])).toBe(0)
  })

  it("should handle single element", () => {
    expect(sum([5])).toBe(5)
  })

  it("should handle negative numbers", () => {
    expect(sum([1, -2, 3, -4])).toBe(-2)
  })

  it("should handle decimals", () => {
    expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6)
  })

  it("should handle all zeros", () => {
    expect(sum([0, 0, 0])).toBe(0)
  })
})

describe("arrayOf", () => {
  it("should create an array of specified length", () => {
    const result = arrayOf(5, () => 0)
    expect(result).toHaveLength(5)
    expect(result).toEqual([0, 0, 0, 0, 0])
  })

  it("should call init function for each element", () => {
    let count = 0
    const result = arrayOf(3, () => count++)
    expect(result).toEqual([0, 1, 2])
  })

  it("should handle zero length", () => {
    expect(arrayOf(0, () => 1)).toEqual([])
  })

  it("should create distinct objects", () => {
    const result = arrayOf(3, () => ({ x: 0 }))
    result[0].x = 1
    expect(result[1].x).toBe(0) // Should be distinct objects
  })

  it("should work with complex types", () => {
    const result = arrayOf(2, () => [1, 2])
    expect(result).toEqual([
      [1, 2],
      [1, 2],
    ])
    // Verify they are distinct arrays
    result[0].push(3)
    expect(result[1]).toEqual([1, 2])
  })
})
