import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import ViewSingle from "./pages/ViewSingle";
import { Main } from "./pages/Main";
import { Export } from "./pages/Export";
import ViewStateful from "./pages/ViewStateful";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen">
        <div className="bg-gray-900 px-8 py-4">
          <p className="text-gray-700 text-base">
            <Link to="/">
              <span className="font-bold text-xl mb-2 mr-4 text-blue-600 hover:text-blue-800">
                play-ts
              </span>
            </Link>
            <span className="hidden md:inline text-gray-200">
              A simple, modern TypeScript-first Algorithmic Art Tool
            </span>
            <a
              href="https://github.com/jamesporter/play-ts"
              className="underline  ml-2 text-blue-600 hover:text-blue-800"
            >
              Project Source and Docs
            </a>
            <a
              className="underline ml-2 text-blue-600 hover:text-blue-800"
              href="https://github.com/jamesporter/play-ts/blob/master/src/sketches.ts"
            >
              (Source Code for example sketches)
            </a>
          </p>
        </div>
        <div className="flex flex-col flex-1 bg-gray-200 overflow-scroll">
          <Route path="/" exact component={Main} />
          <Route path="/view/:id" component={ViewSingle} />
          <Route path="/viewStateful/:id" component={ViewStateful} />
          <Route path="/export/:id" component={Export} />
        </div>
      </div>
    </Router>
  );
}
