import { Point2D } from "../lib/types/sol"
import SCanvas from "../lib/sCanvas"
import { perlin2 } from "../lib/noise"
import { RadialGradient } from "../lib/gradient"
import { clamp, isoTransform, SimplePath } from "../lib"

const isometricExample = (p: SCanvas) => {
  const { bottom, right } = p.meta
  p.background(0, 0, 95)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.8], () => {
    // 1/200 of width = height of 1 unit
    const iso = isoTransform(0.005)
    p.times(10, (n) => {
      const sp = SimplePath.withPoints([])
      p.times(100, (m) => {
        // adjust all x,y,z for vertical size: as in isometric all get scaled linearly in vertical direction
        sp.addPoint(
          iso([
            bottom * (10 - n) * 10,
            bottom * 20 * Math.cos(p.t + (n * 4 + m) / 10),
            bottom * m,
          ])
        )
      })
      p.setStrokeColor(0, 0, 95)
      p.lineWidth = 0.015
      p.draw(sp)
      p.setStrokeColor(215 - n * 3, 90, 60)
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
    p.downFrom(10, (n) => {
      p.downFrom(10, (m) => {
        let sp = SimplePath.withPoints([])
        const h = clamp({ from: -3, to: 6 }, p.poisson(4) - 3)
        sp.addPoint(iso([n, h, m]))
        sp.addPoint(iso([n + 1, h, m]))
        sp.addPoint(iso([n + 1, h, m + 1]))
        sp.addPoint(iso([n, h, m + 1]))
        sp.close()
        p.setFillColor(10 + h * 10, 100, 70)
        p.fill(sp)

        sp = SimplePath.withPoints([])
        sp.addPoint(iso([n, h, m + 1]))
        sp.addPoint(iso([n, h - 1, m + 1]))
        sp.addPoint(iso([n, h - 1, m]))
        sp.addPoint(iso([n, h, m]))
        sp.close()
        p.setFillColor(10 + h * 10, 75, 60)
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
  p.setStrokeColor(30, 10, 30)
  p.withTranslation([right / 2, bottom * 0.9], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(10, (n) => {
      p.downFrom(10, (m) => {
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

        p.setFillColor(h * 10 + 10 * Math.cos(h * 3), 95, 65, 0.9)
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
  p.setStrokeColor(30, 5, 20)
  p.withTranslation([right / 2, bottom * 0.9], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(10, (n) => {
      p.downFrom(10, (m) => {
        const h = perlin2(n / 5, m / 10) * 5 + 4

        const sp = SimplePath.withPoints([])
        sp.addPoint(iso([n, 0, m]))
        sp.addPoint(iso([n + 1, 0, m]))
        sp.addPoint(iso([n + 0.5, h, m + 0.5]))
        sp.close()

        p.setFillColor(h * 10, 100, 75, 0.95)
        p.fill(sp)
        p.draw(sp)

        const sp2 = SimplePath.withPoints([])
        sp2.addPoint(iso([n, 0, m]))
        sp2.addPoint(iso([n, 0, m + 1]))
        sp2.addPoint(iso([n + 0.5, h, m + 0.5]))
        sp2.close()

        p.setFillColor(h * 10, 60, 75, 0.95)
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
  p.setStrokeColor(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)

    const h = (x: number, y: number) =>
      2 + 5 * perlin2(x / 5 + p.t, y / 10 + p.t * 0.5)

    p.downFrom(11, (n) => {
      p.downFrom(11, (m) => {
        p.doProportion(0.8, () => {
          const sp = SimplePath.withPoints([])

          sp.addPoint(iso([n, h(n, m), m]))
          sp.addPoint(iso([n + 1, h(n + 1, m), m]))
          sp.addPoint(iso([n + 1, h(n + 1, m + 1), m + 1]))
          sp.addPoint(iso([n, h(n, m + 1), m + 1]))
          sp.close()

          p.proportionately([
            [1, () => p.setFillColor(210, 100, 55 + 2.5 * h(n, m), 0.95)],
            [1, () => p.setFillColor(0, 80, 50 + 2.5 * h(n, m), 0.95)],
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
  p.setStrokeColor(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)
    p.downFrom(11, (n) => {
      p.downFrom(11, (m) => {
        p.times(3, (k) => {
          p.doProportion(1 - (k + 1) / 6, () => {
            const h = (x: number, y: number) =>
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
                  p.setFillColor(210, 100, 55 + 2.5 * h(n, m), 0.95 - k / 8),
              ],
              [
                1,
                () =>
                  p.setFillColor(340, 100, 45 + 2.5 * h(n, m), 0.95 - k / 8),
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
  p.setStrokeColor(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)

    p.times(7, (hr) => {
      const h = hr + Math.cos(p.t)
      p.setFillColor(h * 10, 90, 50, 0.95)
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
      colors: [
        [0, { h: 0, s: 0, l: 90 }],
        [1, { h: 215, s: 80, l: 30 }],
      ],
    })
  )

  const { bottom, right } = p.meta
  p.lineWidth = 0.005 * bottom
  p.setStrokeColor(30, 5, 20)
  // make origin a point centred horizontally, but near bottom
  p.withTranslation([right / 2, bottom * 0.95], () => {
    const iso = isoTransform(0.05 * bottom)

    const top = (x: number, y: number, z: number) => [
      iso([x + 0, y, z + 0]),
      iso([x + 1, y, z + 0]),
      iso([x + 1, y, z + 1]),
      iso([x + 0, y, z + 1]),
    ]

    const left = (x: number, y: number, z: number) => [
      iso([x, y, z + 0]),
      iso([x, y - 0.5, z + 0]),
      iso([x, y - 0.5, z + 1]),
      iso([x, y, z + 1]),
    ]
    p.times(7, (y) => {
      p.times(7, () => {
        const x = p.uniformRandomInt({ from: 0, to: 10 })
        const z = p.uniformRandomInt({ from: 0, to: 10 })

        p.setFillColor(200, 40, 50)
        const sp = SimplePath.withPoints(top(x, y, z)).close()
        p.fill(sp)
        p.draw(sp)

        p.setFillColor(180, 40, 50, 0.8)
        const sp2 = SimplePath.withPoints(left(x, y, z)).close()
        p.fill(sp2)
        p.draw(sp2)

        p.setFillColor(350, 40, 50, 0.8)
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
  p.setStrokeColor(0, 0, 90)
  p.withTranslation([r / 2, bottom * 0.5], () => {
    const iso = isoTransform(0.1 * bottom)

    // Experimenting with helper functions... probably want to include in framework or as helpers somehow?
    const top = (x: number, y: number, z: number, s: number) => [
      iso([x, y, z]),
      iso([x + s, y, z]),
      iso([x + s, y, z + s]),
      iso([x, y, z + s]),
    ]

    const left = (x: number, y: number, z: number, s: number) => [
      iso([x, y, z]),
      iso([x, y - s, z + 0]),
      iso([x, y - s, z + s]),
      iso([x, y, z + s]),
    ]

    const right = (x: number, y: number, z: number, s: number) => [
      iso([x, y, z]),
      iso([x + s, y, z]),
      iso([x + s, y - s, z]),
      iso([x, y - s, z]),
    ]

    const shade = (
      fn: (a: number, b: number, c: number, d: number) => Point2D[],
      x: number,
      y: number,
      z: number,
      s: number,
      h: number,
      sat = 40,
      l = 50
    ) => {
      p.setFillColor(h, sat, l, 0.95)
      const sp = SimplePath.withPoints(fn(x, y, z, s)).close()
      p.fill(sp)
      p.draw(sp)
    }

    const cube = (x: number, y: number, z: number, s: number) => {
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
  p.setStrokeColor(0, 0, 90)
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

const lorenz = (p: SCanvas) => {
  const { bottom, right: r, center } = p.meta
  p.backgroundGradient(
    new RadialGradient({
      start: center,
      end: center,
      rStart: 0,
      rEnd: 0.65,
      colors: [
        [0, { h: 215, s: 80, l: 40 }],
        [1, { h: 215, s: 80, l: 10 }],
      ],
    })
  )
  p.lineWidth = 0.005 * bottom

  const points: Point2D[] = []
  p.withTranslation([r / 2, bottom * 0.2], () => {
    const iso = isoTransform(0.01 * bottom)

    let x = 0.82
    let y = 0.12
    let z = 0
    let a = 10.0
    let b = 30.0
    let c = 8.0 / 3.0
    let t = 0.01
    const N = 3000

    for (let i = 0; i < N; i++) {
      points.push(iso([x, y - 35, z - 25]))
      const x_ = x + t * a * (y - x)
      const y_ = y + t * (x * (b - z) - y)
      const z_ = z + t * (x * y - c * z)
      x = x_
      y = y_
      z = z_
    }

    for (let j = 0; j < N / 10; j++) {
      p.setStrokeColor(30 * Math.cos(j / 10), 100, 70)
      p.draw(SimplePath.withPoints(points.slice(j * 10, (j + 1) * 10 + 1)))
    }
  })
}

const sketches: { name: string; sketch: (p: SCanvas) => void }[] = [
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
  { sketch: lorenz, name: "Lorenz Attractor" },
]

export default sketches
