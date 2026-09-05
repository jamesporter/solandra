# Solandra

Solandra is a TypeScript library for creating generative art. It provides a simple and expressive API for drawing shapes, paths, and patterns, and for working with color, randomness, and transformations. It is designed to be used in a browser environment, typically with a canvas element.

A Solandra sketch is a function that takes an `SCanvas` instance as an argument. The `SCanvas` object is the main interface to the drawing API.

```ts
import SCanvas from "./lib/sCanvas"

const mySketch = (s: SCanvas) => {
  // Your drawing code here
}
```

## Basic Shapes

Solandra provides a set of basic shapes that can be easily created and drawn.

### Rect

A rectangle.

```ts
const rectanglesDivided = (s: SCanvas) => {
  s.lineWidth = 0.005
  const { right, bottom } = s.meta

  new Rect({ at: [0.1, 0.1], w: right - 0.2, h: bottom - 0.2 })
    .split({ orientation: "vertical", split: [1, 1.5, 2, 2.5] })
    .forEach((r, i) => {
      s.setFillGradient(
        new LinearGradient({
          from: r.at,
          to: [r.at[0], r.at[1] + r.h],
          colors: [
            [0, { h: i * 10, s: 90, l: 60 }],
            [1, { h: i * 10, s: 60, l: 40 }],
          ],
        })
      )
      s.fill(r)
      s.draw(r)
    })
}
```

### Circle

A circle.

```ts
const curls = (s: SCanvas) => {
  const baseColor = s.uniformRandomInt({ from: 150, to: 250 })
  s.background(baseColor, 20, 90)
  s.lineStyle = {
    cap: "round",
  }
  s.setFillColor(baseColor, 60, 30)
  s.setStrokeColor(baseColor - 40, 80, 35, 0.9)
  s.times(s.uniformRandomInt({ from: 20, to: 100 }), () => {
    const c = s.randomPoint()
    let tail = s.perturb({ at: c, magnitude: 0.2 })
    while (distance(c, tail) < 0.1) {
      tail = s.perturb({ at: c, magnitude: 0.2 })
    }
    s.fill(
      new Circle({
        at: c,
        r: 0.015,
      })
    )
    s.fill(
      new Circle({
        at: tail,
        r: 0.015,
      })
    )
    s.draw(
      Path.startAt(c).addCurveTo(tail, {
        curveSize: s.gaussian({
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
const ellipses = (s: SCanvas) => {
  s.background(0, 0, 100)
  s.withRandomOrder(
    s.forTiling,
    { n: 15, type: "square", margin: 0.1 },
    (pt, delta) => {
      const [x, y] = pt
      s.setFillColor(150 + perlin2(x * 10, 1) * 50, 80, 50, 0.9)
      s.setStrokeColor(150, 40, 100)
      s.lineWidth = 0.005
      const r = Math.sqrt(
        1.8 * (0.1 + Math.abs(x - 0.5)) * (0.1 + Math.abs(y - 0.5))
      )
      const e = new Ellipse({
        at: add(pt, scale(delta, 0.5)),
        align: "center",
        w: delta[1] * r * 3,
        h: delta[1] * 1.2,
      })
      s.fill(e)
      s.draw(e)
    }
  )
}
```

### RegularPolygon

A regular polygon with `n` sides.

```ts
const polygons = (s: SCanvas) => {
  s.background(330, 70, 30)
  let n = 3
  s.forTiling({ n: 4, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    s.setFillColor(180 + 40 * x, 50 + 50 * y, 60)
    s.fill(
      new RegularPolygon({
        at: [x + dX / 2, y + dY / 2],
        n,
        r: dX / 2.1,
        a: s.t,
      })
    )
    n++
  })
}
```

### Star

A star shape.

```ts
const stars = (s: SCanvas) => {
  let n = 3
  s.background(30, 20, 80)
  s.forTiling({ n: 4, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    s.setFillColor(20 + 30 * x, 25 + 75 * y, 45 + 5 * (1 + Math.sin(s.t + x)))
    s.fill(
      new Star({
        at: [x + dX / 2, y + dY / 2],
        n,
        r: (dX * (2.2 + Math.cos(x + y + s.t))) / 6.1,
        a: s.t,
      })
    )
    n++
  })
}
```

