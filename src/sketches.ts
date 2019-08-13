import { Point2D } from "./lib/types/sol"
import SCanvas from "./lib/sCanvas"
import {
  Path,
  SimplePath,
  Arc,
  Rect,
  Ellipse,
  RoundedRect,
  RegularPolygon,
  Star,
  Hatching,
  HollowArc,
  Circle,
  CompoundPath,
} from "./lib/path"
import { add, pointAlong, scale, distance } from "./lib/vectors"
import { perlin2 } from "./lib/noise"
import { LinearGradient, RadialGradient } from "./lib/gradient"
import { zip2, sum, arrayOf } from "./lib/collectionOps"
import { clamp, isoTransform } from "./lib"
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants"

const rainbow = (p: SCanvas) => {
  p.withRandomOrder(
    p.forTiling,
    { n: 20, type: "square", margin: 0.1 },
    ([i, j], [di, dj]) => {
      p.doProportion(0.6, () => {
        p.setStrokeColour(i * 100, 80, 30 + j * 30, 0.9)
        p.lineWidth = 0.02 + 0.02 * (1 - i)
        p.drawLine(
          [i + di / 4, j + dj / 4],
          [
            i + (di * 3 * j * p.randomPolarity()) / 4,
            j + (dj * 5 * (1 + p.random())) / 4,
          ]
        )
      })
    }
  )
}

const horizontal = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [1, 0],
      colours: [[0, { h: 0, s: 0, l: 95 }], [1, { h: 0, s: 0, l: 85 }]],
    })
  )
  p.forHorizontal({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setStrokeColour(x * 360, 90, 40)
    p.drawLine([x, y], [x + dX, y + dY])
  })
}

const vertical = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, 1],
      colours: [[0, { h: 50, s: 40, l: 95 }], [1, { h: 30, s: 40, l: 90 }]],
    })
  )
  p.forVertical({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    const points = p.build(p.range, { from: x, to: x + dX, n: 20 }, vX => {
      return p.perturb([vX, y + dY / 2], { magnitude: dY / 4 })
    })
    p.lineWidth = 0.01 / p.meta.aspectRatio
    p.setStrokeColour(y * 60, 90, 40)
    p.draw(SimplePath.withPoints(points))
  })
}

const tiling = (p: SCanvas) => {
  p.forTiling({ n: 20, margin: 0.1, type: "square" }, ([x, y], [dX, dY]) => {
    p.setStrokeColour(120 + x * 120 + p.t * 50, 90 - 20 * y, 40)
    p.proportionately([
      [1, () => p.drawLine([x, y], [x + dX, y + dY])],
      [2, () => p.drawLine([x + dX, y], [x, y + dY])],
    ])
  })
}

const flower = (p: SCanvas) => {
  const horizonOffset = p.random() * 0.25
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colours: [
        [0, { h: 215, s: 90, l: 90 }],
        [0.59 + horizonOffset, { h: 215, s: 100, l: 70 }],
        [0.61 + horizonOffset, { h: 150, s: 90, l: 30 }],
        [1, { h: 140, s: 90, l: 40 }],
      ],
    })
  )

  const { right, bottom } = p.meta

  const midX = right / 2
  const midY = bottom / 2
  const ir = p.random() * 0.025 + midX / 5
  const da = Math.PI / 10

  const start = p.perturb([midX, bottom * 0.95])
  const end: Point2D = [midX, midY]
  const second = p.perturb(pointAlong(start, end, 0.4))

  p.setStrokeColour(140, 50, 25)
  p.lineWidth = 0.02
  p.draw(
    SimplePath.startAt(start)
      .addPoint(second)
      .addPoint(end)
      .chaiken({ n: 3 })
  )

  p.lineWidth = 0.01
  let path = Path.startAt([midX + ir, midY])
  for (let a = 0; a < Math.PI * 2; a += da) {
    const pt: Point2D = [
      midX + ir * Math.cos(a + da),
      midY + ir * Math.sin(a + da),
    ]

    path.addCurveTo(pt, {
      curveSize: 12,
      bulbousness: 2,
      curveAngle: p.random() / 6,
    })
  }
  const baseHue = p.random() * 290
  p.setFillGradient(
    new RadialGradient({
      start: [midX, midY],
      end: [midX, midY],
      rStart: 0,
      rEnd: 2,
      colours: [
        [0, { h: 10 + baseHue, s: 90, l: 50, a: 0.95 }],
        [0.3, { h: 70 + baseHue, s: 90, l: 40, a: 0.95 }],
      ],
    })
  )
  p.fill(path)
  p.lineWidth = 0.005

  p.setFillColour(40, 90, 90)
  p.fill(
    new Arc({
      at: [midX, midY],
      r: ir / 1.4,
      a: 0,
      a2: Math.PI * 2,
    })
  )
}

const curves1 = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, 1],
      colours: [[0, { h: 215, s: 20, l: 90 }], [1, { h: 140, s: 20, l: 90 }]],
    })
  )
  p.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setStrokeColour(20 + x * 40, 90 - 20 * y, 50)
    p.draw(
      Path.startAt([x, y + dY]).addCurveTo([x + dX, y + dY], {
        polarlity: p.randomPolarity(),
        curveSize: x * 2,
        curveAngle: x,
        bulbousness: y,
      })
    )
  })
}

const chaiken = (p: SCanvas) => {
  const { right, bottom } = p.meta

  const midX = right / 2
  const midY = bottom / 2
  const ir = midX / 4
  const da = Math.PI / 10

  p.times(30, n => {
    let points: Point2D[] = []
    for (let a = 0; a < Math.PI * 2; a += da) {
      const rr = 2 * p.random() + 1
      points.push([
        midX + ir * rr * Math.cos(a + da),
        midY + ir * rr * Math.sin(a + da),
      ])
    }
    const sp = SimplePath.startAt(points[0])
    points.slice(1).forEach(p => sp.addPoint(p))
    sp.close()
    sp.chaiken({ n: 4, looped: true })
    p.lineWidth = 0.005
    p.setStrokeColour(190 + n, 90, 40, 0.75)
    p.draw(sp)
  })
}

const tilesOfChaiken = (p: SCanvas) => {
  p.forTiling({ n: 6, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    const midX = x + dX / 2
    const midY = y + dY / 2
    const ir = dX / 4
    const da = Math.PI / 10

    p.times(3, n => {
      let points: Point2D[] = []
      for (let a = 0; a < Math.PI * 2; a += da) {
        const rr = 2 * p.random() + 1
        points.push([
          midX + ir * rr * Math.cos(a + da),
          midY + ir * rr * Math.sin(a + da),
        ])
      }
      const sp = SimplePath.startAt(points[0])
      points.slice(1).forEach(p => sp.addPoint(p))
      sp.close()
      sp.chaiken({ n: 2 + n, looped: true })
      p.lineWidth = 0.005
      p.setStrokeColour(190 + x * 100, 90, 40 + y * 10, 0.75 * ((n + 3) / 5))
      p.draw(sp)
    })
  })
}

const circle = (p: SCanvas) => {
  p.times(10, n => {
    p.setStrokeColour(0, 0, n + 10, (0.75 * (n + 1)) / 10)
    const points = p.build(p.aroundCircle, { n: 20 }, pt => p.perturb(pt))
    const sp = SimplePath.withPoints(points)
      .close()
      .chaiken({ n: n + 1, looped: true })
    p.draw(sp)
  })
}

const arcs = (p: SCanvas) => {
  const { bottom, right } = p.meta

  const cX = right / 2
  const cY = bottom / 2

  p.times(19, n => {
    p.setFillColour(n * 2.5, 90, 50, 0.5)
    p.fill(
      new Arc({
        at: [cX, cY],
        r: (0.3 * Math.sqrt(n + 1)) / 3,
        a: (n * Math.PI) / 10,
        a2: ((n + 2) * Math.PI) / 10,
      })
    )
  })
}

const noise = (p: SCanvas) => {
  p.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    const v = perlin2(x, y) * Math.PI * 2
    p.setFillColour(p.t * 10 + 120 + v * 20, 80, 40)
    p.fill(
      new Arc({
        at: [x + dX / 2, y + dY / 2],
        r: dX / 2,
        a: p.t + v,
        a2: p.t + v + Math.PI / 2,
      })
    )
  })
}

