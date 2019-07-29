import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Main } from "../app/pages/Main"

const IndexPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art" />
    <Main />
  </Layout>
)

export default IndexPage
