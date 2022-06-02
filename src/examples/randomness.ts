import { Point2D } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import {
  Path,
  SimplePath,
  Line,
  RegularPolygon,
  Circle,
  Rect,
  Spiral,
} from "../lib"
import { add, scale } from "../lib/vectors"
import { perlin2 } from "../lib/noise"
import { RadialGradient } from "../lib/gradient"
import { clamp } from "../lib"

const noiseField = (p: SCanvas) => {
  const delta = 0.01
  const s = 8
  p.lineWidth = 0.0025

  p.times(250, (n) => {
    p.setStrokeColor(195 + n / 12.5, 90, 30, 0.7)
    let pt = p.randomPoint()
    const sp = SimplePath.startAt(pt)
    while (true) {
      const a = Math.PI * 2 * perlin2(pt[0] * s, pt[1] * s)
      const nPt = add(pt, [delta * Math.cos(a), delta * Math.sin(a)])
      if (p.inDrawing(nPt)) {
        pt = nPt
        sp.addPoint(nPt)
      } else {
        break
      }
    }
    p.draw(sp.chaiken({ n: 2 }))
  })
}

const randomness1b = (p: SCanvas) => {
  p.times(25, (n) => {
    p.setFillColor(175 + n, 80, 50, 0.4)
    const values = p
      .build(p.times, 50, () => p.gaussian())
      .sort((a, b) => (a > b ? -1 : 1))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    p.forHorizontal(
      {
        n: values.length,
        margin: 0.1,
      },
      ([x, y], [dX, dY], _c, i) => {
        const h = dY * ((values[i] - min) / range)
        p.fill(
          new Rect({
            at: [x + n * 0.04 * dX, y + dY / 2 - h / 2],
            w: dX * 0.2,
            h,
          })
        )
      }
    )
  })
}

const randomness1c = (p: SCanvas) => {
  p.background(205, 20, 85)
  p.forTiling({ n: 20, type: "square", margin: 0.1 }, (_pt, [w], at) => {
    p.setFillColor(195, 70, 40)
    p.fill(new Circle({ at, r: w * 0.45 }))

    p.setFillColor(205, 70, 80)
    p.fill(new Circle({ at: p.perturb({ at, magnitude: w / 3 }), r: w * 0.3 }))
  })
}

const rectangles = (p: SCanvas) => {
  p.lineWidth = 0.005

  p.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setFillColor(214 * x, 100, 35 + 10 * y, 0.7)
    p.fill(
      new Rect({
        at: [x + dX / 8, y + dY / 8],
        w: dX * p.random() * 0.75,
        h: dY * p.random() * 0.75,
      })
    )
  })
}

const littleAbstracts = (p: SCanvas) => {
  p.background(200, 10, 20)
  p.forTiling({ n: 8, margin: 0.1, type: "square" }, (at, d, c, i) => {
    p.setFillColor(p.uniformRandomInt({ from: 200, to: 260 }), 50, 50)
    const rect = new Rect({
      at: add(at, scale(d, 0.1)),
      w: d[0] * 0.8,
      h: d[1] * 0.8,
    })
    p.fill(rect)
    p.withClipping(rect, () => {
      p.setFillColor(0, 0, 100, 0.2)
      const h = (p.random() * 0.5 + 0.1) * d[1] * 0.8
      p.fill(
        new Rect({
          at: add(add(at, scale(d, 0.1)), [0, d[1] * 0.8 - h]),
          w: d[0] * 0.8,
          h,
        })
      )

      p.times(3, () => {
        p.setFillColor(200, p.sample([20, 40]), 90, 0.4)
        p.fill(
          new RegularPolygon({
            at: p.perturb({ at: c, magnitude: d[0] / 1.5 }),
            n: p.poisson(4) + 3,
            r: d[0] / 6,
          })
        )
      })
    })
  })
}

const recordCoverish3 = (p: SCanvas) => {
  p.background(30, 20, 5)
  p.lineWidth = 0.0015
  p.withTranslation(p.meta.center, () => {
    p.times(100, () => {
      const a = p.gaussian({ mean: Math.PI, sd: Math.PI / 12 })
      p.withRotation(a, () => {
        p.setStrokeColor(a * 12, 100, 70, 0.9)
        p.draw(new Line([-1, 0], [1, 0]))
      })
    })
  })
}

