import React, { useState } from "react"
import sketches from "../../examples/sketches"
import Preview from "../Preview"
import statefulSketches from "../../stateful-sketches"
import StatefulPreview from "../StatefulPreview"
import Header from "../components/Header"
import { H1 } from "../components/Text"
import SelectFromChoice from "../components/SelectFromChoice"

export function Main() {
  const [category, setCategory] = useState("Highlights")
  return (
    <>
      <Header />

      <H1>Stateless Examples</H1>
      <p className="text-center max-w-xl m-auto">
        Examples of the framework, from very basic and specific examples of one
        part, to more complex examples composing different parts of the
        framework. Click on Source Code to see how things work.
      </p>

      <SelectFromChoice
        choices={Object.keys(sketches).map(c => ({ label: c, value: c }))}
        onSelect={setCategory}
        value={category}
        tailwindContainerClasses="m-auto"
        tailwindItemContainerClasses="my-4"
      />

      <div className="flex flex-row flex-wrap justify-center container m-auto">
        {sketches[category].map((s, id) => {
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
