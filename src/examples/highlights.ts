import { Point2D } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import {
  Path,
  SimplePath,
  Hatching,
  Star,
  RegularPolygon,
  Circle,
  Ellipse,
  Rect,
  HollowArc,
  Line,
} from "../lib"
import { add, scale } from "../lib/vectors"
import { perlin2 } from "../lib/noise"
import { LinearGradient, RadialGradient } from "../lib/gradient"
import { zip2, sum, arrayOf } from "../lib/collectionOps"
import { clamp } from "../lib"

const tiling = (p: SCanvas) => {
  p.forTiling({ n: 20, margin: 0.1, type: "square" }, ([x, y], [dX, dY]) => {
    p.setStrokeColor(120 + x * 120 + p.t * 50, 90 - 20 * y, 40)
    p.proportionately([
      [1, () => p.draw(new Line([x, y], [x + dX, y + dY]))],
      [2, () => p.draw(new Line([x + dX, y], [x, y + dY]))],
    ])
  })
}

const chaiken = (p: SCanvas) => {
  const { right, bottom } = p.meta

  const midX = right / 2
  const midY = bottom / 2
  const ir = midX / 4
  const da = Math.PI / 10

  p.times(30, (n) => {
    let points: Point2D[] = []
    for (let a = 0; a < Math.PI * 2; a += da) {
      const rr = 2 * p.random() + 1
      points.push([
        midX + ir * rr * Math.cos(a + da),
        midY + ir * rr * Math.sin(a + da),
      ])
    }
    const sp = SimplePath.startAt(points[0])
    points.slice(1).forEach((p) => sp.addPoint(p))
    sp.close()
    sp.chaiken({ n: 4, looped: true })
    p.lineWidth = 0.005
    p.setStrokeColor(190 + n, 90, 40, 0.75)
    p.draw(sp)
  })
}

