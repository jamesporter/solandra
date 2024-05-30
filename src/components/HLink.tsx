import React from "react"
import Link from "next/link"

const HLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link href={to} legacyBehavior>
    <a className="text-white font-bold text-md px-4 hover:text-sky-200 p-2 text-center">
      {children}
    </a>
  </Link>
)

export default HLink
