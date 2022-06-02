import { SketchKind, sketchKinds } from "./examples/sketches"

export const getNumber = (key: string): number | null => {
  const raw = global.localStorage && localStorage.getItem(key)
  if (raw) {
    try {
      const n = JSON.parse(raw)
      if (typeof n === "number") {
        return n
      }
    } catch (ex) {}
  }
  return null
}

export const setNumber = (key: string, n: number) => {
  global.localStorage && localStorage.setItem(key, JSON.stringify(n))
}

export const getBoolean = (
  key: string,
  defaultValue: boolean = false
): boolean => {
  const raw = global.localStorage && localStorage.getItem(key)
  if (raw) {
    try {
      const b = JSON.parse(raw)
      if (typeof b === "boolean") {
        return b
      }
    } catch (ex) {}
  }
  return defaultValue
}

export const setBoolean = (key: string, b: boolean) => {
  global.localStorage && localStorage.setItem(key, JSON.stringify(b))
}

export const getSketchIdx = (): null | number => {
  try {
    // @ts-expect-error
    const params = new URL(document.location).searchParams
    // @ts-expect-error
    const i = parseInt(params.get("sketch"), 10)
    return i
  } catch (ex) {
    return null
  }
}

export const getSketchCategory = (): SketchKind => {
  try {
    // @ts-expect-error
    const params = new URL(document.location).searchParams
    const k = params.get("category")
    if (sketchKinds.includes(k as any)) {
      return k as SketchKind
    } else {
      return "Highlights"
    }
  } catch (ex) {
    return "Highlights"
  }
}

export const setSketchIdxParam = (idx: number) => {
  if ("URLSearchParams" in window) {
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set("sketch", idx.toString())
    window.location.search = searchParams.toString()
  }
}
