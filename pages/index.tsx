import type { NextPage } from "next"
import Head from "next/head"

import ExampleLinks from "../src/components/ExampleLinks"
import Footer from "../src/components/Footer"
import HLink from "../src/components/HLink"
import { ViewAll } from "../src/components/ViewAll"

import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Logo } from "../src/components/Logo"
import {
  Five,
  Four,
  One,
  Six,
  Three,
  Two,
} from "../src/components/CodeAndSketchExamples"
import { headerLinks } from "../src/components/Header"
import { useCommandMenu, useIsApple } from "../src/components/CommandMenu"
import { ThemeSwitcher } from "../src/components/ThemeSwitcher"

function HeroSearchLink() {
  const { open } = useCommandMenu()
  const isApple = useIsApple()

  return (
    <button
      onClick={open}
      aria-label="Search Solandra"
      className="text-white font-bold text-md px-4 py-2 ml-2 rounded-lg bg-white/10 hover:bg-white/20 ring-1 ring-white/20 hover:text-sky-200 text-center"
    >
      Search{" "}
      <span className="font-mono text-sky-100">{isApple ? "⌘" : "Ctrl"} K</span>
    </button>
  )
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
        <div className="relative bg-gradient-to-b from-emerald-400 to-sky-900 dark:from-emerald-800 dark:to-sky-950 py-4 overflow-hidden">
          <ThemeSwitcher className="absolute top-3 right-3 z-10" />

          <Logo />

          <div className="px-8 pt-4 flex flex-col">
            <h1 className="font-bold text-6xl mb-2 mr-4  text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 inline-block drop-shadow-md">
              Solandra
            </h1>
            <h2 className="text-sky-100 text-center text-[calc(max(4vh,16px))] drop-shadow-md">
              A human friendly framework for creative coding with TypeScript
            </h2>
            <div className="flex flex-row flex-wrap items-center justify-center pt-4">
              {headerLinks.map(({ href, name }, _i) => (
                <HLink to={href} key={href}>
                  {name}
                </HLink>
              ))}
              <a
                href="/solandra-book.epub"
                download
                className="text-white font-bold text-md px-4 hover:text-sky-200 p-2 text-center"
              >
                Download Book
              </a>
              <HeroSearchLink />
            </div>
          </div>
        </div>

        <div className="mx-auto p-4 max-w-3xl article-page">
          <h2>Start here</h2>

          <ol className="list-decimal list-inside">
            <li>
              <Link
                href="/main"
                className="font-bold text-emerald-600 hover:text-sky-500 dark:text-emerald-400 dark:hover:text-sky-300"
              >
                Browse the examples
              </Link>
              . Each sketch includes its source code.
            </li>
            <li>
              Follow the{" "}
              <Link
                href="/docs/quickstart"
                className="font-bold text-emerald-600 hover:text-sky-500 dark:text-emerald-400 dark:hover:text-sky-300"
              >
                getting started guide
              </Link>
            </li>
            <li>
              For coding assistants, add the{" "}
              <a
                href="https://github.com/jamesporter/solandra/blob/main/llm.md"
                className="font-bold text-emerald-600 hover:text-sky-500 dark:text-emerald-400 dark:hover:text-sky-300"
                target="_blank"
                rel="noreferrer"
              >
                API reference
              </a>{" "}
              to your project.
            </li>
            <li>Or follow the tutorial below to build an animated sketch.</li>
          </ol>

          <h2>Slideshow</h2>
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

            <Link
              href="/viewAll"
              className="absolute bottom-0 right-0 bg-slate-800  bg-opacity-30 hover:bg-opacity-60 rounded-tl-xl"
            >
              <ArrowsPointingOutIcon className="text-white h-6 w-6 m-2" />
            </Link>
          </div>

          <p className="py-2 pb-8 text-sm text-center">
            Use the arrow keys or click to change sketches.
          </p>

          <h2>Principles</h2>

          <p>
            I built Solandra to make sketches easy to change and experiment
            with. My{" "}
            <a
              href="https://www.amimetic.co.uk/art/"
              className="text-blue-700 underline dark:text-sky-400"
            >
              essays
            </a>{" "}
            describe the ideas behind it.
          </p>
          <ul className="list-inside list-disc">
            <li className="pb-1">
              Use TypeScript for autocomplete and type checking.
            </li>
            <li className="pb-1">
              Assume some JavaScript or TypeScript experience.
            </li>
            <li className="pb-1">
              Work with tiles, rows and shapes in drawing loops.
            </li>
            <li className="pb-1">
              Prioritise quick experimentation over rendering speed.
            </li>
            <li className="pb-1">
              Provide helpers for common tasks such as seeded randomness.
            </li>
            <li className="pb-1">
              Describe shapes with configuration objects and draw them with
              ordinary functions and loops.
            </li>
          </ul>

          <h2>Practice</h2>
          <p>Some of the practical implications:</p>

          <ul className="list-inside list-disc">
            <li className="pb-1">
              Sketches always have width 1, height depends on aspect ratio.
            </li>
            <li className="pb-1">Angles in radians.</li>
            <li className="pb-1">Points are [number, number].</li>
            <li className="pb-1">Colours in hsl(a).</li>
            <li className="pb-1">
              Describe curves by their size, direction and shape.
            </li>
          </ul>

          <h2>Tutorial</h2>

          <p>
            Build the animated logo above, starting with its background. Colours
            use HSL: hue (0–360), saturation (0–100) and lightness (0–100), with
            optional alpha (0–1) for opacity.
          </p>

          <p>
            A sketch is a function that takes an SCanvas, called p in these
            examples.
          </p>

          <One />

          <p>
            Set a fill colour, then pass a shape to fill. To stroke its outline,
            use draw instead.
          </p>

          <Two />

          <p>
            Points use [x, y] coordinates. Common options have short names, such
            as w for width.
          </p>

          <p>Use forTiling to repeat the shape across a grid:</p>

          <Three />

          <p>
            The configuration sets ten square tiles across, with a margin around
            the canvas.
          </p>

          <p>
            The callback receives each tile&apos;s position, size, centre and
            index. Here, the index determines its colour.
          </p>

          <p>
            Next, use forHorizontal to draw a row of polygons. It takes the same
            callback arguments as forTiling:
          </p>

          <Four />

          <p>
            Use p.t, the time in seconds, to animate the polygons. Sine and
            cosine make their properties vary smoothly:
          </p>

          <Five />

          <p>Combine these steps to draw the animated logo:</p>

          <Six />

          <h2>Examples</h2>

          <p>Explore more sketches and their source code:</p>

          <ExampleLinks />

          <h2>Other Platforms</h2>
          <Link
            href={"/other-platforms"}
            className="font-bold text-emerald-600 hover:text-sky-500 dark:text-emerald-400 dark:hover:text-sky-300"
          >
            Versions of Solandra are available on other platforms
          </Link>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default Home
