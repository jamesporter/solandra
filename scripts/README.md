# Sample image snapshot testing

Every sketch in `src/examples` is rendered to a PNG in `samples/`, and those
PNGs are committed. `pnpm check:samples` re-renders them and checks the result
still looks like what is in git, so a change that quietly alters what the
library draws shows up as a failing check rather than as a surprise later.

```bash
pnpm build:samples   # re-render samples/ (and samples.md); commit the result
pnpm check:samples   # compare fresh renders against what is committed
```

`check:samples` runs in CI as the [Sample images](../.github/workflows/samples.yml)
workflow.

## Why not just `git diff`?

That is what this used to do, and it failed constantly. Two renders of the same
sketch are not identical byte for byte across machines: sketches are drawn
through node-canvas, so the pixels depend on cairo, pango and freetype, on the
fonts fontconfig can find, and on floating point rounding. Images that look the
same to a person routinely differ in a few thousand pixels by a shade, or by a
sub pixel along an edge.

So this does two things instead.

### 1. Remove the differences that can be removed

The graphics stack itself is not really a variable: node-canvas ships prebuilt
binaries with cairo, pango, freetype and harfbuzz bundled, so the lockfile pins
it.

Fonts were, though, and they were the worst of it — `sans-serif` means DejaVu
Sans on a Linux CI box and Helvetica on a Mac, which is not a small difference
in an image made mostly of text. `assets/fonts` now holds the three DejaVu
faces, and `scripts/fonts.ts` points fontconfig at a generated config exposing
only those, with every other family aliased onto them. Text renders the same
everywhere. `scripts/__tests__/fonts.test.ts` guards that the aliases actually
resolve the way they are meant to.

### 2. Tolerate the differences that cannot

`scripts/imageDiff.ts` compares two images perceptually rather than exactly.
A pixel only counts against the comparison if:

- it differs by more than `colorTolerance` (0.1 by default), measured as a
  distance in YIQ space, which weights brightness the way an eye does rather
  than treating a change in red as a change in blue; **and**
- nothing within `shiftTolerance` pixels of it in the other image looks like
  it — in both directions. This is what absorbs antialiasing and sub pixel
  shifts, which is where renderers disagree most, without also excusing a
  shape that has appeared out of nowhere next to an existing edge.

What survives both is counted, and an image passes if at least `threshold`
(99% by default) of its pixels match. On a real change — a sketch that draws
something different, or an RNG change that reshuffles a composition — the
number lands far below that, so the threshold is not as loose as it sounds:
the failures this replaces the exact comparison for were fractions of a
percent, and a genuinely changed sketch is usually 20-40% different.

## When it fails

```
Sample images do not match:

  Bokeh (Bokeh.png): 94.104% similar (need 99.000%); 32011 of 540000 pixels
  differ, worst by 87.282%
```

If the change was intended, `pnpm build:samples` and commit the new images. If
it was not, you have found a regression.

To see what moved, `--diff-output` writes, for each failing sample, a diff
image (the expected image faded out, tolerated differences in yellow,
significant ones in red) and the actual render next to it. CI does this
automatically and uploads them as a `sample-diffs` artifact.

```bash
pnpm check:samples --diff-output ./sample-diffs
pnpm check:samples --filter Bokeh          # just the samples matching a name
pnpm check:samples --threshold 0.995       # stricter
pnpm check:samples --color-tolerance 0.05  # stricter per pixel
pnpm check:samples --shift-tolerance 0     # exact positions, no shift allowance
```

The check also fails on a sample image that no sketch renders any more, and on
a stale `samples/samples.md`.

## Files

|                    |                                                                             |
| ------------------ | --------------------------------------------------------------------------- |
| `fonts.ts`         | Points fontconfig at the bundled fonts. Must run before `canvas` is loaded. |
| `renderSamples.ts` | Renders sketches to PNGs, and builds `samples.md`.                          |
| `imageDiff.ts`     | The comparison itself. No dependencies, so it is unit tested directly.      |
| `png.ts`           | PNG encode/decode via node-canvas.                                          |
