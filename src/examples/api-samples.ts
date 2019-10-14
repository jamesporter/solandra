import { Point2D } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import { Path, SimplePath } from "../lib/paths"
import {
  Hatching,
  Star,
  RegularPolygon,
  Circle,
  Ellipse,
  RoundedRect,
  Rect,
  HollowArc,
  Arc,
} from "../lib/paths"
import { add, pointAlong, scale, distance } from "../lib/vectors"
import { perlin2 } from "../lib/noise"
import { LinearGradient, RadialGradient } from "../lib/gradient"
import { clamp, Line, Square, v } from "../lib"
import {
  simpleLinearGradient,
  hueRange,
  saturationRange,
  lightnessRange,
} from "../lib/colors"

const rainbow = (p: SCanvas) => {
  p.withRandomOrder(
    p.forTiling,
    { n: 20, type: "square", margin: 0.1 },
    ([i, j], [di, dj]) => {
      p.doProportion(0.6, () => {
        p.setStrokeColor(i * 100, 80, 30 + j * 30, 0.9)
        p.lineWidth = 0.02 + 0.02 * (1 - i)
        p.draw(
          new Line(
            [i + di / 4, j + dj / 4],
            [
              i + (di * 3 * j * p.randomPolarity()) / 4,
              j + (dj * 5 * (1 + p.random())) / 4,
            ]
          )
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
      colors: [[0, { h: 0, s: 0, l: 95 }], [1, { h: 0, s: 0, l: 85 }]],
    })
  )
  p.forHorizontal({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setStrokeColor(x * 360, 90, 40)
    p.draw(new Line([x, y], [x + dX, y + dY]))
  })
}

const vertical = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, 1],
      colors: [[0, { h: 50, s: 40, l: 95 }], [1, { h: 30, s: 40, l: 90 }]],
    })
  )
  p.forVertical({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    const points = p.build(p.range, { from: x, to: x + dX, n: 20 }, vX => {
      return p.perturb({ at: [vX, y + dY / 2], magnitude: dY / 4 })
    })
    p.lineWidth = 0.01 / p.meta.aspectRatio
    p.setStrokeColor(y * 60, 90, 40)
    p.draw(SimplePath.withPoints(points))
  })
}

const flower = (p: SCanvas) => {
  const horizonOffset = p.random() * 0.25
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colors: [
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

  const start = p.perturb({ at: [midX, bottom * 0.95] })
  const end: Point2D = [midX, midY]
  const second = p.perturb({ at: pointAlong(start, end, 0.4) })

  p.setStrokeColor(140, 50, 25)
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
      colors: [
        [0, { h: 10 + baseHue, s: 90, l: 50, a: 0.95 }],
        [0.3, { h: 70 + baseHue, s: 90, l: 40, a: 0.95 }],
      ],
    })
  )
  p.fill(path)
  p.lineWidth = 0.005

  p.setFillColor(40, 90, 90)
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
      colors: [[0, { h: 215, s: 20, l: 90 }], [1, { h: 140, s: 20, l: 90 }]],
    })
  )
  p.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setStrokeColor(20 + x * 40, 90 - 20 * y, 50)
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
      p.setStrokeColor(190 + x * 100, 90, 40 + y * 10, 0.75 * ((n + 3) / 5))
      p.draw(sp)
    })
  })
}

const circle = (p: SCanvas) => {
  p.times(10, n => {
    p.setStrokeColor(0, 0, n + 10, (0.75 * (n + 1)) / 10)
    const points = p.build(p.aroundCircle, { n: 20 }, at => p.perturb({ at }))
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
    p.setFillColor(n * 2.5, 90, 50, 0.5)
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
    p.setFillColor(p.t * 10 + 120 + v * 20, 80, 40)
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
          colors: [
            [0, { h: i * 10, s: 90, l: 60 }],
            [1, { h: i * 10, s: 60, l: 40 }],
          ],
        })
      )
      p.fill(r)
      p.draw(r)
    })
}

const circleText = (p: SCanvas) => {
  p.aroundCircle({ r: 0.25, n: 12 }, ([x, y], i) => {
    p.times(5, n => {
      p.setFillColor(i * 5 + n, 75, 35, 0.2 * n)
      p.fillText(
        {
          at: p.perturb({ at: [x, y] }),
          size: 0.05,
          align: "left",
        },
        (i + 1).toString()
      )
    })
  })
}

