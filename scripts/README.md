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

Fonts were, though, and they were the worst of it. `sans-serif` is not a font,
it is a request, and each platform answers it differently — DejaVu Sans on a
Linux CI box, Helvetica on a Mac. That is not a small difference in an image
made mostly of text, and no amount of tolerance in the comparison should
paper over it.

So `assets/fonts` holds the three DejaVu faces, and `scripts/fonts.ts`:

1. registers them with node-canvas under names nothing else can claim
   (`Solandra Sample Sans` and friends), and
2. wraps the rendering context so that every font declaration a sketch sets is
   rewritten onto one of those three faces. The platform never gets to resolve
   a family name, so it never gets to disagree.

`registerFont` is node-canvas's own API and works everywhere. This used to be a
fontconfig config instead, which worked on Linux and was **silently ignored on
macOS**, where pango is not using fontconfig — so the Mac rendered every text
sample in Helvetica and six samples failed for reasons the error messages could
not explain.

That is why `check:samples` now calls `assertPinnedFontsInUse()` before it
compares anything: it measures each registered face and fails with a plain
message if the machine has substituted its own font. "Which typeface is this?"
is a question with an exact answer, and it should not be left to an image
comparison to guess at. `scripts/__tests__/fonts.test.ts` asserts the same
thing, so `pnpm test` catches it too.

### 2. Tolerate the differences that cannot

Two renders of the same sketch, with the same font file, still are not
identical: rasterisation depends on hinting, on freetype's version, and on the
platform. `scripts/imageDiff.ts` compares images perceptually. A pixel only
counts against the comparison if all three of these hold:

- it differs by more than `colorTolerance` (0.1 by default), measured as a
  distance in YIQ space, which weights brightness the way an eye does rather
  than treating a change in red as a change in blue;
- nothing within `shiftTolerance` pixels of it in the other image looks like
  it, in both directions — this absorbs sub pixel shifts without also excusing
  a shape that has appeared out of nowhere next to an existing edge; and
- the average colour of the `structureRadius` neighbourhood around it also
  differs, by more than `structureTolerance`.

That last one is what makes text survivable. A glyph is mostly edge, and two
platforms rasterise edges differently, moving individual pixels a long way.
But moving an edge only takes ink from one pixel and gives it to its
neighbour, so the average across the neighbourhood barely moves. Recolouring
something, or moving a whole shape, moves both. Hence the much tighter
tolerance on the average: the differences it exists to forgive shrink almost
to nothing, so it does not need much room.

What survives all three is counted, and an image passes if at least
`threshold` (99% by default) of its pixels match.

### Why these numbers

They were fitted against real pairs of images rather than guessed, with two
opposing requirements: a render that differs only in rasterisation has to pass
comfortably, and one that draws something genuinely different has to fail.

|                                                        | at defaults | verdict                                                     |
| ------------------------------------------------------ | ----------- | ----------------------------------------------------------- |
| Same font file, different rasterisation (worst sample) | 99.85%      | passes, ~6x margin                                          |
| A sketch whose hue moved 210 -> 205                    | 100.00%     | passes                                                      |
| A sketch whose hue moved 210 -> 190                    | 99.97%      | passes                                                      |
| A sketch whose hue moved 210 -> 120                    | 95.97%      | fails                                                       |
| A sketch whose geometry moved 2.5%                     | 98.06%      | fails                                                       |
| Baselines one library change out of date               | 54-98.9%    | fails                                                       |
| Text rendered in the wrong typeface                    | 67-99.5%    | mostly fails, and `assertPinnedFontsInUse` catches the rest |

The neighbourhood test costs nothing on the differences that matter: the
210 -> 120 hue change scores 95.973% with it and 95.973% without.

### When a sample cannot be held to this

`unverifiedSamples` in `renderSamples.ts` lists samples that are rendered and
committed but not compared, each with a reason. There is one: `Hello World`,
which is almost entirely the edge of a glyph at a size where macOS and Linux
disagree by more than any of the above can absorb — 96.8% between an arm64 Mac
and a Linux baseline, with the same font file, on two images that look the
same. Nothing else is close; the next worst text sample is 99.99%.

This is a last resort, not a pressure valve. Each entry gives up the whole
point of the check for one sketch, so prefer fixing the cause, and delete
entries when the reason stops being true. `--filter <name>` compares one
anyway, which is what to do after deliberately changing it.

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
pnpm check:samples --structure-radius 0    # per pixel only, no neighbourhoods
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
