import React from "react"
import Link from "next/link"
import sketches from "../examples/sketches"
import { useRouter } from "next/router"

export default function ExampleLinks() {
  const router = useRouter()
  const areaName = Object.keys(sketches)
  return (
    <div className="flex flex-row justify-center flex-wrap my-4 gap-2">
      {areaName.map((areaName, i) => {
        // @ts-expect-error
        const path = sketches[areaName].path
        const isMatch = router.asPath.includes(path)

        if (isMatch) {
          return (
            <div
              className="bg-sky-900 text-white font-bold p-2 rounded-lg  w-48 text-center flex items-center justify-center"
              key={i}
            >
              {areaName}
            </div>
          )
        } else {
          return (
            <Link href={path} key={i} legacyBehavior>
              <a className="bg-sky-600 text-white font-bold p-2 rounded-lg hover:bg-sky-400 w-48 text-center flex items-center justify-center">
                {areaName}
              </a>
            </Link>
          )
        }
      })}
    </div>
  )
}
