const fs = require("fs"),
  path = require("path")

let exampleScripts = {}

const files = fs.readdirSync(path.join("src", "examples"))
// console.log(files)

for (let f of files) {
  if (f === "sketches.ts") continue
  // console.log(`Process: ${f}\n\n`)

  const filePath = path.join("src", "examples", f)
  const source = fs.readFileSync(filePath).toString()

  //ha!
  const matches = source.match(
    /const .*? = \([sp]: SCanvas\) => {(.|[\n])*?(?=(const .*? = \([sp]: SCanvas\) =>)|(const sketches: {))/gim
  )

  const examples = {}

  matches.forEach((m) => {
    const name = m.match(/const (.*?)(?= )/)[1]
    const code = m

    examples[name] = code
  })

  // console.log(examples)

  const names = {}

  source
    .match(/{ sketch: ([^,]*), name: "([^"]*)" }/gi)
    .map((nm) => nm.match(/{ sketch: ([^,]*), name: "([^"]*)" }/i).slice(1, 3))
    .forEach(([n, l]) => (names[n] = l))

  // console.log(names)

  const esForF = {}
  Object.keys(names).forEach((name) => {
    esForF[names[name]] = examples[name]
  })

  exampleScripts[f] = esForF

  // console.log(`Done: ${f}\n\n`)
}

// console.log(exampleScripts)

fs.writeFileSync(
  path.join("src", "data", "source.json"),
  JSON.stringify(exampleScripts, null, 2)
)