const noiseField = (p: SCanvas) => {
  const delta = 0.01
  const s = 8
  p.lineWidth = 0.0025

  p.times(250, n => {
    p.setStrokeColour(195 + n / 12.5, 90, 30, 0.7)
    let pt = p.randomPoint
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

const rectangles = (p: SCanvas) => {
  p.lineWidth = 0.005

  p.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setFillColour(214 * x, 100, 35 + 10 * y, 0.7)
    p.fill(
      new Rect({
        at: [x + dX / 8, y + dY / 8],
        w: dX * p.random() * 0.75,
        h: dY * p.random() * 0.75,
      })
    )
  })
}

const rectanglesDivided = (p: SCanvas) => {
  p.lineWidth = 0.005
  const { right, bottom } = p.meta

  new Rect({ at: [0.1, 0.1], w: right - 0.2, h: bottom - 0.2 })
    .split({ orientation: "vertical", split: [1, 1.5, 2, 2.5] })
    .forEach((r, i) => {
      p.setFillGradient(
        new LinearGradient({
          from: r.at,
          to: [r.at[0], r.at[1] + r.h],
          colours: [
            [0, { h: i * 10, s: 90, l: 60 }],
            [1, { h: i * 10, s: 60, l: 40 }],
          ],
        })
      )
      p.fill(r)
      p.draw(r)
    })
}

const mondrian = (p: SCanvas) => {
  const { right, bottom } = p.meta

  let rs = [new Rect({ at: [0.1, 0.1], w: right - 0.2, h: bottom - 0.2 })]
  p.times(4, () => {
    rs = rs.flatMap(r => {
      if (r.w > 0.1 && r.h > 0.1) {
        return p.proportionately([
          [0.6, () => [r]],
          [
            1,
            () =>
              r.split({
                orientation: "horizontal",
                split: p.samples(3, [1, 2, 2.5, 3]),
              }),
          ],
          [
            1,
            () =>
              r.split({
                orientation: "vertical",
                split: p.samples(3, [1, 1.2, 1.5, 2]),
              }),
          ],
        ])
      } else {
        return [r]
      }
    })
  })

  rs.map(r => {
    p.doProportion(0.3, () => {
      p.setFillColour(p.sample([10, 60, 200]), 80, 50)
      p.fill(r)
    })
    p.draw(r)
  })
}

const helloWorld = (p: SCanvas) => {
  const { bottom, aspectRatio } = p.meta
  p.range(
    {
      from: 0.1,
      to: bottom - 0.1,
      n: 10,
    },
    n => {
      p.setStrokeColour(n * aspectRatio * 50, 20, 20, 0.75)
      for (let align of ["right", "center", "left"] as const) {
        p.drawText(
          {
            at: [n * aspectRatio, n],
            size: 0.2,
            sizing: "fixed",
            align,
            weight: "600",
          },
          "Hello"
        )
      }
      p.setFillColour(n * aspectRatio * 50, 80, 50, 0.9)

      p.fillText(
        {
          at: [n * aspectRatio, n],
          size: 0.2,
          sizing: "fixed",
          align: "center",
          weight: "600",
        },
        "Hello"
      )
    }
  )
}

const circleText = (p: SCanvas) => {
  p.aroundCircle({ radius: 0.25, n: 12 }, ([x, y], i) => {
    p.times(5, n => {
      p.setFillColour(i * 5 + n, 75, 35, 0.2 * n)
      p.fillText(
        {
          at: p.perturb([x, y]),
          size: 0.05,
          align: "left",
        },
        (i + 1).toString()
      )
    })
  })
}

const scriptLike = (p: SCanvas) => {
  const { bottom, aspectRatio } = p.meta

  p.range({ from: 0.1, to: bottom - 0.1, n: 5 }, m => {
    let points: Point2D[] = []
    p.setStrokeColour(215, 40, 30 - 30 * m)
    p.range({ from: 0.1, to: 0.9, n: 60 }, n => {
      points.push([
        n + perlin2(n * 45 + m * 67, 20) / 12,
        m + perlin2(n * 100 + m * 100, 0.1) / (6 * aspectRatio),
      ])
    })
    p.draw(SimplePath.withPoints(points).chaiken({ n: 4 }))
  })
}

const doodles = (p: SCanvas) => {
  p.forTiling({ n: 7, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    const center = add([x, y], scale([dX, dY], 0.5))
    let path = Path.startAt(center)
    p.setStrokeColour(100 * x + y * 33, 60 + 45 * y, 40)
    p.lineWidth = 0.005
    p.withRandomOrder(
      p.aroundCircle,
      { at: center, radius: dX / 2.8, n: 7 },
      pt => path.addCurveTo(pt)
    )
    path.addCurveTo(center)
    p.draw(path)
  })
}

const circles = (p: SCanvas) => {
  p.background(120, 5, 95)
  p.forTiling({ n: 10, type: "square", margin: 0.1 }, (pt, delta) => {
    p.setFillColour(pt[0] * 100, 80, 50)
    const r = Math.sqrt(1.2 * pt[0] * pt[1])
    p.fill(
      new Ellipse({
        at: add(pt, scale(delta, 0.5)),
        align: "center",
        w: delta[1] * r,
        h: delta[1] * r,
      })
    )
  })
}

const circles2 = (p: SCanvas) => {
  p.background(220, 30, 90)
  p.withRandomOrder(
    p.forTiling,
    { n: 10, type: "square", margin: 0.1 },
    (pt, delta) => {
      p.setFillColour(150 + pt[0] * 50, 80, 50, 0.9)
      p.setStrokeColour(150, 40, 20)
      p.lineWidth = 0.005
      const r = Math.sqrt(1.2 * pt[0] * pt[1]) * p.sample([0.7, 1.1, 1.3])
      const e = new Circle({
        at: add(pt, scale(delta, 0.5)),
        align: "center",
        r: delta[1] * r,
      })

      p.fill(e)
      p.draw(e)
    }
  )
}

const ellipses = (p: SCanvas) => {
  p.background(0, 0, 100)
  p.withRandomOrder(
    p.forTiling,
    { n: 15, type: "square", margin: 0.1 },
    (pt, delta) => {
      const [x, y] = pt
      p.setFillColour(150 + perlin2(x * 10, 1) * 50, 80, 50, 0.9)
      p.setStrokeColour(150, 40, 100)
      p.lineWidth = 0.005
      const r = Math.sqrt(
        1.8 * (0.1 + Math.abs(x - 0.5)) * (0.1 + Math.abs(y - 0.5))
      )
      const e = new Ellipse({
        at: add(pt, scale(delta, 0.5)),
        align: "center",
        w: delta[1] * r * 3,
        h: delta[1] * 1.2,
      })
      p.fill(e)
      p.draw(e)
    }
  )
}

const gradients1 = (p: SCanvas) => {
  const { right, bottom } = p.meta
  p.setFillGradient(
    new LinearGradient({
      from: [0, 0],
      to: [right, bottom],
      colours: [
        [0, { h: 210 + p.t * 100, s: 80, l: 60 }],
        [0.5, { h: 250 + p.t * 100, s: 80, l: 60 }],
        [1.0, { h: 280 + p.t * 100, s: 80, l: 60 }],
      ],
    })
  )
  p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
}

const gradients2 = (p: SCanvas) => {
  const { right, bottom, center } = p.meta

  p.setFillGradient(
    new RadialGradient({
      start: center,
      end: [right, bottom],
      rStart: 0.0,
      rEnd: 2 * Math.max(bottom, right),
      colours: [
        [0, { h: 0 + p.t * 40, s: 80, l: 60 }],
        [0.7, { h: 50 + p.t * 20, s: 90, l: 60 }],
        [1.0, { h: 1000 + p.t * 20, s: 80, l: 60 }],
      ],
    })
  )
  p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
}

const gradients3 = (p: SCanvas) => {
  const { right, bottom, center } = p.meta
  p.setFillGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, bottom],
      colours: [
        [0, { h: 215, s: 80, l: 60 }],
        [0.5, { h: 215, s: 80, l: 60 }],
        [0.55, { h: 240, s: 80, l: 60 }],
        [1.0, { h: 240, s: 80, l: 60 }],
      ],
    })
  )
  p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))

  p.setFillGradient(
    new RadialGradient({
      start: center,
      end: center,
      rStart: 0.0,
      rEnd: 2 * bottom,
      colours: [
        [0, { h: 0, s: 80, l: 60 }],
        [0.02, { h: 0, s: 80, l: 60 }],
        [0.1, { h: 0, s: 80, l: 60, a: 0.3 }],
        [0.15, { h: 0, s: 80, l: 60, a: 0.05 }],
        [1.0, { h: 0, s: 80, l: 60, a: 0.03 }],
      ],
    })
  )
  p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
}

const gradients4 = (p: SCanvas) => {
  const { right, bottom } = p.meta
  const corners: Point2D[] = [[0, 0], [right, 0], [right, bottom], [0, bottom]]
  const hues = [10, 215, 50, 190]

  p.background(0, 0, 5)
  for (let i = 0; i < 4; i++) {
    const from = corners[i]
    const to = corners[(i + 2) % 4]

    p.setFillGradient(
      new LinearGradient({
        from,
        to,
        colours: [
          [0, { h: hues[i], s: 90, l: 90, a: 0.01 }],
          [0.4, { h: hues[i], s: 90, l: 90, a: 0.1 }],
          [0.5, { h: hues[i], s: 90, l: 90, a: 0.9 }],
          [0.5, { h: hues[i], s: 90, l: 90, a: 0.1 }],
          [1, { h: hues[i], s: 90, l: 90, a: 0.01 }],
        ],
      })
    )
    p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
  }
}

const gradients5 = (p: SCanvas) => {
  const { right, bottom } = p.meta
  const corners: Point2D[] = [[0, 0], [right, 0], [right, bottom], [0, bottom]]
  const hues = [10, 215, 50, 190]

  p.background(0, 0, 5)
  p.forHorizontal({ n: 30 }, (from, [dX, _]) => {
    const to = add(from, [dX * p.poisson(3), 0])
    const l = 60
    p.setFillGradient(
      new LinearGradient({
        from,
        to,
        colours: [
          [0, { h: 40, s: 90, l, a: 0.0 }],
          [0, { h: 40, s: 90, l, a: 0.7 }],
          [1, { h: 0, s: 80, l, a: 0.01 }],
          [1, { h: 0, s: 90, l, a: 0.0 }],
        ],
      })
    )
    p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
  })
}

const randomness1 = (p: SCanvas) => {
  const { bottom } = p.meta
  p.forHorizontal(
    {
      n: 100,
      margin: 0.1,
    },
    ([x, y], [dX, dY]) => {
      p.setFillGradient(
        new LinearGradient({
          from: [0, 0],
          to: [0, bottom],
          colours: [
            [0, { h: 245, s: 80, l: 40 }],
            [0.45, { h: 180, s: 80, l: 40 }],
            [0.55, { h: 40, s: 80, l: 40 }],
            [1, { h: 0, s: 80, l: 40 }],
          ],
        })
      )

      const v = p.gaussian()
      p.fill(
        new Rect({
          at: [x, y + dY / 2],
          w: dX,
          h: (dY * v) / 5,
        })
      )
    }
  )
}

const randomness1b = (p: SCanvas) => {
  p.times(25, n => {
    p.setFillColour(175 + n, 80, 50, 0.4)
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
    p.setFillColour(195, 70, 40)
    p.fill(new Circle({ at, r: w * 0.45 }))

    p.setFillColour(205, 70, 80)
    p.fill(new Circle({ at: p.perturb(at, { magnitude: w / 3 }), r: w * 0.3 }))
  })
}

const randomness2 = (p: SCanvas) => {
  p.background(320, 10, 90)
  p.forTiling({ n: 50, margin: 0.1 }, (pt, delta) => {
    const v = p.poisson(4)
    p.times(v, n => {
      p.setFillColour(40 - n * 20, 80, 50, 1 / n)
      p.fill(
        new Ellipse({
          at: add(pt, scale(delta, 0.5)),
          w: (n * delta[0]) / 5,
          h: (n * delta[0]) / 5,
        })
      )
    })
  })
}

const sunsetThroughBlinds = (p: SCanvas) => {
  const { right, bottom, center } = p.meta

  p.setFillGradient(
    new RadialGradient({
      start: add(center, [0, 0.2]),
      end: add(center, [0, 0.4]),
      rStart: 0.0,
      rEnd: 2 * bottom * right,
      colours: [
        [0, { h: 0, s: 80, l: 60 }],
        [0.6, { h: 215, s: 80, l: 60 }],
        [1.0, { h: 230, s: 80, l: 60 }],
      ],
    })
  )
  p.fill(new Rect({ at: [0, 0], w: right, h: bottom }))

  p.forVertical({ n: 15 }, (pt, [w, h]) => {
    p.setFillGradient(
      new LinearGradient({
        from: pt,
        to: add(pt, [0, h]),
        colours: [
          [0, { h: 40, s: 40, l: 90, a: 0.9 }],
          [0.5, { h: 40, s: 40, l: 50, a: 0.8 }],
          [0.55, { h: 40, s: 40, l: 50, a: 0.1 }],
          [1, { h: 40, s: 40, l: 90, a: 0.1 }],
        ],
      })
    )
    p.fill(new Rect({ at: pt, w, h }))
  })
}

