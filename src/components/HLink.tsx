import React from "react"
import Link from "next/link"

const HLink = ({ children, to }) => (
  <Link
    className="text-blue-200 text-md px-4 hover:text-blue-500 w-32 p-2 main-link text-center"
    href={to}
    activeClassName="active-link"
  >
    {children}
  </Link>
)

export const HUrl = ({ children, to }) => (
  <a
    className="text-blue-200 text-md px-4 hover:text-blue-500 w-32 p-2 main-link text-center"
    href={to}
  >
    {children}
  </a>
)

export default HLink
