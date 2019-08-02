import React from "react"
import { Link } from "gatsby"
import HLink, { HUrl } from "./HLink"

export default function Header() {
  return (
    <div className="bg-gray-900 px-8 py-4">
      <HLink to="/">Solandra</HLink>
      <HLink to="/main">Examples</HLink>
      <HLink to="/viewAll">Slideshow</HLink>
      <HLink to="/quickstart">Quick Start</HLink>
      <HUrl to="https://github.com/jamesporter/solandra/docs">Docs</HUrl>
    </div>
  )
}
