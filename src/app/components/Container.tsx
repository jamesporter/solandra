import React from "react"

export default function({ children }) {
  return (
    <div className="flex flex-col m-auto mt-8 px-8" style={{ maxWidth: 800 }}>
      {children}
    </div>
  )
}
