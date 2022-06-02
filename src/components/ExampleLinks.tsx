import React from "react"
import Link from "next/link"
import sketches from "../examples/sketches"

export default function ExampleLinks() {
  const areaName = Object.keys(sketches)
  return (
    <div className="flex flex-row justify-center flex-wrap my-4">
      {areaName.map((areaName, i) => (
        <Link
          className="text-blue-400 text-md px-4 hover:text-blue-800 w-32 p-2 text-center"
          // @ts-expect-error
          href={sketches[areaName].path}
          key={i}
        >
          {areaName}
        </Link>
      ))}
    </div>
  )
}
