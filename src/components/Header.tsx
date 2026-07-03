import Link from "next/link"
import React from "react"

export const headerLinks = [
  {
    href: "/main",
    name: "Examples",
  },
  {
    href: "/docs/introduction",
    name: "Docs",
  },
  {
    href: "/viewAll",
    name: "Slides",
  },
]

export default function Header() {
  return (
    <div className="bg-gradient-to-b from-emerald-500  to-emerald-600 px-8 flex flex-col md:flex-row items-center max-sm:py-2 print:hidden">
      <Link
        href="/"
        className="text-white font-bold hover:text-sky-100 p-2 md:p-4 text-xl drop-shadow-sm"
      >
        Solandra
      </Link>
      {headerLinks.map((link, i) => {
        return (
          <Link
            href={link.href}
            key={i}
            className="text-white font-semibold hover:text-emerald-200 p-2 md:p-4 drop-shadow-sm text-sm md:text-base"
          >
            {link.name}
          </Link>
        )
      })}
      <a
        href="/solandra-book.epub"
        download
        className="text-white font-semibold hover:text-emerald-200 p-2 md:p-4 drop-shadow-sm text-sm md:text-base"
      >
        Download Book
      </a>
    </div>
  )
}
