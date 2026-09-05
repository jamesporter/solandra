import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import cx from "classnames"
import { useRouter } from "next/router"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { searchCommandMenu } from "../fuzzySearch"
import type { CommandMenuItem } from "../data/commandMenuItems"

type CommandMenuContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const CommandMenuContext = createContext<CommandMenuContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export function useCommandMenu() {
  return useContext(CommandMenuContext)
}

/** Wraps the app: owns the ⌘K shortcut and renders the menu when open. */
export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsOpen((wasOpen) => !wasOpen)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <CommandMenuContext.Provider value={value}>
      {children}
      {isOpen && <CommandMenu onClose={close} />}
    </CommandMenuContext.Provider>
  )
}

/** True on Macs, but only known after mount so as not to break hydration. */
export function useIsApple() {
  const [isApple, setIsApple] = useState(false)

  useEffect(() => {
    const { platform, userAgent } = window.navigator
    setIsApple(/Mac|iPhone|iPad|iPod/.test(platform || userAgent))
  }, [])

  return isApple
}

const kindLabels: Record<CommandMenuItem["kind"], string> = {
  page: "Page",
  docs: "Docs",
  concept: "Concept",
  action: "Action",
}

function Highlighted({ text, indices }: { text: string; indices: number[] }) {
  if (indices.length === 0) return <>{text}</>

  const matched = new Set(indices)
  return (
    <>
      {text.split("").map((character, i) => (
        <span
          key={i}
          className={cx({ "text-emerald-600 font-bold": matched.has(i) })}
        >
          {character}
        </span>
      ))}
    </>
  )
}

function CommandMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const isApple = useIsApple()
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchCommandMenu(query).slice(0, 50), [query])

  useEffect(() => setActiveIndex(0), [query])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, results])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const go = useCallback(
    (item: CommandMenuItem) => {
      onClose()
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer")
      } else {
        void router.push(item.href)
      }
    },
    [onClose, router]
  )

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0))
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((i) =>
          results.length ? (i - 1 + results.length) % results.length : 0
        )
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(Math.max(results.length - 1, 0))
        break
      case "Enter": {
        event.preventDefault()
        const result = results[activeIndex]
        if (result) go(result.item)
        break
      }
      case "Escape":
        event.preventDefault()
        onClose()
        break
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-sky-950/50 p-4 pt-[12vh] backdrop-blur-sm print:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Search Solandra"
    >
      <div className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-gray-50 shadow-2xl">
        <div className="flex flex-row items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 p-3">
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-emerald-100" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, docs and concepts..."
            aria-label="Search pages, docs and concepts"
            className="w-full bg-transparent font-semibold text-white outline-hidden placeholder:font-normal placeholder:text-emerald-100"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-sm px-2 py-1 text-xs font-semibold text-emerald-100 hover:bg-emerald-400 hover:text-white"
          >
            esc
          </button>
        </div>

        <div ref={listRef} className="overflow-y-auto" role="listbox">
          {results.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              Nothing matches &ldquo;{query}&rdquo;
            </p>
          )}
          {results.map(({ item, indices }, i) => {
            const active = i === activeIndex
            return (
              <button
                key={`${item.kind}-${item.name}`}
                data-index={i}
                role="option"
                aria-selected={active}
                onMouseMove={() => setActiveIndex(i)}
                onClick={() => go(item)}
                className={cx(
                  "flex w-full flex-row items-center gap-3 border-l-8 p-3 px-4 text-left",
                  {
                    "border-l-emerald-500 bg-emerald-100": active,
                    "border-l-transparent bg-emerald-50 hover:bg-emerald-100":
                      !active,
                  }
                )}
              >
                <span className="w-16 shrink-0 text-xs font-semibold text-sky-700 uppercase">
                  {kindLabels[item.kind]}
                </span>
                <span className="flex-1 truncate font-semibold text-emerald-800">
                  <Highlighted text={item.name} indices={indices} />
                </span>
                {item.external ? (
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  item.section && (
                    <span className="shrink-0 text-xs text-gray-500">
                      {item.section}
                    </span>
                  )
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-row justify-between gap-4 bg-gray-100 px-4 py-2 text-xs text-gray-500">
          <span>
            <span className="font-semibold">&uarr;&darr;</span> navigate{" "}
            <span className="font-semibold">&crarr;</span> open{" "}
            <span className="font-semibold">esc</span> close
          </span>
          <span>{isApple ? "⌘" : "Ctrl"} K</span>
        </div>
      </div>
    </div>
  )
}
