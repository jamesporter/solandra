# Solandra

Solandra is a TypeScript library for creating generative art. It provides a simple and expressive API for drawing shapes, paths, and patterns, and for working with color, randomness, and transformations. It is designed to be used in a browser environment, typically with a canvas element.

A Solandra sketch is a function that takes an `SCanvas` instance as an argument. The `SCanvas` object is the main interface to the drawing API.

```ts
import SCanvas from "./lib/sCanvas"

const mySketch = (p: SCanvas) => {
  // Your drawing code here
}
```

## Basic Shapes

Solandra provides a set of basic shapes that can be easily created and drawn.

### Rect

A rectangle.

```ts
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
```

### Circle

A circle.

```ts
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
```

### Ellipse

An ellipse.

```ts
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
```

### RegularPolygon

A regular polygon with `n` sides.

```ts
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
```

### Star

A star shape.

```ts
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
```

### RoundedRect

A rectangle with rounded corners.

```ts
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
```

## Paths

Solandra provides powerful tools for working with paths, which are sequences of connected points. There are two main types of paths: `SimplePath` for straight line segments and `Path` for curved segments.

### SimplePath

A `SimplePath` is a sequence of points connected by straight lines.

```ts
const tilesOfChaiken = (p: SCanvas) => {
  p.forTiling({ n: 6, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    const midX = x + dX / 2
    const midY = y + dY / 2
    const ir = dX / 4
    const da = Math.PI / 10

    p.times(3, (n) => {
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
      sp.chaiken({ n: 2 + n, looped: true }) // Smooth the path
      p.lineWidth = 0.005
      p.setStrokeColor(190 + x * 100, 90, 40 + y * 10, 0.75 * ((n + 3) / 5))
      p.draw(sp)
    })
  })
}
```

### Path (with curves)

A `Path` can contain both straight and curved segments. The `addCurveTo` method allows for creating complex, organic shapes.

```ts
const curves1 = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, 1],
      colors: [
        [0, { h: 215, s: 20, l: 90 }],
        [1, { h: 140, s: 20, l: 90 }],
      ],
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
```

### Path Manipulations

Paths can be manipulated in various ways to create interesting effects.

#### `exploded`

The `exploded` method breaks a path into its individual segments, which can then be manipulated independently.

```ts
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
```

#### `subdivide`

The `subdivide` method can be used to create interesting geometric patterns within a path.

```ts
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
}
```

#### `curvify`

The `curvify` method converts the straight line segments of a path into curves.

```ts
const curvify = (p: SCanvas) => {
  p.background(150, 90, 30)
  p.setStrokeColor(0, 0, 95, 0.4)
  p.times(20, () => {
    p.draw(
      new RegularPolygon({ at: p.meta.center, r: 0.3, n: 11 }).path.curvify(
        () => ({
          curveSize: p.gaussian({ mean: 2, sd: 0.5 }),
          polarlity: p.randomPolarity(),
        })
      )
    )
  })
}
```

## Tiling and Iteration

Solandra provides several methods for creating repeating patterns and iterating over areas of the canvas.

### `forTiling`

The `forTiling` method is used to create a grid of tiles. You can specify the number of tiles, the type of grid (e.g., "square"), and the margin between tiles.

```ts
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
```

### `forHorizontal` and `forVertical`

These methods iterate over horizontal or vertical bands of the canvas.

```ts
const horizontal = (p: SCanvas) => {
  p.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [1, 0],
      colors: [
        [0, { h: 0, s: 0, l: 95 }],
        [1, { h: 0, s: 0, l: 85 }],
      ],
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
      colors: [
        [0, { h: 50, s: 40, l: 95 }],
        [1, { h: 30, s: 40, l: 90 }],
      ],
    })
  )
  p.forVertical({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    const points = p.build(p.range, { from: x, to: x + dX, n: 20 }, (vX) => {
      return p.perturb({ at: [vX, y + dY / 2], magnitude: dY / 4 })
    })
    p.lineWidth = 0.01 / p.meta.aspectRatio
    p.setStrokeColor(y * 60, 90, 40)
    p.draw(SimplePath.withPoints(points))
  })
}
```

### `aroundCircle`

The `aroundCircle` method iterates over points on the circumference of a circle.

```ts
const circleText = (p: SCanvas) => {
  p.aroundCircle({ r: 0.25, n: 12 }, ([x, y], i) => {
    p.times(5, (n) => {
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
```

## Colors and Gradients

Solandra uses the HSL (Hue, Saturation, Lightness) color model, which is often more intuitive for generative art than RGB.

### Setting Colors

You can set the fill and stroke colors using `setFillColor` and `setStrokeColor`.

```ts
p.setFillColor(hue, saturation, lightness, alpha);
p.setStrokeColor(hue, saturation, lightness, alpha);
```

### Linear Gradients

A linear gradient transitions colors along a straight line.

```ts
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
```

### Radial Gradients

A radial gradient transitions colors outwards from a central point.

```ts
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
```

### Color Helpers

Solandra includes helper functions to generate color palettes and ranges.

- `hueRange`: Creates a range of colors by interpolating hue.
- `saturationRange`: Creates a range of colors by interpolating saturation.
- `lightnessRange`: Creates a range of colors by interpolating lightness.
- `palettePreset`: Provides access to a set of predefined color palettes.

