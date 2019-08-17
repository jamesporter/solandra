import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { H1, P } from "../app/components/Text"
import Header from "../app/components/Header"
import Container from "../app/components/Container"
import { Link } from "gatsby"
import A from "../app/components/A"
import Canvas from "../app/Canvas"
import { SCanvas, LinearGradient, Path } from "../lib"

const QuickStart = () => (
  <Layout>
    <Header />
    <SEO title="Solandra Algorithmic Art" />

    <Container>
      <H1>Quickstart</H1>
      <ul className="list-inside list-disc">
        <li className="pb-2">
          Recommended:{" "}
          <Link to="/main" className="text-blue-700 underline">
            loads of examples with source code to learn from
          </Link>
        </li>
        <li className="pb-2">
          Or an{" "}
          <A href="https://www.amimetic.co.uk/art/solving-sol-with-solandra">
            unconventional tutorial introduction based on instructions from Sol
            LeWitt
          </A>
        </li>
        <li className="pb-2">
          On CodeSandbox, quickly get started:{" "}
          <A href="https://codesandbox.io/s/simple-solandra-example-2-wy7nx?fontsize=14">
            {" "}
            Simple editable sketch
          </A>
        </li>
        <li className="pb-2">
          To start coding: clone{" "}
          <A href="https://github.com/jamesporter/solandra">this project</A> to
          try out as add React/Gatsby powered GUI around stuff.
        </li>
        <li className="pb-2">
          On <A href="https://www.npmjs.com/package/typeplates">NPM</A>. Install
          with <span className="text-gray-500 font-mono">npm i solandra</span>{" "}
          or <span className="text-gray-500 font-mono">yarn add solandra</span>.
        </li>
      </ul>

      <div className="flex flex-col" style={{ height: 640 }}>
        <Canvas
          seed={8}
          playing
          sketch={(p: SCanvas) => {
            p.backgroundGradient(
              new LinearGradient({
                from: [0, 0],
                to: [0, p.meta.bottom],
                colours: [
                  [0, { h: 215, s: 30, l: 35 }],
                  [1, { h: 230, s: 30, l: 20 }],
                ],
              })
            )

            const n = Math.floor(50 * (1 + Math.sin(p.t * 0.5)))

            p.forVertical(
              { n: 100, margin: 0.15 },
              ([x, y], [dX, dY], c, i) => {
                const revCounts = parseInt(
                  i
                    .toString()
                    .split("")
                    .map(i => parseInt(i))
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
                    colours: [
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
    </Container>
  </Layout>
)

export default QuickStart
