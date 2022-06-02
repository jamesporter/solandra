import React from "react"
import Link from "next/link"
import sketches from "../examples/sketches"

export default function ExampleLinks() {
  const areaName = Object.keys(sketches)
  return (
    <div className="flex flex-row justify-center flex-wrap my-4 gap-2">
      {areaName.map((areaName, i) => (
        <Link
          // @ts-expect-error
          href={sketches[areaName].path}
          key={i}
        >
          <a className="bg-sky-600 text-white font-bold p-2 rounded-lg hover:bg-sky-400 w-48 text-center flex items-center justify-center">
            {areaName}
          </a>
        </Link>
      ))}
    </div>
  )
}