const curves = (p: SCanvas) => {
  p.background(215, 30, 20)
  p.forHorizontal({ n: 75 }, ([x, y], [dX, dY]) => {
    const vPts = [0, 0, 0, 0].map(_ => p.poisson(5) + 2)
    const total = sum(vPts)
    let nVPts = vPts.map(p => (dY * p) / total)
    nVPts = [y - 0.1].concat(
      [3, 2, 1, 0].map(i => y + 1.2 * sum(nVPts.slice(i)))
    )
    const nHPts = nVPts.map(p => x + dX * 12 * perlin2(10 + p * 60, x * 20))
    const points = zip2(nHPts, nVPts)
    const path = SimplePath.withPoints(points)
    path.chaiken({ n: 4 })
    p.setStrokeColour(p.uniformRandomInt({ from: -40, to: 60 }), 90, 60, 0.95)
    p.draw(path)
  })
}

const transforms = (p: SCanvas) => {
  p.forTiling({ n: 8, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setFillColour(120 + x * 100, 90, 50)
    p.withTranslation([x + dX / 2, y + dY / 2], () =>
      p.withRotation(x + y + p.t, () => {
        p.fill(new Rect({ at: [-dX / 4, -dY / 4], w: dX / 2, h: dY / 2 }))
      })
    )
  })
}

const transforms2 = (p: SCanvas) => {
  p.background(0, 0, 0)
  const baseSize = (1 + Math.sin(2 * p.t)) / 2
  const { bottom: h } = p.meta
  p.forTiling({ n: 32, type: "square" }, ([x, y], [dX, dY]) => {
    p.setFillColour(320 - x * 100 + p.t * 10, 90, 50, 0.8)
    p.withTranslation([x + dX / 2, y + dY / 2], () =>
      p.withRotation(x + y + p.t * 2, () =>
        p.withScale(
          [
            baseSize + 6 * Math.abs(0.5 - x),
            baseSize + 12 * Math.abs(0.5 - y / h),
          ],
          () => {
            p.fill(new Rect({ at: [-dX / 4, -dY / 4], w: dX / 2, h: dY / 2 }))
          }
        )
      )
    )
  })
}

const transforms3 = (p: SCanvas) => {
  const { bottom: h } = p.meta
  const a = Math.sin(p.t)
  p.forHorizontal({ n: 20, margin: 0.3 }, ([x, y], [dX, dY]) => {
    p.range({ from: 0, to: 2 * Math.PI, n: 12 }, n =>
      p.withTranslation([x + dX / 2, (h * n) / 6 + dY / 6], () => {
        p.withRotation(x - n + a, () => {
          p.setFillColour(360 - n * 20, 90, 30, 0.5)
          p.fill(new Rect({ at: [-dX / 2, -dY / 2], w: dX / 4, h: 2 * dY }))
        })
      })
    )
  })
}

const time = (p: SCanvas) => {
  p.background(50, 20, 90)
  const times = 4
  p.forHorizontal({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.times(times, n => {
      const h = dY * 0.5 * (1 + perlin2(x, 100 + n + p.t / 4))
      p.setFillColour((n * 60) / times, 80, 60)
      p.fill(
        new Rect({
          at: [x + (dX / times) * n, y + dY - h],
          h,
          w: dX / times,
        })
      )
    })
  })
}

const clipping = (p: SCanvas) => {
  const { center, bottom, right } = p.meta
  const size = Math.min(bottom, right) * 0.8
  p.background(120 + p.t * 50, 40, 90)
  p.lineWidth = 0.005
  p.range({ from: 1, to: 4, n: 4 }, n =>
    p.withTranslation([0.037 * n * n, bottom * 0.037 * n * n], () =>
      p.withScale([0.1 * n, 0.1 * n], () =>
        p.withClipping(new Ellipse({ at: center, w: size, h: size }), () =>
          p.forTiling(
            { n: 60 / (8 - n), type: "square" },
            ([x, y], [dX, dY]) => {
              p.setStrokeColour(120 + x * 120 + p.t * 50, 90 - 20 * y, 40)
              p.proportionately([
                [1, () => p.drawLine([x, y], [x + dX, y + dY])],
                [2, () => p.drawLine([x + dX, y], [x, y + dY])],
                [1, () => p.drawLine([x, y], [x, y + dY])],
              ])
            }
          )
        )
      )
    )
  )
}

const roundedRects = (p: SCanvas) => {
  p.forTiling(
    { n: 5, type: "proportionate", margin: 0.1 },
    ([x, y], [dX, dY]) => {
      p.setFillColour(p.t * 50 + 150 + x * 100, y * 40 + 60, 40)
      p.fill(
        new RoundedRect({
          at: [x + dX / 6, y + dY / 6],
          w: (dX * 2) / 3,
          h: (dY * 2) / 3,
          r: dX / 8,
        })
      )
    }
  )
}

const cards = (p: SCanvas) => {
  p.forTiling({ n: 6, type: "square", margin: 0.05 }, ([x, y], [dX, dY]) => {
    p.withClipping(
      new RoundedRect({
        at: [x + dX / 6, y + dX / 4],
        w: (dX * 2) / 3,
        h: dY / 2,
        r: dX / 12,
      }),
      () => {
        p.setFillColour(175 + x * 60 + y * 100, y * 40 + 60, 40)
        p.fill(
          new Rect({
            at: [x + dX / 6, y + dX / 4],
            w: (dX * 2) / 3,
            h: dY / 2,
          })
        )

        p.setFillColour(0, 0, 100, 0.4)
        p.times(5, () =>
          p.fill(
            new Ellipse({
              at: p.perturb([x + dX / 2, y + dY / 2]),
              w: dX / 2,
              h: dX / 2,
            })
          )
        )
      }
    )
  })
}

const polygons = (p: SCanvas) => {
  p.background(330, 70, 30)
  let n = 3
  p.forTiling({ n: 4, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setFillColour(180 + 40 * x, 50 + 50 * y, 60)
    p.fill(
      new RegularPolygon({
        at: [x + dX / 2, y + dY / 2],
        n,
        r: dX / 2.1,
        a: p.t,
      })
    )
    n++
  })
}

const polygons2 = (p: SCanvas) => {
  p.background(330, 70, 10)
  p.times(5, n => {
    const sides = 10 - n
    const r = 0.4 - n * 0.05
    p.setFillColour(330, 70, 10 + n * 12)
    p.fill(
      new RegularPolygon({
        at: p.meta.center,
        n: sides,
        r,
      })
    )
  })
}

const polygons3 = (p: SCanvas) => {
  p.background(210, 70, 90)
  p.forHorizontal({ n: 4, margin: 0.1 }, (_pt, [dX], c, i) => {
    p.setFillColour([215, 225, 235, 245][i], 90, 30)
    p.fill(
      new RegularPolygon({
        at: c,
        n: 6,
        r: dX / 2,
        a: (i * Math.PI) / 6 + p.t * (i % 2 === 0 ? 1 : -1),
      })
    )
  })
}

const stars = (p: SCanvas) => {
  let n = 3
  p.background(30, 20, 80)
  p.forTiling({ n: 4, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setFillColour(20 + 30 * x, 25 + 75 * y, 45 + 5 * (1 + Math.sin(p.t + x)))
    p.fill(
      new Star({
        at: [x + dX / 2, y + dY / 2],
        n,
        r: (dX * (2.2 + Math.cos(x + y + p.t))) / 6.1,
        a: p.t,
      })
    )
    n++
  })
}

const hatching = (p: SCanvas) => {
  p.lineWidth = 0.001
  p.range({ from: 1, to: 0.2, n: 4, inclusive: true }, n => {
    p.setStrokeColour(215 - n * 75, 90, 10 + n * 30)
    const s = (1.5 + Math.cos(p.t)) / 2
    p.draw(
      new Hatching({
        at: p.meta.center,
        r: n * s,
        delta: 0.01,
        a: (n * 16) / Math.PI,
      })
    )
  })
}

const hatching2 = (p: SCanvas) => {
  p.background(0, 0, 10)
  p.lineWidth = 0.005
  const { center } = p.meta
  const count = p.uniformRandomInt({ from: 5, to: 35 })
  const points = p.build(p.times, count, n => {
    return p.perturb(center, { magnitude: 0.1 * n })
  })
  points.forEach(pt => {
    p.setStrokeColour(15 + pt[0] * 50, 90, 40, 0.9)
    const r = 0.1 + 0.15 * p.random()
    p.withClipping(new Circle({ at: pt, r }), () =>
      p.draw(
        new Hatching({
          at: pt,
          r: 1,
          delta: 0.01,
          a: (pt[1] * Math.PI) / 12,
        })
      )
    )
  })
}

const moreArcs = (p: SCanvas) => {
  const s = p.meta.right / 4
  p.times(100, () => {
    const a = p.random() * 2 * Math.PI
    const a2 = a + p.random()
    p.setFillColour(a * 30, 90, 30, 0.2)
    p.fill(
      new HollowArc({
        at: p.meta.center,
        r: s + (p.random() * s) / 2,
        r2: s - (p.random() * s) / 2,
        a,
        a2,
      })
    )
  })
}

const evenMoreArcs = (p: SCanvas) => {
  p.background(30, 50, 90)
  p.times(24, () => {
    const a = p.random() * Math.PI * 2
    const r = p.sample([0.2, 0.25, 0.3, 0.35, 0.4])
    p.setFillColour(p.sample([20, 30, 35, 40]), 90, 60, 0.8)
    p.fill(
      new HollowArc({
        at: p.meta.center,
        a,
        a2: a + p.gaussian({ mean: 0.5, sd: 0.2 }),
        r,
        r2: r - 0.1,
      })
    )
  })

  p.times(48, () => {
    const a = p.random() * Math.PI * 2
    const r = p.sample([0.325, 0.375, 0.425])
    p.setFillColour(p.sample([20, 30, 35, 40]), 80, 30, 0.95)
    p.fill(
      new HollowArc({
        at: p.meta.center,
        a,
        a2: a + Math.PI / 96,
        r,
        r2: r - 0.3,
      })
    )
  })
}

