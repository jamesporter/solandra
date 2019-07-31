import React from "react"
import { Link } from "gatsby"

const HLink = ({ children, to }) => (
  <Link
    className="text-blue-200 text-xl px-4 hover:text-blue-500 w-48 p-4 main-link text-center"
    to={to}
  >
    {children}
  </Link>
)

export default HLink