### RoundedRect

A rectangle with rounded corners.

```ts
const roundedRects = (s: SCanvas) => {
  s.forTiling(
    { n: 5, type: "proportionate", margin: 0.1 },
    ([x, y], [dX, dY]) => {
      s.setFillColor(s.t * 50 + 150 + x * 100, y * 40 + 60, 40)
      s.fill(
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
const tilesOfChaiken = (s: SCanvas) => {
  s.forTiling({ n: 6, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    const midX = x + dX / 2
    const midY = y + dY / 2
    const ir = dX / 4
    const da = Math.PI / 10

    s.times(3, (n) => {
      let points: Point2D[] = []
      for (let a = 0; a < Math.PI * 2; a += da) {
        const rr = 2 * s.random() + 1
        points.push([
          midX + ir * rr * Math.cos(a + da),
          midY + ir * rr * Math.sin(a + da),
        ])
      }
      const sp = SimplePath.startAt(points[0])
      points.slice(1).forEach((p) => sp.addPoint(p))
      sp.close()
      sp.chaiken({ n: 2 + n, looped: true }) // Smooth the path
      s.lineWidth = 0.005
      s.setStrokeColor(190 + x * 100, 90, 40 + y * 10, 0.75 * ((n + 3) / 5))
      s.draw(sp)
    })
  })
}
```

#### Measuring and sampling a SimplePath

A `SimplePath` can be measured and sampled by distance travelled (not by point index), so evenly spaced proportions give evenly spaced results however unevenly the path's own points are spread.

- `length`: the total length of the path
- `pointAt(proportion)`: the point a proportion (0 to 1, clamped) of the way along
- `tangentAt(proportion)`: the unit vector the path heads in there (`v.heading` for an angle)
- `pointsAlong({ n, inclusive })`: `n` evenly spaced points; `inclusive: false` stops short of the end, which is what a closed path wants

```ts
const beads = (s: SCanvas) => {
  const wave = SimplePath.withPoints(
    s.build(s.range, { from: 0.05, to: 0.95, n: 40 }, (x) => [
      x,
      0.3 + 0.15 * Math.sin(x * 8),
    ])
  )
  s.draw(wave)
  wave.pointsAlong({ n: 30 }).forEach((at) => {
    s.fill(new Circle({ at, r: 0.01 }))
  })
}
```

#### Measuring a SimplePath as a shape

- `boundingBox`: the smallest box containing every point, as `{ at, w, h }`, which is what `Rect` takes, so `new Rect(path.boundingBox)` is the box itself
- `area`: the area enclosed, taking the path as closed whether or not `close` was called, always positive whichever way round the points go
- `containsPoint(at)`: whether a point falls inside it, concave shapes included
- `convexHull`: the smallest convex path containing all its points, closed (the standalone `convexHull(points)` does the same for bare points)
- `simplified({ tolerance })`: a copy with the points that barely change the shape dropped (Ramer-Douglas-Peucker); everything left out lies within `tolerance` (default 0.01) of what remains

```ts
const inside = (s: SCanvas) => {
  const outline = new Star({ at: s.meta.center, n: 7, r: 0.35, r2: 0.16 }).path
  s.draw(outline)
  s.draw(new Rect(outline.boundingBox))
  // dots inside the star itself, not merely inside its bounding box
  s.times(500, () => {
    const at = s.randomPoint()
    if (outline.containsPoint(at)) s.fill(new Circle({ at, r: 0.006 }))
  })
}
```

#### `SimplePath.flowLine`

Traces a path through a vector field, starting at `from` and repeatedly stepping in whatever direction the field points in there. The field is sampled for direction only (the vector is normalized), so every step is `step` long (default 0.01) however strong the field is, and `n` (default 100) sets how many steps to take. `until` stops a line early, most usefully when it leaves the canvas. Any function from a point to a vector will do; `curl2` is the usual one.

```ts
const streamers = (s: SCanvas) => {
  s.times(120, () => {
    s.draw(
      SimplePath.flowLine({
        from: s.randomPoint(),
        field: ([x, y]) => curl2(x * 2.5, y * 2.5),
        n: 120,
        step: 0.005,
        until: (at) => !s.inDrawing(at),
      })
    )
  })
}
```

