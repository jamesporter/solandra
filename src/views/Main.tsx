import Header from "../components/Header"
import ExampleLinks from "../components/ExampleLinks"
import Footer from "../components/Footer"
import sketches, { SketchKind } from "../examples/sketches"
import Preview from "../components/Preview"

export function Main({ category }: { category: string }) {
  return (
    <>
      <Header />

      <ExampleLinks />

      <h1 className="text-4xl text-sky-700 mt-16 mb-4 text-center">
        {category}
      </h1>
      <p className="text-center max-w-xl m-auto mb-12">
        {sketches[category as SketchKind].description}
      </p>

      <div className="flex flex-row flex-wrap justify-center container m-auto">
        {sketches[category as SketchKind].sketches.map((s, id) => {
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

      <Footer />
    </>
  )
}
