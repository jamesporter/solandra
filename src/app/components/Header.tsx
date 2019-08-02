import React from "react"
import HLink, { HUrl } from "./HLink"

export default function Header() {
  return (
    <div className="bg-gray-900 px-8 flex flex-row">
      <HLink to="/">Solandra</HLink>
      <HLink to="/main">Examples</HLink>
      <HLink to="/viewAll">Slides</HLink>
      <HLink to="/quickstart">Start</HLink>
      <HUrl to="https://github.com/jamesporter/solandra/tree/master/docs">
        Docs
      </HUrl>
    </div>
  )
}
