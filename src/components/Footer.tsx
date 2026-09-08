import React from "react"
import Container from "./Container"

export default function Footer() {
  return (
    <div className="bg-emerald-800 dark:bg-emerald-900 p-4 md:p-16 flex flex-col">
      <Container>
        <p className="text-xl mb-2 mr-4 text-emerald-50 text-center">
          Solandra was made by{" "}
          <a
            className="text-white font-bold hover:text-emerald-200"
            href="https://www.amimetic.co.uk"
          >
            James Porter
          </a>
          .
        </p>{" "}
        <p className="text-xl mb-2 mr-4 text-emerald-50 text-center">
          Check out the{" "}
          <a
            className="text-white font-bold hover:text-emerald-200"
            href="https://github.com/jamesporter/solandra"
          >
            GitHub page
          </a>{" "}
          or install with{" "}
          <span className="text-emerald-100 font-mono">npm i solandra</span>
        </p>
      </Container>
    </div>
  )
}
