import { Point2D } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import {
  Path,
  SimplePath,
  Star,
  RegularPolygon,
  Rect,
  Spiral,
  Arc,
  HollowArc,
  RoundedRect,
  Ellipse,
  Circle,
} from "../lib"
import { arrayOf } from "../lib/collectionOps"
import { perlin2, v } from "../lib"

const dividing3 = (p: SCanvas) => {
  p.background(0, 0, 5)
  new RegularPolygon({ at: p.meta.center, r: 0.4, n: 20 }).path.segmented
    .flatMap((s) => s.exploded({ scale: 0.75, magnitude: 1.1 }))
    .map((s, i) => s.rotated((i * Math.PI) / 2))
    .forEach((s, i) => {
      p.setFillColor(i * 5, 80, 60, 0.9)
      p.fill(s)
    })
}

const dividing4 = (p: SCanvas) => {
  p.background(45, 20, 95)
  new RegularPolygon({ at: p.meta.center, r: 0.4, n: 24 }).path.segmented
    .flatMap((s) => s.exploded({ scale: 0.8, magnitude: 1.1 }))
    .map((s, i) =>
      s
        .rotated((i * Math.PI) / 4)
        .moved([p.gaussian({ sd: 0.06 }), p.gaussian({ sd: 0.04 })])
    )
    .forEach((s, i) => {
      p.setFillColor(210 + (i % 40), 80, 60, 0.8)
      p.fill(s)
    })
}

const dividing5 = (p: SCanvas) => {
  p.background(210, 20, 95)
  p.setFillColor(215, 95, 20, 0.8)
  p.forMargin(0.1, (at, [w, h]) => {
    new Rect({ at, w, h })
      .split({ orientation: "horizontal", split: arrayOf(10, () => 1) })
      .flatMap((r) =>
        r.split({ orientation: "vertical", split: arrayOf(10, () => 1) })
      )
      .flatMap((r) => r.path.exploded({ scale: 0.85, magnitude: 1.0 }))
      .map((s) => s.rotated(p.gaussian({ sd: Math.PI / 8 })))
      .forEach((s) => p.fill(s))
  })
}

const dividing7 = (p: SCanvas) => {
  p.background(90, 20, 95)
  p.lineWidth = 0.004
  const explosionSize = 2 + Math.cos(p.t)

  p.forMargin(0.1, (at, [w, h]) => {
    new Rect({ at, w, h })
      .split({ orientation: "horizontal", split: arrayOf(8, () => 1) })
      .flatMap((r) =>
        r.split({ orientation: "vertical", split: arrayOf(8, () => 1) })
      )
      .map((r) => r.path)
      .flatMap((s) => s.exploded({ scale: 0.9, magnitude: 1 }))
      .filter((_) => p.random() > 0.2)
      .map((s) =>
        s
          .scaled(p.gaussian({ mean: 1, sd: 0.2 }))
          .rotated(p.gaussian({ sd: Math.PI / 4 }))
      )
      .flatMap((s) =>
        s.exploded({
          scale: 0.6 + 0.3 * explosionSize,
          magnitude: explosionSize,
        })
      )
      .forEach((s, i) => {
        p.setFillColor(0 + (i % 60), 90, 50)
        p.draw(s)
        p.fill(s)
      })
  })
}

const dividing8 = (p: SCanvas) => {
  p.background(0, 0, 85)
  p.setFillColor(0, 0, 20)
  p.fill(new RegularPolygon({ n: 6, at: p.meta.center, r: 0.44 }))
  new RegularPolygon({ n: 6, at: p.meta.center, r: 0.4 }).path
    .subdivide({ m: 1, n: 5 })
    .forEach((s, i) => {
      p.setFillColor(i * 20, 50, 50)
      p.fill(s)
    })
  new RegularPolygon({ n: 6, at: p.meta.center, r: 0.4 }).path
    .subdivide({ m: 0, n: 3 })
    .forEach((s, i) => {
      p.setFillColor(i * 20, 50, 50, 0.5)
      p.fill(s)
    })

  p.setFillColor(60, 50, 20, 0.1)
  p.fill(
    new RegularPolygon({ n: 6, at: p.meta.center, r: 0.4 }).path.subdivide({
      m: 2,
      n: 5,
    })[0]
  )
}

