import { Rect, RegularPolygon, SCanvas } from "../lib"
import CodeAndSketch from "./CodeAndSketch"

export function One() {
  return (
    <CodeAndSketch
      code={`p.background(220, 26, 14)`}
      sketch={(p) => {
        p.background(220, 26, 14)
      }}
    />
  )
}

export function Two() {
  return (
    <CodeAndSketch
      code={`p.setFillColor(220, 54, 50)
p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))`}
      sketch={(p) => {
        p.background(220, 26, 14)
        p.setFillColor(220, 54, 50)
        p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))
      }}
    />
  )
}

export function Three() {
  return (
    <CodeAndSketch
      code={`p.forTiling({ n: 10, type: "square", margin: 0.1 },
    (at, [w, h], c, i) => {
        p.setFillColor(150 + i * 5, 54, 50)
        p.fill(new Rect({ at, w, h }))
    })`}
      sketch={(p) => {
        p.background(220, 26, 14)
        p.forTiling(
          { n: 10, type: "square", margin: 0.1 },
          (at, [w, h], c, i) => {
            p.setFillColor(150 + i * 5, 54, 50)
            p.fill(new Rect({ at, w, h }))
          }
        )
      }}
    />
  )
}

export function Four() {
  return (
    <CodeAndSketch
      code={`p.forHorizontal({ n: 8, margin: 0.1 }, (at, [w, h], c, i) => {
    p.setFillColor(150 + i * 5, 54, 50)
    p.fill(new RegularPolygon({ at: c, r: w / 3, n: i + 3 }))
})`}
      sketch={(p) => {
        p.background(220, 26, 14)
        p.forHorizontal({ n: 6, margin: 0.1 }, (at, [w, h], c, i) => {
          p.setFillColor(150 + i * 10, 54, 50)
          p.fill(new RegularPolygon({ at: c, r: w / 3, n: i + 3 }))
        })
      }}
    />
  )
}

export function Five() {
  return (
    <CodeAndSketch
      code={`new RegularPolygon({
        at: [c[0], c[1] + Math.cos(p.t + (i * Math.PI) / 8) * 0.2],
        r: w / 3,
        n: i + 3,
    })`}
      sketch={(p) => {
        p.background(220, 26, 14)
        p.forHorizontal({ n: 6, margin: 0.1 }, (at, [w, h], c, i) => {
          p.setFillColor(150 + i * 10, 54, 50)
          p.fill(
            new RegularPolygon({
              at: [c[0], c[1] + Math.cos(p.t + (i * Math.PI) / 8) * 0.2],
              r: w / 3,
              n: i + 3,
            })
          )
        })
      }}
      playing
    />
  )
}

const logoForDemo = (p: SCanvas) => {
  p.background(220, 26, 14)
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, (n) => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t)) / 40
    p.setFillColor(220, 70, 10 + n * 12)
    p.fill(
      new RegularPolygon({
        at: center,
        n: sides,
        r,
      })
    )
  })
}

export function Six() {
  return (
    <CodeAndSketch
      code={`p.background(220, 26, 14)
const { bottom, right, center } = p.meta
const d = Math.min(bottom, right) / 2.8

p.times(5, n => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t)) / 40
    p.setFillColor(220, 70, 10 + n * 12)
    p.fill(new RegularPolygon({
        at: center,
        n: sides,
        r,
    }))
})`}
      sketch={logoForDemo}
      playing
    />
  )
}