const recordCoverish4 = (p: SCanvas) => {
  p.background(30, 10, 20)
  p.lineWidth = 0.001
  p.setStrokeColor(0, 0, 90)
  p.forTiling({ n: 10, type: "square", margin: 0.15 }, (at, d, c) => {
    p.draw(
      new Rect({
        at,
        w: d[0],
        h: d[1],
      })
    )
    p.withClipping(
      new Rect({
        at,
        w: d[0],
        h: d[1],
      }),
      () => {
        p.setFillColor(30, 20, p.uniformRandomInt({ from: 60, to: 80 }))
        const a = p.gaussian({ sd: Math.PI / 8 })
        const fY = p.gaussian({ mean: 0.04, sd: 0.01 })
        p.withTranslation(add(c, [0, fY]), () => {
          p.withRotation(a, () => {
            p.fill(new Rect({ at: scale(d, -0.5), w: d[0], h: d[1] }))
          })
        })
      }
    )
  })
}

const stackedCurves = (p: SCanvas) => {
  p.background(210, 40, 15)
  p.withRandomOrder(
    p.forHorizontal,
    { n: 20, margin: 0.1 },
    ([x, y], [dX, dY], c, i) => {
      let sp = SimplePath.withPoints([])
      p.times(10, (n) => {
        sp.addPoint([x + dX / 2 + p.gaussian({ sd: 0.01 }), y + (n * dY) / 10])
      })
      p.downFrom(10, (n) => {
        sp.addPoint([x - dX / 2 - p.gaussian({ sd: 0.01 }), y + (n * dY) / 10])
      })
      sp.close()
      p.setFillColor(120 + i * 5, 60, 50, 0.85)

      p.fill(sp.chaiken({ n: 5, looped: true }))
    }
  )
}

const stackedCurves2 = (p: SCanvas) => {
  const M = 0.075
  const N = 20
  const HUES = [190, 195, 200, 210, 215, 220, 170, 30, 40]
  p.background(40, 80, 95)
  let sp = SimplePath.withPoints([])
  p.times(p.meta.bottom * 13, (n) => {
    sp.addPoint([-0.2 + p.gaussian({ sd: 0.01 }), n / 10])
  })
  p.draw(sp)

  const paths: SimplePath[] = [sp]
  for (let i = 0; i < N; i++) {
    paths.push(paths[i].transformed(([x, y]) => [x + 0.02 * p.poisson(4), y]))
  }

  p.withClipping(
    new Rect({ at: [M, M], w: p.meta.right - 2 * M, h: p.meta.bottom - 2 * M }),
    () => {
      for (let i = 0; i < N - 1; i++) {
        p.proportionately([
          [1, () => p.setFillColor(p.sample(HUES), 95, 50)],
          [1, () => p.setFillColor(p.sample(HUES), 40, 80)],
        ])

        p.fill(
          paths[i]
            .withAppended(
              paths[i + 1].reversed.transformed(([x, y]) => [x + 0.01, y])
            )
            .chaiken({ n: 4 })
        )
      }
    }
  )
}

const minis = (p: SCanvas) => {
  p.background(45, 20, 10)
  p.forTiling({ n: 7, margin: 0.075 }, ([x, y], [dX, dY], [cX, cY], i) => {
    p.withClipping(new Rect({ at: [x, y], w: dX, h: dY }), () => {
      p.background(i * 27, 20, 65)
      let nPt: Point2D = [cX, cY]
      p.times(6, (j) => {
        p.setFillColor(i * 27 + j * 12, 90, 30, 0.3)
        nPt = p.perturb({ at: nPt, magnitude: dX / 1.5 })
        p.fill(new Circle({ at: nPt, r: dX / 2 }))
      })
    })
  })
}

const weave = (p: SCanvas) => {
  const s = 0.01
  const h2 = 220
  p.background(45, 50, 75)
  p.forTiling(
    { n: 20, type: "square", margin: 0.1 },
    ([x, y], [dX, dY], [cX, cY]) => {
      p.proportionately([
        [
          1,
          () => {
            p.setFillColor(0, 0, 50)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
            p.setFillColor(h2, 80, 10)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
          },
        ],
        [
          1,
          () => {
            p.setFillColor(h2, 80, 10)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
            p.setFillColor(0, 0, 50)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
          },
        ],
      ])
    }
  )
}

