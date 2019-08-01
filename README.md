# Solandra

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

![Examples](samples/samples.png)

## Get Started

- Probably best to clone this project to try out as add React powered GUI around stuff but first see: [Live Demo](https://solandra.netlify.com/).
- On CodeSandbox, quickly get started: [Simple editable sketch](https://codesandbox.io/embed/festive-boyd-db9n3)
- On [NPM](https://www.npmjs.com/package/solandra). Install with `npm i solandra` or `yarn add solandra`.

Or if you want to play, install gatsby cli, clone this repo and start by

```
yarn
gatsby develop
```

Then open [http://localhost:8000](http://localhost:8000) and in your editor `sketches.ts` and try things out. It does things like the below

![A simple example drawn with tiles](tiles.png)

```typescript
p.forTiling({ n: 20, margin: 0.1, type: "square" }, ([x, y], [dX, dY]) => {
  p.lineStyle = { cap: "round" }
  p.proportionately([
    [
      1,
      () => {
        p.setStrokeColour(120 + x * 120, 90 - 20 * y, 40)
        p.drawLine([x, y], [x + dX, y + dY])
      },
    ],
    [
      2,
      () => {
        p.setStrokeColour(120 + x * 120, 90 - 20 * y, 40)
        p.drawLine([x + dX, y], [x, y + dY])
      },
    ],
  ])
})
```

![An example](samples/1.png)
