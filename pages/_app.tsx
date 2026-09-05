import "../styles/globals.css"
import type { AppProps } from "next/app"
import { CommandMenuProvider } from "../src/components/CommandMenu"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CommandMenuProvider>
      <Component {...pageProps} />
    </CommandMenuProvider>
  )
}

export default MyApp
