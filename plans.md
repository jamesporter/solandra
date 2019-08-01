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
- [x] Interactions(!)
- [ ] Maybe add JSON 'canvas' for easy testing

## Phase 3

- [x] naming
- [x] many more examples
- [x] revise apis
- [x] move project site to gatsby

## Phase 4

- [x] iterate a bit on new gatsby powered site
- [x] publish
- [x] OS (again!)
- [x] more examples
