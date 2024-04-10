import Link from "next/link"
import { ViewAll } from "../src/components/ViewAll"
import { LinearGradient, Path, SCanvas } from "../src/lib"
import { Canvas } from "../src/components/Canvas"
import Header from "../src/components/Header"
import Footer from "../src/components/Footer"
import { TutorialCards } from "../src/components/TutorialCards"

const QuickStart = () => (
  <>
    <Header />

    <div className="mx-auto p-4 max-w-3xl article-page">
      <h1>Getting Started</h1>

      <h2>Examples</h2>

      <div className="w-full bg-gray-100 rounded-xl flex flex-col items-center h-[480px] overflow-hidden shadow-md">
        <div className="h-96 w-full flex flex-col bg-white">
          <ViewAll />
        </div>

        <p className="p-4">
          Recommended:{" "}
          <Link href="/main" className="text-blue-700 underline">
            over 100 examples with source code to learn from (click on the
            Source Code button).
          </Link>
        </p>
      </div>

      <h2>Other Tutorials</h2>
      <TutorialCards />

      <h2>Talks</h2>

      <p>
        On 28th October 2019, I gave a workshop/talk on Solandra which{" "}
        <a href="https://algorithmicartmeetup.blogspot.com/2019/10/solandra-hands-on-tutorial-emergent.html">
          Tariq Rashid wrote up as a introductory tutorial
        </a>
        .
      </p>

      <p>
        On 6th November 2019 I&apos;ll gave a talk about TypeScript and Solandra
        (at the London TypeScript Meetup).
      </p>

      <p>
        On 15th November 2019 I covered why I created Solandra and the
        ideas/principles behind it at London Creative Code.
      </p>

      <h2>Code</h2>
      <p>
        Solandra Codesandbox (uses React, though other frameworks would be very
        similar):{" "}
        <a href="https://codesandbox.io/p/sandbox/solandra-0-18-react-example-ll5gjg">
          Solandra CodeSandbox v0.18
        </a>
        .
      </p>

      <p>
        To start coding: clone{" "}
        <a href="https://github.com/jamesporter/solandra">this project</a> to
        try out as add React/NextJS powered GUI around stuff.
      </p>
      <p>
        On <a href="https://www.npmjs.com/package/solandra">NPM</a>. Install
        with <span className="text-gray-500 font-mono">npm i solandra</span> or{" "}
        <span className="text-gray-500 font-mono">yarn add solandra</span>.
      </p>
      <div className="start-item-text">
        There is a React wrapper for those using the most popular front end
        framework, install from{" "}
        <a href="https://www.npmjs.com/package/solandra-react">NPM</a> with{" "}
        <span className="text-gray-500 font-mono">
          npm i solandra-react solandra react react-dom
        </span>{" "}
        or{" "}
        <span className="text-gray-500 font-mono">
          yarn add solandra-react solandra react react-dom
        </span>
        .
      </div>

      <div className="flex flex-col" style={{ height: 640 }}>
        <Canvas
          seed={8}
          playing
          sketch={(p: SCanvas) => {
            p.backgroundGradient(
              new LinearGradient({
                from: [0, 0],
                to: [0, p.meta.bottom],
                colors: [
                  [0, { h: 215, s: 30, l: 35 }],
                  [1, { h: 230, s: 30, l: 20 }],
                ],
              })
            )

            const n = Math.floor(50 * (1 + Math.sin(p.t * 0.8)))

            p.forVertical(
              { n: 100, margin: 0.15 },
              ([x, y], [dX, dY], c, i) => {
                const revCounts = parseInt(
                  i
                    .toString()
                    .split("")
                    .map((i) => parseInt(i))
                    .reverse()
                    .join("")
                )
                if (revCounts >= n) return

                const h = p.gaussian({
                  mean: dY,
                  sd: (1.5 * dY) / p.meta.bottom,
                })
                const curveSize = p.gaussian({ sd: 0.25 * p.meta.right })
                const xOffset = p.gaussian({ sd: dX / 25 })

                const h1 = p.uniformRandomInt({ from: 280, to: 350 })
                const h2 = p.uniformRandomInt({ from: 0, to: 30 })

                p.setFillGradient(
                  new LinearGradient({
                    from: [x + xOffset, y],
                    to: [x + dX + xOffset, y + dY],
                    colors: [
                      [0, { h: h1, s: 60, l: 65, a: 0 }],
                      [0.05, { h: h1, s: 60, l: 65, a: 0 }],
                      [0.1, { h: h1, s: 60, l: 65, a: 0.8 }],
                      [
                        0.5,
                        {
                          h: p.gaussian({ mean: 10 }) + (h1 + h2) / 2,
                          s: 60,
                          l: 65,
                          a: 0.7,
                        },
                      ],
                      [0.9, { h: h2, s: 60, l: 65, a: 0.8 }],
                      [0.95, { h: h2, s: 60, l: 65, a: 0 }],
                      [1, { h: h2, s: 60, l: 65, a: 0 }],
                    ],
                  })
                )
                p.fill(
                  Path.startAt([x, y])
                    .addCurveTo([x + dX, y], { curveSize })
                    .addLineTo([x + dX, y + h])
                    .addCurveTo([x, y + h], { curveSize, polarlity: -1 })
                    .addLineTo([x, y])
                )
              }
            )
          }}
        />
      </div>
    </div>

    <Footer />
  </>
)

export default QuickStart
