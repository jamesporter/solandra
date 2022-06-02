import SCanvas from "../lib/sCanvas"
import { Path, CompoundPath, Star, RegularPolygon, Circle } from "../lib"
import {
  v,
  Rect,
  Square,
  RoundedRect,
  hexTransform,
  Hexagon,
  EquilateralTriangle,
  triTransform,
} from "../lib"

const compoundPath = (p: SCanvas) => {
  p.background(45, 80, 75)
  p.setFillColor(220, 9, 45, 0.4)
  // To remove a shape from another shape the path winding order must be opposite (hence the reversed)
  p.times(4, (n) => {
    p.fill(
      CompoundPath.withPaths(
        new RegularPolygon({ at: p.meta.center, r: 0.3 + n * 0.05, n: 8 }).path,
        new Star({ at: p.meta.center, r: 0.3 + n * 0.05, n: 4 }).path.reversed
      )
    )
  })
}

const compoundPath2 = (p: SCanvas) => {
  p.background(45, 20, 95)
  p.forTiling({ n: 3, type: "square" }, (at, [dX], c, i) => {
    p.setFillColor(220 - i * 40, 30, 45, 0.4)
    const s = 1 + 0.5 * p.random()
    p.times(4, (n) => {
      p.fill(
        CompoundPath.withPaths(
          new RegularPolygon({
            at: c,
            r: dX / 4 + dX * n * 0.05,
            n: 2 * (i + 3),
          }).path,
          new Star({
            at: c,
            r: (s * dX) / 4 + dX * n * 0.05,
            n: i + 3,
          }).path.transformed((at) => p.perturb({ at, magnitude: 0.05 }))
            .reversed
        )
      )
    })
  })
}

const transformingPaths = (p: SCanvas) => {
  p.background(30, 80, 40)
  const { center, bottom, right } = p.meta
  const [cX, cY] = center
  const r = 0.3 * Math.min(bottom, right)
  const path = Path.startAt([cX + r * Math.cos(p.t), cY + r * Math.sin(p.t)])
  p.times(33, (n) => {
    path.addCurveTo(
      [
        cX + (n % 2 === 0 ? 1 : 0.8) * r * Math.cos(p.t + (n * Math.PI) / 16),
        cY + (n % 2 === 0 ? 1 : 0.8) * r * Math.sin(p.t + (n * Math.PI) / 16),
      ],
      {
        polarlity: n % 2 === 0 ? 1 : -1,
      }
    )
  })

  p.times(4, (sc) => {
    const scale = (sc ** 1.5 + 1) * 0.22
    p.lineWidth = (sc + 1) * 0.002

    p.setStrokeColor(0, 0, 0, 0.9)
    p.draw(path.scaled(scale))
    p.setStrokeColor(0, 0, 0, 0.3)
    p.draw(path.rotated(0.234234 + p.t / 10).scaled(scale))
  })
}

const orderedTiles = (p: SCanvas) => {
  p.background(0, 0, 20)
  p.forTiling(
    { n: 10, type: "square", margin: 0.1, order: "columnFirst" },
    (_, [dX], c, i) => {
      p.setFillColor(i * 3, 80, 60, 0.6)
      p.fill(new Circle({ at: v.subtract(c, [dX / 8, 0]), r: dX / 3 }))
    }
  )
  p.forTiling(
    { n: 10, type: "square", margin: 0.1, order: "rowFirst" },
    (_, [dX], c, i) => {
      p.setFillColor(i * 3, 80, 60, 0.6)
      p.fill(new Circle({ at: v.add(c, [dX / 8, 0]), r: dX / 3 }))
    }
  )
}

const shadows = (p: SCanvas) => {
  p.background(10, 30, 95)
  p.forTiling(
    { n: 6, type: "square", order: "rowFirst", margin: 0.05 },
    (pt, [dX], _c, t) => {
      const i = t % 6
      const j = Math.floor(t / 6)

      p.setFillColor(t, 90, 40, 0.75)
      p.shadow = { size: t * 0.001, dX: (i - 2.5) * 0.01, dY: j * 0.01 }
      p.fill(
        new Rect({
          at: v.add([dX / 6, dX / 6], pt),
          w: (dX * 2) / 3,
          h: (dX * 2) / 3,
        })
      )
    }
  )
}

const dashes = (p: SCanvas) => {
  p.background(0, 0, 5)
  p.forTiling({ n: 5, margin: 0.1, type: "square" }, (_pt, [dX], at, i) => {
    p.lineWidth = 0.005
    p.dash = { offset: p.t / 20, pattern: [0.001 * (5 + i), 0.002 * (5 + i)] }
    p.setStrokeColor(45 + i * 10, 100, 70, 0.9)
    p.draw(new RegularPolygon({ at, n: 6, r: dX / 3 }))
  })
}