const circles = (p: SCanvas) => {
  p.background(120, 5, 95)
  p.forTiling({ n: 10, type: "square", margin: 0.1 }, (pt, delta) => {
    p.setFillColor(pt[0] * 100, 80, 50)
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

const helloWorld = (p: SCanvas) => {
  const { bottom, aspectRatio } = p.meta
  p.range(
    {
      from: 0.1,
      to: bottom - 0.1,
      n: 10,
    },
    n => {
      p.setStrokeColor(n * aspectRatio * 50, 20, 20, 0.75)
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
      p.setFillColor(n * aspectRatio * 50, 80, 50, 0.9)

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

const ellipses = (p: SCanvas) => {
  p.background(0, 0, 100)
  p.withRandomOrder(
    p.forTiling,
    { n: 15, type: "square", margin: 0.1 },
    (pt, delta) => {
      const [x, y] = pt
      p.setFillColor(150 + perlin2(x * 10, 1) * 50, 80, 50, 0.9)
      p.setStrokeColor(150, 40, 100)
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
      colors: [
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
      colors: [
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
      colors: [
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
      colors: [
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
        colors: [
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
        colors: [
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

const sunsetThroughBlinds = (p: SCanvas) => {
  const { right, bottom, center } = p.meta

  p.setFillGradient(
    new RadialGradient({
      start: add(center, [0, 0.2]),
      end: add(center, [0, 0.4]),
      rStart: 0.0,
      rEnd: 2 * bottom * right,
      colors: [
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
        colors: [
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

const transforms = (p: SCanvas) => {
  p.forTiling({ n: 8, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.setFillColor(120 + x * 100, 90, 50)
    p.withTranslation([x + dX / 2, y + dY / 2], () =>
      p.withRotation(x + y + p.t, () => {
        p.fill(new Rect({ at: [-dX / 4, -dY / 4], w: dX / 2, h: dY / 2 }))
      })
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
          p.setFillColor(360 - n * 20, 90, 30, 0.5)
          p.fill(new Rect({ at: [-dX / 2, -dY / 2], w: dX / 4, h: 2 * dY }))
        })
      })
    )
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
              p.setStrokeColor(120 + x * 120 + p.t * 50, 90 - 20 * y, 40)
              p.proportionately([
                [1, () => p.draw(new Line([x, y], [x + dX, y + dY]))],
                [2, () => p.draw(new Line([x + dX, y], [x, y + dY]))],
                [1, () => p.draw(new Line([x, y], [x, y + dY]))],
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
      p.setFillColor(p.t * 50 + 150 + x * 100, y * 40 + 60, 40)
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
        p.setFillColor(175 + x * 60 + y * 100, y * 40 + 60, 40)
        p.fill(
          new Rect({
            at: [x + dX / 6, y + dX / 4],
            w: (dX * 2) / 3,
            h: dY / 2,
          })
        )

        p.setFillColor(0, 0, 100, 0.4)
        p.times(5, () =>
          p.fill(
            new Ellipse({
              at: p.perturb({ at: [x + dX / 2, y + dY / 2] }),
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
    p.setFillColor(180 + 40 * x, 50 + 50 * y, 60)
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

const polygons3 = (p: SCanvas) => {
  p.background(210, 70, 90)
  p.forHorizontal({ n: 4, margin: 0.1 }, (_pt, [dX], c, i) => {
    p.setFillColor([215, 225, 235, 245][i], 90, 30)
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
    p.setFillColor(20 + 30 * x, 25 + 75 * y, 45 + 5 * (1 + Math.sin(p.t + x)))
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
    p.setStrokeColor(215 - n * 75, 90, 10 + n * 30)
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

const evenMoreArcs = (p: SCanvas) => {
  p.background(30, 50, 90)
  p.times(24, () => {
    const a = p.random() * Math.PI * 2
    const r = p.sample([0.2, 0.25, 0.3, 0.35, 0.4])
    p.setFillColor(p.sample([20, 30, 35, 40]), 90, 60, 0.8)
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
    p.setFillColor(p.sample([20, 30, 35, 40]), 80, 30, 0.95)
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
  const baseColor = p.uniformRandomInt({ from: 150, to: 250 })
  p.background(baseColor, 20, 90)
  p.lineStyle = {
    cap: "round",
  }
  p.setFillColor(baseColor, 60, 30)
  p.setStrokeColor(baseColor - 40, 80, 35, 0.9)
  p.times(p.uniformRandomInt({ from: 20, to: 100 }), () => {
    const c = p.randomPoint()
    let tail = p.perturb({ at: c, magnitude: 0.2 })
    while (distance(c, tail) < 0.1) {
      tail = p.perturb({ at: c, magnitude: 0.2 })
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

const colorPaletteGenerator = (p: SCanvas) => {
  const baseColor = p.uniformRandomInt({ from: 0, to: 360 })

  p.proportionately([
    [1, () => p.background(0, 0, 10)],
    [1, () => p.background(0, 0, 90)],
  ])

  const colors = [
    baseColor + 90,
    baseColor + 45,
    baseColor,
    baseColor - 45,
    baseColor - 90,
    baseColor + 180,
  ]

  p.forVertical({ n: 6, margin: 0.1 }, ([x, y], [dX, dY], _c, i) => {
    const c = colors[i]
    p.range({ from: x, to: x + dX, n: 6, inclusive: false }, xV => {
      p.setFillColor(c, 80, 10 + xV * 70)
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

const stackPolys = (p: SCanvas) => {
  p.background(320, 10, 90)
  p.lineWidth = 0.0025
  const v = p.uniformRandomInt({ from: 5, to: 8 })
  const m = p.uniformRandomInt({ from: 30, to: 80 })

  p.times(m, n => {
    p.setStrokeColor(p.uniformRandomInt({ from: 320, to: 360 }), 80, 50)
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

const anotherTiling = (p: SCanvas) => {
  p.background(240, 20, 90)
  p.forTiling({ n: 25, margin: 0.1, type: "square" }, (at, [dX, dY]) => {
    p.withTranslation(add(at, scale([dX, dY], 0.5)), () =>
      p.withRotation(p.sample([0, Math.PI / 2, Math.PI]), () => {
        p.setFillColor(p.sample([160, 175, 220]), 80, 40)
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
      p.setStrokeColor(220, 90 - i / 4, 20)
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
      colors: [[0, { h: 50, s: 0, l: 40 }], [1, { h: 50, s: 0, l: 0 }]],
    })
  )
  p.lineWidth = 0.005
  p.times(20, () => {
    p.setStrokeColor(p.sample([20, 40, 50]), 30, 80, 0.85)
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
    p.setFillColor((180 * n) / Math.PI, 100, 60)
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
    p.setFillColor(p.sample([190, 170]), 40 + v * 40, 80)
    p.fill(
      new Rect({
        at: [at[0] + dX / 10, at[1] + (dY - v) / 2],
        h: v,
        w: dX * 0.8,
      })
    )
  })
}

const scaled = (p: SCanvas) => {
  p.withTranslation(add([0, 0.1], p.meta.center), () => {
    p.times(16, n => {
      p.withRotation((Math.PI * n) / 8, () => {
        p.withScale([1, 1 - 0.05 * n], () => {
          p.withTranslation([n * 0.02, 0], () => {
            p.setFillColor(90, 80, 40 + 3 * n, 0.75)
            const c = new Circle({ at: [0, 0], r: p.meta.bottom / 5 })
            p.fill(c)
            p.draw(c)
          })
        })
      })
    })
  })
}

const colourThemes = (p: SCanvas) => {
  p.background(0, 10, 80)
  const g = simpleLinearGradient(
    { h: 10, s: 90, l: 50, a: 1 },
    { h: 50, s: 70, l: 60, a: 1 },
    100
  )
  const g2 = simpleLinearGradient(
    { h: 210, s: 90, l: 50, a: 0.6 },
    { h: 350, s: 70, l: 60, a: 0.7 },
    100
  )
  p.forTiling(
    { n: 10, type: "square", margin: 0.1, order: "rowFirst" },
    (_p, [dX], c, i) => {
      p.setFillColor(g(i))
      p.fill(new Square({ at: c, align: "center", s: dX / 3 }))

      p.setFillColor(g2(i))
      p.fill(
        new Square({
          at: v.add(c, [(i * dX) / 500, (-i * dX) / 500]),
          align: "center",
          s: dX / 3,
        })
      )
    }
  )
}

const colourThemes2 = (p: SCanvas) => {
  const N = 70
  p.background(0, 0, 20)
  p.times(N, () => {
    const s = p.uniformRandomInt({ from: 0, to: 100 })
    const delta = p.gaussian({ sd: 0.1 })
    const delta2 = p.gaussian({ sd: 0.1 })

    const g1 = hueRange({ h1: 0, h2: 360, s, l: 50, a: 0.7, steps: 12 })
    p.forHorizontal({ n: 12 }, (pt, [dX, dY], c, i) => {
      p.setFillColor(g1(i))
      p.fill(
        new Square({
          at: v.add(c, [delta, delta2]),
          align: "center",
          s: dX / 3,
        })
      )
    })
  })

  const h = p.uniformRandomInt({ from: 0, to: 100 })
  p.times(N, () => {
    const l = p.uniformRandomInt({ from: 0, to: 100 })
    const delta = p.gaussian({ sd: 0.1 })
    const delta2 = p.gaussian({ sd: 0.1 })
    const g2 = saturationRange({
      h,
      s1: 30,
      s2: 100,
      l,
      a: 0.6,
      steps: 12,
    })
    p.forHorizontal({ n: 12 }, (pt, [dX, dY], c, i) => {
      p.setFillColor(g2(i))
      p.fill(
        new Square({
          at: v.subtract(c, [delta, delta2 + dY / 4]),
          align: "center",
          s: dX / 3,
        })
      )
    })
  })

  p.times(N, () => {
    const h = p.uniformRandomInt({ from: 0, to: 360 })
    const delta = p.gaussian({ sd: 0.1 })
    const delta2 = p.gaussian({ sd: 0.1 })
    const g3 = lightnessRange({
      h,
      l1: 30,
      l2: 100,
      s: 100,
      a: 0.7,
      steps: 12,
    })
    p.forHorizontal({ n: 12 }, (pt, [dX, dY], c, i) => {
      p.setFillColor(g3(i))
      p.fill(
        new Square({
          at: v.add(c, [delta, delta2 + dY / 4]),
          align: "center",
          s: dX / 3,
        })
      )
    })
  })
}

const colourThemes3 = (p: SCanvas) => {
  const hr = hueRange({
    h1: 215,
    h2: 360,
    s: 80,
    l: 50,
    a: 1,
    steps: 10,
  })
  p.background(25, 60, 15)
  p.forTiling({ n: 20, type: "square", margin: 0.1 }, (pt, [dX], at) => {
    p.setFillColor(hr(p.uniformRandomInt({ from: 0, to: 10 })))
    p.fill(new Square({ at, align: "center", s: dX * 0.8 }))
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: rainbow, name: "Rainbow Drips" },
  { sketch: horizontal, name: "Horizontal" },
  { sketch: vertical, name: "Vertical" },
  { sketch: curves1, name: "Curves Demo" },
  { sketch: flower, name: "Flower" },
  { sketch: tilesOfChaiken, name: "Tiled Curves" },
  { sketch: circle, name: "Around a Circle" },
  { sketch: arcs, name: "Arcs" },
  { sketch: noise, name: "Noise" },
  { sketch: rectanglesDivided, name: "Rectangles Divided" },
  { sketch: helloWorld, name: "Hello World" },
  { sketch: circleText, name: "Circle Labels" },
  { sketch: circles, name: "Circles" },
  { sketch: ellipses, name: "Ellipses Demo" },
  { sketch: gradients1, name: "Gradient Demo 1" },
  { sketch: gradients2, name: "Gradient Demo 2" },
  { sketch: gradients3, name: "Gradient Demo 3" },
  { sketch: gradients4, name: "Gradient Demo 4" },
  { sketch: gradients5, name: "Gradient Demo 5" },
  { sketch: sunsetThroughBlinds, name: "Gradient Demo 6" },
  { sketch: transforms, name: "Transforms Demo" },
  { sketch: transforms3, name: "Transforms Demo 3" },
  { sketch: clipping, name: "Clipping Demo" },
  { sketch: roundedRects, name: "Rounded Rectangles Demo" },
  { sketch: cards, name: "Cards" },
  { sketch: polygons, name: "Polygons" },
  { sketch: polygons3, name: "Polygons 3" },
  { sketch: stars, name: "Stars" },
  { sketch: hatching, name: "Hatching Demo 1" },
  { sketch: evenMoreArcs, name: "Even More Arcs" },
  { sketch: curls, name: "Curls" },
  { sketch: colorPaletteGenerator, name: "Color Palette Generator" },
  { sketch: stackPolys, name: "Stack Polygons" },
  { sketch: anotherTiling, name: "Another Tiling" },
  { sketch: shading, name: "Shading In" },
  { sketch: shading2, name: "Shading Again" },
  { sketch: shadingArcs, name: "Shaded Arcs" },
  { sketch: arcChart, name: "Arc Chart" },
  { sketch: bars, name: "Bars" },
  { sketch: scaled, name: "Discs" },
  { sketch: colourThemes, name: "Colour Themes" },
  { sketch: colourThemes2, name: "Colour Themes 2" },
  { sketch: colourThemes3, name: "Colour Themes 3" },
]

export default sketches
