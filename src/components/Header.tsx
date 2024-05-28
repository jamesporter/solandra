import Link from "next/link"
import { useRouter } from "next/router"
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
  const router = useRouter()
  return (
    <div className="bg-emerald-700 px-8 flex flex-row items-center">
      <Link href="/" legacyBehavior>
        <a className="text-white font-bold hover:text-sky-100 p-4 text-xl">
          Solandra
        </a>
      </Link>
      {links.map((link, i) => {
        const isMatch = router.asPath.includes(link.basePath ?? link.href)

        if (isMatch) {
          return (
            <div className="text-emerald-300 font-bold p-4" key={i}>
              {link.name}
            </div>
          )
        } else {
          return (
            <Link href={link.href} key={i} legacyBehavior>
              <a className="text-white font-bold hover:text-emerald-200 p-4">
                {link.name}
              </a>
            </Link>
          )
        }
      })}
    </div>
  )
}
