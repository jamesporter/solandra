import React from "react"
import "./layout.css"

const Layout = ({ children }) => {
  return <main className="flex flex-col w-screen h-screen">{children}</main>
}

export default Layout
