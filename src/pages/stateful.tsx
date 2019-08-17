import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Stateful from "../app/pages/Stateful"

const MainPage = () => (
  <Layout>
    <SEO title="Solandra Algorithmic Art: Randomness and Noise" />
    <Stateful />
  </Layout>
)

export default MainPage
