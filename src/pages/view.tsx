import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewSingle from "../app/pages/ViewSingle"

const IndexPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art" />
    <ViewSingle />
  </Layout>
)

export default IndexPage
