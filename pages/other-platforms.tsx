import type { NextPage } from "next"
import Head from "next/head"

import Footer from "../src/components/Footer"
import {
  CodeIcon,
  DownloadIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline"

import { SVGSketch } from "../src/components/SVGSketch"
import Header from "../src/components/Header"

const Other: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solandra - Other Platforms</title>
        <meta
          name="description"
          content="A human friendly, agile framework for creative coding"
        />
        <link rel="icon" type="image/png" href="/images/icon.png" />
      </Head>

      <main>
        <Header />
        <div className="mx-auto p-4 max-w-3xl article-page">
          <h1>Other Platforms</h1>

          <p>
            You can also use a version of solandra for SVG rendering and with
            Flutter.
          </p>
        </div>

        <div className="flex flex-row flex-wrap md:gap-4 justify-center mb-8">
          <div className="bg-gray-800 text-white md:rounded-xl p-4 md:shadow-lg max-w-lg flex flex-col gap-y-4">
            <h3 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-600 inline-block">
              Solandra Flutter
            </h3>
            <p>
              Flutter is a cross platform framework for creating applications.
              You can make native iOS, Android, Mac, Windows and Linux Apps. You
              can also deploy to the web. Unlike most native app development
              environments it supports hot (stateful) reload; which is great for
              working on interactive applications.
            </p>

            <a
              href="https://solandra-flutter.netlify.app/#/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/solandra-flutter.png"
                alt="Example of Solandra Flutter App"
                className="m-auto"
              />
            </a>

            <div className="flex flex-col mt-4">
              <a
                href="https://github.com/jamesporter/solandra-flutter"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-amber-400 to-rose-500 hover:text-sky-900 rounded-lg"
              >
                <CodeIcon className="h-8 w-8" />
                Documentation and Source Code
              </a>

              <a
                href="https://pub.dev/packages/solandra"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-amber-400 to-rose-500 hover:text-sky-900 rounded-lg"
              >
                <DownloadIcon className="h-8 w-8" />
                Dart Package on Pub
              </a>
            </div>
          </div>

          <div className="bg-sky-800 text-white md:rounded-xl p-4 md:shadow-lg max-w-lg flex flex-col gap-y-4">
            <h3 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500 inline-block">
              Solandra SVG
            </h3>
            <p>
              Solandra SVG allows for the creation of vector graphics with many
              of Solandra&apos;s APIs. I created it to make images for plotters
              and experimented with a fluent/chained API.
            </p>

            <a
              href="https://solandra-svg.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              <SVGSketch
                sketch={(s) => {
                  s.times(40, () => {
                    s.strokedPath((attr) =>
                      attr.fill(s.sample([220, 210, 320, 175]), 90, 50, 0.1)
                    )
                      .moveTo(s.randomPoint())
                      .arcTo(s.randomPoint())
                  })
                }}
                width={100}
                height={100}
                className="max-w-md m-auto w-full bg-white"
              />
            </a>

            <div className="flex flex-col mt-4">
              <a
                href="https://github.com/jamesporter/solandra-svg"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-emerald-400 to-sky-500  rounded-lg"
              >
                <CodeIcon className="h-8 w-8" />
                Source Code
              </a>

              <a
                href="https://solandra-svg.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-x-4 items-center p-2 hover:bg-gradient-to-r from-emerald-400 to-sky-500  rounded-lg"
              >
                <InformationCircleIcon className="h-8 w-8" />
                Documentation
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default Other