const dividing9 = (p: SCanvas) => {
  p.background(45, 20, 85)
  p.setFillColor(0, 0, 20)
  const hue = p.sample([160, 0, 190])

  p.downFrom(2, (n) => {
    const s = n / 2
    new Star({ at: p.meta.center, r: s * 0.4, r2: s * 0.2, n: 12 }).path
      .subdivide({ m: 0, n: 12 })
      .forEach((s, i) => {
        p.setFillColor(hue + i * 40, 90, 40)
        p.fill(s)
      })
    p.setFillColor(45, 20, 70 + 5 * n)
    p.fill(new Star({ at: p.meta.center, r: s * 0.3, r2: s * 0.15, n: 12 }))
  })
}

const dividing10 = (p: SCanvas) => {
  p.background(0, 0, 85)
  p.setFillColor(0, 0, 0, 0.5)
  const points: Point2D[] = []
  new RegularPolygon({ n: 24, r: 0.4, at: p.meta.center }).path
    .exploded({ scale: 0.95, magnitude: 1 })
    .flatMap((s) => s.exploded({ scale: 0.95, magnitude: 1 }))
    .map((s) => s.rotated(p.gaussian({ sd: Math.PI / 2 })))
    .forEach((s) => {
      p.fill(s)
      points.push(s.centroid)
    })

  p.lineWidth = 0.01
  p.setStrokeColor(0, 0, 0, 0.2)
  p.draw(SimplePath.withPoints(p.shuffle(points)))
}

