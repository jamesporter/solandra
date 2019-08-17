import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Main } from "../app/pages/Main"

const MainPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art: Highlights" />
    <Main category="Highlights" />
  </Layout>
)

export default MainPage
