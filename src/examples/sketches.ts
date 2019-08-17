import advancedApis from "./advanced-apis"
import advancedPaths from "./advanced-paths"
import animated from "./animated"
import samples from "./api-samples"
import highlights from "./highlights"
import isometric from "./isometric"
import randomness from "./randomness"

export default {
  Highlights: { sketches: highlights, fileName: "highlights.ts" },
  "API Samples": {
    sketches: samples,
    fileName: "api-samples.ts",
  },
  Animated: { sketches: animated, fileName: "animated.ts" },
  "Advanced APIs": {
    sketches: advancedApis,
    fileName: "advanced-apis.ts",
  },
  "Advanced Paths": {
    sketches: advancedPaths,
    fileName: "advanced-paths.ts",
  },
  Isometric: { sketches: isometric, fileName: "isometric.ts" },
  "Randomness and Noise": {
    sketches: randomness,
    fileName: "randomness.ts",
  },
}
