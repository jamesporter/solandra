import SCanvas from "../lib/sCanvas"
import { Path, CompoundPath, Star, RegularPolygon, Circle } from "../lib/paths"
import { v, Rect } from "../lib"

const compoundPath = (p: SCanvas) => {
  p.background(45, 80, 75)
  p.setFillColour(220, 9, 45, 0.4)
  // To remove a shape from another shape the path winding order must be opposite (hence the reversed)
  p.times(4, n => {
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
    p.setFillColour(220 - i * 40, 30, 45, 0.4)
    const s = 1 + 0.5 * p.random()
    p.times(4, n => {
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
          }).path.transformed(pt => p.perturb(pt, { magnitude: 0.05 })).reversed
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
  p.times(33, n => {
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

  p.times(4, sc => {
    const scale = (sc ** 1.5 + 1) * 0.22
    p.lineWidth = (sc + 1) * 0.002

    p.setStrokeColour(0, 0, 0, 0.9)
    p.draw(path.scaled(scale))
    p.setStrokeColour(0, 0, 0, 0.3)
    p.draw(path.rotated(0.234234 + p.t / 10).scaled(scale))
  })
}

const orderedTiles = (p: SCanvas) => {
  p.background(0, 0, 20)
  p.forTiling(
    { n: 10, type: "square", margin: 0.1, order: "columnFirst" },
    (_, [dX], c, i) => {
      p.setFillColour(i * 3, 80, 60, 0.6)
      p.fill(new Circle({ at: v.subtract(c, [dX / 8, 0]), r: dX / 3 }))
    }
  )
  p.forTiling(
    { n: 10, type: "square", margin: 0.1, order: "rowFirst" },
    (_, [dX], c, i) => {
      p.setFillColour(i * 3, 80, 60, 0.6)
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

      p.setFillColour(t, 90, 40, 0.75)
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
    p.setStrokeColour(45 + i * 10, 100, 70, 0.9)
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

      p.setFillColour(t + 150, 90, 40, 0.75)
      p.shadow = {
        dX: 0,
        dY: 0,
        size: t * 0.0025 * p.oscillate({ from: 0.5, to: 1.5 }),
        colour: {
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

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: compoundPath, name: "Compound Path" },
  { sketch: compoundPath2, name: "Compound Path 2" },
  { sketch: transformingPaths, name: "Transforming Paths" },
  { sketch: orderedTiles, name: "Ordering of Tiles" },
  { sketch: dashes, name: "Dashes" },
  { sketch: shadows, name: "Shadows" },
  { sketch: glow, name: "Glow" },
]

export default sketches
