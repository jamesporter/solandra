import React from "react"
import Container from "./Container"

export default function Footer() {
  return (
    <div className="bg-gray-900 px-8 pt-4 flex flex-col">
      <Container>
        <p className="text-xl mb-2 mr-4 text-white text-center">
          Solandra was made by{" "}
          <a className="text-blue-400 " href="https://www.amimetic.co.uk">
            James Porter
          </a>
          .
        </p>{" "}
        <p className="text-xl mb-2 mr-4 text-white text-center">
          Check out the{" "}
          <a
            className="text-blue-400 "
            href="https://github.com/jamesporter/solandra"
          >
            GitHub page
          </a>{" "}
          or install with{" "}
          <span className="text-gray-400 font-mono">npm i solandra</span>
        </p>
      </Container>
    </div>
  )
}
