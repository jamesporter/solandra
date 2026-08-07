import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  getBoolean,
  getNumber,
  getSketchCategory,
  getSketchIdx,
  setBoolean,
  setNumber,
} from "../util"

const store = new Map<string, string>()

const fakeLocalStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    store.set(key, value)
  },
  removeItem: (key: string) => {
    store.delete(key)
  },
} as unknown as Storage

const setLocation = (search: string) => {
  ;(globalThis as any).document = {
    location: { href: `https://example.com/view${search}` },
  }
}

beforeEach(() => {
  store.clear()
  ;(globalThis as any).window = { localStorage: fakeLocalStorage }
})

afterEach(() => {
  delete (globalThis as any).window
  delete (globalThis as any).document
})

describe("stored numbers", () => {
  it("round trips", () => {
    setNumber("a", 42)
    expect(getNumber("a")).toBe(42)
  })

  it("returns null when unset", () => {
    expect(getNumber("missing")).toBeNull()
  })

  it("returns null for a value of the wrong type", () => {
    fakeLocalStorage.setItem("a", JSON.stringify("not a number"))
    expect(getNumber("a")).toBeNull()
  })

  it("returns null for unparseable json", () => {
    fakeLocalStorage.setItem("a", "{{{")
    expect(getNumber("a")).toBeNull()
  })

  it("handles zero", () => {
    setNumber("a", 0)
    expect(getNumber("a")).toBe(0)
  })
})

describe("stored booleans", () => {
  it("round trips both values", () => {
    setBoolean("t", true)
    setBoolean("f", false)
    expect(getBoolean("t")).toBe(true)
    expect(getBoolean("f", true)).toBe(false)
  })

  it("falls back to the default when unset", () => {
    expect(getBoolean("missing")).toBe(false)
    expect(getBoolean("missing", true)).toBe(true)
  })

  it("falls back to the default for a value of the wrong type", () => {
    fakeLocalStorage.setItem("b", JSON.stringify(1))
    expect(getBoolean("b", true)).toBe(true)
  })
})

describe("without localStorage", () => {
  it("reads and writes are no-ops rather than throwing", () => {
    delete (globalThis as any).window
    expect(() => setNumber("a", 1)).not.toThrow()
    expect(getNumber("a")).toBeNull()
    expect(getBoolean("a", true)).toBe(true)
  })
})

describe("getSketchIdx", () => {
  it("reads the sketch query parameter", () => {
    setLocation("?sketch=7")
    expect(getSketchIdx()).toBe(7)
  })

  it("is null when absent or not a number", () => {
    setLocation("")
    expect(getSketchIdx()).toBeNull()
    setLocation("?sketch=abc")
    expect(getSketchIdx()).toBeNull()
  })

  it("is null when there is no document", () => {
    expect(getSketchIdx()).toBeNull()
  })
})

describe("getSketchCategory", () => {
  it("reads a known category", () => {
    setLocation("?category=Animated")
    expect(getSketchCategory()).toBe("Animated")
  })

  it("falls back to Highlights for an unknown category", () => {
    setLocation("?category=Nonsense")
    expect(getSketchCategory()).toBe("Highlights")
  })

  it("falls back to Highlights when there is no document", () => {
    expect(getSketchCategory()).toBe("Highlights")
  })
})