const curls = (p: SCanvas) => {
  const baseColour = p.uniformRandomInt({ from: 150, to: 250 })
  p.background(baseColour, 20, 90)
  p.lineStyle = {
    cap: "round",
  }
  p.setFillColour(baseColour, 60, 30)
  p.setStrokeColour(baseColour - 40, 80, 35, 0.9)
  p.times(p.uniformRandomInt({ from: 20, to: 100 }), () => {
    const c = p.randomPoint
    let tail = p.perturb(c, { magnitude: 0.2 })
    while (distance(c, tail) < 0.1) {
      tail = p.perturb(c, { magnitude: 0.2 })
    }
    p.fill(
      new Circle({
        at: c,
        r: 0.015,
      })
    )
    p.fill(
      new Circle({
        at: tail,
        r: 0.015,
      })
    )
    p.draw(
      Path.startAt(c).addCurveTo(tail, {
        curveSize: p.gaussian({
          mean: 2,
          sd: 1,
        }),
      })
    )
  })
}

const colourWheel = (p: SCanvas) => {
  const dA = Math.PI / 20
  const dR = 0.05
  for (let a = 0; a < Math.PI * 2; a += dA) {
    for (let r = 0.1; r < 0.4; r += dR) {
      p.doProportion(0.6, () => {
        p.setFillColour((180 * a) / Math.PI, r * 220, 50)
        p.fill(
          new HollowArc({
            at: p.meta.center,
            r,
            r2: r - dR,
            a,
            a2: a + dA,
          })
        )
      })
    }
  }
}

const colourPaletteGenerator = (p: SCanvas) => {
  const baseColour = p.uniformRandomInt({ from: 0, to: 360 })

  p.proportionately([
    [1, () => p.background(0, 0, 10)],
    [1, () => p.background(0, 0, 90)],
  ])

  const colours = [
    baseColour + 90,
    baseColour + 45,
    baseColour,
    baseColour - 45,
    baseColour - 90,
    baseColour + 180,
  ]

  p.forVertical({ n: 6, margin: 0.1 }, ([x, y], [dX, dY], _c, i) => {
    const c = colours[i]
    p.range({ from: x, to: x + dX, n: 6, inclusive: false }, xV => {
      p.setFillColour(c, 80, 10 + xV * 70)
      p.fill(
        new Rect({
          at: [xV + 0.01, y + 0.01],
          w: (dX - 0.02 * 6) / 6,
          h: dY - 0.02,
        })
      )
    })
  })
}

const sunburst = (p: SCanvas) => {
  p.background(0, 0, 10)

  const nextLayer = (
    layer: { start: number; end: number; depth: number }[]
  ): { start: number; end: number; depth: number }[] => {
    return layer
      .flatMap(({ start, end, depth }) => {
        const prop = 0.1 + 0.8 * p.random()
        return p.proportionately([
          [
            10,
            () => [
              { start, end: (end - start) * prop + start, depth: depth + 1 },
              { start: (end - start) * prop + start, end, depth: depth + 1 },
            ],
          ],
          [
            depth,
            () => [
              { start, end: (end - start) * prop + start, depth: depth + 1 },
            ],
          ],
          [
            depth,
            () => [
              { start: (end - start) * prop + start, end, depth: depth + 1 },
            ],
          ],
        ])
      })
      .filter(l => l.end - l.start > 0.01)
  }

  const layerZero: { start: number; end: number; depth: number }[] = [
    {
      start: 0,
      end: Math.PI * 2,
      depth: 1,
    },
  ]

  const layers: { start: number; end: number; depth: number }[][] = [layerZero]
  const n = p.uniformRandomInt({ from: 5, to: 8 })
  for (let i = 1; i < n; i++) {
    layers.push(nextLayer(layers[i - 1]))
  }

  const prop = (1.2 + Math.cos(p.t / 2)) / 2.2
  layers.flat().forEach(({ start, end, depth }, i) => {
    p.setFillColour(i, 90, 60)
    p.fill(
      new HollowArc({
        at: p.meta.center,
        r: (0.35 * (depth + 1)) / n - 0.005,
        r2: (0.35 * depth) / n,
        a: start * prop,
        a2: end * prop,
      })
    )
  })
}

const stackPolys = (p: SCanvas) => {
  p.background(320, 10, 90)
  p.lineWidth = 0.0025
  const v = p.uniformRandomInt({ from: 5, to: 8 })
  const m = p.uniformRandomInt({ from: 30, to: 80 })

  p.times(m, n => {
    p.setStrokeColour(p.uniformRandomInt({ from: 320, to: 360 }), 80, 50)
    p.draw(
      new RegularPolygon({
        at: p.meta.center,
        n: v,
        r: clamp(
          { from: 0, to: 0.45 * Math.min(p.meta.bottom, p.meta.right) },
          (n / m) * 0.35 + p.gaussian({ sd: 0.1 })
        ),
      })
    )
  })
}

const blob = (p: SCanvas) => {
  p.background(205, 55, 95)
  const paths = p.build(p.times, 3, n =>
    SimplePath.withPoints(
      p.build(p.aroundCircle, { n: 12, at: [0, 0] }, (pt, i) =>
        add(
          pt,
          scale([perlin2(i / 12, 1 + n + p.t), perlin2(-i / 12, n + p.t)], 0.25)
        )
      )
    )
      .close()
      .chaiken({ n: 3, looped: true })
  )

  paths.forEach(pt => {
    p.withTranslation([0.5, 0.5], () => {
      p.withScale([1.2, 1.2], () => {
        p.setFillColour(205, 75, 90)
        p.fill(pt)
      })
    })
  })

  paths.forEach(pt => {
    p.withTranslation([0.5, 0.5], () => {
      p.setFillColour(205, 75, 45)
      p.fill(pt)
    })
  })
}

const fancyTiling = (p: SCanvas) => {
  const baseHue = p.uniformRandomInt({ from: 0, to: 360 })

  const generateTile = (): ((
    x: number,
    y: number,
    dX: number,
    dY: number
  ) => void) => {
    const colour: [number, number, number] = [
      p.uniformRandomInt({ from: baseHue, to: baseHue + 60 }),
      p.uniformRandomInt({ from: 60, to: 90 }),
      p.uniformRandomInt({ from: 30, to: 60 }),
    ]
    const lw = clamp(
      { from: 0.005, to: 0.02 },
      p.gaussian({ mean: 0.01, sd: 0.01 })
    )

    return p.proportionately([
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColour(...colour)
          p.drawLine([x, y], [x + dX, y + dY])
        },
      ],
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColour(...colour)
          p.drawLine([x + dX, y], [x, y + dY])
        },
      ],
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColour(...colour)
          p.drawLine([x, y], [x, y + dY])
        },
      ],
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColour(...colour)
          p.drawLine([x, y], [x + dX, y])
        },
      ],
    ])
  }

  const rules = arrayOf(
    p.uniformRandomInt({ from: 2, to: 5, inclusive: true }),
    generateTile
  )

  p.forTiling(
    {
      n: p.uniformRandomInt({ from: 15, to: 25 }),
      margin: 0.1,
      type: "square",
    },
    ([x, y], [dX, dY]) => {
      p.proportionately(
        rules.map(r => [p.poisson(3) + 1, () => r(x, y, dX, dY)])
      )
    }
  )
}

const anotherTiling = (p: SCanvas) => {
  p.background(240, 20, 90)
  p.forTiling({ n: 25, margin: 0.1, type: "square" }, (at, [dX, dY]) => {
    p.withTranslation(add(at, scale([dX, dY], 0.5)), () =>
      p.withRotation(p.sample([0, Math.PI / 2, Math.PI]), () => {
        p.setFillColour(p.sample([160, 175, 220]), 80, 40)
        p.fill(
          SimplePath.withPoints([
            [-dX / 2, -dY / 2],
            [dX / 2, -dY / 2],
            [-dX / 2, dY / 2],
          ]).close()
        )
      })
    )
  })
}

const lissajous = (p: SCanvas) => {
  p.background(140, 20, 10)
  p.lineWidth = 0.005
  p.setStrokeColour(140, 80, 60, 0.5)

  const a = 1
  const b = 2.4

  const sp = SimplePath.withPoints([])

  for (let t = 0; t < 50; t += 0.1) {
    sp.addPoint([
      0.5 + 0.4 * Math.sin(a * t),
      p.meta.bottom * (0.5 + 0.4 * Math.sin(b * t + p.t)),
    ])
  }

  p.draw(sp.chaiken({ n: 3 }))
}

const sketchingCurves = (p: SCanvas) => {
  p.background(30, 30, 95)
  p.lineWidth = 0.005
  p.setStrokeColour(230, 90, 25, 0.6)

  const points = p.build(
    p.forHorizontal,
    { n: 40, margin: 0.05 },
    (_pt, [dX, dY], [x, y]): Point2D => {
      return [x, y + dY / 2.2 + 0.1 * perlin2(x * 4, 0)]
    }
  )

  let curve = SimplePath.withPoints(points).chaiken({ n: 2 })
  for (let i = 1; i < 200; i += i / 4) {
    p.draw(curve)
    curve = curve
      .moved([0, (-i * p.meta.bottom) / 1024])
      .transformed(pt => [
        pt[0],
        pt[1] + 0.017 * p.meta.bottom * perlin2(pt[0] * 4, pt[1] + p.t),
      ])
  }
}

const shading = (p: SCanvas) => {
  const delta = 0.005
  p.background(50, 80, 85)
  p.lineWidth = 0.0005
  p.forTiling({ n: 8, type: "square", margin: 0.1 }, (at, [dX], c, i) => {
    p.withClipping(
      new Rect({ at: add(at, [dX / 10, dX / 10]), w: dX * 0.8, h: dX * 0.8 }),
      () => {
        p.draw(new Hatching({ at: c, r: dX, a: 0, delta }))
        p.draw(new Hatching({ at: c, r: dX, a: (Math.PI * i) / 64, delta }))
      }
    )
  })
}

const shading2 = (p: SCanvas) => {
  const delta = 0.005
  p.background(0, 80, 85)
  p.lineWidth = 0.001
  p.forTiling({ n: 12, margin: 0.1, type: "square" }, (at, [dX, dY], c, i) => {
    p.withClipping(new Rect({ at, w: dX, h: dY }), () => {
      p.setStrokeColour(220, 90 - i / 4, 20)
      p.draw(
        new Hatching({
          at: c,
          r: Math.max(dY, dX),
          a: (i * Math.PI) / 16,
          delta: (delta * p.sample([3, 5])) / Math.sqrt(12 + i),
        })
      )
    })
  })
}

