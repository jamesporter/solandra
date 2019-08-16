import { Point2D } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import { Path, SimplePath, Rect, RegularPolygon, Star } from "../lib/path"
import { arrayOf } from "../lib/collectionOps"

const dividing3 = (p: SCanvas) => {
  p.background(0, 0, 5)
  new RegularPolygon({ at: p.meta.center, r: 0.4, n: 20 }).path.segmented
    .flatMap(s => s.exploded({ scale: 0.75, magnitude: 1.1 }))
    .map((s, i) => s.rotated((i * Math.PI) / 2))
    .forEach((s, i) => {
      p.setFillColour(i * 5, 80, 60, 0.9)
      p.fill(s)
    })
}

const dividing4 = (p: SCanvas) => {
  p.background(45, 20, 95)
  new RegularPolygon({ at: p.meta.center, r: 0.4, n: 24 }).path.segmented
    .flatMap(s => s.exploded({ scale: 0.8, magnitude: 1.1 }))
    .map((s, i) =>
      s
        .rotated((i * Math.PI) / 4)
        .moved([p.gaussian({ sd: 0.06 }), p.gaussian({ sd: 0.04 })])
    )
    .forEach((s, i) => {
      p.setFillColour(210 + (i % 40), 80, 60, 0.8)
      p.fill(s)
    })
}

const dividing5 = (p: SCanvas) => {
  p.background(210, 20, 95)
  p.setFillColour(215, 95, 20, 0.8)
  p.forMargin(0.1, (at, [w, h]) => {
    new Rect({ at, w, h })
      .split({ orientation: "horizontal", split: arrayOf(10, () => 1) })
      .flatMap(r =>
        r.split({ orientation: "vertical", split: arrayOf(10, () => 1) })
      )
      .flatMap(r => r.path.exploded({ scale: 0.85, magnitude: 1.0 }))
      .map(s => s.rotated(p.gaussian({ sd: Math.PI / 8 })))
      .forEach(s => p.fill(s))
  })
}

const dividing7 = (p: SCanvas) => {
  p.background(90, 20, 95)
  p.lineWidth = 0.004

  p.forMargin(0.1, (at, [w, h]) => {
    new Rect({ at, w, h })
      .split({ orientation: "horizontal", split: arrayOf(8, () => 1) })
      .flatMap(r =>
        r.split({ orientation: "vertical", split: arrayOf(8, () => 1) })
      )
      .map(r => r.path)
      .flatMap(s => s.exploded({ scale: 0.9, magnitude: 1 }))
      .filter(_ => p.random() > 0.2)
      .map(s =>
        s
          .scaled(p.gaussian({ mean: 1, sd: 0.2 }))
          .rotated(p.gaussian({ sd: Math.PI / 4 }))
      )
      .flatMap(s => s.exploded({ scale: 0.9, magnitude: 1 }))
      .forEach((s, i) => {
        p.setFillColour(0 + (i % 60), 90, 50)
        p.draw(s)
        p.fill(s)
      })
  })
}

const dividing8 = (p: SCanvas) => {
  p.background(0, 0, 85)
  p.setFillColour(0, 0, 20)
  p.fill(new RegularPolygon({ n: 6, at: p.meta.center, r: 0.44 }))
  new RegularPolygon({ n: 6, at: p.meta.center, r: 0.4 }).path
    .subdivide({ m: 1, n: 5 })
    .forEach((s, i) => {
      p.setFillColour(i * 20, 50, 50)
      p.fill(s)
    })
  new RegularPolygon({ n: 6, at: p.meta.center, r: 0.4 }).path
    .subdivide({ m: 0, n: 3 })
    .forEach((s, i) => {
      p.setFillColour(i * 20, 50, 50, 0.5)
      p.fill(s)
    })

  p.setFillColour(60, 50, 20, 0.1)
  p.fill(
    new RegularPolygon({ n: 6, at: p.meta.center, r: 0.4 }).path.subdivide({
      m: 2,
      n: 5,
    })[0]
  )
}

const dividing9 = (p: SCanvas) => {
  p.background(45, 20, 85)
  p.setFillColour(0, 0, 20)
  const hue = p.sample([160, 0, 190])

  p.downFrom(2, n => {
    const s = n / 2
    new Star({ at: p.meta.center, r: s * 0.4, r2: s * 0.2, n: 12 }).path
      .subdivide({ m: 0, n: 12 })
      .forEach((s, i) => {
        p.setFillColour(hue + i * 40, 90, 40)
        p.fill(s)
      })
    p.setFillColour(45, 20, 70 + 5 * n)
    p.fill(new Star({ at: p.meta.center, r: s * 0.3, r2: s * 0.15, n: 12 }))
  })
}

const dividing10 = (p: SCanvas) => {
  p.background(0, 0, 85)
  p.setFillColour(0, 0, 0, 0.5)
  const points: Point2D[] = []
  new RegularPolygon({ n: 24, r: 0.4, at: p.meta.center }).path
    .exploded({ scale: 0.95, magnitude: 1 })
    .flatMap(s => s.exploded({ scale: 0.95, magnitude: 1 }))
    .map(s => s.rotated(p.gaussian({ sd: Math.PI / 2 })))
    .forEach(s => {
      p.fill(s)
      points.push(s.centroid)
    })

  p.lineWidth = 0.01
  p.setStrokeColour(0, 0, 0, 0.2)
  p.draw(SimplePath.withPoints(p.shuffle(points)))
}

const advancedDivisions2 = (p: SCanvas) => {
  p.background(215, 90, 10)
  const points: Point2D[] = []
  p.forMargin(0.1, ([x, y], [dX, dY]) => {
    p.times(10, n => {
      points.push([x + (n * dX) / 10, y])
    })
    p.times(10, n => {
      points.push([x + dX, y + (n * dY) / 10])
    })
    p.times(10, n => {
      points.push([x + dX - (n * dX) / 10, y + dY])
    })
    p.times(10, n => {
      points.push([x, y + dY - (n * dY) / 10])
    })
  })

  const path = Path.startAt(points[0])
  for (let i = 1; i < points.length; i++) {
    path.addCurveTo(points[i], {
      curveSize: p.gaussian({ mean: 0.6, sd: 0.15 }),
    })
  }
  path.addCurveTo(points[0])

  path.exploded().forEach(s => {
    p.setFillColour(0, 0, 95, p.sample([0.2, 0.4]))
    p.fill(s)
  })

  path.subdivide({ m: 5, n: 25, curve: { curveSize: 0.5 } }).forEach(s => {
    p.fill(s.scaled(0.8))
    p.fill(s.rotated(Math.PI / 2))
  })

  path.subdivide({ m: 5, n: 25, curve: { curveSize: -0.5 } }).forEach(s => {
    p.fill(s.scaled(0.8))
    p.fill(s.rotated(Math.PI / 2))
    p.fill(s.rotated(-Math.PI / 2))
  })

  path
    .exploded()
    .flatMap(s => s.exploded())
    .filter(_ => p.random() < 0.4)
    .forEach(s => {
      p.setFillColour(0, 0, 95, p.sample([0.1, 0.2]))
      p.fill(s)
    })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: dividing3, name: "Dividing 3" },
  { sketch: dividing4, name: "Dividing 4" },
  { sketch: dividing5, name: "Dividing 5" },
  { sketch: dividing7, name: "Dividing 7" },
  { sketch: dividing8, name: "Dividing 8" },
  { sketch: dividing9, name: "Dividing 9" },
  { sketch: dividing10, name: "Dividing 10" },
  { sketch: advancedDivisions2, name: "Advanced Divisions 2" },
]

export default sketches