### Path (with curves)

A `Path` can contain both straight and curved segments. The `addCurveTo` method allows for creating complex, organic shapes.

```ts
const curves1 = (s: SCanvas) => {
  s.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, 1],
      colors: [
        [0, { h: 215, s: 20, l: 90 }],
        [1, { h: 140, s: 20, l: 90 }],
      ],
    })
  )
  s.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    s.setStrokeColor(20 + x * 40, 90 - 20 * y, 50)
    s.draw(
      Path.startAt([x, y + dY]).addCurveTo([x + dX, y + dY], {
        polarlity: s.randomPolarity(),
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
const dividing4 = (s: SCanvas) => {
  s.background(45, 20, 95)
  new RegularPolygon({ at: s.meta.center, r: 0.4, n: 24 }).path.segmented
    .flatMap((s) => s.exploded({ scale: 0.8, magnitude: 1.1 }))
    .map((s, i) =>
      s
        .rotated((i * Math.PI) / 4)
        .moved([s.gaussian({ sd: 0.06 }), s.gaussian({ sd: 0.04 })])
    )
    .forEach((s, i) => {
      s.setFillColor(210 + (i % 40), 80, 60, 0.8)
      s.fill(s)
    })
}
```

#### `subdivide`

The `subdivide` method can be used to create interesting geometric patterns within a path.

```ts
const dividing8 = (s: SCanvas) => {
  s.background(0, 0, 85)
  s.setFillColor(0, 0, 20)
  s.fill(new RegularPolygon({ n: 6, at: s.meta.center, r: 0.44 }))
  new RegularPolygon({ n: 6, at: s.meta.center, r: 0.4 }).path
    .subdivide({ m: 1, n: 5 })
    .forEach((s, i) => {
      s.setFillColor(i * 20, 50, 50)
      s.fill(s)
    })
}
```

#### `curvify`

The `curvify` method converts the straight line segments of a path into curves.

```ts
const curvify = (s: SCanvas) => {
  s.background(150, 90, 30)
  s.setStrokeColor(0, 0, 95, 0.4)
  s.times(20, () => {
    s.draw(
      new RegularPolygon({ at: s.meta.center, r: 0.3, n: 11 }).path.curvify(
        () => ({
          curveSize: s.gaussian({ mean: 2, sd: 0.5 }),
          polarlity: s.randomPolarity(),
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
const rainbow = (s: SCanvas) => {
  s.withRandomOrder(
    s.forTiling,
    { n: 20, type: "square", margin: 0.1 },
    ([i, j], [di, dj]) => {
      s.doProportion(0.6, () => {
        s.setStrokeColor(i * 100, 80, 30 + j * 30, 0.9)
        s.lineWidth = 0.02 + 0.02 * (1 - i)
        s.draw(
          new Line(
            [i + di / 4, j + dj / 4],
            [
              i + (di * 3 * j * s.randomPolarity()) / 4,
              j + (dj * 5 * (1 + s.random())) / 4,
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
const horizontal = (s: SCanvas) => {
  s.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [1, 0],
      colors: [
        [0, { h: 0, s: 0, l: 95 }],
        [1, { h: 0, s: 0, l: 85 }],
      ],
    })
  )
  s.forHorizontal({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    s.setStrokeColor(x * 360, 90, 40)
    s.draw(new Line([x, y], [x + dX, y + dY]))
  })
}

const vertical = (s: SCanvas) => {
  s.backgroundGradient(
    new LinearGradient({
      from: [0, 0],
      to: [0, 1],
      colors: [
        [0, { h: 50, s: 40, l: 95 }],
        [1, { h: 30, s: 40, l: 90 }],
      ],
    })
  )
  s.forVertical({ n: 20, margin: 0.1 }, ([x, y], [dX, dY]) => {
    const points = s.build(s.range, { from: x, to: x + dX, n: 20 }, (vX) => {
      return s.perturb({ at: [vX, y + dY / 2], magnitude: dY / 4 })
    })
    s.lineWidth = 0.01 / s.meta.aspectRatio
    s.setStrokeColor(y * 60, 90, 40)
    s.draw(SimplePath.withPoints(points))
  })
}
```

