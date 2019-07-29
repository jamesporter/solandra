import React from "react"
import sketches from "../../sketches"
import Preview from "../Preview"
import statefulSketches from "../../stateful-sketches"
import StatefulPreview from "../StatefulPreview"
import Header from "../components/Header"
import { Link } from "gatsby"

export function Main() {
  return (
    <>
      <Header />

      <h1 className="text-4xl text-center">Slide Show</h1>

      <p className="text-center max-w-xl m-auto">
        In slideshow like way. Click/tap to advance.
      </p>

      <div className="m-auto py-6">
        <Link
          className="text-lg bg-teal-500 hover:bg-teal-700 focus:outline-none focus:shadow-outline px-4 m-auto py-3 rounded ml-2 w-64 text-center"
          to="/viewAll"
        >
          View All as Slideshow
        </Link>
      </div>

      <h1 className="text-4xl text-center">Stateless Examples</h1>
      <p className="text-center max-w-xl m-auto">
        Examples of the framework, from very basic and specific examples of one
        part, to more complex examples composing different parts of the
        framework. Click on Source Code to see how things work.
      </p>
      <div className="flex flex-row flex-wrap justify-center container m-auto">
        {sketches.map((s, id) => {
          return (
            <Preview
              sketch={s.sketch}
              name={s.name}
              size={240}
              id={id}
              key={id}
            />
          )
        })}
      </div>
      <h1 className="text-4xl text-center">
        State(ful) and Interactive Examples
      </h1>
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
