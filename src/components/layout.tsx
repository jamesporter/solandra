import React from "react"
import "./layout.css"

const Layout = ({ children }) => {
  return <main className="flex flex-col">{children}</main>
}

export default Layout
