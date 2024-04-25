import clsx from "clsx"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"

import Heading from "@theme/Heading"

import styles from "./index.module.css"
import { Logo } from "../components/Logo"
import { ViewAll } from "../components/ViewAll"

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Tutorials/Tutorials/Basics"
          >
            Solandra Tutorial
          </Link>
        </div>

        <Logo />
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`Solandra`} description="TypeScript first creative coding">
      <HomepageHeader />
      <main>
        <ViewAll />
      </main>
    </Layout>
  )
}