const shadingArcs = (p: SCanvas) => {
  const { center } = p.meta
  p.backgroundGradient(
    new RadialGradient({
      start: center,
      end: center,
      rStart: 0,
      rEnd: 1,
      colours: [[0, { h: 50, s: 0, l: 40 }], [1, { h: 50, s: 0, l: 0 }]],
    })
  )
  p.lineWidth = 0.005
  p.times(20, () => {
    p.setStrokeColour(p.sample([20, 40, 50]), 30, 80, 0.85)
    const a = p.random() * Math.PI * 2
    const r = p.random() * 0.4 + 0.2
    const dR = p.random() * 0.1 + 0.1
    p.withClipping(
      new HollowArc({
        at: p.meta.center,
        r,
        r2: r - dR,
        a,
        a2: a + p.random() * 0.2 + Math.PI / 4,
      }),
      () => {
        p.draw(new Hatching({ at: p.meta.center, r: 1, a, delta: 0.01 }))
      }
    )
  })
}

const arcChart = (p: SCanvas) => {
  p.background(30, 30, 20)
  const { center: at } = p.meta
  p.range({ from: 0, to: Math.PI * 2, inclusive: false, n: 32 }, n => {
    p.setFillColour((180 * n) / Math.PI, 100, 60)
    p.fill(
      new HollowArc({
        at,
        a: n,
        a2: n + Math.PI / 32,
        r: 0.1 + p.poisson(4) * 0.04 + Math.cos(p.t + n) * 0.025,
        r2: 0.05,
      })
    )
  })
}

const bars = (p: SCanvas) => {
  p.background(150, 30, 20)
  p.forHorizontal({ n: 32, margin: 0.1 }, (at, [dX, dY]) => {
    const v = (dY * (1 + perlin2(at[0] + p.t, at[1]))) / 2
    p.setFillColour(p.sample([190, 170]), 40 + v * 40, 80)
    p.fill(
      new Rect({
        at: [at[0] + dX / 10, at[1] + (dY - v) / 2],
        h: v,
        w: dX * 0.8,
      })
    )
  })
}

const littleAbstracts = (p: SCanvas) => {
  p.background(200, 10, 20)
  p.forTiling({ n: 8, margin: 0.1, type: "square" }, (at, d, c, i) => {
    p.setFillColour(p.uniformRandomInt({ from: 200, to: 260 }), 50, 50)
    const rect = new Rect({
      at: add(at, scale(d, 0.1)),
      w: d[0] * 0.8,
      h: d[1] * 0.8,
    })
    p.fill(rect)
    p.withClipping(rect, () => {
      p.setFillColour(0, 0, 100, 0.2)
      const h = (p.random() * 0.5 + 0.1) * d[1] * 0.8
      p.fill(
        new Rect({
          at: add(add(at, scale(d, 0.1)), [0, d[1] * 0.8 - h]),
          w: d[0] * 0.8,
          h,
        })
      )

      p.times(3, () => {
        p.setFillColour(200, p.sample([20, 40]), 90, 0.4)
        p.fill(
          new RegularPolygon({
            at: p.perturb(c, { magnitude: d[0] / 1.5 }),
            n: p.poisson(4) + 3,
            r: d[0] / 6,
          })
        )
      })
    })
  })
}

const recordCoverish = (p: SCanvas) => {
  const baseHue = p.uniformRandomInt({ from: 0, to: 360 })
  p.background(baseHue, 80, 10)
  p.withClipping(
    new Circle({
      at: p.meta.center,
      r: Math.min(p.meta.bottom, p.meta.right) / 2.8,
    }),
    () => {
      p.forVertical({ n: 9 }, (at, [w, h], _c, i) => {
        p.setFillColour(
          baseHue + i * 10 + p.uniformRandomInt({ from: -5, to: 5 }),
          90,
          50,
          0.9
        )
        p.fill(new Rect({ at, w, h }))
      })
    }
  )
  p.times(20, () => {
    const x = p.random()
    p.setFillColour(baseHue, 80, 10)
    p.fill(new Rect({ at: [x, 0], w: 0.01, h: p.meta.bottom }))
  })
}

const recordCoverish2 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  const mainRect = new Rect({
    at: [right / 10, bottom / 10],
    w: right * 0.8,
    h: bottom * 0.8,
  })

  p.background(30, 10, 95)
  p.setFillGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, bottom],
      colours: [[0, { h: 215, s: 80, l: 60 }], [1, { h: 215, s: 80, l: 20 }]],
    })
  )
  p.fill(mainRect)

  p.withClipping(mainRect, () => {
    p.times(40, () => {
      p.setFillColour(p.uniformRandomInt({ from: 180, to: 225 }), 80, 40, 0.3)
      p.fill(
        new Rect({
          at: [0, p.gaussian({ mean: bottom * 0.6, sd: bottom * 0.15 })],
          w: right,
          h: bottom * 0.1,
        })
      )
    })
    p.lineWidth = 0.005
    p.times(20, () => {
      p.setStrokeColour(0, 0, 100, 0.2)
      const y = p.gaussian({ mean: bottom * 0.8, sd: bottom * 0.1 })
      p.drawLine([0, y], [right, y])
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
        p.setStrokeColour(a * 12, 100, 70, 0.9)
        p.drawLine([-1, 0], [1, 0])
      })
    })
  })
}

const recordCoverish4 = (p: SCanvas) => {
  p.background(30, 10, 20)
  p.lineWidth = 0.001
  p.setStrokeColour(0, 0, 90)
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
        p.setFillColour(30, 20, p.uniformRandomInt({ from: 60, to: 80 }))
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

const isometricExample = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.background(0, 0, 95)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.8], () => {
    // 1/200 of width = height of 1 unit
    const iso = isoTransform(0.005)
    p.times(10, n => {
      const sp = SimplePath.withPoints([])
      p.times(100, m => {
        // adjust all x,y,z for vertical size: as in isometric all get scaled linearly in vertical direction
        sp.addPoint(
          iso([
            bottom * (10 - n) * 10,
            bottom * 20 * Math.cos(p.t + (n * 4 + m) / 10),
            bottom * m,
          ])
        )
      })
      p.setStrokeColour(0, 0, 95)
      p.lineWidth = 0.015
      p.draw(sp)
      p.setStrokeColour(215 - n * 3, 90, 60)
      p.lineWidth = 0.005
      p.draw(sp)
    })
  })
}

const isometricExample2 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.lineWidth = 0.01 * bottom
  p.background(30, 20, 85)
  p.withTranslation([right / 2, bottom * 0.9], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(10, n => {
      p.downFrom(10, m => {
        let sp = SimplePath.withPoints([])
        const h = clamp({ from: -3, to: 6 }, p.poisson(4) - 3)
        sp.addPoint(iso([n, h, m]))
        sp.addPoint(iso([n + 1, h, m]))
        sp.addPoint(iso([n + 1, h, m + 1]))
        sp.addPoint(iso([n, h, m + 1]))
        sp.close()
        p.setFillColour(10 + h * 10, 100, 70)
        p.fill(sp)

        sp = SimplePath.withPoints([])
        sp.addPoint(iso([n, h, m + 1]))
        sp.addPoint(iso([n, h - 1, m + 1]))
        sp.addPoint(iso([n, h - 1, m]))
        sp.addPoint(iso([n, h, m]))
        sp.close()
        p.setFillColour(10 + h * 10, 75, 60)
        p.fill(sp)

        sp = SimplePath.withPoints([])
        sp.addPoint(iso([n, h, m]))
        sp.addPoint(iso([n + 1, h, m]))
        sp.addPoint(iso([n + 1, h, m + 1]))
        sp.addPoint(iso([n, h, m + 1]))
        sp.addPoint(iso([n, h - 1, m + 1]))
        sp.addPoint(iso([n, h - 1, m]))
        sp.addPoint(iso([n, h, m]))
        sp.close()
        p.draw(sp)
      })
    })
  })
}

const isometricExample3 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.lineWidth = 0.01 * bottom
  p.background(210, 70, 30)
  p.setStrokeColour(30, 10, 30)
  p.withTranslation([right / 2, bottom * 0.9], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(10, n => {
      p.downFrom(10, m => {
        const sp = SimplePath.withPoints([])
        const h = clamp(
          { from: -2, to: 5 },
          p.poisson(4) - 3 + Math.cos(p.t + n + m)
        )
        sp.addPoint(iso([n, h, m]))
        sp.addPoint(iso([n + 1, h, m]))
        sp.addPoint(iso([n + 1, h, m + 1]))
        sp.addPoint(iso([n, h, m + 1]))
        sp.addPoint(iso([n, h - 1, m + 1]))
        sp.addPoint(iso([n, h - 1, m]))
        // sp.addPoint(iso([n + 1, h - 1, m + 1]))
        sp.close()

        p.setFillColour(h * 10 + 10 * Math.cos(h * 3), 95, 65, 0.9)
        p.fill(sp)
        p.draw(sp)
      })
    })
  })
}

const isometricExample4 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.lineWidth = 0.005 * bottom
  p.background(340, 100, 40)
  p.setStrokeColour(30, 5, 20)
  p.withTranslation([right / 2, bottom * 0.9], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(10, n => {
      p.downFrom(10, m => {
        const h = perlin2(n / 5, m / 10) * 5 + 4

        const sp = SimplePath.withPoints([])
        sp.addPoint(iso([n, 0, m]))
        sp.addPoint(iso([n + 1, 0, m]))
        sp.addPoint(iso([n + 0.5, h, m + 0.5]))
        sp.close()

        p.setFillColour(h * 10, 100, 75, 0.95)
        p.fill(sp)
        p.draw(sp)

        const sp2 = SimplePath.withPoints([])
        sp2.addPoint(iso([n, 0, m]))
        sp2.addPoint(iso([n, 0, m + 1]))
        sp2.addPoint(iso([n + 0.5, h, m + 0.5]))
        sp2.close()

        p.setFillColour(h * 10, 60, 75, 0.95)
        p.fill(sp2)
        p.draw(sp2)
      })
    })
  })
}

const isometricExample5 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.lineWidth = 0.005 * bottom
  p.background(40, 40, 90)
  p.setStrokeColour(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)

    const h = (x, y) => 2 + 5 * perlin2(x / 5 + p.t, y / 10 + p.t * 0.5)

    p.downFrom(11, n => {
      p.downFrom(11, m => {
        p.doProportion(0.8, () => {
          const sp = SimplePath.withPoints([])

          sp.addPoint(iso([n, h(n, m), m]))
          sp.addPoint(iso([n + 1, h(n + 1, m), m]))
          sp.addPoint(iso([n + 1, h(n + 1, m + 1), m + 1]))
          sp.addPoint(iso([n, h(n, m + 1), m + 1]))
          sp.close()

          p.proportionately([
            [1, () => p.setFillColour(210, 100, 55 + 2.5 * h(n, m), 0.95)],
            [1, () => p.setFillColour(0, 80, 50 + 2.5 * h(n, m), 0.95)],
          ])

          p.fill(sp)
          p.draw(sp)
        })
      })
    })
  })
}

