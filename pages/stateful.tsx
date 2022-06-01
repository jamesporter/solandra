import React from "react"
import StatefulPreview from "../src/components/StatefulPreview"
import { H1 } from "../src/components/Text"
import statefulSketches from "../src/stateful-sketches"

const MainPage = () => (
  <>
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

export default MainPage
