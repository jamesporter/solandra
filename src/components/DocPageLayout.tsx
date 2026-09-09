import { ReactNode, useState } from "react"
import Header from "./Header"
import Link from "next/link"
import { usePathname } from "next/navigation"
import cx from "classnames"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
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
    href: "/docs/canvas-basics",
    name: "Canvas Basics",
  },
  {
    href: "/docs/shapes",
    name: "Shapes",
  },
  {
    href: "/docs/paths",
    name: "Paths & Curves",
  },
  {
    href: "/docs/iteration",
    name: "Iteration",
  },
  {
    href: "/docs/randomness",
    name: "Randomness & Noise",
  },
  {
    href: "/docs/colors",
    name: "Colour & Palettes",
  },
  {
    href: "/docs/transforms",
    name: "Transforms & Clipping",
  },
  {
    href: "/docs/text",
    name: "Text",
  },
  {
    href: "/docs/animation",
    name: "Animation & Time",
  },
  {
    href: "/docs/vectors-and-utilities",
    name: "Vectors & Utilities",
  },
  {
    href: "/docs/shaders",
    name: "Shaders & Images",
  },
  {
    href: "/docs/release-notes",
    name: "Release Notes",
  },
]

const headingClasses =
  "font-semibold text-emerald-50 bg-emerald-500 dark:bg-emerald-800 p-4 px-6"

export function DocLinks() {
  const pathname = usePathname()
  // Narrow viewports get the contents as a disclosure, collapsed by default, so
  // that the page itself (rather than a long list of links) is what you land on.
  const [open, setOpen] = useState(false)

  const current = links.find(({ href }) => pathname.includes(href))

  return (
    <nav className="flex flex-col lg:w-64 lg:shrink-0 lg:rounded-lg lg:overflow-hidden print:hidden">
      <h3 className={cx(headingClasses, "max-lg:hidden")}>Contents</h3>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="doc-contents"
        className={cx(
          headingClasses,
          "lg:hidden flex flex-row items-center gap-2 text-left"
        )}
      >
        <span>Contents</span>
        {current && (
          <span className="text-emerald-100/80 font-normal truncate">
            {current.name}
          </span>
        )}
        <ChevronDownIcon
          className={cx("h-5 w-5 ml-auto shrink-0 transition-transform", {
            "rotate-180": open,
          })}
        />
      </button>

      <div
        id="doc-contents"
        className={cx("flex flex-col", { "max-lg:hidden": !open })}
      >
        {links.map(({ href, name }, _i) => {
          const active = pathname.includes(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cx(
                "font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-4 dark:text-emerald-100 dark:hover:text-white dark:bg-emerald-950 dark:hover:bg-emerald-900",
                {
                  "bg-emerald-200 border-l-8 border-l-emerald-500 dark:bg-emerald-800":
                    active,
                  "border-l-8 border-l-transparent hover:border-l-emerald-200 dark:hover:border-l-emerald-700":
                    !active,
                }
              )}
            >
              {name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function DocPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* The nav keeps a fixed width on wide viewports so that the article can
          be centred in whatever space is left, rather than the gap all landing
          between the nav and the content. */}
      <div className="flex flex-col flex-1 lg:flex-row lg:items-start lg:gap-4 lg:my-8 lg:px-4">
        <DocLinks />
        <div className="flex-1 min-w-0">
          <div className="mx-auto p-4 lg:px-12 max-w-6xl article-page bg-gray-50 dark:bg-gray-900 @container">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
