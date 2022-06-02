import Header from "../components/Header"
import { H1 } from "../components/Text"
import ExampleLinks from "../components/ExampleLinks"
import Footer from "../components/Footer"
import sketches, { SketchKind } from "../examples/sketches"
import Preview from "../components/Preview"

export function Main({ category }: { category: string }) {
  return (
    <>
      <Header />

      <ExampleLinks />

      <H1>{category}</H1>
      <p className="text-center max-w-xl m-auto">
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
