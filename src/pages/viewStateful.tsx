import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewStateful from "../app/pages/ViewStateful"

const ViewPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art" />
    <ViewStateful />
  </Layout>
)

export default ViewPage
