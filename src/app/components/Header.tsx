import React from "react"
import { Link } from "gatsby"
import HLink from "./HLink"

export default function Header() {
  return (
    <div className="bg-gray-900 px-8 py-4">
      <p className="text-gray-700 text-base">
        <Link to="/">
          <span className="font-bold text-xl mb-2 mr-4 text-white hover:text-blue-200">
            Solandra
          </span>
        </Link>
        <span className="hidden md:inline text-gray-200">
          A simple, modern TypeScript-first Algorithmic Art Tool
        </span>
        <HLink to="/main">Examples</HLink>
        <HLink to="/viewAll">Slideshow</HLink>
      </p>
    </div>
  )
}
