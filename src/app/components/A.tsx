import React from "react"

export default function A({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <a className="text-blue-700 underline" href={href}>
      {children}
    </a>
  )
}
