/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import Head from "next/head"
import { Canvas } from "../src/components/Canvas"
import CodeAndSketch from "../src/components/CodeAndSketch"
import ExampleLinks from "../src/components/ExampleLinks"
import Footer from "../src/components/Footer"
import HLink from "../src/components/HLink"
import { ViewAll } from "../src/components/ViewAll"
import { Rect, SCanvas } from "../src/lib"
import { RegularPolygon } from "../src/lib/paths/RegularPolygon"
import {
  ArrowsExpandIcon,
  CodeIcon,
  DownloadIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline"
import Link from "next/link"
import { SVGSketch } from "../src/components/SVGSketch"

const logo = (p: SCanvas) => {
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, (n) => {
    const sides = 10 - n
    const r = d - n * 0.16 * d + (1 + Math.cos(p.t * 1.5)) / 45
    p.setFillColor(345, 70, 20 + n * 12)
    p.fill(
      new RegularPolygon({
        at: center,
        n: sides,
        r,
        a: 0.1 * Math.cos(p.t),
      })
    )
  })
}

const logoForDemo = (p: SCanvas) => {
  p.background(220, 26, 14)
  const { bottom, right, center } = p.meta
  const d = Math.min(bottom, right) / 2.8

  p.times(5, (n) => {
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
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solandra</title>
        <meta
          name="description"
          content="A human friendly, agile framework for creative coding"
        />
        <link rel="icon" type="image/png" href="/images/icon.png" />
      </Head>

      <main>
        <div className="bg-gradient-to-b from-rose-500  to-sky-700 py-4 overflow-hidden">
          <div
            style={{
              height: "50vh",
              width: "100vw",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Canvas sketch={logo} seed={1} noShadow playing />
          </div>

          <div className="px-8 pt-4 flex flex-col">
            <h1 className="font-bold text-6xl mb-2 mr-4 text-white text-center">
              Solandra
            </h1>
            <h2 className="text-gray-100 text-center text-3xl">
              A modern TypeScript-first Creative Coding Framework
            </h2>
            <div className="flex flex-row justify-center pt-4">
              <HLink to="/main">Examples</HLink>
              <HLink to="/viewAll">Slides</HLink>
              <HLink to="/quickstart">Start</HLink>
            </div>
          </div>
        </div>

        <div className="mx-auto p-4 max-w-3xl article-page">
          <h1>Slideshow</h1>
          <div
            style={{
              maxWidth: "640px",
              height: "32rem",
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
              margin: "auto",
              position: "relative",
            }}
            className="shadow-lg select-none rounded-xl overflow-hidden"
          >
            <ViewAll />

            <Link href="/viewAll">
              <a className="absolute bottom-0 right-0 bg-slate-800 bg-opacity-30 rounded-tl-xl">
                <ArrowsExpandIcon className="text-white h-6 w-6 m-2" />
              </a>
            </Link>
          </div>

          <p className="py-2 pb-8 text-sm text-center">
            Use Arrow keys or click to navigate
          </p>

          <h1>Principles</h1>

          <p>
            Opinionated, agile (code is easy to change) framework for
            algorithmic art. See my{" "}
            <a
              href="https://www.amimetic.co.uk/art/"
              className="text-blue-700 underline"
            >
              essays
            </a>{" "}
            for research/plans that went into this!
          </p>
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
              procedural when pragmatic; make it easy to explore/change your
              mind.
            </li>
          </ul>
          <h1>Tutorial</h1>

          <p>
            Let&apos;s make the animated logo thing above to learn about how to
            use Solandra. Let&apos;s start with the background. The only way to
            do colours in Solandra is via HSL(A). Hue (0-360), Saturation
            (0-100) and Brightness (0-100). Oh and alpha (0-1). RGB is for
            computers not for you.
          </p>

          <p>
            Every sketch is just a function on the main Solandra object (here
            called p). So we get friendly autocompletion.
          </p>

          <CodeAndSketch
            code={`p.background(220, 26, 14)`}
            sketch={(p) => {
              p.background(220, 26, 14)
            }}
          />

          <p>
            That&apos;s a bit boring. Let&apos;s draw something. First we set a
            fill colour. Then we use a fill call (to draw lines use draw
            instead). Solandra comes with loads of standard built in shapes,
            with clear, declarative APIs (you describe the shape).
          </p>

          <CodeAndSketch
            code={`p.setFillColor(220, 54, 50)
p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))`}
            sketch={(p) => {
              p.background(220, 26, 14)
              p.setFillColor(220, 54, 50)
              p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))
            }}
          />

          <p>
            What did we learn? Points are always of the form: [x,y]. We use
            short names for common things (like width, w).
          </p>

          <p>
            Let&apos;s draw many shapes. But we&apos;ll make the computer do the
            hard bit. What if we could just ask it to tile our canvas? We can.
          </p>

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

          <p>
            First we configure out tiling: 10 tiles across, square shape.
            Let&apos;s add a margin (that would be really tedious by hand).
          </p>

          <p>
            Now let&apos;s use our tiling. That&apos;s a lot of arguments. But
            it doesn&apos;t matter. TypeScript keeps track of them. They are the
            position, tile size, tile centre and iteration count. We&apos;ll use
            the last one to pick a colour.
          </p>

          <p>
            Let&apos;s draw polygons instead. Instead of tiling, let&apos;s move
            across our canvas. The API is basically the same. Configuration goes
            first (we can then easily tweak it).
          </p>

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

          <p>
            We need one more thing before we can finish our drawing: time. But
            it is really easy, usually just p.t gives the time in seconds. We
            throw in some trigonometric stuff to make look more organic and:
          </p>

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

          <p>
            Okay so let&apos;s put everything together and draw our animated
            logo.
          </p>

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
            sketch={logoForDemo}
            playing
          />

          <h1>Examples</h1>

          <ExampleLinks />

          <h1>Other Platforms</h1>

          <p>
            You can also use a version of solandra for SVG rendering and with
            Flutter.
          </p>

          <div className="bg-gray-800 text-white rounded-xl p-4 shadow-lg">
            <h3 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-600 inline-block">
              Solandra Flutter
            </h3>
            <p>
              Flutter is a cross platform framework for creating applications.
              You can make native iOS, Android, Mac, Windows and Linux Apps. You
              can also deploy to the web. Unlike most native app development
              environments it supports hot (stateful) reload; which is great for
              working on interactive applications.
            </p>

            <a
              href="https://solandra-flutter.netlify.app/#/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/solandra-flutter.png"
                alt="Example of Solandra Flutter App"
                className="max-w-md m-auto"
              />
            </a>

            <div className="flex flex-col mt-4">
              <a
                href="https://github.com/jamesporter/solandra-flutter"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-amber-400 to-rose-500 hover:text-sky-900 rounded-lg"
              >
                <CodeIcon className="h-8 w-8" />
                Documentation and Source Code
              </a>

              <a
                href="https://pub.dev/packages/solandra"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-amber-400 to-rose-500 hover:text-sky-900 rounded-lg"
              >
                <DownloadIcon className="h-8 w-8" />
                Dart Package on Pub
              </a>
            </div>
          </div>

          <div className="bg-sky-800 text-white rounded-xl p-4 shadow-lg mt-8">
            <h3 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500 inline-block">
              Solandra SVG
            </h3>
            <p>
              Solandra SVG allows for the creation of vector graphics with many
              of Solandra's APIs. I created it to make images for plotters and
              experimented with a fluent/chained API.
            </p>

            <a
              href="https://solandra-svg.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              <SVGSketch
                sketch={(s) => {
                  s.times(40, () => {
                    s.strokedPath((attr) =>
                      attr.fill(s.sample([220, 210, 320, 175]), 90, 50, 0.1)
                    )
                      .moveTo(s.randomPoint())
                      .arcTo(s.randomPoint())
                  })
                }}
                width={100}
                height={100}
                className="max-w-md m-auto w-full bg-white"
              />
            </a>

            <div className="flex flex-col mt-4">
              <a
                href="https://github.com/jamesporter/solandra-svg"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-emerald-400 to-sky-500  rounded-lg"
              >
                <CodeIcon className="h-8 w-8" />
                Source Code
              </a>

              <a
                href="https://solandra-svg.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-emerald-400 to-sky-500  rounded-lg"
              >
                <InformationCircleIcon className="h-8 w-8" />
                Documentation
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}

export default Home
