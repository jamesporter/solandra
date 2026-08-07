/**
 * Shared helpers for the library tests.
 *
 * Not a test file itself (vitest only collects `*.test.ts`), just the bits
 * several test files would otherwise each reimplement.
 */

import { Traceable } from "../paths/index.js"

/**
 * A recorded call made against a canvas context whilst tracing.
 */
export type TraceCall = { op: string; args: unknown[] }

/**
 * A proxy based mock of a canvas context that records every method call and
 * property assignment as a readable string, e.g. `"lineTo(0.5, 0.5)"`.
 */
export const createMockCtx = (): {
  ctx: CanvasRenderingContext2D
  history: string[]
} => {
  const history: string[] = []
  const ctx = new Proxy(
    {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      lineCap: "butt",
      lineJoin: "miter",
      shadowBlur: 0,
      shadowColor: "",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      globalCompositeOperation: "source-over",
    } as any,
    {
      get: function (target, property) {
        if (property in target) {
          return target[property]
        }
        history.push(`${String(property)}`)
        return (...args: any[]) => {
          history[history.length - 1] =
            `${String(property)}(${args.join(", ")})`
          // gradient factories have to return something usable
          if (String(property).endsWith("Gradient")) {
            return { addColorStop: () => {} }
          }
        }
      },
      set: function (target, property, value) {
        history.push(`${String(property)} = ${value}`)
        target[property] = value
        return true
      },
    }
  )
  return { ctx: ctx as CanvasRenderingContext2D, history }
}

/**
 * Traces a Traceable into a recording context, returning the structured calls
 * it made. Useful for asserting on the geometry a shape produces.
 */
export const recordTrace = (traceable: Traceable): TraceCall[] => {
  const calls: TraceCall[] = []
  const record =
    (op: string) =>
    (...args: unknown[]) => {
      calls.push({ op, args })
    }

  const ctx = {
    moveTo: record("moveTo"),
    lineTo: record("lineTo"),
    rect: record("rect"),
    arc: record("arc"),
    bezierCurveTo: record("bezierCurveTo"),
    quadraticCurveTo: record("quadraticCurveTo"),
    closePath: record("closePath"),
  } as unknown as CanvasRenderingContext2D

  traceable.traceIn(ctx)
  return calls
}

/**
 * The points visited by `moveTo`/`lineTo` whilst tracing, in order.
 */
export const tracedPoints = (traceable: Traceable): [number, number][] =>
  recordTrace(traceable)
    .filter(({ op }) => op === "moveTo" || op === "lineTo")
    .map(({ args }) => [args[0] as number, args[1] as number])
