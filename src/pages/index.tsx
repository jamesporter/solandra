import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Canvas from "../app/Canvas"
import { RegularPolygon, Rect, PlayCanvas } from "../lib"
import ViewAll from "../app/pages/ViewAll"
import { H2, H3, P, H1 } from "../app/components/Text"
import Container from "../app/components/Container"
import CodeAndSketch from "../app/components/CodeAndSketch"
import sketches from "../sketches"
import { Link } from "gatsby"
import HLink from "../app/components/HLink"

const logo = (p: PlayCanvas) => {
  p.background(220, 26, 14)
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, n => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t * 1.5)) / 45
    p.setFillColour(220, 70, 10 + n * 12)
    p.fill(
      new RegularPolygon({
        at: center,
        n: sides,
        r,
      })
    )
  })
}

const IndexPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art" />

    <div className="overflow-auto">
      <div
        style={{
          height: "50vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "hsl(220, 26%, 14%)",
        }}
      >
        <Canvas sketch={logo} seed={1} noShadow playing />
      </div>

      <div className="bg-gray-900 px-8 pt-4 flex flex-col">
        <h1 className="font-bold text-4xl mb-2 mr-4 text-white text-center">
          Solandra
        </h1>
        <H2 tw="text-gray-400">
          A simple, modern TypeScript-first Algorithmic Art Tool
        </H2>
        <div className="flex flex-row justify-center pt-4">
          <HLink to="/main">Examples</HLink>
          <HLink to="/viewAll">Slide Show</HLink>
          <HLink to="/quickstart">Quick Start</HLink>
        </div>
      </div>

      <Container>
        <H1>Slideshow</H1>
        <div
          style={{
            width: "100%",
            maxWidth: "640px",
            height: "32rem",
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
          }}
          className="shadow-lg select-none"
        >
          <ViewAll />
        </div>
        <H3 tw="py-2 pb-8">Use Arrow keys or click to navigate</H3>

        <H1>Principles</H1>

        <P>
          Opionated, agile (code is easy to change) framework for algorithmic
          art. See my{" "}
          <a
            href="https://www.amimetic.co.uk/art/"
            className="text-blue-700 underline"
          >
            essays
          </a>{" "}
          for research/plans that went into this!
        </P>
        <ul className="list-inside list-disc">
          <li className="pb-1">
            Sketches always have width 1, height depends on aspect ratio.
          </li>
          <li className="pb-1">Angles in radians.</li>
          <li className="pb-1">Points are [number, number].</li>
          <li className="pb-1">Colours in hsl(a).</li>
          <li className="pb-1">
            Leverage TypeScript: you shouldn't need to learn much, autocomplete
            and type checking should have your back.
          </li>
          <li className="pb-1">Not for beginners.</li>
          <li className="pb-1">
            Control flow at level of drawing (tiling, partitions etc).
          </li>
          <li className="pb-1">Few dependencies/mostly from scratch.</li>
          <li className="pb-1">Performance is not the goal.</li>
          <li className="pb-1">
            Common algorthmic art things (e.g. randomness) should be easy.
          </li>
          <li className="pb-1">Should feel fun/powerful.</li>
          <li className="pb-1">Life is too short to compile things.</li>
          <li className="pb-1">
            Rethink APIs e.g. standard bezier curve APIs make absolutely no
            sense
          </li>
          <li className="pb-1">
            Declarative when possible (especially anything configuration-y),
            proceedural when pragmatic; make it easy to explore/change your
            mind.
          </li>
        </ul>
        <H1>Tutorial</H1>

        <P>
          Let's make the animated logo thing above to learn about how to use
          Solandra. Let's start with the background. The only way to do colours
          in Solandra is via HSL(A). Hue (0-360), Saturation (0-100) and
          Brightness (0-100). Oh and alpha (0-1). RGB is for computers not for
          you.
        </P>

        <P>
          Every sketch is just a function on the main Solandra object (here
          called p). So we get friendly autocompletion.
        </P>

        <CodeAndSketch
          code={`p.background(220, 26, 14)`}
          sketch={p => {
            p.background(220, 26, 14)
          }}
        />

        <P>
          That's a bit boring. Let's draw something. First we set a fill colour.
          Then we use a fill call (to draw lines use draw instead). Solandra
          comes with loads of standard built in shapes, with clear, declarative
          APIs (you describe the shape).
        </P>

        <CodeAndSketch
          code={`p.setFillColour(220, 54, 50)
p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))`}
          sketch={p => {
            p.background(220, 26, 14)
            p.setFillColour(220, 54, 50)
            p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))
          }}
        />

        <P>
          What did we learn? Points are always of the form: [x,y]. We use short
          names for common things (like width, w).
        </P>

        <P>
          Let's draw many shapes. But we'll make the computer do the hard bit.
          What if we could just ask it to tile our canvas? We can.
        </P>

        <CodeAndSketch
          code={`p.forTiling(
  { n: 10, type: "square", margin: 0.1 },
  (at, [w, h], c, i) => {
    p.setFillColour(150 + i * 5, 54, 50)
    p.fill(new Rect({ at, w, h }))
  }
)`}
          sketch={p => {
            p.background(220, 26, 14)
            p.forTiling(
              { n: 10, type: "square", margin: 0.1 },
              (at, [w, h], c, i) => {
                p.setFillColour(150 + i * 5, 54, 50)
                p.fill(new Rect({ at, w, h }))
              }
            )
          }}
        />

        <P>
          First we configure out tiling: 10 tiles across, square shape. Let's
          add a margin (that would be really tedious by hand).
        </P>

        <P>
          Now let's use our tiling. That's a lot of arguments. But it doesn't
          matter. TypeScript keeps track of them. The are the position, tile
          size, tile centre and iteration count. We'll use the last one to pick
          a colour.
        </P>

        <P>
          Let's draw polygons instead. Instead of tiling, let's move across our
          canvas. The API is basically the same. Configuration goes first (we
          can then easily tweak it).
        </P>

        <CodeAndSketch
          code={`p.forHorizontal({ n: 8, margin: 0.1 }, (at, [w, h], c, i) => {
  p.setFillColour(150 + i * 5, 54, 50)
  p.fill(new RegularPolygon({ at: c, r: w / 3, n: i + 3 }))
})`}
          sketch={p => {
            p.background(220, 26, 14)
            p.forHorizontal({ n: 6, margin: 0.1 }, (at, [w, h], c, i) => {
              p.setFillColour(150 + i * 10, 54, 50)
              p.fill(new RegularPolygon({ at: c, r: w / 3, n: i + 3 }))
            })
          }}
        />

        <P>
          We need one more thing before we can finish our drawing: time. But it
          is really easy, usually just p.t gives the time in seconds. We throw
          in some trigonometric stuff to make look more organic and:
        </P>

        <CodeAndSketch
          code={`new RegularPolygon({
  at: [c[0], c[1] + Math.cos(p.t + (i * Math.PI) / 8) * 0.2],
  r: w / 3,
  n: i + 3,
})`}
          sketch={p => {
            p.background(220, 26, 14)
            p.forHorizontal({ n: 6, margin: 0.1 }, (at, [w, h], c, i) => {
              p.setFillColour(150 + i * 10, 54, 50)
              p.fill(
                new RegularPolygon({
                  at: [c[0], c[1] + Math.cos(p.t + (i * Math.PI) / 8) * 0.2],
                  r: w / 3,
                  n: i + 3,
                })
              )
            })
          }}
          playing
        />

        <P>Okay so let's put everything together and draw our animated logo.</P>

        <CodeAndSketch
          code={`(p: PlayCanvas) => {
  p.background(220, 26, 14)
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, n => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t)) / 40
    p.setFillColour(220, 70, 10 + n * 12)
    p.fill(
      new RegularPolygon({
        at: center,
        n: sides,
        r,
      })
    )
  })
}`}
          sketch={logo}
          playing
        />
      </Container>

      <div className="bg-gray-900 px-8 pt-4 flex flex-col">
        <Container>
          <p className="text-xl mb-2 mr-4 text-white text-center">
            Solandra was made by{" "}
            <a className="text-blue-400 " href="https://www.complexview.com">
              James Porter
            </a>
            .
          </p>{" "}
          <p className="text-xl mb-2 mr-4 text-white text-center mb-12">
            Check out the{" "}
            <a
              className="text-blue-400 "
              href="https://github.com/jamesporter/solandra"
            >
              GitHub page
            </a>{" "}
            or install with{" "}
            <span className="text-gray-400 font-mono">npm i solandra</span>
          </p>
        </Container>
      </div>
    </div>
  </Layout>
)

export default IndexPage