const isometricExample6 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.lineWidth = 0.005 * bottom
  p.background(0, 0, 90)
  p.setStrokeColour(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(11, n => {
      p.downFrom(11, m => {
        p.times(3, k => {
          p.doProportion(1 - (k + 1) / 6, () => {
            const h = (x, y) =>
              k * 2 + 2 * perlin2(x / 5 + p.t, y / 10 + p.t * 0.5)

            const sp = SimplePath.withPoints([])

            sp.addPoint(iso([n, h(n, m), m]))
            sp.addPoint(iso([n + 1, h(n + 1, m), m]))
            sp.addPoint(iso([n + 1, h(n + 1, m + 1), m + 1]))
            sp.addPoint(iso([n, h(n, m + 1), m + 1]))
            sp.close()

            p.proportionately([
              [
                1,
                () =>
                  p.setFillColour(210, 100, 55 + 2.5 * h(n, m), 0.95 - k / 8),
              ],
              [
                1,
                () =>
                  p.setFillColour(340, 100, 45 + 2.5 * h(n, m), 0.95 - k / 8),
              ],
            ])

            p.fill(sp)
            p.draw(sp)
          })
        })
      })
    })
  })
}

const isometricExample7 = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.lineWidth = 0.005 * bottom
  p.background(0, 0, 90)
  p.setStrokeColour(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)

    p.times(7, hr => {
      const h = hr + Math.cos(p.t)
      p.setFillColour(h * 10, 90, 50, 0.95)
      const sp = SimplePath.withPoints([])

      p.proportionately([
        [
          1,
          () => {
            sp.addPoint(iso([5, h, 0]))
            sp.addPoint(iso([0, h, 0]))
            sp.addPoint(iso([0, h, 1]))
            sp.addPoint(iso([0, 5, 3]))
            sp.addPoint(iso([1, 5, 3]))
            sp.addPoint(iso([1, h, 1]))

            sp.addPoint(iso([4, h, 1]))
          },
        ],
        [
          1,
          () => {
            sp.addPoint(iso([8, h, 1]))
            sp.addPoint(iso([8, h, 0]))
            sp.addPoint(iso([8, 0, -2]))
            sp.addPoint(iso([7, 0, -2]))
            sp.addPoint(iso([7, h, 0]))
            sp.addPoint(iso([4, h, 0]))
            sp.addPoint(iso([4, h, 1]))
          },
        ],
      ])

      sp.addPoint(iso([4, h + 1, 3]))

      p.proportionately([
        [
          1,
          () => {
            sp.addPoint(iso([4, h + 1, 7]))
            sp.addPoint(iso([0, h, 7]))
            sp.addPoint(iso([-2, 0, 7]))
            sp.addPoint(iso([-2, 0, 8]))
            sp.addPoint(iso([0, h, 8]))
            sp.addPoint(iso([5, h + 1, 8]))
          },
        ],
        [
          1,
          () => {
            sp.addPoint(iso([4, h + 1, 10]))
            sp.addPoint(iso([5, h + 1, 10]))
            sp.addPoint(iso([9, h + 2, 10]))
            sp.addPoint(iso([11, 7, 10]))
            sp.addPoint(iso([11, 7, 9]))
            sp.addPoint(iso([9, h + 2, 9]))
            sp.addPoint(iso([4, h + 2, 8]))
          },
        ],
      ])

      sp.addPoint(iso([5, h + 1, 3]))
      sp.addPoint(iso([5, h, 1]))
      sp.close()
      p.fill(sp)
      p.draw(sp)
    })
  })
}

const isometricExample8 = (p: SCanvas) => {
  p.backgroundGradient(
    new RadialGradient({
      start: p.meta.center,
      rStart: 0,
      end: p.meta.center,
      rEnd: 0.6,
      colours: [[0, { h: 0, s: 0, l: 90 }], [1, { h: 215, s: 80, l: 30 }]],
    })
  )

  const { bottom, right } = p.meta
  p.lineWidth = 0.005 * bottom
  p.setStrokeColour(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)

    const top = (x, y, z) => [
      iso([x + 0, y, z + 0]),
      iso([x + 1, y, z + 0]),
      iso([x + 1, y, z + 1]),
      iso([x + 0, y, z + 1]),
    ]

    const left = (x, y, z) => [
      iso([x, y, z + 0]),
      iso([x, y - 0.5, z + 0]),
      iso([x, y - 0.5, z + 1]),
      iso([x, y, z + 1]),
    ]
    p.times(7, y => {
      p.times(7, () => {
        const x = p.uniformRandomInt({ from: 0, to: 10 })
        const z = p.uniformRandomInt({ from: 0, to: 10 })

        p.setFillColour(200, 40, 50)
        const sp = SimplePath.withPoints(top(x, y, z)).close()
        p.fill(sp)
        p.draw(sp)

        p.setFillColour(180, 40, 50, 0.8)
        const sp2 = SimplePath.withPoints(left(x, y, z)).close()
        p.fill(sp2)
        p.draw(sp2)

        p.setFillColour(350, 40, 50, 0.8)
        const sp3 = SimplePath.withPoints(left(x + 1, y + 0.5, z)).close()
        p.fill(sp3)
        p.draw(sp3)
      })
    })
  })
}

const isometricExample9 = (p: SCanvas) => {
  p.background(215, 80, 10)
  const { bottom, right: r } = p.meta
  p.lineWidth = 0.005 * bottom
  p.setStrokeColour(0, 0, 90)
  p.withTranslation([r / 2, bottom * 0.5], () => {
    const iso = isoTransform(0.1 * bottom)

    // Experimenting with helper functions... probably want to include in framework or as helpers somehow?
    const top = (x, y, z, s) => [
      iso([x, y, z]),
      iso([x + s, y, z]),
      iso([x + s, y, z + s]),
      iso([x, y, z + s]),
    ]

    const left = (x, y, z, s) => [
      iso([x, y, z]),
      iso([x, y - s, z + 0]),
      iso([x, y - s, z + s]),
      iso([x, y, z + s]),
    ]

    const right = (x, y, z, s) => [
      iso([x, y, z]),
      iso([x + s, y, z]),
      iso([x + s, y - s, z]),
      iso([x, y - s, z]),
    ]

    const shade = (fn, x, y, z, s, h, sat = 40, l = 50) => {
      p.setFillColour(h, sat, l, 0.95)
      const sp = SimplePath.withPoints(fn(x, y, z, s)).close()
      p.fill(sp)
      p.draw(sp)
    }

    const cube = (x, y, z, s) => {
      shade(top, x, y, z, s, 200)
      shade(left, x, y, z, s, 180)
      shade(right, x, y, z, s, 350)
    }

    shade(top, -1.5, -2, -1.5, 5, 30, 20, 50)

    cube(0, 0, 0, 2)
    cube(1, -1, -1, 1)
    cube(0.5, -1.5, -0.5, 0.5)
    cube(-1, -1, 1, 1)
    cube(-0.5, -1.5, 0.5, 0.5)
  })
}

const isometricExample10 = (p: SCanvas) => {
  p.background(175, 60, 10)
  const { bottom, right: r } = p.meta
  p.lineWidth = 0.005 * bottom
  p.setStrokeColour(0, 0, 90)
  const tracePoints = (points: Point2D[]) => {
    const sp = SimplePath.withPoints(points).close()
    p.draw(sp)
  }

  const sub3 = (
    [a, b, c]: [number, number, number],
    [d, e, f]: [number, number, number]
  ): [number, number, number] => [a - d, b - e, c - f]

  p.withTranslation([r / 2, bottom * 0.5], () => {
    const iso = isoTransform(0.2 * bottom)

    const a: [number, number, number] = [
      Math.cos(p.t) + Math.sin(p.t),
      1,
      -Math.sin(p.t) + Math.cos(p.t),
    ]
    const b: [number, number, number] = [
      Math.cos(p.t) - Math.sin(p.t),
      1,
      -Math.sin(p.t) - Math.cos(p.t),
    ]
    const c: [number, number, number] = [
      -Math.cos(p.t) - Math.sin(p.t),
      1,
      Math.sin(p.t) - Math.cos(p.t),
    ]
    const d: [number, number, number] = [
      -Math.cos(p.t) + Math.sin(p.t),
      1,
      Math.sin(p.t) + Math.cos(p.t),
    ]

    const dH: [number, number, number] = [0, 2, 0]

    tracePoints([
      iso(sub3(a, dH)),
      iso(sub3(b, dH)),
      iso(sub3(c, dH)),
      iso(sub3(d, dH)),
    ])
    tracePoints([iso(a), iso(b), iso(sub3(b, dH)), iso(sub3(a, dH))])
    tracePoints([iso(b), iso(c), iso(sub3(c, dH)), iso(sub3(b, dH))])
    tracePoints([iso(c), iso(d), iso(sub3(d, dH)), iso(sub3(c, dH))])
    tracePoints([iso(d), iso(a), iso(sub3(a, dH)), iso(sub3(d, dH))])
    tracePoints([iso(a), iso(b), iso(c), iso(d)])
  })
}

const painting = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colours: [[0, { h: 45, s: 30, l: 95 }], [1, { h: 55, s: 30, l: 90 }]],
    })
  )
  p.forVertical({ n: 100, margin: 0.15 }, ([x, y], [dX, dY]) => {
    const h = p.gaussian({ mean: dY, sd: (1.5 * dY) / p.meta.bottom })
    const curveSize = p.gaussian({ sd: 0.35 * p.meta.right })
    const xOffset = p.gaussian({ sd: dX / 20 })

    const h1 = p.uniformRandomInt({ from: 180, to: 240 })
    const h2 = p.uniformRandomInt({ from: 0, to: 40 })

    p.setFillGradient(
      new LinearGradient({
        from: [x + xOffset, y],
        to: [x + dX + xOffset, y + dY],
        colours: [
          [0, { h: h1, s: 60, l: 65, a: 0 }],
          [0.05, { h: h1, s: 60, l: 65, a: 0 }],
          [0.1, { h: h1, s: 60, l: 65, a: 0.9 }],
          [
            0.5,
            {
              h: p.gaussian({ mean: 10 }) + (h1 + h2) / 2,
              s: 60,
              l: 65,
              a: 0.8,
            },
          ],
          [0.9, { h: h2, s: 60, l: 65, a: 0.9 }],
          [0.95, { h: h2, s: 60, l: 65, a: 0 }],
          [1, { h: h2, s: 60, l: 65, a: 0 }],
        ],
      })
    )
    p.fill(
      Path.startAt([x, y])
        .addCurveTo([x + dX, y], { curveSize })
        .addLineTo([x + dX, y + h])
        .addCurveTo([x, y + h], { curveSize, polarlity: -1 })
        .addLineTo([x, y])
    )
  })
}