const mondrian = (p: SCanvas) => {
  const { right, bottom } = p.meta

  let rs = [new Rect({ at: [0.1, 0.1], w: right - 0.2, h: bottom - 0.2 })]
  p.times(4, () => {
    rs = rs.flatMap((r) => {
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

  rs.map((r) => {
    p.doProportion(0.3, () => {
      p.setFillColor(p.sample([10, 60, 200]), 80, 50)
      p.fill(r)
    })
    p.draw(r)
  })
}

const scriptLike = (p: SCanvas) => {
  const { bottom, aspectRatio } = p.meta

  p.range({ from: 0.1, to: bottom - 0.1, n: 5 }, (m) => {
    let points: Point2D[] = []
    p.setStrokeColor(215, 40, 30 - 30 * m)
    p.range({ from: 0.1, to: 0.9, n: 60 }, (n) => {
      points.push([
        n + perlin2(n * 45 + m * 67, 20) / 12,
        m + perlin2(n * 100 + m * 100, 0.1) / (6 * aspectRatio),
      ])
    })
    p.draw(SimplePath.withPoints(points).chaiken({ n: 4 }))
  })
}

const circles2 = (p: SCanvas) => {
  p.background(220, 30, 90)
  p.withRandomOrder(
    p.forTiling,
    { n: 10, type: "square", margin: 0.1 },
    (pt, delta) => {
      p.setFillColor(150 + pt[0] * 50, 80, 50, 0.9)
      p.setStrokeColor(150, 40, 20)
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
          colors: [
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

const randomness2 = (p: SCanvas) => {
  p.background(320, 10, 90)
  p.forTiling({ n: 50, margin: 0.1 }, (pt, delta) => {
    const v = p.poisson(4)
    p.times(v, (n) => {
      p.setFillColor(40 - n * 20, 80, 50, 1 / n)
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

const curves = (p: SCanvas) => {
  p.background(215, 30, 20)
  p.forHorizontal({ n: 75 }, ([x, y], [dX, dY]) => {
    const vPts = [0, 0, 0, 0].map((_) => p.poisson(5) + 2)
    const total = sum(vPts)
    let nVPts = vPts.map((p) => (dY * p) / total)
    nVPts = [y - 0.1].concat(
      [3, 2, 1, 0].map((i) => y + 1.2 * sum(nVPts.slice(i)))
    )
    const nHPts = nVPts.map((p) => x + dX * 12 * perlin2(10 + p * 60, x * 20))
    const points = zip2(nHPts, nVPts)
    const path = SimplePath.withPoints(points)
    path.chaiken({ n: 4 })
    p.setStrokeColor(p.uniformRandomInt({ from: -40, to: 60 }), 90, 60, 0.95)
    p.draw(path)
  })
}

const transforms2 = (p: SCanvas) => {
  p.background(0, 0, 0)
  const baseSize = (1 + Math.sin(2 * p.t)) / 2
  const { bottom: h } = p.meta
  p.forTiling({ n: 32, type: "square" }, ([x, y], [dX, dY]) => {
    p.setFillColor(320 - x * 100 + p.t * 10, 90, 50, 0.8)
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

const time = (p: SCanvas) => {
  p.background(50, 20, 90)
  const times = 4
  p.forHorizontal({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    p.times(times, (n) => {
      const h = dY * 0.5 * (1 + perlin2(x, 100 + n + p.t / 4))
      p.setFillColor((n * 60) / times, 80, 60)
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

const polygons2 = (p: SCanvas) => {
  p.background(330, 70, 10)
  p.times(5, (n) => {
    const sides = 10 - n
    const r = 0.4 - n * 0.05
    p.setFillColor(330, 70, 10 + n * 12)
    p.fill(
      new RegularPolygon({
        at: p.meta.center,
        n: sides,
        r,
      })
    )
  })
}

const hatching2 = (p: SCanvas) => {
  p.background(0, 0, 10)
  p.lineWidth = 0.005
  const { center } = p.meta
  const count = p.uniformRandomInt({ from: 5, to: 35 })
  const points = p.build(p.times, count, (n) => {
    return p.perturb({ at: center, magnitude: 0.1 * n })
  })
  points.forEach((pt) => {
    p.setStrokeColor(15 + pt[0] * 50, 90, 40, 0.9)
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
    p.setFillColor(a * 30, 90, 30, 0.2)
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

const colorWheel = (p: SCanvas) => {
  const dA = Math.PI / 20
  const dR = 0.05
  for (let a = 0; a < Math.PI * 2; a += dA) {
    for (let r = 0.1; r < 0.4; r += dR) {
      p.doProportion(0.6, () => {
        p.setFillColor((180 * a) / Math.PI, r * 220, 50)
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
      .filter((l) => l.end - l.start > 0.01)
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
    p.setFillColor(i, 90, 60)
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

const fancyTiling = (p: SCanvas) => {
  const baseHue = p.uniformRandomInt({ from: 0, to: 360 })

  const generateTile = (): ((
    x: number,
    y: number,
    dX: number,
    dY: number
  ) => void) => {
    const color: [number, number, number] = [
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
          p.setStrokeColor(...color)
          p.draw(new Line([x, y], [x + dX, y + dY]))
        },
      ],
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColor(...color)
          p.draw(new Line([x + dX, y], [x, y + dY]))
        },
      ],
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColor(...color)
          p.draw(new Line([x, y], [x, y + dY]))
        },
      ],
      [
        1,
        () => (x: number, y: number, dX: number, dY: number) => {
          p.lineWidth = lw
          p.setStrokeColor(...color)
          p.draw(new Line([x, y], [x + dX, y]))
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
        rules.map((r) => [p.poisson(3) + 1, () => r(x, y, dX, dY)])
      )
    }
  )
}

const sketchingCurves = (p: SCanvas) => {
  p.background(30, 30, 95)
  p.lineWidth = 0.005
  p.setStrokeColor(230, 90, 25, 0.6)

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
      .transformed((pt) => [
        pt[0],
        pt[1] + 0.017 * p.meta.bottom * perlin2(pt[0] * 4, pt[1] + p.t),
      ])
  }
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
        p.setFillColor(
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
    p.setFillColor(baseHue, 80, 10)
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
      colors: [
        [0, { h: 215, s: 80, l: 60 }],
        [1, { h: 215, s: 80, l: 20 }],
      ],
    })
  )
  p.fill(mainRect)

  p.withClipping(mainRect, () => {
    p.times(40, () => {
      p.setFillColor(p.uniformRandomInt({ from: 180, to: 225 }), 80, 40, 0.3)
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
      p.setStrokeColor(0, 0, 100, 0.2)
      const y = p.gaussian({ mean: bottom * 0.8, sd: bottom * 0.1 })
      p.draw(new Line([0, y], [right, y]))
    })
  })
}

const painting = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colors: [
        [0, { h: 45, s: 30, l: 95 }],
        [1, { h: 55, s: 30, l: 90 }],
      ],
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
        colors: [
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
      colors: [
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
            colors: [
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

const doodles = (p: SCanvas) => {
  p.forTiling({ n: 7, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    const center = add([x, y], scale([dX, dY], 0.5))
    let path = Path.startAt(center)
    p.setStrokeColor(100 * x + y * 33, 60 + 45 * y, 40)
    p.lineWidth = 0.005
    p.withRandomOrder(p.aroundCircle, { at: center, r: dX / 2.8, n: 7 }, (pt) =>
      path.addCurveTo(pt)
    )
    path.addCurveTo(center)
    p.draw(path)
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
        p.times(6, (j) => {
          p.setFillColor(i * 27 + j * 12, 90, 40, 0.3)
          nPt = p.perturb({ at: nPt, magnitude: dX / 1.5 })
          p.fill(new Circle({ at: nPt, r: dX / 2 }))
        })
      })

      let frame: Point2D = [x, y]
      p.lineWidth = 0.001
      p.setStrokeColor(0, 0, 90)
      p.times(3, () => {
        p.draw(new Rect({ at: frame, w: dX, h: dY }))
        frame = p.perturb({ at: frame, magnitude: 0.015 })
      })
    }
  )
}

const contoured3 = (p: SCanvas) => {
  let e = 0.01
  let s = 3
  p.lineWidth = 0.005
  p.background(190, 80, 80)

  p.times(20, (n) => {
    const sPerlin = (x: number, y: number) =>
      perlin2(p.random() + x * s + n / 50, y * s + n / 100)
    p.setFillColor(
      p.sample([220, 170]),
      p.sample([50, 80]),
      p.sample([50, 40, 30]),
      0.25
    )
    let spt = p.randomPoint()
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

const central = (p: SCanvas) => {
  const N = 80
  p.background(220, 90, 10)
  p.setFillGradient(
    new RadialGradient({
      start: [0, 0],
      end: [0, 0],
      rStart: 0,
      rEnd: 0.8,
      colors: [
        [0, { h: 0, s: 0, l: 100 }],
        [0.25, { h: 220, s: 10, l: 50 }],
        [0.35, { h: 0, s: 0, l: 100 }],
        [0.45, { h: p.sample([0, 45, 170, 215]), s: 50, l: 50 }],
        [0.8, { h: 0, s: 0, l: 100 }],
      ],
    })
  )
  p.withTranslation(p.meta.center, () => {
    p.aroundCircle({ at: [0, 0], r: 0.1, n: N }, (pt, i) => {
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
      colors: [
        [0, { h: 0, s: 0, l: 100 }],
        [0.25, { h: 220, s: 10, l: 50 }],
        [0.35, { h: 0, s: 0, l: 100 }],
        [0.45, { h: p.sample([0, 45, 215, 340]), s: 50, l: 50 }],
        [0.8, { h: 0, s: 0, l: 100 }],
      ],
    })
  )
  p.withTranslation(p.meta.center, () => {
    p.aroundCircle({ at: [0, 0], r: 0.1, n: N }, (pt, i) => {
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
    p.setFillColor(p.sample([45, 55, 60, 65]), 30, 85, 0.6)
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
  }).path.segmented.flatMap((s) => s.segmented)
  ss.forEach((s, i) => {
    p.setFillColor(i * 5, 70, 60)
    p.fill(s)
  })
  p.lineWidth = 0.005
  ss.forEach((s) => {
    p.draw(s)
  })
}

const dividing2 = (p: SCanvas) => {
  p.background(0, 0, 5)
  new RegularPolygon({ at: p.meta.center, r: 0.4, n: 20 }).path.segmented
    .flatMap((s) => s.exploded({ scale: 0.75, magnitude: 1.1 }))
    .flatMap((s) => s.exploded({ scale: 0.75, magnitude: 1.3 }))
    .forEach((s, i) => {
      p.setFillColor(i * 5, 80, 60, 0.9)
      p.fill(s)
    })
}

const dividing6 = (p: SCanvas) => {
  p.background(175, 20, 95)

  new Star({ at: p.meta.center, n: 16, r: 0.4 }).path
    .exploded({ magnitude: 1.05, scale: 0.99 })
    .flatMap((s) => s.exploded({ magnitude: 1.05, scale: 0.99 }))
    .forEach((s, i) => {
      p.setFillColor(215 - i * 3, 90, 40)
      p.fill(s.rotated(p.gaussian({ sd: Math.PI / 12 })))
    })
}

const bokeh = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, p.meta.bottom],
      colors: [
        [0, { h: 0, s: 0, l: 30 }],
        [1, { h: 0, s: 0, l: 0 }],
      ],
    })
  )
  p.forTiling({ n: 20, type: "square", margin: 0.2 }, (_pt, [dX], c) => {
    const hue = p.sample([5, 25, 210])
    const loc = p.perturb({ at: c, magnitude: 0.4 })
    p.setFillGradient(
      new RadialGradient({
        start: loc,
        end: loc,
        rStart: 0,
        rEnd: dX * 2.2,
        colors: [
          [0, { h: hue, s: 80, l: 70 }],
          [p.sample([0.1, 0.2, 0.3, 0.5]), { h: hue, s: 80, l: 70, a: 0 }],
        ],
      })
    )
    p.fill(new Circle({ at: loc, r: dX }))
  })
}

const advancedDivisions = (p: SCanvas) => {
  p.background(45, 100, 94)
  const path = Path.startAt([0.5, p.meta.center[1] - 0.3])
  p.aroundCircle({ at: p.meta.center, r: 0.3, n: 20 }, (pt, i) => {
    path.addCurveTo(pt, { curveSize: p.gaussian({ mean: 1.5, sd: 0.2 }) })
  })

  path.subdivide({ m: 0, n: 10 }).forEach((part, i) => {
    p.setFillColor(10 + i * 40, 90, 60, p.sample([0.4, 0.5]))
    p.fill(part)
  })

  path.exploded().forEach((part, i) => {
    p.setFillColor(10 + i * 2, 90, 60, p.sample([0.4, 0.5]))
    p.fill(part)
  })

  path
    .exploded()
    .flatMap((part) => part.exploded())
    .forEach((part, i) => {
      p.setFillColor(10 + (i * 2) / 3, 90, 60, p.sample([0.2, 0.3]))
      p.fill(part)
    })
}

const lchIntro = (p: SCanvas) => {
  p.backgroundLCH(62, 13, 210)

  p.range({ from: 0, to: Math.PI * 2, n: 11 }, (a) => {
    p.setFillColorLCH(62 - a * 5, 28, 280 - a * 11, 0.8)
    p.fill(new Star({ at: p.meta.center, n: 7, r: 0.4, a }))
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
  { sketch: tiling, name: "Tiling" },
  { sketch: chaiken, name: "Chaiken" },
  { sketch: mondrian, name: "Mondrianish" },
  { sketch: scriptLike, name: "Script-ish" },
  { sketch: doodles, name: "Doodles" },
  { sketch: circles2, name: "Bubbles" },
  { sketch: randomness1, name: "Gaussian" },
  { sketch: randomness2, name: "Poisson" },
  { sketch: curves, name: "Curves" },
  { sketch: transforms2, name: "Transforms Demo 2" },
  { sketch: time, name: "Time" },
  { sketch: polygons2, name: "Polygons 2" },
  { sketch: hatching2, name: "Hatching Demo 2" },
  { sketch: moreArcs, name: "More Arcs" },
  { sketch: colorWheel, name: "Color Wheel" },
  { sketch: sunburst, name: "Sunburst" },
  { sketch: fancyTiling, name: "Fancy Tiling" },
  { sketch: sketchingCurves, name: "Sketching Curves" },
  { sketch: recordCoverish, name: "Record Cover" },
  { sketch: recordCoverish2, name: "Record Cover 2" },
  { sketch: painting, name: "Paint Strokes" },
  { sketch: painting2, name: "Round Paint Strokes" },
  { sketch: minis2, name: "Minis 2" },
  { sketch: contoured3, name: "Contoured 3" },
  { sketch: central, name: "Centrality" },
  { sketch: centralCurves, name: "Central Curves" },
  { sketch: lineOfCurves, name: "Line of Curves" },
  { sketch: dividing, name: "Dividing 1" },
  { sketch: dividing2, name: "Dividing 2" },
  { sketch: dividing6, name: "Dividing 6" },
  { sketch: bokeh, name: "Bokeh" },
  { sketch: advancedDivisions, name: "Advanced Divisions" },
  { sketch: lchIntro, name: "OKLCH Intro" },
]

export default sketches
