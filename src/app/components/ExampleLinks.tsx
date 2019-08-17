import React from "react"
import { Link } from "gatsby"
import sketches from "../../examples/sketches"

export default function ExampleLinks() {
  const areaName = Object.keys(sketches)
  return (
    <div className="flex flex-row justify-center flex-wrap my-4">
      {areaName.map((areaName, i) => (
        <Link
          className="text-blue-400 text-md px-4 hover:text-blue-800 w-32 p-2 text-center"
          to={sketches[areaName].path}
          activeClassName="text-blue-700"
          key={i}
        >
          {areaName}
        </Link>
      ))}
      <Link
        className="text-blue-400 text-md px-4 hover:text-blue-800 w-32 p-2 text-center"
        to="/stateful"
        activeClassName="text-blue-700"
        key={-1}
      >
        Stateful
      </Link>
    </div>
  )
}
