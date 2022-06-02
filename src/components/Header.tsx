import Link from "next/link"
import React from "react"

export default function Header() {
  return (
    <div className="bg-rose-700 px-8 flex flex-row items-center">
      <Link href="/">
        <a className="text-white font-bold hover:text-sky-100 p-4 text-xl">
          Solandra
        </a>
      </Link>
      <Link href="/main">
        <a className="text-white font-bold hover:text-rose-200 p-4">Examples</a>
      </Link>
      <Link href="/viewAll">
        <a className="text-white font-bold hover:text-rose-200 p-4">Slides</a>
      </Link>
      <Link href="/quickstart">
        <a className="text-white font-bold hover:text-rose-200 p-4">Start</a>
      </Link>
    </div>
  )
}
