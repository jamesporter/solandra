import { ReactNode } from "react"
import Header from "./Header"
import Link from "next/link"
import { usePathname } from "next/navigation"
import cx from "classnames"
import Footer from "./Footer"

const links = [
  {
    href: "/docs/introduction",
    name: "Introduction",
  },
  {
    href: "/docs/quickstart",
    name: "Get Started",
  },
  {
    href: "/docs/shaders",
    name: "Shaders",
  },
]

export function DocLinks() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-[3]">
      {links.map(({ href, name }, i) => {
        const active = pathname.includes(href)
        return (
          <Link
            key={href}
            href={href}
            className={cx(
              "p-4 font-semibold text-emerald-800 hover:text-emerald-700 mr-2",
              {
                "bg-emerald-100 border-l-8 border-l-emerald-500": active,
                "border-l-8 border-l-transparent": !active,
              }
            )}
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
}

export function DocPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <div className="flex flex-col lg:flex-row lg:my-8">
        <DocLinks />
        <div className="flex-[9]">
          <div className="mx-auto p-4 lg:px-12 max-w-6xl article-page bg-gray-50">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