const glow = (p: SCanvas) => {
  p.background(0, 0, 5)
  p.forTiling(
    { n: 5, type: "square", order: "rowFirst", margin: 0.05 },
    (pt, [dX], c, t) => {
      const i = t % 5
      const j = Math.floor(t / 5)

      p.setFillColor(t + 150, 90, 40, 0.75)
      p.shadow = {
        dX: 0,
        dY: 0,
        size: t * 0.0025 * p.oscillate({ from: 0.5, to: 1.5 }),
        color: {
          h: t + 150,
          s: 50,
          l: 100,
          a: 0.9,
        },
      }
      p.fill(
        new RegularPolygon({
          at: c,
          r: dX / 3,
          n: p.sample([3, 5, 7]),
        })
      )
    }
  )
}

const shadowAnimation = (p: SCanvas) => {
  p.background(10, 30, 95)
  p.forTiling({ margin: 0.05, n: 6, type: "square" }, (_pt, [dX], at, i) => {
    const sc = Math.cos(p.t + i)
    p.setFillColor(198 + i, 60, 40)
    p.shadow = {
      size: 0.05 + 0.05 * sc,
      dY: 0,
      dX: 0,
      color: { h: 210, s: 90, l: 30, a: 0.9 },
    }
    p.fill(
      new Square({
        at,
        s: dX * 0.5 + sc * 0.005,
        align: "center",
      })
    )
  })
}

const segments = (p: SCanvas) => {
  p.background(35, 5, 20)
  p.forTiling(
    { n: 12, type: "square", margin: 0.05, order: "rowFirst" },
    (_pt, [dX], at, i) => {
      p.doProportion(0.6, () => {
        p.setFillColor(5 + i, 90, 40)
        p.shadow = {
          size: 0.05,
          dY: 0,
          dX: 0,
          color: { h: 45, s: 80, l: 30, a: 0.9 },
        }
        p.fill(
          new RoundedRect({
            at,
            align: "center",
            w: dX / 1.3,
            h: dX / 1.3,
            r: dX / 8,
          })
        )
      })
    }
  )
}

const hex = (p: SCanvas) => {
  p.background(35, 30, 10)
  const r = 0.1
  const vertical = true
  const h = hexTransform({ r, vertical })
  p.withTranslation(p.meta.center, () => {
    p.times(50, () => {
      p.setFillColor(p.sample([35, 40, 45]), 60, 60, 0.4)
      p.fill(
        new Hexagon({
          at: h(
            p.uniformGridPoint({
              minX: -3,
              maxX: 3,
              minY: -3,
              maxY: 3,
            })
          ),
          r,
          vertical,
        })
      )
    })
  })
}

const hexH = (p: SCanvas) => {
  p.background(215, 40, 30)
  const r = 0.075
  const vertical = false
  const h = hexTransform({ r, vertical })
  p.withTranslation(p.meta.center, () => {
    p.times(250, () => {
      p.setFillColor(p.sample([135, 140, 145]), 60, 60, 0.4)
      p.fill(
        new Hexagon({
          at: h(
            p.uniformGridPoint({
              minX: -5,
              maxX: 5,
              minY: -5,
              maxY: 5,
            })
          ),
          r: r * 0.9,
          vertical,
        })
      )
    })
  })
}

const tri = (p: SCanvas) => {
  p.background(215, 40, 30)
  p.lineWidth = 0.005
  p.setStrokeColor(0, 0, 90, 0.5)
  const s = 0.14
  const tt = triTransform({ s })
  const area = {
    minX: -8,
    maxX: 8,
    minY: -5,
    maxY: 5,
  } as const
  p.withTranslation(p.meta.center, () => {
    p.forGrid(area, (gp) => {
      const ta = new EquilateralTriangle({
        ...tt(gp),
        s,
      })
      p.setFillColor(p.sample([215, 195]), 60, 60, 0.2)
      p.fill(ta)
      p.draw(ta)
    })

    p.times(100, (n) => {
      p.setFillColor(n / 2, 90, 60, 0.45)
      p.fill(
        new EquilateralTriangle({
          ...tt(p.uniformGridPoint(area)),
          s: s * p.gaussian({ mean: 1.5, sd: 0.4 }),
        })
      )
    })
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: compoundPath, name: "Compound Path" },
  { sketch: compoundPath2, name: "Compound Path 2" },
  { sketch: transformingPaths, name: "Transforming Paths" },
  { sketch: orderedTiles, name: "Ordering of Tiles" },
  { sketch: dashes, name: "Dashes" },
  { sketch: shadows, name: "Shadows" },
  { sketch: shadowAnimation, name: "Shadow Animation" },
  { sketch: glow, name: "Glow" },
  { sketch: segments, name: "Segments" },
  { sketch: hex, name: "Hex" },
  { sketch: hexH, name: "Hex (Horizontal)" },
  { sketch: tri, name: "Triangles" },
]

export default sketches
