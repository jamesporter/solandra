import { useEffect } from "react"

export default function useKeypresses(keyEvents: [string, () => void][]) {
  // what no deps?, almost like I don't think perf is real issue for this
  useEffect(() => {
    const keyHandler = event => {
      for (let k of keyEvents) {
        const [key, h] = k
        if (event.key === key) {
          h()
          return
        }
      }
    }

    if (document) {
      document.addEventListener("keydown", keyHandler)

      return () => {
        if (document) {
          document.removeEventListener("keydown", keyHandler)
        }
      }
    }
  })
}
