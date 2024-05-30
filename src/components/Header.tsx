import Link from "next/link"
import React from "react"

export const headerLinks = [
  {
    href: "/docs/quickstart",
    name: "Start",
  },
  {
    href: "/docs/introduction",
    name: "Docs (Preview)",
  },
  {
    href: "/main",
    name: "Examples",
  },
  {
    href: "/viewAll",
    name: "Slides",
  },
]

export default function Header() {
  return (
    <div className="bg-gradient-to-b from-emerald-500  to-emerald-600 px-8 flex flex-row items-center">
      <Link href="/" legacyBehavior>
        <a className="text-white font-bold hover:text-sky-100 p-4 text-xl drop-shadow-sm">
          Solandra
        </a>
      </Link>
      {headerLinks.map((link, i) => {
        return (
          <Link href={link.href} key={i} legacyBehavior>
            <a className="text-white font-bold hover:text-emerald-200 p-4 drop-shadow-sm">
              {link.name}
            </a>
          </Link>
        )
      })}
    </div>
  )
}