const painting2 = (p: SCanvas) => {
  const bh = p.uniformRandomInt({ from: 0, to: 360 })
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colours: [
        [0, { h: bh + 15, s: 30, l: 95 }],
        [1, { h: bh + 25, s: 30, l: 90 }],
      ],
    })
  )
  p.forVertical({ n: 100, margin: 0.1 }, ([x, y], [dX, dY], _c, i) => {
    const h = p.gaussian({ mean: dY, sd: (1.5 * dY) / p.meta.bottom })
    const curveSize = p.gaussian({ sd: 0.35 * p.meta.right })
    const xOffset = p.gaussian({ sd: dX / 20 })

    const h1 = p.uniformRandomInt({ from: bh, to: bh + 40 })
    const h2 = p.uniformRandomInt({ from: bh + 30, to: bh + 70 })

    p.withTranslation(p.meta.center, () => {
      p.withRotation((i * Math.PI) / 50, () => {
        p.setFillGradient(
          new LinearGradient({
            from: [x + xOffset, y],
            to: [x + dX + xOffset, y + dY],
            colours: [
              [0, { h: h1, s: 60, l: 65, a: 0 }],
              [0.05, { h: h1, s: 60, l: 65, a: 0 }],
              [0.1, { h: h1, s: 60, l: 65, a: 0.9 }],
              [
                0.5,
                {
                  h: p.gaussian({ mean: 10 }) + (h1 + h2) / 2,
                  s: 60,
                  l: 65,
                  a: 0.4,
                },
              ],
              [0.9, { h: h2, s: 60, l: 65, a: 0.9 }],
              [0.95, { h: h2, s: 60, l: 65, a: 0 }],
              [1, { h: h2, s: 60, l: 65, a: 0 }],
            ],
          })
        )
        p.fill(
          Path.startAt([0, 0])
            .addCurveTo([dX, 0], { curveSize })
            .addLineTo([dX, h])
            .addCurveTo([0, h], {
              curveSize: curveSize + p.gaussian({ sd: 0.1 }),
              polarlity: -1,
            })
            .addLineTo([0, 0])
        )
      })
    })
  })
}

const stackedCurves = (p: SCanvas) => {
  p.background(210, 40, 15)
  p.withRandomOrder(
    p.forHorizontal,
    { n: 20, margin: 0.1 },
    ([x, y], [dX, dY], c, i) => {
      let sp = SimplePath.withPoints([])
      p.times(10, n => {
        sp.addPoint([x + dX / 2 + p.gaussian({ sd: 0.01 }), y + (n * dY) / 10])
      })
      p.downFrom(10, n => {
        sp.addPoint([x - dX / 2 - p.gaussian({ sd: 0.01 }), y + (n * dY) / 10])
      })
      sp.close()
      p.setFillColour(120 + i * 5, 60, 50, 0.85)

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
  p.times(p.meta.bottom * 13, n => {
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
          [1, () => p.setFillColour(p.sample(HUES), 95, 50)],
          [1, () => p.setFillColour(p.sample(HUES), 40, 80)],
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
      p.times(6, j => {
        p.setFillColour(i * 27 + j * 12, 90, 30, 0.3)
        nPt = p.perturb(nPt, { magnitude: dX / 1.5 })
        p.fill(new Circle({ at: nPt, r: dX / 2 }))
      })
    })
  })
}

const minis2 = (p: SCanvas) => {
  p.background(215, 60, 10)
  p.forTiling(
    { n: 6, type: "square", margin: 0.1 },
    ([x, y], [dX, dY], [cX, cY], i) => {
      p.withClipping(new Rect({ at: [x, y], w: dX, h: dY }), () => {
        p.background(i * 27, 20, 10)
        let nPt: Point2D = [cX, cY]
        p.times(6, j => {
          p.setFillColour(i * 27 + j * 12, 90, 40, 0.3)
          nPt = p.perturb(nPt, { magnitude: dX / 1.5 })
          p.fill(new Circle({ at: nPt, r: dX / 2 }))
        })
      })

      let frame: Point2D = [x, y]
      p.lineWidth = 0.001
      p.setStrokeColour(0, 0, 90)
      p.times(3, () => {
        p.draw(new Rect({ at: frame, w: dX, h: dY }))
        frame = p.perturb(frame, { magnitude: 0.015 })
      })
    }
  )
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
            p.setFillColour(0, 0, 50)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
            p.setFillColour(h2, 80, 10)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
          },
        ],
        [
          1,
          () => {
            p.setFillColour(h2, 80, 10)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
            p.setFillColour(0, 0, 50)
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
            p.setFillColour(h1, 60, 30)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
          },
        ],
        [
          1,
          () => {
            p.setFillColour(h1, 60, 30)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
            p.setFillColour(h2, 80, 50)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
          },
        ],
        [
          1,
          () => {
            p.setFillColour(h2, 80, 50)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
            p.setFillColour(h1, 60, 30)
            p.fill(new Rect({ at: [x, cY - s], w: dX, h: 2 * s }))
          },
        ],
        [
          1,
          () => {
            p.setFillColour(h2, 80, 50)
            p.fill(new Rect({ at: [cX - s, y], w: 2 * s, h: dY }))
          },
        ],
      ])
    }
  )
}

const scaled = (p: SCanvas) => {
  p.withTranslation(add([0, 0.1], p.meta.center), () => {
    p.times(16, n => {
      p.withRotation((Math.PI * n) / 8, () => {
        p.withScale([1, 1 - 0.05 * n], () => {
          p.withTranslation([n * 0.02, 0], () => {
            p.setFillColour(90, 80, 40 + 3 * n, 0.75)
            const c = new Circle({ at: [0, 0], r: p.meta.bottom / 5 })
            p.fill(c)
            p.draw(c)
          })
        })
      })
    })
  })
}

