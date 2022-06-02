import type { NextPage } from "next"
import Head from "next/head"
import { Canvas } from "../src/components/Canvas"
import CodeAndSketch from "../src/components/CodeAndSketch"
import ExampleLinks from "../src/components/ExampleLinks"
import Footer from "../src/components/Footer"
import HLink from "../src/components/HLink"
import { H1, H2, P } from "../src/components/Text"
import { ViewAll } from "../src/components/ViewAll"
import { Rect, SCanvas } from "../src/lib"
import { RegularPolygon } from "../src/lib/paths/RegularPolygon"

const logo = (p: SCanvas) => {
  p.background(220, 26, 14)
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, (n) => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t * 1.5)) / 45
    p.setFillColor(220, 70, 10 + n * 12)
    p.fill(
      new RegularPolygon({
        at: center,
        n: sides,
        r,
      })
    )
  })
}

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Solandra</title>
        <meta
          name="description"
          content="A human friendly, agile framework for creative coding"
        />
        <link rel="icon" type="image/png" href="/images/icon.png" />
      </Head>

      <main className="">
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
            <HLink to="/viewAll">Slides</HLink>
            <HLink to="/quickstart">Start</HLink>
          </div>
        </div>

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

        <p className="py-2 pb-8 text-sm text-center">
          Use Arrow keys or click to navigate
        </p>

        <H1>Principles</H1>

        <P>
          Opinionated, agile (code is easy to change) framework for algorithmic
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
            Leverage TypeScript: you shouldn&apos;t need to learn much,
            autocomplete and type checking should have your back.
          </li>
          <li className="pb-1">Not for beginners.</li>
          <li className="pb-1">
            Control flow at level of drawing (tiling, partitions etc).
          </li>
          <li className="pb-1">Zero dependencies.</li>
          <li className="pb-1">Performance is not the goal.</li>
          <li className="pb-1">
            Common algorithmic art things (e.g. randomness) should be easy.
          </li>
          <li className="pb-1">Should feel fun/powerful.</li>
          <li className="pb-1">Life is too short to compile things.</li>
          <li className="pb-1">
            Rethink APIs e.g. standard bezier curve APIs make absolutely no
            sense
          </li>
          <li className="pb-1">
            Declarative when possible (especially anything configuration-y),
            procedural when pragmatic; make it easy to explore/change your mind.
          </li>
        </ul>
        <H1>Tutorial</H1>

        <P>
          Let&apos;s make the animated logo thing above to learn about how to
          use Solandra. Let&apos;s start with the background. The only way to do
          colours in Solandra is via HSL(A). Hue (0-360), Saturation (0-100) and
          Brightness (0-100). Oh and alpha (0-1). RGB is for computers not for
          you.
        </P>

        <P>
          Every sketch is just a function on the main Solandra object (here
          called p). So we get friendly autocompletion.
        </P>

        <CodeAndSketch
          code={`p.background(220, 26, 14)`}
          sketch={(p) => {
            p.background(220, 26, 14)
          }}
        />

        <P>
          That&apos;s a bit boring. Let&apos;s draw something. First we set a
          fill colour. Then we use a fill call (to draw lines use draw instead).
          Solandra comes with loads of standard built in shapes, with clear,
          declarative APIs (you describe the shape).
        </P>

        <CodeAndSketch
          code={`p.setFillColor(220, 54, 50)
p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))`}
          sketch={(p) => {
            p.background(220, 26, 14)
            p.setFillColor(220, 54, 50)
            p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))
          }}
        />

        <P>
          What did we learn? Points are always of the form: [x,y]. We use short
          names for common things (like width, w).
        </P>

        <P>
          Let&apos;s draw many shapes. But we&apos;ll make the computer do the
          hard bit. What if we could just ask it to tile our canvas? We can.
        </P>

        <CodeAndSketch
          code={`p.forTiling(
  { n: 10, type: "square", margin: 0.1 },
  (at, [w, h], c, i) => {
    p.setFillColor(150 + i * 5, 54, 50)
    p.fill(new Rect({ at, w, h }))
  }
)`}
          sketch={(p) => {
            p.background(220, 26, 14)
            p.forTiling(
              { n: 10, type: "square", margin: 0.1 },
              (at, [w, h], c, i) => {
                p.setFillColor(150 + i * 5, 54, 50)
                p.fill(new Rect({ at, w, h }))
              }
            )
          }}
        />

        <P>
          First we configure out tiling: 10 tiles across, square shape.
          Let&apos;s add a margin (that would be really tedious by hand).
        </P>

        <P>
          Now let&apos;s use our tiling. That&apos;s a lot of arguments. But it
          doesn&apos;t matter. TypeScript keeps track of them. They are the
          position, tile size, tile centre and iteration count. We&apos;ll use
          the last one to pick a colour.
        </P>

        <P>
          Let&apos;s draw polygons instead. Instead of tiling, let&apos;s move
          across our canvas. The API is basically the same. Configuration goes
          first (we can then easily tweak it).
        </P>

        <CodeAndSketch
          code={`p.forHorizontal({ n: 8, margin: 0.1 }, (at, [w, h], c, i) => {
  p.setFillColor(150 + i * 5, 54, 50)
  p.fill(new RegularPolygon({ at: c, r: w / 3, n: i + 3 }))
})`}
          sketch={(p) => {
            p.background(220, 26, 14)
            p.forHorizontal({ n: 6, margin: 0.1 }, (at, [w, h], c, i) => {
              p.setFillColor(150 + i * 10, 54, 50)
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
          sketch={(p) => {
            p.background(220, 26, 14)
            p.forHorizontal({ n: 6, margin: 0.1 }, (at, [w, h], c, i) => {
              p.setFillColor(150 + i * 10, 54, 50)
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

        <P>
          Okay so let&apos;s put everything together and draw our animated logo.
        </P>

        <CodeAndSketch
          code={`(p: SCanvas) => {
  p.background(220, 26, 14)
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, n => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t)) / 40
    p.setFillColor(220, 70, 10 + n * 12)
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

        <H2>Examples</H2>

        <ExampleLinks />

        <Footer />
      </main>
    </div>
  )
}

export default Home
