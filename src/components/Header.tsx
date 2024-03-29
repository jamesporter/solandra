import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const links = [
  {
    href: "/main",
    name: "Examples",
  },
  {
    href: "/viewAll",
    name: "Slides",
  },
  {
    href: "/quickstart",
    name: "Start",
  },
]

export default function Header() {
  const router = useRouter()
  return (
    <div className="bg-rose-700 px-8 flex flex-row items-center">
      <Link href="/">
        <a className="text-white font-bold hover:text-sky-100 p-4 text-xl">
          Solandra
        </a>
      </Link>
      {links.map((link, i) => {
        const isMatch = router.asPath.includes(link.href)

        if (isMatch) {
          return (
            <div className="text-amber-200 font-bold  p-4" key={i}>
              {link.name}
            </div>
          )
        } else {
          return (
            <Link href={link.href} key={i}>
              <a className="text-white font-bold hover:text-rose-200 p-4">
                {link.name}
              </a>
            </Link>
          )
        }
      })}
    </div>
  )
}
