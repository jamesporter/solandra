import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewAll from "../app/pages/ViewAll"

const ViewPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art" />
    <div className="flex flex-col w-screen h-screen">
      <ViewAll playing />
    </div>
  </Layout>
)

export default ViewPage
