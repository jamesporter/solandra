import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { H1, P } from "../app/components/Text"
import Header from "../app/components/Header"
import Container from "../app/components/Container"

const QuickStart = () => (
  <Layout>
    <Header />
    <SEO title="Solandra Algorithmic Art" />

    <Container>
      <H1>Quickstart</H1>
      <ul className="list-inside list-disc">
        <li className="pb-2">
          Probably best to clone this project to try out as add React powered
          GUI around stuff.
        </li>
        <li className="pb-2">
          On CodeSandbox, quickly get started:{" "}
          <a href="https://codesandbox.io/embed/festive-boyd-db9n3">
            Simple editable sketch
          </a>
        </li>
        <li className="pb-2">
          On <a href="https://www.npmjs.com/package/typeplates">NPM</a>. Install
          with <span className="text-gray-500 font-mono">npm i solandra</span>{" "}
          or <span className="text-gray-500 font-mono">yarn add solandra</span>.
        </li>
      </ul>
    </Container>
  </Layout>
)

export default QuickStart