### `alongPath`

Iterates over `n` points spread evenly by distance along a path, giving the point, the angle the path is heading in there, and an index. Takes a `SimplePath` or anything with a `path` (`Line`, `Rect`, `RegularPolygon`, `Star`, `Spiral`). Pass `inclusive: false` for a closed path.

```ts
const alongAStar = (s: SCanvas) => {
  const star = new Star({ at: s.meta.center, n: 5, r: 0.28, r2: 0.13 })
  s.alongPath({ path: star, n: 60, inclusive: false }, (at, angle, i) => {
    s.setFillColor(45 + i * 3, 85, 60)
    s.withTranslation(at, () => {
      s.withRotation(angle, () => {
        s.fill(new Rect({ at: [0, 0], w: 0.006, h: 0.04, align: "center" }))
      })
    })
  })
}
```

### `aroundCircle`

The `aroundCircle` method iterates over points on the circumference of a circle.

```ts
const circleText = (s: SCanvas) => {
  s.aroundCircle({ r: 0.25, n: 12 }, ([x, y], i) => {
    s.times(5, (n) => {
      s.setFillColor(i * 5 + n, 75, 35, 0.2 * n)
      s.fillText(
        {
          at: s.perturb({ at: [x, y] }),
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
s.setFillColor(hue, saturation, lightness, alpha)
s.setStrokeColor(hue, saturation, lightness, alpha)
```

### Linear Gradients

A linear gradient transitions colors along a straight line.

```ts
const gradients1 = (s: SCanvas) => {
  const { right, bottom } = s.meta
  s.setFillGradient(
    new LinearGradient({
      from: [0, 0],
      to: [right, bottom],
      colors: [
        [0, { h: 210 + s.t * 100, s: 80, l: 60 }],
        [0.5, { h: 250 + s.t * 100, s: 80, l: 60 }],
        [1.0, { h: 280 + s.t * 100, s: 80, l: 60 }],
      ],
    })
  )
  s.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
}
```

### Radial Gradients

A radial gradient transitions colors outwards from a central point.

```ts
const gradients2 = (s: SCanvas) => {
  const { right, bottom, center } = s.meta

  s.setFillGradient(
    new RadialGradient({
      start: center,
      end: [right, bottom],
      rStart: 0.0,
      rEnd: 2 * Math.max(bottom, right),
      colors: [
        [0, { h: 0 + s.t * 40, s: 80, l: 60 }],
        [0.7, { h: 50 + s.t * 20, s: 90, l: 60 }],
        [1.0, { h: 1000 + s.t * 20, s: 80, l: 60 }],
      ],
    })
  )
  s.fill(new Rect({ at: [0, 0], w: right, h: bottom }))
}
```

### Color Helpers

Solandra includes helper functions to generate color palettes and ranges.

- `hueRange`: Creates a range of colors by interpolating hue.
- `saturationRange`: Creates a range of colors by interpolating saturation.
- `lightnessRange`: Creates a range of colors by interpolating lightness.
- `palettePreset`: Provides access to a set of predefined color palettes.
- `harmony(base, config)`: The classic colour schemes around a colour. `type` is `"complementary"` (default), `"analogous"`, `"triadic"`, `"tetradic"`, `"splitComplementary"` or `"monochrome"`. The base colour comes first, then its companions, all carrying its saturation, lightness and alpha (except `"monochrome"`, which varies lightness). `n` sets how many colours the open ended schemes give, `spread` how far apart they sit (degrees of hue, or of lightness for `"monochrome"`).
- `mixColors(a, b, proportion)`: Blends two colours, taking the short way round the hue circle, so red (350) to orange (10) passes through 0 rather than sweeping the whole spectrum. Proportion defaults to 0.5 and is not clamped.

```ts
const scheme = (s: SCanvas) => {
  const colors = harmony({ h: 15, s: 75, l: 55 }, { type: "analogous", n: 4 })
  s.forTiling({ n: 12, type: "square" }, (at, [w, h]) => {
    s.setFillColorFromSpec(s.sample(colors))
    s.fill(new Rect({ at, w, h }))
  })
}

const blend = (s: SCanvas) => {
  s.forHorizontal({ n: 24 }, (at, [dX, dY], _c, i) => {
    s.setFillColorFromSpec(
      mixColors({ h: 350, s: 80, l: 55 }, { h: 40, s: 85, l: 60 }, i / 23)
    )
    s.fill(new Rect({ at, w: dX, h: dY }))
  })
}
```

