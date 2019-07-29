import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewAll from "../app/pages/ViewAll"

const ViewPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art" />
    <ViewAll />
  </Layout>
)

export default ViewPage
