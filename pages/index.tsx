import type { NextPage } from "next"
import Head from "next/head"

// import CodeAndSketch from "../src/components/CodeAndSketch"
import ExampleLinks from "../src/components/ExampleLinks"
import Footer from "../src/components/Footer"
import HLink from "../src/components/HLink"
import { ViewAll } from "../src/components/ViewAll"

import { ArrowsExpandIcon } from "@heroicons/react/outline"
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
        <div className="bg-gradient-to-b from-emerald-400  to-sky-900 py-4 overflow-hidden">
          <Logo />

          <div className="px-8 pt-4 flex flex-col">
            <h1 className="font-bold text-6xl mb-2 mr-4  text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 inline-block drop-shadow-md">
              Solandra
            </h1>
            <h2 className="text-sky-100 text-center text-[calc(max(4vh,16px))] drop-shadow-md">
              Modern TypeScript-first Creative Coding
            </h2>
            <div className="flex flex-row justify-center pt-4">
              {headerLinks.map(({ href, name }, i) => (
                <HLink to={href}>{name}</HLink>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto p-4 max-w-3xl article-page">
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

            <Link href="/viewAll" legacyBehavior>
              <a className="absolute bottom-0 right-0 bg-slate-800  bg-opacity-30 hover:bg-opacity-60 rounded-tl-xl">
                <ArrowsExpandIcon className="text-white h-6 w-6 m-2" />
              </a>
            </Link>
          </div>

          <p className="py-2 pb-8 text-sm text-center">
            Use Arrow keys or click to navigate
          </p>

          <h2>Principles</h2>

          <p>
            Opinionated, agile (code is easy to change) framework for
            algorithmic art. See my{" "}
            <a
              href="https://www.amimetic.co.uk/art/"
              className="text-blue-700 underline"
            >
              essays
            </a>{" "}
            for research/plans that went into this.
          </p>
          <ul className="list-inside list-disc">
            <li className="pb-1">
              Leverage TypeScript: you shouldn&apos;t need to learn much,
              autocomplete and type checking should have your back.
            </li>
            <li className="pb-1">Not for beginners.</li>
            <li className="pb-1">
              Control flow at level of drawing (tiling, partitions etc).
            </li>
            <li className="pb-1">Performance is not the goal.</li>
            <li className="pb-1">
              Common algorithmic art things (e.g. randomness) should be easy.
            </li>
            <li className="pb-1">Should feel fun/powerful.</li>
            <li className="pb-1">Life is too short to compile things.</li>
            <li className="pb-1">Rethink standard APIs</li>
            <li className="pb-1">
              Declarative when possible (especially anything configuration-y),
              procedural when pragmatic; make it easy to explore/change your
              mind.
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
              Novel curve drawing API, as standard bezier curve APIs make
              absolutely no sense for humans to think about.
            </li>
          </ul>

          <h2>Tutorial</h2>

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

          <One />

          <p>
            That&apos;s a bit boring. Let&apos;s draw something. First we set a
            fill colour. Then we use a fill call (to draw lines use draw
            instead). Solandra comes with loads of standard built in shapes,
            with clear, declarative APIs (you describe the shape).
          </p>

          <Two />

          <p>
            What did we learn? Points are always of the form: [x,y]. We use
            short names for common things (like width, w).
          </p>

          <p>
            Let&apos;s draw many shapes. But we&apos;ll make the computer do the
            hard bit. What if we could just ask it to tile our canvas? We can.
          </p>

          <Three />

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

          <Four />

          <p>
            We need one more thing before we can finish our drawing: time. But
            it is really easy, usually just p.t gives the time in seconds. We
            throw in some trigonometric stuff to make look more organic and:
          </p>

          <Five />

          <p>
            Okay so let&apos;s put everything together and draw our animated
            logo.
          </p>

          <Six />

          <h2>Examples</h2>

          <p>
            This website has loads of examples of using Solandra, all with
            source code.
          </p>

          <ExampleLinks />

          <h2>Other Platforms</h2>
          <Link
            href={"/other-platforms"}
            className="font-bold text-emerald-600 hover:text-sky-500"
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
