import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { H1, P } from "../app/components/Text"
import Header from "../app/components/Header"
import Container from "../app/components/Container"
import { Link } from "gatsby"

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
          To start coding: clone{" "}
          <a
            className="text-blue-700 underline"
            href="https://github.com/jamesporter/solandra"
          >
            this project
          </a>{" "}
          to try out as add React/Gatsby powered GUI around stuff.
        </li>
        <li className="pb-2">
          On CodeSandbox, quickly get started:{" "}
          <a
            className="text-blue-700 underline"
            href="https://codesandbox.io/s/simple-solandra-example-2-wy7nx?fontsize=14"
          >
            {" "}
            Simple editable sketch
          </a>
        </li>
        <li className="pb-2">
          On{" "}
          <a
            className="text-blue-700 underline"
            href="https://www.npmjs.com/package/typeplates"
          >
            NPM
          </a>
          . Install with{" "}
          <span className="text-gray-500 font-mono">npm i solandra</span> or{" "}
          <span className="text-gray-500 font-mono">yarn add solandra</span>.
        </li>
      </ul>
    </Container>
  </Layout>
)

export default QuickStart
