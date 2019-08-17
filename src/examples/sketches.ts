import advancedApis from "./advanced-apis"
import advancedPaths from "./advanced-paths"
import animated from "./animated"
import samples from "./api-samples"
import highlights from "./highlights"
import isometric from "./isometric"
import randomness from "./randomness"

export default {
  Highlights: {
    sketches: highlights,
    fileName: "highlights.ts",
    path: "/main",
    description: `Highlights of the framework, from very basic and specific examples of one
part, to more complex examples composing different parts of the
framework. Click on Source Code to see how things work.`,
  },
  "API Samples": {
    sketches: samples,
    fileName: "api-samples.ts",
    path: "/api-samples",
    description: `A large set of simple examples focusing on one part of the Solandra API. Click on Source Code to see how things work.`,
  },
  Animated: {
    sketches: animated,
    fileName: "animated.ts",
    path: "/animated",
    description: `Animated examples of Solandra (NB loads of other examples also have animation). Click on Source Code to see how things work.`,
  },
  "Advanced APIs": {
    sketches: advancedApis,
    fileName: "advanced-apis.ts",
    path: "/advanced-apis",
    description: `Examples illustrating some advanced Solandra APIs. Click on Source Code to see how things work.`,
  },
  "Advanced Paths": {
    sketches: advancedPaths,
    fileName: "advanced-paths.ts",
    path: "/advanced-paths",
    description: `Examples of more complex path (shape) APIs. Click on Source Code to see how things work.`,
  },
  Isometric: {
    sketches: isometric,
    fileName: "isometric.ts",
    path: "/isometric",
    description: `Solandra does Isometric graphics. Click on Source Code to see how things work.`,
  },
  "Randomness and Noise": {
    sketches: randomness,
    fileName: "randomness.ts",
    path: "/randomness-and-noise",
    description: `Examples focusing on randomness or noise. Click on Source Code to see how things work.`,
  },
}
