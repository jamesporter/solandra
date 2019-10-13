import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { H1, H2, P } from "../app/components/Text"
import Header from "../app/components/Header"
import Container from "../app/components/Container"
import { Link } from "gatsby"
import A from "../app/components/A"
import Canvas from "../app/Canvas"
import { SCanvas, LinearGradient, Path } from "../lib"
import Footer from "../app/components/Footer"

import imgIcons from "../images/icons.png"
import imgSol from "../images/sol.png"
import imgWall from "../images/wallpaper.png"
import imgWater from "../images/watercolour.png"
import ViewAll from "../app/pages/ViewAll"

const QuickStart = () => (
  <Layout>
    <Header />
    <SEO title="Solandra Algorithmic Art" />

    <Container minHeight="calc(100vh - 260px)">
      <H1>Getting Started</H1>

      <H2>Examples and Tutorials</H2>
      <div className="start-item">
        <div
          style={{
            width: 340,
            height: 340,
            padding: 10,
            margin: "auto",
            marginTop: 20,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
          }}
          className="shadow-2xl select-none"
        >
          <ViewAll />
        </div>
        Recommended:{" "}
        <Link to="/main" className="text-blue-700 underline">
          over 100 examples with source code to learn from (click on the Source
          Code button)
        </Link>
      </div>
      <div className="start-item">
        <img
          src={imgSol}
          alt="Sol LeWitt Solandra Tutorial"
          className="shadow-2xl"
        />
        Or an{" "}
        <A href="https://www.amimetic.co.uk/art/solving-sol-with-solandra">
          unconventional tutorial introduction based on instructions from Sol
          LeWitt
        </A>
      </div>
      <div className="start-item">
        <img src={imgIcons} alt="Icon design" className="shadow-2xl" />
        This tutorial shows how you might use Solandra as a way to do{" "}
        <A href="https://www.amimetic.co.uk/art/generative-icon-design-a-solandra-tutorial/">
          Generative design for App Icons
        </A>
      </div>
      <div className="start-item">
        <img
          src={imgWall}
          alt="Wallpaper Solandra Tutorial"
          className="shadow-2xl"
        />
        Alternatively, why not{" "}
        <A href="https://www.amimetic.co.uk/art/apple-style-wallpaper/">
          create iOS 13 style wallpapers with Solandra
        </A>
        .
      </div>

      <div className="start-item">
        <img
          src={imgWater}
          alt="Watercolours with Solandra"
          className="shadow-2xl"
        />
        Create{" "}
        <A href="https://www.amimetic.co.uk/art/watercolour">
          watercolour style
        </A>{" "}
        graphics with Solandra.
      </div>
      <H2>Code</H2>
      <div className="start-item-text">
        On CodeSandbox, quickly get started:{" "}
        <A href="https://codesandbox.io/s/simple-solandra-example-2-wy7nx?fontsize=14">
          {" "}
          Simple editable sketch
        </A>
      </div>

      <div className="start-item-text">
        You can get a{" "}
        <A href="https://github.com/jamesporter/solandra/tree/master/src/docs/cheat-sheet.md">
          markdown cheat sheet
        </A>{" "}
        or{" "}
        <A href="https://github.com/jamesporter/solandra/tree/master/src/docs/cheat-sheet.pdf">
          PDF cheat sheet (for printing)
        </A>
        .
      </div>

      <div className="start-item-text">
        To start coding: clone{" "}
        <A href="https://github.com/jamesporter/solandra">this project</A> to
        try out as add React/Gatsby powered GUI around stuff.
      </div>
      <div className="start-item-text">
        On <A href="https://www.npmjs.com/package/solandra">NPM</A>. Install
        with <span className="text-gray-500 font-mono">npm i solandra</span> or{" "}
        <span className="text-gray-500 font-mono">yarn add solandra</span>.
      </div>
      <div className="start-item-text">
        There is a React wrapper for those using the most popular front end
        framework, install from{" "}
        <A href="https://www.npmjs.com/package/solandra-react">NPM</A> with{" "}
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
    </Container>
    <Footer />
  </Layout>
)

export default QuickStart
