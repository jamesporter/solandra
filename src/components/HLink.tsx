import React from "react"
import Link from "next/link"

const HLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link href={to}>
    <a className="text-sky-200 text-md px-4 hover:text-sky-500 w-32 p-2 main-link text-center">
      {children}
    </a>
  </Link>
)

export const HUrl = ({
  children,
  to,
}: {
  children: React.ReactNode
  to: string
}) => (
  <a href={to}>
    <a className="text-sky-200 text-md px-4 hover:text-sky-500 w-32 p-2 main-link text-center">
      {children}
    </a>
  </a>
)

export default HLink
