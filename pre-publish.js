const fs = require("fs"),
  path = require("path"),
  rimraf = require("rimraf");

rimraf.sync("package");
fs.mkdirSync("package");

const mainPackage = JSON.parse(fs.readFileSync("./package.json").toString());
const version = mainPackage.version;

const packageTemplate = {
  name: "typeplates",
  author: "James Porter <james@amimetic.co.uk>",
  version,
  main: "index.js",
  license: "MIT",
  dependencies: {
    prando: "^5.1.1"
  },
  types: "index.d.ts"
};

fs.writeFileSync(
  path.join("package", "package.json"),
  JSON.stringify(packageTemplate, null, 2)
);
