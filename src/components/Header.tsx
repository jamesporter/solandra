import { SearchIcon } from "@heroicons/react/outline"
import Link from "next/link"
import React from "react"
import { useCommandMenu, useIsApple } from "./CommandMenu"

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
      <SearchButton />
    </div>
  )
}

function SearchButton() {
  const { open } = useCommandMenu()
  const isApple = useIsApple()

  return (
    <button
      onClick={open}
      aria-label="Search Solandra"
      className="flex flex-row items-center gap-2 text-white font-semibold hover:text-emerald-200 p-2 md:px-4 drop-shadow-sm text-sm md:text-base md:ml-auto"
    >
      <SearchIcon className="h-4 w-4" />
      Search
      <span className="rounded-sm bg-emerald-400/60 px-1.5 py-0.5 text-xs font-mono max-sm:hidden">
        {isApple ? "⌘" : "Ctrl"} K
      </span>
    </button>
  )
}
