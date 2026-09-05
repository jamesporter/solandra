/**
 * The mapping that powers the ⌘K command menu.
 *
 * Kept deliberately small and hand curated: every site page, every docs page
 * and the key concepts of the library, each pointing at the page that explains
 * it. `section` gives a bit of context in the menu (and is fuzzy matched too),
 * `keywords` is a place for the words people are likely to type that don't
 * appear in the name.
 */

export type CommandMenuKind = "page" | "docs" | "concept" | "action"

export type CommandMenuItem = {
  name: string
  href: string
  kind: CommandMenuKind
  /** Where this lives, shown on the right of a result. */
  section?: string
  /** Extra terms to match on, never displayed. */
  keywords?: string
  /** Leaves the site, opened in a new tab. */
  external?: boolean
}

const pages: CommandMenuItem[] = [
  {
    name: "Home",
    href: "/",
    kind: "page",
    section: "Site",
    keywords: "solandra start index landing",
  },
  {
    name: "Examples",
    href: "/main",
    kind: "page",
    section: "Site",
    keywords: "highlights gallery sketches showcase",
  },
  {
    name: "API Samples",
    href: "/api-samples",
    kind: "page",
    section: "Examples",
    keywords: "simple small snippets reference",
  },
  {
    name: "Animated Examples",
    href: "/animated",
    kind: "page",
    section: "Examples",
    keywords: "animation motion loop time",
  },
  {
    name: "Advanced API Examples",
    href: "/advanced-apis",
    kind: "page",
    section: "Examples",
    keywords: "complex composition",
  },
  {
    name: "Advanced Path Examples",
    href: "/advanced-paths",
    kind: "page",
    section: "Examples",
    keywords: "curves shapes complex",
  },
  {
    name: "Isometric Examples",
    href: "/isometric",
    kind: "page",
    section: "Examples",
    keywords: "3d cubes projection",
  },
  {
    name: "Randomness Examples",
    href: "/randomness-and-noise",
    kind: "page",
    section: "Examples",
    keywords: "noise perlin random",
  },
  {
    name: "Text Examples",
    href: "/text",
    kind: "page",
    section: "Examples",
    keywords: "type lettering fonts",
  },
  {
    name: "Shader Playground",
    href: "/shaders",
    kind: "page",
    section: "Site",
    keywords: "glsl webgl fragment",
  },
  {
    name: "Slideshow",
    href: "/viewAll",
    kind: "page",
    section: "Site",
    keywords: "slides view all present screensaver",
  },
  {
    name: "Export a Sketch",
    href: "/export",
    kind: "page",
    section: "Site",
    keywords: "download png save high resolution print",
  },
  {
    name: "Other Platforms",
    href: "/other-platforms",
    kind: "page",
    section: "Site",
    keywords: "svg flutter dart ports",
  },
]

const docs: CommandMenuItem[] = [
  {
    name: "Introduction",
    href: "/docs/introduction",
    kind: "docs",
    section: "Docs",
    keywords: "overview what is solandra about",
  },
  {
    name: "Get Started",
    href: "/docs/quickstart",
    kind: "docs",
    section: "Docs",
    keywords: "quickstart install npm setup tutorial first sketch",
  },
  {
    name: "Canvas Basics",
    href: "/docs/canvas-basics",
    kind: "docs",
    section: "Docs",
    keywords: "sCanvas drawing fundamentals",
  },
  {
    name: "Shapes",
    href: "/docs/shapes",
    kind: "docs",
    section: "Docs",
    keywords: "primitives geometry gallery",
  },
  {
    name: "Paths & Curves",
    href: "/docs/paths",
    kind: "docs",
    section: "Docs",
    keywords: "bezier lines points",
  },
  {
    name: "Iteration",
    href: "/docs/iteration",
    kind: "docs",
    section: "Docs",
    keywords: "loops grids tiling repeat",
  },
  {
    name: "Randomness & Noise",
    href: "/docs/randomness",
    kind: "docs",
    section: "Docs",
    keywords: "random perlin gaussian seed",
  },
  {
    name: "Colour & Palettes",
    href: "/docs/colors",
    kind: "docs",
    section: "Docs",
    keywords: "color hsl gradients themes",
  },
  {
    name: "Transforms & Clipping",
    href: "/docs/transforms",
    kind: "docs",
    section: "Docs",
    keywords: "rotate translate scale context state",
  },
  {
    name: "Text",
    href: "/docs/text",
    kind: "docs",
    section: "Docs",
    keywords: "fonts lettering typography",
  },
  {
    name: "Animation & Time",
    href: "/docs/animation",
    kind: "docs",
    section: "Docs",
    keywords: "animate motion loop frames",
  },
  {
    name: "Vectors & Utilities",
    href: "/docs/vectors-and-utilities",
    kind: "docs",
    section: "Docs",
    keywords: "maths helpers grids collections",
  },
  {
    name: "Shaders & Images",
    href: "/docs/shaders",
    kind: "docs",
    section: "Docs",
    keywords: "glsl webgl render image",
  },
  {
    name: "Release Notes",
    href: "/docs/release-notes",
    kind: "docs",
    section: "Docs",
    keywords: "changelog versions history",
  },
]