const advancedDivisions2 = (p: SCanvas) => {
  p.background(215, 90, 10)
  const points: Point2D[] = []
  p.forMargin(0.1, ([x, y], [dX, dY]) => {
    p.times(10, (n) => {
      points.push([x + (n * dX) / 10, y])
    })
    p.times(10, (n) => {
      points.push([x + dX, y + (n * dY) / 10])
    })
    p.times(10, (n) => {
      points.push([x + dX - (n * dX) / 10, y + dY])
    })
    p.times(10, (n) => {
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

  path.exploded().forEach((s) => {
    p.setFillColor(0, 0, 95, p.sample([0.2, 0.4]))
    p.fill(s)
  })

  path.subdivide({ m: 5, n: 25, curve: { curveSize: 0.5 } }).forEach((s) => {
    p.fill(s.scaled(0.8))
    p.fill(s.rotated(Math.PI / 2))
  })

  path.subdivide({ m: 5, n: 25, curve: { curveSize: -0.5 } }).forEach((s) => {
    p.fill(s.scaled(0.8))
    p.fill(s.rotated(Math.PI / 2))
    p.fill(s.rotated(-Math.PI / 2))
  })

  path
    .exploded()
    .flatMap((s) => s.exploded())
    .filter((_) => p.random() < 0.4)
    .forEach((s) => {
      p.setFillColor(0, 0, 95, p.sample([0.1, 0.2]))
      p.fill(s)
    })
}

const curvify = (p: SCanvas) => {
  p.background(150, 90, 30)
  p.setStrokeColor(0, 0, 95, 0.4)
  p.times(20, () => {
    p.draw(
      new RegularPolygon({ at: p.meta.center, r: 0.3, n: 11 }).path.curvify(
        () => ({
          curveSize: p.gaussian({ mean: 2, sd: 0.5 }),
          polarity: p.randomPolarity(),
        })
      )
    )
  })
}

const curvify2 = (p: SCanvas) => {
  p.background(150, 20, 20)
  p.setStrokeColor(0, 0, 95)
  new RegularPolygon({ at: p.meta.center, r: 0.3, n: 12 }).path
    .exploded({ magnitude: 1.2, scale: 0.8 })
    .map((sp, _i) => sp.curvify(() => ({ curveSize: -0.25 })))
    .forEach((s) => p.draw(s))
  const middle = new RegularPolygon({
    at: p.meta.center,
    r: 0.25,
    n: 12,
  }).path.curvify((i) => (i % 2 === 0 ? { curveSize: -0.9 } : null))
  p.setFillColor(0, 0, 75, 0.4)
  p.fill(middle)
  p.setStrokeColor(0, 0, 75)
  p.draw(middle)
}

const spirals = (p: SCanvas) => {
  p.background(195, 30, 95)
  p.lineWidth = 0.0025
  new Spiral({
    at: p.meta.center,
    l: 0.05,
    n: 400,
    rate: p.oscillate({ from: 0.004, to: 0.005, rate: 0.15 }),
  }).path.edges.forEach((edge, i) => {
    p.setStrokeColor(i / 3, 70, 30)
    p.draw(edge.rotated(Math.PI / 4 + (i * Math.PI) / 2))
  })
}

const spirals2 = (p: SCanvas) => {
  p.background(195, 10, 95)
  p.lineWidth = 0.0025
  p.setStrokeColor(0, 50, 20, 0.9)
  new Spiral({
    at: p.meta.center,
    l: 0.04,
    n: 500,
    rate: p.oscillate({ from: 0.004, to: 0.005, rate: 0.15 }),
  }).path.edges.forEach((edge) => {
    const offsetA = 2 * Math.PI * perlin2(...edge.points[0])
    const offset = v.scale([Math.cos(offsetA), Math.sin(offsetA)], 0.1)
    p.draw(edge.rotated(Math.PI / 4).moved(offset))
  })
}

const pathConversions = (p: SCanvas) => {
  const h = p.meta.bottom

  p.background(30, 20, 95)

  p.setFillColor(200, 70, 50)
  p.fill(
    new Arc({ at: [0.25, 0.25 * h], r: 0.1, a: 0, a2: Math.PI / 2 }).toPath(4)
  )

  p.setFillColor(340, 70, 50)
  p.fill(
    new HollowArc({
      at: [0.75, 0.25 * h],
      r: 0.1,
      r2: 0.05,
      a: 0,
      a2: (3 * Math.PI) / 2,
    }).toPath(6)
  )

  p.setFillColor(120, 70, 50)
  p.fill(
    new RoundedRect({
      at: [0.25, 0.75 * h],
      w: 0.2,
      h: 0.1,
      r: 0.03,
      align: "center",
    }).toPath(4)
  )

  p.setFillColor(60, 70, 50)
  p.fill(new Ellipse({ at: [0.75, 0.75 * h], w: 0.2, h: 0.15 }).toPath(6))
}

const beadsOnAPath = (p: SCanvas) => {
  p.background(35, 25, 95)
  const wire = SimplePath.withPoints(
    p.build(p.range, { from: 0, to: 1, n: 40 }, (x) => {
      return [x, 0.33 + 0.12 * Math.sin(x * 7) + 0.05 * perlin2(x * 3, 0)]
    })
  ).chaiken({ n: 2 })

  p.lineWidth = 0.004
  p.setStrokeColor(210, 30, 40)
  p.draw(wire)

  // evenly spaced by distance, so the beads do not bunch up on the bends
  p.alongPath({ path: wire, n: 40 }, (at, angle, i) => {
    p.setFillColor(20 + i * 4, 75, 55)
    p.withTranslation(at, () => {
      p.withRotation(angle, () => {
        p.fill(new Ellipse({ at: [0, 0], w: 0.02, h: 0.035 }))
      })
    })
  })
}

const alongAStar = (p: SCanvas) => {
  p.background(215, 40, 15)

  const star = new Star({ at: p.meta.center, n: 5, r: 0.28, r2: 0.13 })
  p.setStrokeColor(45, 70, 50, 0.4)
  p.lineWidth = 0.002
  p.draw(star)

  // a shape can be followed directly: Star (like Line, Rect, RegularPolygon
  // and Spiral) has a path. Each tick is turned to sit across the outline,
  // which is what the angle the callback gets is for.
  p.alongPath({ path: star, n: 60, inclusive: false }, (at, angle, i) => {
    p.setFillColor(45 + i * 3, 85, 60)
    p.withTranslation(at, () => {
      p.withRotation(angle, () => {
        p.fill(
          new Rect({
            at: [0, 0],
            w: 0.006,
            h: 0.03 + 0.03 * (i % 3),
            align: "center",
          })
        )
      })
    })
  })
}

const insideAStar = (p: SCanvas) => {
  p.background(35, 25, 95)
  const outline = new Star({ at: p.meta.center, n: 7, r: 0.35, r2: 0.16 }).path

  p.lineWidth = 0.003
  p.setStrokeColor(215, 30, 40, 0.5)
  // boundingBox is in exactly the form Rect takes
  p.draw(new Rect(outline.boundingBox))
  p.setStrokeColor(215, 30, 40)
  p.draw(outline)

  // dots inside the star itself, not merely inside the box around it
  p.times(2000, () => {
    const at = p.randomPoint()
    if (outline.containsPoint(at)) {
      p.setFillColor(20 + 300 * outline.area, 70, 55, 0.7)
      p.fill(new Circle({ at, r: 0.005 }))
    }
  })
}

const hulls = (p: SCanvas) => {
  p.background(215, 35, 15)

  p.forTiling({ n: 3, type: "square", margin: 0.05 }, (_at, [dX], c, i) => {
    // the shape a scattered set of points suggests, from the points alone
    const cloud = SimplePath.withPoints(
      p.build(p.times, 9, () => p.perturb({ at: c, magnitude: dX * 0.8 }))
    )

    p.setFillColor(20 + i * 24, 70, 55, 0.55)
    p.fill(cloud.convexHull)
    p.setFillColor(0, 0, 95, 0.9)
    cloud.points.forEach((at) => p.fill(new Circle({ at, r: 0.006 })))
  })
}

const faceted = (p: SCanvas) => {
  p.background(40, 20, 95)
  p.lineWidth = 0.004

  // a smoothed loop carries far more points than its shape needs; dropping
  // the ones that barely matter is a tidy up, and, done heavily, an effect
  const blob = SimplePath.withPoints(
    p.build(p.aroundCircle, { at: [0, 0], r: 0.4, n: 20 }, (at) =>
      p.perturb({ at, magnitude: 0.2 })
    )
  )
    .close()
    .chaiken({ n: 4, looped: true })

  const tolerances = [0, 0.001, 0.004, 0.01, 0.03, 0.08]
  p.forTiling({ n: 3, type: "square", margin: 0.05 }, (_at, [dX], c, i) => {
    const tolerance = tolerances[i % tolerances.length]
    const path = (
      tolerance === 0 ? blob : blob.simplified({ tolerance })
    ).scaled(dX * 0.85)
    p.setStrokeColor(200 + i * 25, 60, 45)
    // simplifying moves the centroid a little, so centre each one on its tile
    p.draw(path.moved(v.subtract(c, path.centroid)))
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
  { sketch: curvify, name: "Paths to Curves" },
  { sketch: curvify2, name: "Paths to Curves 2" },
  { sketch: spirals, name: "Spirals" },
  { sketch: spirals2, name: "Spirals 2" },
  { sketch: pathConversions, name: "Path Conversions" },
  { sketch: beadsOnAPath, name: "Beads on a Path" },
  { sketch: alongAStar, name: "Along a Star" },
  { sketch: insideAStar, name: "Inside a Star" },
  { sketch: hulls, name: "Hulls" },
  { sketch: faceted, name: "Faceted" },
]

export default sketches
