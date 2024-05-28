import Link from "next/link"
import React from "react"

const links = [
  {
    href: "/docs/introduction",
    name: "Docs",
    basePath: "/docs",
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
    <div className="bg-emerald-700 px-8 flex flex-row items-center">
      <Link href="/" legacyBehavior>
        <a className="text-white font-bold hover:text-sky-100 p-4 text-xl">
          Solandra
        </a>
      </Link>
      {links.map((link, i) => {
        return (
          <Link href={link.href} key={i} legacyBehavior>
            <a className="text-white font-bold hover:text-emerald-200 p-4">
              {link.name}
            </a>
          </Link>
        )
      })}
    </div>
  )
}