```ts
const colourPalettes = (p: SCanvas) => {
  p.background(30, 20, 90)

  // Generate palettes from a preset name and number of colours:
  const cs1 = palettePreset("rusty", 12)
  const cs2 = palettePreset("autumnal", 12)

  p.forHorizontal({ n: 12, margin: 0.1 }, (pt, [dX, dY], c, i) => {
    const [h, s, l] = cs1[i]
    p.setFillColor(h, s, l, 0.9)
    p.fill(
      new Rect({ at: p.perturb({ at: pt, magnitude: 0.05 }), w: dX, h: dY / 4 })
    )

    const [h2, s2, l2] = cs2[i]
    p.setFillColor(h2, s2, l2, 0.9)
    p.fill(
      new Rect({
        at: p.perturb({ at: add(pt, [0, dY / 4]), magnitude: 0.05 }),
        w: dX,
        h: dY / 4,
      })
    )
  })
}
```

## Randomness and Noise

Solandra provides a rich set of tools for incorporating randomness and noise into your creations, which is fundamental to generative art.

### Basic Randomness

You can generate random numbers using methods like `p.random()` (a float between 0 and 1), `p.randomPolarity()` (either 1 or -1), and `p.uniformRandomInt({ from, to })`.

### Distributions

Solandra supports various random number distributions, allowing for more controlled randomness.
- `p.gaussian({ mean, sd })`: Samples from a normal (Gaussian) distribution.
- `p.poisson(lambda)`: Samples from a Poisson distribution.

### Perturbation and Sampling

- `p.perturb({ at, magnitude })`: Randomly displaces a point.
- `p.sample(array)`: Selects a random element from an array.
- `p.shuffle(array)`: Randomizes the order of elements in an array.
- `p.withRandomOrder(...)`: Executes a tiling function in a random order.

```ts
const curls = (p: SCanvas) => {
  const baseColor = p.uniformRandomInt({ from: 150, to: 250 })
  p.background(baseColor, 20, 90)
  // ...
  p.times(p.uniformRandomInt({ from: 20, to: 100 }), () => {
    const c = p.randomPoint()
    let tail = p.perturb({ at: c, magnitude: 0.2 })
    // ...
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
```

### Perlin Noise

Perlin noise provides a way to generate natural-looking, organic randomness. Solandra provides `perlin2` for 2D noise.

```ts
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
```

## Transforms

Solandra allows you to apply transformations like translation, rotation, and scaling to your drawing operations. These are scoped operations, meaning they only affect the code within the supplied function.

### `withTranslation`

Moves the origin (0, 0) of the canvas.

### `withRotation`

Rotates the canvas around the origin. The angle is specified in radians.

### `withScale`

Scales the canvas.

```ts
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
```

## Advanced Features

Solandra also provides a range of advanced features for creating more complex and interesting effects.

### `withClipping`

The `withClipping` method allows you to use a shape as a mask, so that subsequent drawing operations are only visible within the bounds of that shape.

```ts
const clipping = (p: SCanvas) => {
  const { center, bottom, right } = p.meta
  const size = Math.min(bottom, right) * 0.8
  p.background(120 + p.t * 50, 40, 90)
  p.lineWidth = 0.005
  p.range({ from: 1, to: 4, n: 4 }, (n) =>
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
```

### Shadows

You can add shadows to your shapes by setting the `p.shadow` property.

```ts
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
          at: add([dX / 6, dX / 6], pt),
          w: (dX * 2) / 3,
          h: (dX * 2) / 3,
        })
      )
    }
  )
}
```

### Dashes

You can draw dashed lines by setting the `p.dash` property.

```ts
const dashes = (p: SCanvas) => {
  p.background(0, 0, 5)
  p.forTiling({ n: 5, margin: 0.1, type: "square" }, (_pt, [dX], at, i) => {
    p.lineWidth = 0.005
    p.dash = { offset: p.t / 20, pattern: [0.001 * (5 + i), 0.002 * (5 + i)] }
    p.setStrokeColor(45 + i * 10, 100, 70, 0.9)
    p.draw(new RegularPolygon({ at, n: 6, r: dX / 3 }))
  })
}
```

### Hatching

The `Hatching` shape creates a pattern of parallel lines, which can be used for shading.

```ts
const hatching = (p: SCanvas) => {
  p.lineWidth = 0.001
  p.range({ from: 1, to: 0.2, n: 4, inclusive: true }, (n) => {
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
```

### Spiral

The `Spiral` shape generates a spiral path.

```ts
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
```

## Animation

Solandra supports animation through the `p.t` variable, which represents the current time in seconds. By incorporating `p.t` into your drawing logic, you can create dynamic and evolving artworks.

```ts
const lowResAnimation3 = (p: SCanvas) => {
  const scaleXY = scaler2d(
    {
      minDomain: 0.1,
      maxDomain: 0.9,
      minRange: -2 * Math.PI,
      maxRange: Math.PI,
    },
    {
      minDomain: 0.1,
      maxDomain: p.meta.bottom - 0.1,
      minRange: -1.5,
      maxRange: 1.5,
    }
  )
  p.background(p.t * 20 + 95, 15, 10)
  p.forTiling({ n: 35, type: "square", margin: 0.05 }, ([x, y], [w], at) => {
    const [sX, sY] = scaleXY([x, y])
    const eqn = Math.cos(p.t / 1.2 + sX)
    const alpha = clamp({ from: 0.15, to: 1 }, 1 - Math.abs(sY - eqn))
    p.setFillColor(p.t * 20 + 120 + y * 40, 90, 50, alpha)
    p.fill(new Circle({ at, r: w / 2.1 }))
  })
}
```