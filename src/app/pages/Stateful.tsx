import React from "react"
import statefulSketches from "../../stateful-sketches"
import StatefulPreview from "../StatefulPreview"
import Header from "../components/Header"
import { H1 } from "../components/Text"
import ExampleLinks from "../components/ExampleLinks"

export default function Stateful() {
  return (
    <>
      <Header />

      <ExampleLinks />

      <H1>State(ful) and Interactive Examples</H1>
      <p className="text-center max-w-xl m-auto">
        The below are proof of concepts and are not (at least for now) the main
        focus of this framework.
      </p>
      <div className="flex flex-row flex-wrap justify-center container m-auto">
        {statefulSketches.map((s, id) => {
          return (
            <StatefulPreview
              sketch={s}
              name={s.name}
              size={240}
              id={id}
              key={id}
            />
          )
        })}
      </div>
    </>
  )
}