const weave2 = (p: SCanvas) => {
  const s = 0.01
  const h1 = 220
  const h2 = 0
  p.background(35, 80, 65)
  p.forTiling(
    { n: 15, type: "square", margin: 0.1 },
    ([x, y], [dX, dY], [cX, cY]) => {
      p.proportionately([
        [
          1,
          () => {
            p.setFillColor(h1, 60, 30)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
          },
        ],
        [
          1,
          () => {
            p.setFillColor(h1, 60, 30)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
            p.setFillColor(h2, 80, 50)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
          },
        ],
        [
          1,
          () => {
            p.setFillColor(h2, 80, 50)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
            p.setFillColor(h1, 60, 30)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
          },
        ],
        [
          1,
          () => {
            p.setFillColor(h2, 80, 50)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
          },
        ],
      ])
    }
  )
}

const explosion = (p: SCanvas) => {
  p.background(355, 70, 32)
  const N = 45
  p.withTranslation(p.meta.center, () => {
    p.times(5, (m) => {
      const sp = SimplePath.withPoints([])
      p.aroundCircle({ at: [0, 0], r: 0.1 + 0.08 * m, n: 30 }, ([x, y]) => {
        sp.addPoint(p.perturb({ at: [x, y] }))
      })
      sp.close()
      p.setFillColor(210, 45, 90, 0.2)
      p.fill(sp.chaiken({ n: 2, looped: true }))
    })

    p.setFillColor(45, 90, 100)
    p.times(N, (n) => {
      p.withRotation((2 * Math.PI * n) / N, () => {
        const start = p.perturb({
          at: [0.1 + p.random() * 0.2, 0],
          magnitude: 0.03,
        })
        const end = p.perturb({ at: [0.4, 0], magnitude: 0.1 })
        p.fill(
          Path.startAt(start)
            .addCurveTo(end, { curveSize: 0.05 })
            .addCurveTo(start, { curveSize: 0.05, polarlity: 1 })
        )
      })
    })
  })
}

const contoured = (p: SCanvas) => {
  let e = 0.01
  let s = 3
  p.lineWidth = 0.005
  p.background(0, 30, 96)
  const sPerlin = (x: number, y: number) => perlin2(x * s, y * s)
  p.times(40, () => {
    p.setStrokeColor(
      p.sample([215, 200, 0]),
      p.sample([50, 80]),
      p.sample([40, 20, 10])
    )
    let spt = p.randomPoint()
    let pt: Point2D = [spt[0], spt[1]]
    let p1 = SimplePath.withPoints([spt])
    while (p.inDrawing(pt)) {
      let newPt = add(pt, [
        e * Math.cos(sPerlin(...pt)),
        e * Math.sin(sPerlin(...pt)),
      ])
      p1.addPoint(newPt)
      pt = newPt
    }
    p.draw(p1)

    let p2 = SimplePath.withPoints([spt])
    pt = [spt[0], spt[1]]
    while (p.inDrawing(pt)) {
      let newPt = add(pt, [
        -e * Math.cos(sPerlin(...pt)),
        -e * Math.sin(sPerlin(...pt)),
      ])
      p2.addPoint(newPt)
      pt = newPt
    }
    p.draw(p2)
  })
}

const contoured2 = (p: SCanvas) => {
  let e = 0.01
  let s = 3
  p.lineWidth = 0.005
  p.background(170, 40, 95)

  p.times(30, (n) => {
    const sPerlin = (x: number, y: number) =>
      perlin2(x * s + n / 50, y * s + n / 100)
    p.setStrokeColor(
      p.sample([150, 170, 75]),
      p.sample([50, 80]),
      p.sample([40, 20, 10]),
      0.75
    )
    let spt = p.randomPoint()
    let pt: Point2D = [spt[0], spt[1]]
    let p1 = SimplePath.withPoints([spt])
    while (p.inDrawing(pt)) {
      let newPt = add(pt, [
        e * Math.cos(sPerlin(...pt)),
        e * Math.sin(sPerlin(...pt)),
      ])
      p1.addPoint(newPt)
      pt = newPt
    }
    p.draw(p1)

    let p2 = SimplePath.withPoints([spt])
    pt = [spt[0], spt[1]]
    while (p.inDrawing(pt)) {
      let newPt = add(pt, [
        -e * Math.cos(sPerlin(...pt)),
        -e * Math.sin(sPerlin(...pt)),
      ])
      p2.addPoint(newPt)
      pt = newPt
    }
    p.draw(p2)
  })
}