```ts
const colourPalettes = (s: SCanvas) => {
  s.background(30, 20, 90)

  // Generate palettes from a preset name and number of colours:
  const cs1 = palettePreset("rusty", 12)
  const cs2 = palettePreset("autumnal", 12)

  s.forHorizontal({ n: 12, margin: 0.1 }, (pt, [dX, dY], c, i) => {
    const [h, s, l] = cs1[i]
    s.setFillColor(h, s, l, 0.9)
    s.fill(
      new Rect({ at: s.perturb({ at: pt, magnitude: 0.05 }), w: dX, h: dY / 4 })
    )

    const [h2, s2, l2] = cs2[i]
    s.setFillColor(h2, s2, l2, 0.9)
    s.fill(
      new Rect({
        at: s.perturb({ at: add(pt, [0, dY / 4]), magnitude: 0.05 }),
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

You can generate random numbers using methods like `s.random()` (a float between 0 and 1), `s.randomPolarity()` (either 1 or -1), and `s.uniformRandomInt({ from, to })`.

### Distributions

Solandra supports various random number distributions, allowing for more controlled randomness.

- `s.gaussian({ mean, sd })`: Samples from a normal (Gaussian) distribution.
- `s.poisson(lambda)`: Samples from a Poisson distribution.

### Perturbation and Sampling

- `s.perturb({ at, magnitude })`: Randomly displaces a point.
- `s.sample(array)`: Selects a random element from an array.
- `s.shuffle(array)`: Randomizes the order of elements in an array.
- `s.withRandomOrder(...)`: Executes a tiling function in a random order.

```ts
const curls = (s: SCanvas) => {
  const baseColor = s.uniformRandomInt({ from: 150, to: 250 })
  s.background(baseColor, 20, 90)
  // ...
  s.times(s.uniformRandomInt({ from: 20, to: 100 }), () => {
    const c = s.randomPoint()
    let tail = s.perturb({ at: c, magnitude: 0.2 })
    // ...
    s.draw(
      Path.startAt(c).addCurveTo(tail, {
        curveSize: s.gaussian({
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
const noise = (s: SCanvas) => {
  s.forTiling({ n: 12, margin: 0.1 }, ([x, y], [dX, dY]) => {
    const v = perlin2(x, y) * Math.PI * 2
    s.setFillColor(s.t * 10 + 120 + v * 20, 80, 40)
    s.fill(
      new Arc({
        at: [x + dX / 2, y + dY / 2],
        r: dX / 2,
        a: s.t + v,
        a2: s.t + v + Math.PI / 2,
      })
    )
  })
}
```

### Fractal Noise

`fbm2` sums several octaves of `perlin2`, each at a higher frequency and lower amplitude than the last, giving noise with detail at every scale (clouds, terrain, texture) rather than at just one. It stays in roughly the same range as `perlin2`. Configure with `octaves` (default 4), `persistence` (how much quieter each octave is, default 0.5) and `lacunarity` (how much finer each octave is, default 2).

```ts
const fractalClouds = (s: SCanvas) => {
  s.forTiling({ n: 120, type: "square" }, ([x, y], [dX, dY]) => {
    const n = fbm2(x * 3, y * 3, { octaves: 6, persistence: 0.55 })
    s.setFillColor(210 - n * 30, 40 + n * 20, 55 + n * 45)
    s.fill(new Rect({ at: [x, y], w: dX * 1.2, h: dY * 1.2 }))
  })
}
```

### Curl Noise

`curl2` gives a smooth vector field taken from the curl of the noise, `(dn/dy, -dn/dx)`. Taking a noise value as an angle instead produces a field with sources and sinks, where everything eventually drains into the same few places; the curl of a field is divergence free, so lines following it swirl around each other indefinitely. Takes the same `octaves`, `persistence` and `lacunarity` as `fbm2` (one octave by default, i.e. plain `perlin2`) plus `epsilon`, the step used for the derivative (default 0.0001). Direction is what matters; use `v.normalize` (as `SimplePath.flowLine` does) if you need a unit vector.

```ts
const flowField = (s: SCanvas) => {
  s.forTiling({ n: 22, type: "square" }, (_, [dX], [cX, cY]) => {
    const [uX, uY] = v.normalize(curl2(cX * 2.5, cY * 2.5))
    s.draw(
      SimplePath.withPoints([
        [cX, cY],
        [cX + uX * dX, cY + uY * dX],
      ])
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
const transforms = (s: SCanvas) => {
  s.forTiling({ n: 8, type: "square", margin: 0.1 }, ([x, y], [dX, dY]) => {
    s.setFillColor(120 + x * 100, 90, 50)
    s.withTranslation([x + dX / 2, y + dY / 2], () =>
      s.withRotation(x + y + s.t, () => {
        s.fill(new Rect({ at: [-dX / 4, -dY / 4], w: dX / 2, h: dY / 2 }))
      })
    )
  })
}
```

### `withSymmetry`

Draws the same thing several times over, arranged symmetrically: the callback runs once per copy with the canvas already rotated and/or reflected about `at` (the centre of the canvas by default). `type` is `"rotational"` (default, `n` copies around a full turn), `"mirror"` (a reflected pair, in the `"vertical"` or `"horizontal"` axis) or `"kaleidoscope"` (`n` rotations, each also drawn reflected, so 2n copies). The callback is given the index of the copy and whether it is a reflection.

```ts
const rosette = (s: SCanvas) => {
  s.background(255, 30, 12)
  s.withSymmetry({ n: 12 }, (i) => {
    s.setFillColor(280 + i * 4, 70, 55, 0.55)
    s.fill(new Ellipse({ at: [0.5, 0.16], w: 0.14, h: 0.34 }))
  })
}

const kaleidoscope = (s: SCanvas) => {
  s.withSymmetry({ type: "kaleidoscope", n: 6 }, (i, reflected) => {
    s.setFillColor(reflected ? 195 : 45, 85, 60, 0.7)
    s.fill(new Circle({ at: [0.53, 0.08], r: 0.03 }))
  })
}
```

## Advanced Features

Solandra also provides a range of advanced features for creating more complex and interesting effects.

### `withClipping`

The `withClipping` method allows you to use a shape as a mask, so that subsequent drawing operations are only visible within the bounds of that shape.

```ts
const clipping = (s: SCanvas) => {
  const { center, bottom, right } = s.meta
  const size = Math.min(bottom, right) * 0.8
  s.background(120 + s.t * 50, 40, 90)
  s.lineWidth = 0.005
  s.range({ from: 1, to: 4, n: 4 }, (n) =>
    s.withTranslation([0.037 * n * n, bottom * 0.037 * n * n], () =>
      s.withScale([0.1 * n, 0.1 * n], () =>
        s.withClipping(new Ellipse({ at: center, w: size, h: size }), () =>
          s.forTiling(
            { n: 60 / (8 - n), type: "square" },
            ([x, y], [dX, dY]) => {
              s.setStrokeColor(120 + x * 120 + s.t * 50, 90 - 20 * y, 40)
              s.proportionately([
                [1, () => s.draw(new Line([x, y], [x + dX, y + dY]))],
                [2, () => s.draw(new Line([x + dX, y], [x, y + dY]))],
                [1, () => s.draw(new Line([x, y], [x, y + dY]))],
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

You can add shadows to your shapes by setting the `s.shadow` property.

```ts
const shadows = (s: SCanvas) => {
  s.background(10, 30, 95)
  s.forTiling(
    { n: 6, type: "square", order: "rowFirst", margin: 0.05 },
    (pt, [dX], _c, t) => {
      const i = t % 6
      const j = Math.floor(t / 6)

      s.setFillColor(t, 90, 40, 0.75)
      s.shadow = { size: t * 0.001, dX: (i - 2.5) * 0.01, dY: j * 0.01 }
      s.fill(
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

You can draw dashed lines by setting the `s.dash` property.

```ts
const dashes = (s: SCanvas) => {
  s.background(0, 0, 5)
  s.forTiling({ n: 5, margin: 0.1, type: "square" }, (_pt, [dX], at, i) => {
    s.lineWidth = 0.005
    s.dash = { offset: s.t / 20, pattern: [0.001 * (5 + i), 0.002 * (5 + i)] }
    s.setStrokeColor(45 + i * 10, 100, 70, 0.9)
    s.draw(new RegularPolygon({ at, n: 6, r: dX / 3 }))
  })
}
```

### Hatching

The `Hatching` shape creates a pattern of parallel lines, which can be used for shading.

```ts
const hatching = (s: SCanvas) => {
  s.lineWidth = 0.001
  s.range({ from: 1, to: 0.2, n: 4, inclusive: true }, (n) => {
    s.setStrokeColor(215 - n * 75, 90, 10 + n * 30)
    const s = (1.5 + Math.cos(s.t)) / 2
    s.draw(
      new Hatching({
        at: s.meta.center,
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
const spirals = (s: SCanvas) => {
  s.background(195, 30, 95)
  s.lineWidth = 0.0025
  new Spiral({
    at: s.meta.center,
    l: 0.05,
    n: 400,
    rate: s.oscillate({ from: 0.004, to: 0.005, rate: 0.15 }),
  }).path.edges.forEach((edge, i) => {
    s.setStrokeColor(i / 3, 70, 30)
    s.draw(edge.rotated(Math.PI / 4 + (i * Math.PI) / 2))
  })
}
```

## Vectors and Utilities

Points are plain `[number, number]` tuples. Solandra ships with pure vector functions, available on the `v` namespace object, that return new values without mutating inputs:

- `v.add(a, b)`, `v.subtract(a, b)`, `v.scale(p, factor)`: Basic arithmetic.
- `v.magnitude(p)`, `v.distance(a, b)`: Lengths.
- `v.normalize(p)`: Unit vector (returns `[0, 0]` for the zero vector).
- `v.dot(a, b)`, `v.cross(a, b)`: Dot product and 2D scalar cross product (sign tells you orientation).
- `v.heading(p)`: Angle of a vector in radians; `v.polarToCartesian(center, radius, angle)` goes the other way.
- `v.rotate(p, angle)`, `v.rotateAround(origin, p, angle)`: Rotation.
- `v.pointAlong(a, b, proportion)`: Interpolate between two points.

There are also numeric helpers:

- `clamp({ from, to }, n)`: Constrain a number to a range.
- `lerp({ from, to }, proportion)`: Linear interpolation between two numbers.
- `scaler(config)` and `scaler2d(c1, c2)`: Map values between ranges.
- `centroid(points)`: The average of a set of points.
- `convexHull(points)`: The smallest convex polygon containing a set of points, as if a rubber band were stretched around them, starting from the leftmost and going round clockwise as drawn. Points inside, or along an edge, are left out.

```ts
import { v, clamp, lerp } from "solandra"

const mid = v.pointAlong([0.1, 0.1], [0.9, 0.5], 0.5)
const direction = v.heading(v.subtract([0.9, 0.5], [0.1, 0.1]))
const eased = lerp({ from: 0.2, to: 0.8 }, 0.25)
```

## Animation

Solandra supports animation through the `s.t` variable, which represents the current time in seconds. By incorporating `s.t` into your drawing logic, you can create dynamic and evolving artworks.

```ts
const lowResAnimation3 = (s: SCanvas) => {
  const scaleXY = scaler2d(
    {
      minDomain: 0.1,
      maxDomain: 0.9,
      minRange: -2 * Math.PI,
      maxRange: Math.PI,
    },
    {
      minDomain: 0.1,
      maxDomain: s.meta.bottom - 0.1,
      minRange: -1.5,
      maxRange: 1.5,
    }
  )
  s.background(s.t * 20 + 95, 15, 10)
  s.forTiling({ n: 35, type: "square", margin: 0.05 }, ([x, y], [w], at) => {
    const [sX, sY] = scaleXY([x, y])
    const eqn = Math.cos(s.t / 1.2 + sX)
    const alpha = clamp({ from: 0.15, to: 1 }, 1 - Math.abs(sY - eqn))
    s.setFillColor(s.t * 20 + 120 + y * 40, 90, 50, alpha)
    s.fill(new Circle({ at, r: w / 2.1 }))
  })
}
```
