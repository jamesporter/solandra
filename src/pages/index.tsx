import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Canvas from "../app/Canvas"
import { RegularPolygon, Rect } from "../lib"
import ViewAll from "../app/pages/ViewAll"
import { H2, H3, P } from "../app/components/Text"
import CodeAndSketch from "../app/components/CodeAndSketch"

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
        <Canvas
          sketch={p => {
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
          }}
          seed={1}
          noShadow
          playing
        />
      </div>

      <div className="bg-gray-900 px-8 py-4 flex flex-col">
        <h1 className="font-bold text-4xl mb-2 mr-4 text-white text-center">
          Solandra
        </h1>
        <H2 tw="text-gray-400">
          A simple, modern TypeScript-first Algorithmic Art Tool
        </H2>
      </div>

      <div className="flex flex-col m-auto mt-8 px-8" style={{ maxWidth: 800 }}>
        <div
          style={{
            width: "100%",
            maxWidth: "640px",
            height: "32rem",
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
          }}
        >
          <ViewAll />
        </div>
        <H3 tw="py-2">Use Arrow keys or click to navigate</H3>

        <H2>Let's get started</H2>
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
          sketch={p => {
            p.background(220, 26, 14)
          }}
        />

        <P>That's a bit boring. Let's draw something.</P>

        <CodeAndSketch
          sketch={p => {
            p.background(220, 26, 14)
            p.setFillColour(220, 54, 50)
            p.fill(new Rect({ at: [0.2, 0.2], w: 0.6, h: 0.4 }))
          }}
        />
      </div>
    </div>
  </Layout>
)

export default IndexPage
