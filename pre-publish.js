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
  main: "./cjs/index.js",
  module: "./esm/index.js",
  license: "MIT",
  dependencies: {},
  types: "index.d.ts",
}

fs.writeFileSync(
  path.join("package", "package.json"),
  JSON.stringify(packageTemplate, null, 2)
)

fs.copyFileSync("README.md", path.join("package", "README.md"))
