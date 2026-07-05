const fs = require("fs"),
  path = require("path"),
  rimraf = require("rimraf")

rimraf.sync("package")
fs.mkdirSync("package")

const mainPackage = JSON.parse(fs.readFileSync("./package.json").toString())
const version = mainPackage.version

const packageTemplate = {
  name: "solandra",
  author: "James Porter <james@amimetic.co.uk>",
  version,
  description: mainPackage.description,
  keywords: [
    "generative-art",
    "algorithmic-art",
    "creative-coding",
    "canvas",
    "graphics",
    "typescript",
  ],
  license: "MIT",
  repository: mainPackage.repository,
  bugs: mainPackage.bugs,
  homepage: "https://solandra.amimetic.co.uk",
  sideEffects: false,
  main: "./cjs/index.js",
  module: "./esm/index.js",
  types: "./cjs/index.d.ts",
  exports: {
    ".": {
      import: {
        types: "./esm/index.d.ts",
        default: "./esm/index.js",
      },
      require: {
        types: "./cjs/index.d.ts",
        default: "./cjs/index.js",
      },
    },
    "./package.json": "./package.json",
  },
  dependencies: {},
}

fs.writeFileSync(
  path.join("package", "package.json"),
  JSON.stringify(packageTemplate, null, 2)
)

// Module-type markers so Node treats esm/*.js as ESM and cjs/*.js as CommonJS
fs.mkdirSync(path.join("package", "esm"))
fs.writeFileSync(
  path.join("package", "esm", "package.json"),
  JSON.stringify({ type: "module" }, null, 2)
)
fs.mkdirSync(path.join("package", "cjs"))
fs.writeFileSync(
  path.join("package", "cjs", "package.json"),
  JSON.stringify({ type: "commonjs" }, null, 2)
)

fs.copyFileSync("README.md", path.join("package", "README.md"))
fs.copyFileSync("LICENSE", path.join("package", "LICENSE"))
