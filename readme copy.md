# Typeplates

## Principles

Opionated, agile (code is easy to change) framework for algorithmic art. See my [essays](https://www.amimetic.co.uk/art/) for research/plans that went into this!

- Sketches always have width 1, height depends on aspect ratio.
- Angles in radians.
- Points are [number, number].
- Colours in hsl(a).
- Leverage TypeScript: you shouldn't need to learn much, autocomplete and type checking should have your back.
- Not for beginners.
- Control flow at level of drawing (tiling, partitions etc).
- Few dependencies/mostly from scratch.
- Performance is not the goal.
- Common algorthmic art things (e.g. randomness) should be easy.
- Should feel fun/powerful.
- Life is too short to compile things.
- Rethink APIs e.g. standard bezier curve APIs make absolutely no sense
- Declarative when possible (especially anything configuration-y), proceedural when pragmatic; make it easy to explore/change your mind.

## Get Started

- Probably best to clone this project to try out as add React powered GUI around stuff but first see: [Live Demo](https://focused-agnesi-2a3bda.netlify.com).
- On CodeSandbox, quickly get started: [Simple editable sketch](https://codesandbox.io/embed/festive-boyd-db9n3)
- On [NPM](https://www.npmjs.com/package/typeplates). Install with `npm i typeplates` or `yarn add typeplates`.

Or if you want to play, clone this repo and start by

```
yarn
yarn start
```

Then open [http://localhost:1234](http://localhost:1234) and in your editor `sketches.ts` and try things out. It does things like the below

![A simple example drawn with tiles](tiles.png)

```typescript
p.forTiling({ n: 20, margin: 0.1, type: "square" }, ([x, y], [dX, dY]) => {
  p.lineStyle = { cap: "round" };
  p.proportionately([
    [
      1,
      () => {
        p.setStrokeColour(120 + x * 120, 90 - 20 * y, 40);
        p.drawLine([x, y], [x + dX, y + dY]);
      }
    ],
    [
      2,
      () => {
        p.setStrokeColour(120 + x * 120, 90 - 20 * y, 40);
        p.drawLine([x + dX, y], [x, y + dY]);
      }
    ]
  ]);
});
```

![An example](samples/1.png)

## Reference

- [Metadata](#Metadata)
- [Drawing](#Drawing)
- [Drawable](#Drawable)
- [Control Flow](#Control-Flow)
- [Randomness](#Randomness)

![An example](samples/2.png)

### Metadata

Get metadata on the drawing surface.

```typescript
meta: {
  top: number;
  bottom: number;
  right: number;
  left: number;
  aspectRatio: number;
  center: [number, number];
}
```

### Drawing

Set line width

```typescript
lineWidth: number;
```

Line style (standard Canvas options)

```typescript
lineStyle: {
    cap?: "round" | "butt" | "square";
};
```

Fill the background. Colour is always via hsl(a). No more ##RRGGBB that is for computers not humans.

```typescript
background(h: number, s: number, l: number, a?: number): void;
```

Fill the background with a gradient (either linear or radial). See LinearGradient and RadialGradient which provide nice ways to specify the gradients.

```typescript
backgroundGradient(gradient: Gradientable): void;
```

Set the 'pen' colour.

```typescript
setStrokeColour(h: number, s: number, l: number, a?: number): void;
```

Set the fill colour.

```typescript
setFillColour(h: number, s: number, l: number, a?: number): void;
```

Set the pen gradient.

```typescript
setStrokeGradient(gradient: Gradientable): void;
```

Set the fill gradient.

```typescript
setFillGradient(gradient: Gradientable): void;
```

Draw a line (deprecated). Typelates ues `[number, number] (Point2D)` for all points.

```typescript
drawLine(from: Point2D, to: Point2D): void;
```

Draw (lines on) something.

```typescript
draw(traceable: Traceable): void;
```

Fill something.

```typescript
fill(traceable: Traceable): void;
```

Outline text.

```typescript
drawText(config: TextConfig, text: string): void;
```

Solid text.

```typescript
fillText(config: TextConfig, text: string): void;
```

### Drawable

The first (attempt at being a) innovative area of Typeplates is in the drawing APIs. Instead of awkward, low level HTML Canvas APIs we have nicer, more declarative, more agile and more human APIs.

Curves in particular should make more sense. And there are convenience operations on sets of points (smoothing with the Chaiken algorithm) and Rectanges (splitting into smaller rectangles).

The core drawing objects are listed below. For basic paths (a series of points):

```typescript
SimplePath implements Traceable
```

For complex paths (with curves):

```typescript
Path implements Traceable
```

For arcs (partial circles):

```typescript
Arc implements Traceable
```

For rectangles:

```typescript
Rect implements Traceable
```

For circles and ellipses:

```typescript
Ellipse implements Traceable
```

See the `implements Traceable` bit, yeah, you can do that for custom drawing. It exposes the low level HTML Canvas operations in a simple way. You should assume it will get called in this way (or equivalent for filling) and `ctx` is a 2D Canvas context:

```typescript
  draw(traceable: Traceable) {
    this.ctx.beginPath();
    traceable.traceIn(this.ctx);
    this.ctx.stroke();
  }
```

### Control Flow

The second innovative area of Typeplates is in bringing into the framework control flow relevant to drawing. We can easily iterate across the canvas, add a margin and so without writing boilerplate. We can even compose these with operations to build data or randomise the order.

2D tiling across the canvas. The type optional parameter allows for square tiles (with adjusted margin) or proportionate tiling.

```typescript
forTiling: (config: {
  n: number;
  type?: "square" | "proportionate";
  margin?: number;
}, callback: (point: [number, number], delta: [number, number]) => void) => void;
```

Horizontal tiling across the canvas.

```typescript
forHorizontal: (config: {
  n: number;
  margin?: number;
}, callback: (point: [number, number], delta: [number, number], i: number) => void)
  => void;
```

Horizontal tiling down the canvas.

```typescript
forVertical: (config: {
  n: number;
  margin?: number;
}, callback: (point: [number, number], delta: [number, number], i: number) => void)
  => void;
```

Take an existing control flow operation and build an array out of the results of the callbacks.

```typescript
build: <C, T extends any[], U>(iterFn: (config: C, callback: (...args: T) => void)
=> void, config: C, cb: (...args: T) => U) => U[];
```

Take an existing control flow operation and do it in a random order.

```typescript
withRandomOrder<C, T extends any[]>(iterFn: (config: C, callback: (...args: T) =>
  void) => void, config: C, cb: (...args: T) => void): void;
```

Do something a proportion of times e.g. `0.5` means half the time.

```typescript
doProportion(p: number, callback: () => void): void;
```

Do something `n` times.

```typescript
times(n: number, callback: (n: number) => void): void;
```

Iterate around a circle.

```typescript
aroundCircle: (config: {
  cX?: number;
  cY?: number;
  radius?: number;
  n: number;
}, callback: (point: [number, number], i: number) => void) => void;
```

Give proportions and callbacks. Randomly choose an option, weighted by the proportion.

```typescript
proportionately<T>(cases: [number, () => T][]): T;
```

Pick a random point within the canvas.

```typescript
randomPoint: Point2D;
```

Do something over a range (don't use for loops!)

```typescript
range(config: {
  from: number;
  to: number;
  n: number;
  inclusive?: boolean;
}, callback: (n: number) => void): void;
```

Is a point in the drawing?

```typescript
inDrawing: (point: [number, number]) => boolean;
```

### Randomness

A pseudorandom number

```typescript
random: () => number;
```

A random integer.

```typescript
uniformRandomInt: (config: {
  from?: number;
  to: number;
  inclusive?: boolean;
}) => number;
```

-1/1 (flip a coin).

```typescript
randomPolarity: () => 1 | -1;
```

Pick an item in an array at random.

```typescript
sample: <T>(from: T[]) => T;
```

Pick n times from an array.

```typescript
samples: <T>(n: number, from: T[]) => T[];
```

Shuffle an array.

```typescript
shuffle: <T>(items: T[]) => T[];
```

Randomly perturb a point.

```typescript
perturb: (
  [x, y]: [number, number],
  config?: {
    magnitude?: number;
  }
) => [number, number];
```

A Gaussian pseudo-random number.

```typescript
gaussian: (config?: { mean?: number; sd?: number }) => number;
```

A Poisson pseudo-random number.

```typescript
poisson: (lambda: number) => number;
```

![An example](samples/3.png)

## Phase 1 (done)

- [x] Improve App to allow for saving at arbitrary sizes
- [x] Improve App/add show all sketches
- [x] Text with nice api
- [x] Fix tiling to more sensibly support different aspect ratios (i.e. adjust margins)
- [x] More consistent text api
- [x] Gradients: linear and radial (given up on svg, so can better cover canvas api!)
- [x] More randomness (support common probability distributions
- [x] Seeding for randomness, move into play, initialise
- [x] More path classes rect, including subdivision operation on rect
- [x] More path classes ellipse
- [x] Ability to set background
- [x] Revise/clean up core play-canvas api, drop some references to canvas as only going to support that now(!) etc
- [x] Publish something to code sandbox that people can try without having to download/install stuff
- [x] Documentation
- [x] Figure out nice way to package/publish

![An example](samples/4.png)

## Phase 2

- [x] Scaling: original plan was to _not_ allow the canvas to scale, but to build some utilities to perform transformations on paths etc; not sure if this is good idea, maybe better just to do something on top of cavnas approach, particularly as decided to drop svg now?
- [ ] better export e.g. common paper/dpi sizes, move existing related stuff to utility
- [x] 'Play'/time... be able to do dynamic redrawing i.e. requestAnimationFrame, redraw etc
- [ ] Interactions(!)
- [ ] Maybe add JSON 'canvas' for easy testing
