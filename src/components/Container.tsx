import React from "react"

export default function({
  children,
  minHeight,
}: {
  children
  minHeight?: string
}) {
  return (
    <div
      className="flex flex-col m-auto mt-8 px-8"
      style={{ maxWidth: 800, minHeight }}
    >
      {children}
    </div>
  )
}
