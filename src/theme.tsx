import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/** Where the visitor's choice is remembered between visits. */
export const THEME_STORAGE_KEY = "solandra.theme"

/** What someone can pick: follow the OS, or pin one of the two themes. */
export type ThemeChoice = "system" | "light" | "dark"
export type ResolvedTheme = "light" | "dark"

const isThemeChoice = (value: unknown): value is ThemeChoice =>
  value === "system" || value === "light" || value === "dark"

const DARK_QUERY = "(prefers-color-scheme: dark)"

const readStoredChoice = (): ThemeChoice => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemeChoice(stored)) return stored
  } catch {
    // localStorage can be unavailable (private mode, blocked cookies)
  }
  return "system"
}

const resolve = (choice: ThemeChoice, prefersDark: boolean): ResolvedTheme =>
  choice === "system" ? (prefersDark ? "dark" : "light") : choice

const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  // Tells the browser which scrollbars/form controls to draw.
  root.style.colorScheme = theme
}

/**
 * Runs before the first paint, from `_document`, so the page is never briefly
 * light before React has had a chance to read the stored choice. Deliberately
 * plain, small ES5 with everything inlined: it cannot import from this module.
 */
export const themeScript = `(function(){try{var c=window.localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(c!=="light"&&c!=="dark"&&c!=="system"){c="system"}var d=c==="dark"||(c==="system"&&window.matchMedia(${JSON.stringify(
  DARK_QUERY
)}).matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`

type ThemeContextValue = {
  /** What the visitor picked, which may be "system". */
  theme: ThemeChoice
  /** What that currently means, once mounted. */
  resolvedTheme: ResolvedTheme
  setTheme: (choice: ThemeChoice) => void
  /** False until the stored choice has been read on the client. */
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  mounted: false,
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server rendering and the first client render agree on "system"; the stored
  // choice arrives on mount (the inline script has already applied it to the
  // document, so there is nothing to see).
  const [theme, setThemeState] = useState<ThemeChoice>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setThemeState(readStoredChoice())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const media = window.matchMedia(DARK_QUERY)
    const update = () => {
      const next = resolve(theme, media.matches)
      applyTheme(next)
      setResolvedTheme(next)
    }

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [mounted, theme])

  const setTheme = useCallback((choice: ThemeChoice) => {
    setThemeState(choice)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, choice)
    } catch {
      // ignore – the choice just won't survive a reload
    }
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, mounted }),
    [theme, resolvedTheme, setTheme, mounted]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
