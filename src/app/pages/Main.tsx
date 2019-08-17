import React from "react"
import sketches from "../../examples/sketches"
import Preview from "../Preview"
import Header from "../components/Header"
import { H1 } from "../components/Text"
import ExampleLinks from "../components/ExampleLinks"

export function Main({ category }: { category: string }) {
  return (
    <>
      <Header />

      <ExampleLinks />

      <H1>{category}</H1>
      <p className="text-center max-w-xl m-auto">
        {sketches[category].description}
      </p>

      <div className="flex flex-row flex-wrap justify-center container m-auto">
        {sketches[category].sketches.map((s, id) => {
          return (
            <Preview
              sketch={s.sketch}
              name={s.name}
              size={240}
              id={id}
              key={id}
              category={category}
            />
          )
        })}
      </div>
    </>
  )
}
