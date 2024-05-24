import childProcess from "child_process"

const r1 = childProcess.execSync("npm run build:samples").toString()

const result = childProcess.execSync("git diff samples").toString()

if (result.trim() !== "") {
  console.error(
    "Images are inconsistent with the samples. Please verify.",
    result
  )
  process.exit(1)
}
