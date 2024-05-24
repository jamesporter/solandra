import { describe, it, expect } from 'vitest';

import SCanvas from "../sCanvas"
import { Rect } from "../paths/Rect"

describe("Draw something with Solandra", () => {
  it("should be able to draw a rectangle", () => {
    const history: string[] = []
    const pocFakeCanvas = new Proxy(
      {},
      {
        get: function (target, property, receiver) {
          history.push(`${String(property)}`)
          return (...args: any[]) => {
            history[history.length - 1] = `${String(property)}(${args.join(
              ", "
            )})`
          }
        },
        set: function (target, property, value, receiver) {
          history.push(`${String(property)} = ${value}`)
          return true
        },
      }
    )

    const s = new SCanvas(
      pocFakeCanvas as CanvasRenderingContext2D,
      { width: 100, height: 100 },
      1,
      0
    )
    s.background(100, 20, 20)
    s.draw(new Rect({ at: [0.2, 0.2], w: 0.4, h: 0.2 }))
    expect(history).toMatchSnapshot()
  })
})
