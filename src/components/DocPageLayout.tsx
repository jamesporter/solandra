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
  // {
  //   href: "/docs/shaders",
  //   name: "Shaders",
  // },
  {
    href: "/docs/release-notes",
    name: "Release Notes",
  },
]

export function DocLinks() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-[3] lg:rounded-lg lg:overflow-hidden lg:mx-4 docsPage">
      <h3 className="font-semibold text-emerald-50  bg-emerald-500 p-4 px-6">
        Preview Docs
      </h3>

      {links.map(({ href, name }, i) => {
        const active = pathname.includes(href)
        return (
          <Link
            key={href}
            href={href}
            className={cx(
              "font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-4",
              {
                "bg-emerald-200 border-l-8 border-l-emerald-500": active,
                "border-l-8 border-l-transparent hover:border-l-emerald-200":
                  !active,
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
          <div className="mx-auto p-4 lg:px-12 max-w-6xl article-page bg-gray-50 @container lg:mr-4">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
