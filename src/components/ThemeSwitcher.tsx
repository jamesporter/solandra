import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import cx from "classnames"
import React from "react"
import { useTheme, type ThemeChoice } from "../theme"

const options: {
  value: ThemeChoice
  label: string
  Icon: typeof SunIcon
}[] = [
  { value: "system", label: "System theme", Icon: ComputerDesktopIcon },
  { value: "light", label: "Light theme", Icon: SunIcon },
  { value: "dark", label: "Dark theme", Icon: MoonIcon },
]

/**
 * Three way switch (system/light/dark) for the header bars, which are green in
 * both themes, so it is styled against that rather than against the page.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cx(
        "flex flex-row items-center gap-0.5 rounded-full bg-emerald-900/30 p-0.5 ring-1 ring-white/20",
        className
      )}
    >
      {options.map(({ value, label, Icon }) => {
        const selected = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cx("rounded-full p-1.5 transition-colors", {
              "bg-white text-emerald-800 shadow-sm": selected,
              "text-emerald-100 hover:bg-white/20 hover:text-white": !selected,
            })}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}
