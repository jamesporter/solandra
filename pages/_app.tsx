import "../styles/globals.css"
import type { AppProps } from "next/app"
import { CommandMenuProvider } from "../src/components/CommandMenu"
import { ThemeProvider } from "../src/theme"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CommandMenuProvider>
        <Component {...pageProps} />
      </CommandMenuProvider>
    </ThemeProvider>
  )
}

export default MyApp
