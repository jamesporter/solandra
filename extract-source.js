const fs = require("fs"),
  path = require("path");

const source = fs.readFileSync(path.join("src", "sketches.ts")).toString();

//ha!
const matches = source.match(
  /const .*? = \(p: PlayCanvas\) => {(.|[\n])*?(?=(const .*? = \(p: PlayCanvas\) =>)|(const sketches: {))/gim
);

const examples = {};

matches.forEach(m => {
  const name = m.match(/const (.*?)(?= )/)[1];
  const code = m;

  examples[name] = code;
});

// console.log(examples);

const names = {};

const metaMatches = source
  .match(/{ sketch: ([^,]*), name: "([^"]*)" }/gi)
  .map(nm => nm.match(/{ sketch: ([^,]*), name: "([^"]*)" }/i).slice(1, 3))
  .forEach(([n, l]) => (names[n] = l));

// console.log(names);

const exampleScripts = {};
Object.keys(names).forEach(name => {
  exampleScripts[names[name]] = examples[name];
});

// console.log(exampleScripts);

fs.writeFileSync(
  path.join("src", "app", "examples.json"),
  JSON.stringify(exampleScripts, null, 2)
);
