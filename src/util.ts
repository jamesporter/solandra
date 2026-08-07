import { SketchKind, sketchKinds } from "./examples/sketches"

// Safely resolve localStorage. It is only available in the browser, and
// access can throw (e.g. disabled cookies). During SSR some environments also
// expose a partial `global.localStorage` stub without the expected methods, so
// guard on `window` rather than trusting a bare/global reference.
const safeLocalStorage = (): Storage | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage
    }
  } catch {
    // ignore – localStorage is not accessible
  }
  return null
}

/**
 * Read a JSON encoded value of an expected type from localStorage, falling
 * back when it is missing, unparseable or of the wrong type.
 */
const getStored = <T>(
  key: string,
  isExpected: (value: unknown) => value is T,
  fallback: T | null
): T | null => {
  const raw = safeLocalStorage()?.getItem(key)
  if (raw) {
    try {
      const value: unknown = JSON.parse(raw)
      if (isExpected(value)) return value
    } catch {}
  }
  return fallback
}

const setStored = (key: string, value: number | boolean) => {
  safeLocalStorage()?.setItem(key, JSON.stringify(value))
}

const isNumber = (value: unknown): value is number => typeof value === "number"
const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean"

export const getNumber = (key: string): number | null =>
  getStored(key, isNumber, null)

export const setNumber = (key: string, n: number) => setStored(key, n)

export const getBoolean = (
  key: string,
  defaultValue: boolean = false
): boolean => getStored(key, isBoolean, defaultValue) as boolean

export const setBoolean = (key: string, b: boolean) => setStored(key, b)

/**
 * The current page's query parameters, or null where there is no document
 * (i.e. during server rendering).
 */
const searchParams = (): URLSearchParams | null => {
  try {
    return new URL(document.location.href).searchParams
  } catch {
    return null
  }
}

export const getSketchIdx = (): null | number => {
  const raw = searchParams()?.get("sketch")
  const i = parseInt(raw ?? "", 10)
  return Number.isNaN(i) ? null : i
}

export const getSketchCategory = (): SketchKind => {
  const k = searchParams()?.get("category")
  return sketchKinds.includes(k as SketchKind)
    ? (k as SketchKind)
    : "Highlights"
}

export const setSketchIdxParam = (idx: number) => {
  if ("URLSearchParams" in window) {
    const params = new URLSearchParams(window.location.search)
    params.set("sketch", idx.toString())
    window.location.search = params.toString()
  }
}