const night = (p: SCanvas) => {
  p.background(0, 0, 5)
  p.forTiling({ n: 15, type: "square" }, (_pt, [dX], c) => {
    const hue = p.sample([45, 55, 60])
    const loc = p.perturb({ at: c, magnitude: 0.4 })
    p.setFillGradient(
      new RadialGradient({
        start: loc,
        end: loc,
        rStart: 0,
        rEnd: dX,
        colors: [
          [0, { h: hue, s: 80, l: 70 }],
          [p.sample([0.1, 0.2, 0.3, 0.5]), { h: hue, s: 80, l: 90, a: 0 }],
        ],
      })
    )
    p.fill(new Circle({ at: loc, r: dX }))
  })
}

const noiseGlow = (p: SCanvas) => {
  p.background(0, 0, 10)
  p.forTiling({ n: 50, type: "square" }, ([x, y], [dX], at) => {
    const maxR = dX / 1.8
    const value = clamp(
      { from: 0.2, to: 1 },
      1.5 * perlin2(x * 6 + 0.3, y * 15 + 0.5)
    )
    const h = 120 - 120 * value
    p.setFillColor(h, 80, 50, 0.2)
    p.fill(new Circle({ at, r: maxR * value * 1.5 }))
    p.setFillColor(h, 90, 50)
    p.fill(new Circle({ at, r: maxR * value }))
  })
}

const perturbedSpiral = (p: SCanvas) => {
  let r = 0.001
  let a = 0
  const {
    center: [cX, cY],
  } = p.meta

  p.background(45, 85, 97)
  p.lineWidth = 0.001
  p.times(800, (n) => {
    p.setStrokeColor(p.sample([220, 190, 215]), 50, p.sample([20, 40]))
    const pA = a + p.gaussian({ sd: Math.PI })
    p.draw(
      new Line(
        [cX + Math.cos(pA) * r, cY + Math.sin(pA) * r],
        [cX + Math.cos(pA) * (r + 0.1), cY + Math.sin(pA) * (r + 0.1)]
      )
    )
    r += 0.001
    a += 0.1
  })
}

const perturbedSpiral2 = (p: SCanvas) => {
  p.background(25, 40, 95)
  p.lineWidth = 0.002
  p.setStrokeColor(205, 70, 40)
  p.withTranslation(p.meta.center, () => {
    const path = SimplePath.withPoints([])
    let a = 0
    let l = 0.05
    let r = l
    path.addPoint([r * Math.cos(a), r * Math.sin(a)])
    p.times(400, () => {
      const dA = 2 * Math.asin(l / (r * 2))
      r += 0.005 * dA
      a += dA
      path.addPoint(
        p.perturb({
          at: [r * Math.cos(a), r * Math.sin(a)],
          magnitude: 0.0125 * (1.1 + Math.cos(p.t)),
        })
      )
    })
    p.draw(path)
  })
}

const perturbedSpiral3 = (p: SCanvas) => {
  p.background(0, 0, 95)
  p.lineWidth = 0.002
  p.setStrokeColor(165, 70, 30)

  new Spiral({ at: p.meta.center, l: 0.05, n: 400 }).path.edges.forEach(
    (edge) => {
      p.draw(
        edge.rotated(p.gaussian({ sd: Math.PI / (10 + Math.cos(p.t * 2) * 8) }))
      )
    }
  )
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: noiseField, name: "Noise Field" },
  { sketch: rectangles, name: "Rectangles" },
  { sketch: randomness1b, name: "Gaussian 2" },
  { sketch: randomness1c, name: "Gaussian 3" },
  { sketch: littleAbstracts, name: "Little Abstracts" },
  { sketch: recordCoverish3, name: "Record Cover 3" },
  { sketch: recordCoverish4, name: "Record Cover 4" },
  { sketch: stackedCurves, name: "Stacked Curves" },
  { sketch: stackedCurves2, name: "Stacked Curves 2" },
  { sketch: minis, name: "Minis" },
  { sketch: weave, name: "Weave" },
  { sketch: weave2, name: "Weave 2" },
  { sketch: explosion, name: "Explosion" },
  { sketch: contoured, name: "Contoured" },
  { sketch: contoured2, name: "Contoured 2" },
  { sketch: night, name: "Night" },
  { sketch: noiseGlow, name: "Noise Glow" },
  { sketch: perturbedSpiral, name: "Perturbed Spiral" },
  { sketch: perturbedSpiral2, name: "Perturbed Spiral 2" },
  { sketch: perturbedSpiral3, name: "Perturbed Spiral 3" },
]

export default sketches
