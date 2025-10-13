import React from "react"
import Link from "next/link"

const HLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link
    href={to}
    className="text-white font-bold text-md px-4 hover:text-sky-200 p-2 text-center"
  >
    {children}
  </Link>
)

export default HLink