const explosion = (p: SCanvas) => {
  p.background(355, 70, 32)
  const N = 45
  p.withTranslation(p.meta.center, () => {
    p.times(5, m => {
      const sp = SimplePath.withPoints([])
      p.aroundCircle(
        { at: [0, 0], radius: 0.1 + 0.08 * m, n: 30 },
        ([x, y]) => {
          sp.addPoint(p.perturb([x, y]))
        }
      )
      sp.close()
      p.setFillColour(210, 45, 90, 0.2)
      p.fill(sp.chaiken({ n: 2, looped: true }))
    })

    p.setFillColour(45, 90, 100)
    p.times(N, n => {
      p.withRotation((2 * Math.PI * n) / N, () => {
        const start = p.perturb([0.1 + p.random() * 0.2, 0], {
          magnitude: 0.03,
        })
        const end = p.perturb([0.4, 0], { magnitude: 0.1 })
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
  const sPerlin = (x, y) => perlin2(x * s, y * s)
  p.times(40, () => {
    p.setStrokeColour(
      p.sample([215, 200, 0]),
      p.sample([50, 80]),
      p.sample([40, 20, 10])
    )
    let spt = p.randomPoint
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

  p.times(30, n => {
    const sPerlin = (x, y) => perlin2(x * s + n / 50, y * s + n / 100)
    p.setStrokeColour(
      p.sample([150, 170, 75]),
      p.sample([50, 80]),
      p.sample([40, 20, 10]),
      0.75
    )
    let spt = p.randomPoint
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

const contoured3 = (p: SCanvas) => {
  let e = 0.01
  let s = 3
  p.lineWidth = 0.005
  p.background(190, 80, 80)

  p.times(20, n => {
    const sPerlin = (x, y) =>
      perlin2(p.random() + x * s + n / 50, y * s + n / 100)
    p.setFillColour(
      p.sample([220, 170]),
      p.sample([50, 80]),
      p.sample([50, 40, 30]),
      0.25
    )
    let spt = p.randomPoint
    let pt: Point2D = [spt[0], spt[1]]
    const points: Point2D[] = [spt]
    while (p.inDrawing(pt)) {
      let newPt = add(pt, [
        e * Math.cos(sPerlin(...pt)),
        e * Math.sin(sPerlin(...pt)),
      ])
      points.push(newPt)
      pt = newPt
    }
    pt = [spt[0], spt[1]]
    while (p.inDrawing(pt)) {
      let newPt = add(pt, [
        -e * Math.cos(sPerlin(...pt)),
        -e * Math.sin(sPerlin(...pt)),
      ])
      points.unshift(newPt)
      pt = newPt
    }

    const { right, left } = p.meta
    if (points[0][0] < left && points[points.length - 1][0] > right) {
      points.unshift([right, 0], [0, 0])
      p.fill(SimplePath.withPoints(points).close())
    } else if (points[0][0] > right && points[points.length - 1][0] < left) {
      points.unshift([right, 0], [0, 0])
      p.fill(SimplePath.withPoints(points).close())
    }
  })
}

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

const central = (p: SCanvas) => {
  const N = 80
  p.background(220, 90, 10)
  p.setFillGradient(
    new RadialGradient({
      start: [0, 0],
      end: [0, 0],
      rStart: 0,
      rEnd: 0.8,
      colours: [
        [0, { h: 0, s: 0, l: 100 }],
        [0.25, { h: 220, s: 10, l: 50 }],
        [0.35, { h: 0, s: 0, l: 100 }],
        [0.45, { h: p.sample([0, 45, 170, 215]), s: 50, l: 50 }],
        [0.8, { h: 0, s: 0, l: 100 }],
      ],
    })
  )
  p.withTranslation(p.meta.center, () => {
    p.aroundCircle({ at: [0, 0], radius: 0.1, n: N }, (pt, i) => {
      if ((i + 2) % 20 > 2) {
        p.fill(
          Path.startAt(pt)
            .addCurveTo(scale(pt, p.gaussian({ mean: 4, sd: 0.1 })), {
              curveSize: 0.05,
            })
            .addCurveTo(pt, { curveSize: 0.05 })
        )
      }
    })
  })
}

const centralCurves = (p: SCanvas) => {
  const N = 80
  p.background(20, 90, 10)
  p.setFillGradient(
    new RadialGradient({
      start: [0, 0],
      end: [0, 0],
      rStart: 0,
      rEnd: 0.8,
      colours: [
        [0, { h: 0, s: 0, l: 100 }],
        [0.25, { h: 220, s: 10, l: 50 }],
        [0.35, { h: 0, s: 0, l: 100 }],
        [0.45, { h: p.sample([0, 45, 215, 340]), s: 50, l: 50 }],
        [0.8, { h: 0, s: 0, l: 100 }],
      ],
    })
  )
  p.withTranslation(p.meta.center, () => {
    p.aroundCircle({ at: [0, 0], radius: 0.1, n: N }, (pt, i) => {
      if ((i + p.uniformRandomInt({ from: 4, to: 16 })) % 20 > 2) {
        const r = p.gaussian({ mean: 0.4, sd: 0.04 })
        const a = ((i + 2) * Math.PI * 2) / N
        const t: Point2D = [r * Math.cos(a), r * Math.sin(a)]
        p.fill(
          Path.startAt(pt)
            .addCurveTo(t, {
              curveSize: 0.8,
            })
            .addCurveTo(pt, { curveSize: -0.75 })
        )
      }
    })
  })
}

const lineOfCurves = (p: SCanvas) => {
  p.background(170, 90, 10)
  p.forHorizontal({ n: 120, margin: 0.2 }, ([x, y], [dX, dY], [cX, cY]) => {
    const height = p.gaussian({ mean: 0.5 * p.meta.bottom, sd: 0.1 })
    const dH = p.gaussian({ sd: 0.1 })
    const cS = p.gaussian({ mean: 0.3, sd: 0.1 })
    const pol = p.randomPolarity()
    const yBase = y + dY + 0.2
    p.setFillColour(p.sample([45, 55, 60, 65]), 30, 85, 0.6)
    p.fill(
      Path.startAt([x, yBase])
        .addCurveTo([cX + dH, y + dY - height + 0.1], {
          curveSize: cS * pol,
        })
        .addCurveTo([x + dX + 0.02, yBase], {
          curveSize: (cS - 0.05) * pol * -1,
        })
        .addLineTo([x - 0.1, yBase])
    )
  })
}

const dividing = (p: SCanvas) => {
  p.background(40, 25, 95)
  const ss = new RegularPolygon({
    at: p.meta.center,
    n: 14,
    r: 0.4,
  }).path.segmented.flatMap(s => s.segmented)
  ss.forEach((s, i) => {
    p.setFillColour(i * 5, 70, 60)
    p.fill(s)
  })
  p.lineWidth = 0.005
  ss.forEach(s => {
    p.draw(s)
  })
}

const dividing2 = (p: SCanvas) => {
  p.background(0, 0, 5)
  new RegularPolygon({ at: p.meta.center, r: 0.4, n: 20 }).path.segmented
    .flatMap(s => s.exploded({ scale: 0.75, magnitude: 1.1 }))
    .flatMap(s => s.exploded({ scale: 0.8, magnitude: 1.5 }))
    .forEach((s, i) => {
      p.setFillColour(i * 5, 80, 60, 0.9)
      p.fill(s)
    })
}

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

const dividing6 = (p: SCanvas) => {
  p.background(175, 20, 95)

  new Star({ at: p.meta.center, n: 16, r: 0.4 }).path
    .exploded({ magnitude: 1.05, scale: 0.99 })
    .flatMap(s => s.exploded({ magnitude: 1.05, scale: 0.99 }))
    .forEach((s, i) => {
      p.setFillColour(215 - i * 3, 90, 40)
      p.fill(s.rotated(p.gaussian({ sd: Math.PI / 12 })))
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

const night = (p: SCanvas) => {
  p.background(0, 0, 5)
  p.forTiling({ n: 15, type: "square" }, (_pt, [dX], c) => {
    const hue = p.sample([45, 55, 60])
    const loc = p.perturb(c, { magnitude: 0.4 })
    p.setFillGradient(
      new RadialGradient({
        start: loc,
        end: loc,
        rStart: 0,
        rEnd: dX,
        colours: [
          [0, { h: hue, s: 80, l: 70 }],
          [p.sample([0.1, 0.2, 0.3, 0.5]), { h: hue, s: 80, l: 90, a: 0 }],
        ],
      })
    )
    p.fill(new Circle({ at: loc, r: dX }))
  })
}

const bokeh = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colours: [[0, { h: 0, s: 0, l: 30 }], [1, { h: 0, s: 0, l: 0 }]],
    })
  )
  p.forTiling({ n: 20, type: "square", margin: 0.2 }, (_pt, [dX], c) => {
    const hue = p.sample([5, 25, 210])
    const loc = p.perturb(c, { magnitude: 0.4 })
    p.setFillGradient(
      new RadialGradient({
        start: loc,
        end: loc,
        rStart: 0,
        rEnd: dX * 2.2,
        colours: [
          [0, { h: hue, s: 80, l: 70 }],
          [p.sample([0.1, 0.2, 0.3, 0.5]), { h: hue, s: 80, l: 70, a: 0 }],
        ],
      })
    )
    p.fill(new Circle({ at: loc, r: dX }))
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: tiling, name: "Tiling" },
  { sketch: rainbow, name: "Rainbow Drips" },
  { sketch: horizontal, name: "Horizontal" },
  { sketch: vertical, name: "Vertical" },
  { sketch: curves1, name: "Curves Demo" },
  { sketch: flower, name: "Flower" },
  { sketch: chaiken, name: "Chaiken" },
  { sketch: tilesOfChaiken, name: "Tiled Curves" },
  { sketch: circle, name: "Around a Circle" },
  { sketch: arcs, name: "Arcs" },
  { sketch: noise, name: "Noise" },
  { sketch: noiseField, name: "Noise Field" },
  { sketch: rectangles, name: "Rectangles" },
  { sketch: rectanglesDivided, name: "Rectangles Divided" },
  { sketch: mondrian, name: "Mondrianish" },
  { sketch: helloWorld, name: "Hello World" },
  { sketch: circleText, name: "Circle Labels" },
  { sketch: scriptLike, name: "Script-ish" },
  { sketch: doodles, name: "Doodles" },
  { sketch: circles, name: "Circles" },
  { sketch: circles2, name: "Bubbles" },
  { sketch: ellipses, name: "Ellipses Demo" },
  { sketch: gradients1, name: "Gradient Demo 1" },
  { sketch: gradients2, name: "Gradient Demo 2" },
  { sketch: gradients3, name: "Gradient Demo 3" },
  { sketch: gradients4, name: "Gradient Demo 4" },
  { sketch: gradients5, name: "Gradient Demo 5" },
  { sketch: sunsetThroughBlinds, name: "Gradient Demo 6" },
  { sketch: randomness1, name: "Gaussian" },
  { sketch: randomness1b, name: "Gaussian 2" },
  { sketch: randomness1c, name: "Gaussian 3" },
  { sketch: randomness2, name: "Poisson" },
  { sketch: curves, name: "Curves" },
  { sketch: transforms, name: "Transforms Demo" },
  { sketch: transforms2, name: "Transforms Demo 2" },
  { sketch: transforms3, name: "Transforms Demo 3" },
  { sketch: time, name: "Time" },
  { sketch: clipping, name: "Clipping Demo" },
  { sketch: roundedRects, name: "Rounded Rectangles Demo" },
  { sketch: cards, name: "Cards" },
  { sketch: polygons, name: "Polygons" },
  { sketch: polygons2, name: "Polygons 2" },
  { sketch: polygons3, name: "Polygons 3" },
  { sketch: stars, name: "Stars" },
  { sketch: hatching, name: "Hatching Demo 1" },
  { sketch: hatching2, name: "Hatching Demo 2" },
  { sketch: moreArcs, name: "More Arcs" },
  { sketch: evenMoreArcs, name: "Even More Arcs" },
  { sketch: curls, name: "Curls" },
  { sketch: colourWheel, name: "Colour Wheel" },
  { sketch: colourPaletteGenerator, name: "Colour Palette Generator" },
  { sketch: stackPolys, name: "Stack Polygons" },
  { sketch: blob, name: "Blob" },
  { sketch: sunburst, name: "Sunburst" },
  { sketch: fancyTiling, name: "Fancy Tiling" },
  { sketch: anotherTiling, name: "Another Tiling" },
  { sketch: lissajous, name: "Lissajous" },
  { sketch: sketchingCurves, name: "Sketching Curves" },
  { sketch: shading, name: "Shading In" },
  { sketch: shading2, name: "Shading Again" },
  { sketch: shadingArcs, name: "Shaded Arcs" },
  { sketch: arcChart, name: "Arc Chart" },
  { sketch: bars, name: "Bars" },
  { sketch: littleAbstracts, name: "Little Abstracts" },
  { sketch: recordCoverish, name: "Record Cover" },
  { sketch: recordCoverish2, name: "Record Cover 2" },
  { sketch: recordCoverish3, name: "Record Cover 3" },
  { sketch: recordCoverish4, name: "Record Cover 4" },
  { sketch: isometricExample, name: "Isometric" },
  { sketch: isometricExample2, name: "Isometric 2" },
  { sketch: isometricExample3, name: "Isometric 3" },
  { sketch: isometricExample4, name: "Isometric 4" },
  { sketch: isometricExample5, name: "Isometric 5" },
  { sketch: isometricExample6, name: "Isometric 6" },
  { sketch: isometricExample7, name: "Isometric Tapes" },
  { sketch: isometricExample8, name: "Isometric Fragments" },
  { sketch: isometricExample9, name: "Isometric Cube Examples" },
  { sketch: isometricExample10, name: "Isometric Rotation" },
  { sketch: painting, name: "Paint Strokes" },
  { sketch: painting2, name: "Round Paint Strokes" },
  { sketch: stackedCurves, name: "Stacked Curves" },
  { sketch: stackedCurves2, name: "Stacked Curves 2" },
  { sketch: minis, name: "Minis" },
  { sketch: minis2, name: "Minis 2" },
  { sketch: weave, name: "Weave" },
  { sketch: weave2, name: "Weave 2" },
  { sketch: scaled, name: "Discs" },
  { sketch: explosion, name: "Explosion" },
  { sketch: contoured, name: "Contoured" },
  { sketch: contoured2, name: "Contoured 2" },
  { sketch: contoured3, name: "Contoured 3" },
  { sketch: compoundPath, name: "Compound Path" },
  { sketch: compoundPath2, name: "Compound Path 2" },
  { sketch: central, name: "Centrality" },
  { sketch: centralCurves, name: "Central Curves" },
  { sketch: lineOfCurves, name: "Line of Curves" },
  { sketch: dividing, name: "Dividing 1" },
  { sketch: dividing2, name: "Dividing 2" },
  { sketch: dividing3, name: "Dividing 3" },
  { sketch: dividing4, name: "Dividing 4" },
  { sketch: dividing5, name: "Dividing 5" },
  { sketch: dividing6, name: "Dividing 6" },
  { sketch: dividing7, name: "Dividing 7" },
  { sketch: dividing8, name: "Dividing 8" },
  { sketch: dividing9, name: "Dividing 9" },
  { sketch: dividing10, name: "Dividing 10" },
  { sketch: night, name: "Night" },
  { sketch: bokeh, name: "Bokeh" },
]

export default sketches
