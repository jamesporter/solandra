const fs = require("fs"),
  rimraf = require("rimraf")

rimraf.sync("docs")
fs.mkdirSync("docs")