const concepts: CommandMenuItem[] = [
  {
    name: "forTiling",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "tiles grid n squares",
  },
  {
    name: "forGrid",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "rows columns cells",
  },
  {
    name: "forHorizontal & forVertical",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "strips bands rows columns",
  },
  {
    name: "aroundCircle",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "radial polar ring",
  },
  {
    name: "forPoissonDiskPoints",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "poisson disk sampling scatter blue noise",
  },
  {
    name: "times, downFrom & range",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "repeat count sequence",
  },
  {
    name: "Higher order iteration",
    href: "/docs/iteration",
    kind: "concept",
    section: "Iteration",
    keywords: "build withRandomOrder proportionately doProportion",
  },
  {
    name: "SimplePath",
    href: "/docs/paths",
    kind: "concept",
    section: "Paths & Curves",
    keywords: "polyline points chaiken",
  },
  {
    name: "Path",
    href: "/docs/paths",
    kind: "concept",
    section: "Paths & Curves",
    keywords: "curveTo lineTo arcTo bezier",
  },
  {
    name: "Smoothing & sampling paths",
    href: "/docs/paths",
    kind: "concept",
    section: "Paths & Curves",
    keywords: "chaiken subdivide length pointAt segment split",
  },
  {
    name: "Measuring paths & hit testing",
    href: "/docs/paths",
    kind: "concept",
    section: "Paths & Curves",
    keywords: "boundingBox area containsPoint inside enclosed size box",
  },
  {
    name: "Convex hull",
    href: "/docs/paths",
    kind: "concept",
    section: "Paths & Curves",
    keywords: "convexHull wrap rubber band cloud points hull",
  },
  {
    name: "Simplifying paths",
    href: "/docs/paths",
    kind: "concept",
    section: "Paths & Curves",
    keywords: "simplified tolerance douglas peucker thin reduce facet",
  },
  {
    name: "Rect, Square & RoundedRect",
    href: "/docs/shapes",
    kind: "concept",
    section: "Shapes",
    keywords: "rectangle box corners",
  },
  {
    name: "Circle, Ellipse & Arc",
    href: "/docs/shapes",
    kind: "concept",
    section: "Shapes",
    keywords: "round oval HollowArc segment",
  },
  {
    name: "Star & RegularPolygon",
    href: "/docs/shapes",
    kind: "concept",
    section: "Shapes",
    keywords: "hexagon pentagon points sides",
  },
  {
    name: "Hatching, Line & Spiral",
    href: "/docs/shapes",
    kind: "concept",
    section: "Shapes",
    keywords: "fill texture stripes helix",
  },
  {
    name: "CompoundPath",
    href: "/docs/shapes",
    kind: "concept",
    section: "Shapes",
    keywords: "holes boolean combine subtract",
  },
  {
    name: "background, fill & stroke",
    href: "/docs/canvas-basics",
    kind: "concept",
    section: "Canvas Basics",
    keywords: "draw setFillColor setStrokeColor colour",
  },
  {
    name: "Line style & shadows",
    href: "/docs/canvas-basics",
    kind: "concept",
    section: "Canvas Basics",
    keywords: "lineWidth lineCap dash setShadow blur",
  },
  {
    name: "Coordinate system & meta",
    href: "/docs/canvas-basics",
    kind: "concept",
    section: "Canvas Basics",
    keywords: "aspect ratio center bottom width height inDrawing",
  },
  {
    name: "Gradients",
    href: "/docs/colors",
    kind: "concept",
    section: "Colour",
    keywords: "linear radial LinearGradient RadialGradient",
  },
  {
    name: "Colour themes & generative palettes",
    href: "/docs/colors",
    kind: "concept",
    section: "Colour",
    keywords: "scheme step wise ramp palette random harmony",
  },
  {
    name: "Colour schemes & mixing",
    href: "/docs/colors",
    kind: "concept",
    section: "Colour",
    keywords:
      "harmony complementary analogous triadic tetradic monochrome mixColors blend hue circle",
  },
  {
    name: "withContext",
    href: "/docs/transforms",
    kind: "concept",
    section: "Transforms",
    keywords: "save restore state stack",
  },
  {
    name: "Translation, rotation & scale",
    href: "/docs/transforms",
    kind: "concept",
    section: "Transforms",
    keywords: "withTranslation withRotation withScale move",
  },
  {
    name: "Clipping",
    href: "/docs/transforms",
    kind: "concept",
    section: "Transforms",
    keywords: "withClipping mask cut inside",
  },
  {
    name: "Blend modes",
    href: "/docs/transforms",
    kind: "concept",
    section: "Transforms",
    keywords: "multiply screen overlay composite",
  },
  {
    name: "Perlin & fractal noise",
    href: "/docs/randomness",
    kind: "concept",
    section: "Randomness",
    keywords: "perlin2 noise field organic octaves",
  },
  {
    name: "Curl noise & flow fields",
    href: "/docs/randomness",
    kind: "concept",
    section: "Randomness",
    keywords: "curl2 flowLine streamline swirl divergence free vector field",
  },
  {
    name: "perturb & distributions",
    href: "/docs/randomness",
    kind: "concept",
    section: "Randomness",
    keywords: "gaussian poisson uniformRandomInt jitter sample shuffle",
  },
  {
    name: "Seeds & reproducibility",
    href: "/docs/randomness",
    kind: "concept",
    section: "Randomness",
    keywords: "seed rng deterministic repeat",
  },
  {
    name: "oscillate",
    href: "/docs/animation",
    kind: "concept",
    section: "Animation",
    keywords: "sine wave pulse time loop",
  },
  {
    name: "Text rendering & fonts",
    href: "/docs/text",
    kind: "concept",
    section: "Text",
    keywords: "drawText measure font size align",
  },
  {
    name: "Vector operations",
    href: "/docs/vectors-and-utilities",
    kind: "concept",
    section: "Vectors & Utilities",
    keywords: "v add scale normalise dot distance point",
  },
  {
    name: "Collection helpers",
    href: "/docs/vectors-and-utilities",
    kind: "concept",
    section: "Vectors & Utilities",
    keywords: "c zip2 sum arrayOf tapAt",
  },
  {
    name: "Hex & triangular grids",
    href: "/docs/vectors-and-utilities",
    kind: "concept",
    section: "Vectors & Utilities",
    keywords: "hexagon triangle tiling lattice",
  },
  {
    name: "Isometric projection",
    href: "/docs/vectors-and-utilities",
    kind: "concept",
    section: "Vectors & Utilities",
    keywords: "3d cube isometric axonometric",
  },
  {
    name: "renderShader & render",
    href: "/docs/shaders",
    kind: "concept",
    section: "Shaders",
    keywords: "glsl fragment webgl uniforms offscreen texture image data",
  },
]

const actions: CommandMenuItem[] = [
  {
    name: "Open the GitHub repo",
    href: "https://github.com/jamesporter/solandra",
    kind: "action",
    section: "Action",
    keywords: "source code issues star contribute git",
    external: true,
  },
]

export const commandMenuItems: CommandMenuItem[] = [
  ...pages,
  ...docs,
  ...concepts,
  ...actions,
]
