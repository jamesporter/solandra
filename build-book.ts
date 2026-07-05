// build-book.ts
//
// Builds "The Solandra Book":
//   1. Boots the Next.js site, visits every /docs/* page with a headless
//      browser, and captures the fully rendered article HTML — including the
//      example <canvas> sketches, which are drawn at runtime and snapshotted
//      to PNG images.
//   2. Writes a single, self-contained HTML file plus its images into
//      ./bookOutput (git ignored).
//   3. Packages that content into an EPUB at ./public/solandra-book.epub, so it
//      is served from the site root at /solandra-book.epub.
//
// The captured pages are "clean": no site header, sidebar contents or footer,
// just the article body and the rendered sketches.
//
// Run with: pnpm build:book  (tsx ./build-book.ts)

import { spawn, type ChildProcess } from "node:child_process"
import { once } from "node:events"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type LaunchOptions, type Page } from "playwright"
import JSZip from "jszip"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The pre-installed Chromium in the web environment; falls back to Playwright's
// own resolution locally.
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
const PORT = 3939
const BASE = `http://localhost:${PORT}`
const OUT_DIR = path.join(__dirname, "bookOutput")
const IMG_DIR = path.join(OUT_DIR, "images")
const HTML_OUT = path.join(OUT_DIR, "solandra-book.html")
const PUBLIC_DIR = path.join(__dirname, "public")
const EPUB_OUT = path.join(PUBLIC_DIR, "solandra-book.epub")
const COVER_SRC = path.join(__dirname, "book-cover.png")
const COVER_NAME = "cover.png"

const BOOK_TITLE = "The Solandra Book"
const BOOK_AUTHOR = "James Porter"
const BOOK_ID = "urn:uuid:2a42e4e0-a24d-4be3-9500-c0c18508b079"

interface SketchImage {
  name: string
  dataUrl: string
}

interface StaticImageRef {
  publicPath: string
  name: string
}

interface PageCapture {
  xhtml: string
  images: SketchImage[]
  staticImages: StaticImageRef[]
}

interface Chapter {
  slug: string
  title: string
}

interface CapturedChapter extends Chapter {
  xhtml: string
  images: SketchImage[]
}

// Chapters, in reading order. Mirrors the docs navigation in
// src/components/DocPageLayout.tsx.
const chapters: Chapter[] = [
  { slug: "introduction", title: "Introduction" },
  { slug: "quickstart", title: "Get Started" },
  { slug: "canvas-basics", title: "Canvas Basics" },
  { slug: "shapes", title: "Shapes" },
  { slug: "paths", title: "Paths & Curves" },
  { slug: "iteration", title: "Iteration" },
  { slug: "randomness", title: "Randomness & Noise" },
  { slug: "colors", title: "Colour & Palettes" },
  { slug: "transforms", title: "Transforms & Clipping" },
  { slug: "text", title: "Text" },
  { slug: "animation", title: "Animation & Time" },
  { slug: "vectors-and-utilities", title: "Vectors & Utilities" },
  { slug: "shaders", title: "Shaders & Images" },
  { slug: "release-notes", title: "Release Notes" },
]

function log(...args: unknown[]) {
  console.log("[build:book]", ...args)
}

async function existsBinary(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function waitForServer(url: string, timeoutMs = 90_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      // not up yet
    }
    await new Promise<void>((r) => setTimeout(r, 500))
  }
  throw new Error(`Server did not become ready at ${url}`)
}

function startServer(): ChildProcess {
  log(`starting next dev on :${PORT} ...`)
  const child = spawn(
    "pnpm",
    ["exec", "next", "dev", "--webpack", "-p", String(PORT)],
    {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    }
  )
  child.stdout?.on("data", () => {})
  child.stderr?.on("data", () => {})
  return child
}

// Runs in the browser: replace each <canvas> with an <img> pointing at a saved
// PNG, then return the article as clean XHTML plus the captured PNG data URLs.
async function capturePage(page: Page, slug: string): Promise<PageCapture> {
  await page.goto(`${BASE}/docs/${slug}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  })

  // Wait for every canvas to have been laid out and drawn.
  await page
    .waitForFunction(
      () => {
        const cs = [...document.querySelectorAll("canvas")]
        return cs.every((c) => c.width > 0 && c.height > 0)
      },
      { timeout: 20_000 }
    )
    .catch(() => {})
  // Give sketches (incl. one animation frame) time to paint.
  await page.waitForTimeout(1000)

  return await page.evaluate<PageCapture, string>((slug) => {
    const article = document.querySelector(".article-page")
    if (!article) return { xhtml: "", images: [], staticImages: [] }

    const images: SketchImage[] = []
    const canvases = [...article.querySelectorAll("canvas")]
    canvases.forEach((canvas, i) => {
      const name = `${slug}-${i}.png`
      let dataUrl = ""
      try {
        dataUrl = canvas.toDataURL("image/png")
      } catch {
        dataUrl = ""
      }
      images.push({ name, dataUrl })

      const img = document.createElement("img")
      img.setAttribute("src", `images/${name}`)
      img.setAttribute("alt", "Solandra example sketch")
      img.setAttribute("class", "sketch")
      canvas.replaceWith(img)
    })

    // Static images (e.g. <img src="/images/sol.png"> served from /public).
    // Rewrite their root-absolute src to a relative path and record which
    // files need to be copied into the book.
    const staticImages: StaticImageRef[] = []
    ;[...article.querySelectorAll("img")].forEach((img) => {
      const src = img.getAttribute("src") || ""
      if (!src.startsWith("/")) return // canvas snapshots are already relative
      const name = (src.split("/").pop() || "").split(/[?#]/)[0]
      staticImages.push({ publicPath: src, name })
      img.setAttribute("src", `images/${name}`)
    })

    // XMLSerializer emits well-formed XHTML (self-closed void elements, quoted
    // attributes) which is what an EPUB requires.
    const xhtml = new XMLSerializer().serializeToString(article)
    return { xhtml, images, staticImages }
  }, slug)
}

function pageXhtml(title: string, bodyXhtml: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeXml(title)}</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
${bodyXhtml}
</body>
</html>
`
}

// Full-bleed cover page shown first in the reading order.
function coverXhtml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeXml(BOOK_TITLE)}</title>
<style>
  html, body { margin: 0; padding: 0; height: 100%; }
  body { text-align: center; }
  img { max-width: 100%; max-height: 100%; object-fit: contain; }
</style>
</head>
<body epub:type="cover">
<img src="images/${COVER_NAME}" alt="${escapeXml(BOOK_TITLE)} cover" />
</body>
</html>
`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function mimeFor(name: string): string {
  const ext = (name.split(".").pop() || "").toLowerCase()
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
  }
  return map[ext] || "image/png"
}

const BOOK_CSS = `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1f2933;
  margin: 0 auto;
  max-width: 44rem;
  padding: 1.5rem;
}
h1, h2, h3, h4 { line-height: 1.25; color: #065f46; margin-top: 1.6em; }
h1 { font-size: 2rem; border-bottom: 3px solid #10b981; padding-bottom: 0.3em; }
h2 { font-size: 1.5rem; }
p { margin: 0.8em 0; }
a { color: #059669; }
ul, ol { padding-left: 1.4em; }
img.sketch, .article-page img {
  display: block;
  margin: 1.5em auto;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
pre {
  overflow-x: auto;
  padding: 1em;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.5;
}
code { font-family: "SF Mono", Menlo, Consolas, monospace; }
:not(pre) > code {
  background: #f0fdf4;
  color: #065f46;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.9em;
}
.chapter { page-break-before: always; }
`

async function main() {
  const chromiumOpts: LaunchOptions = { args: ["--no-sandbox"] }
  if (await existsBinary(CHROME)) chromiumOpts.executablePath = CHROME

  // Fresh output directory.
  await fs.rm(OUT_DIR, { recursive: true, force: true })
  await fs.mkdir(IMG_DIR, { recursive: true })
  await fs.mkdir(PUBLIC_DIR, { recursive: true })

  const server = startServer()
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await waitForServer(`${BASE}/docs/introduction`)
    log("server ready")

    browser = await chromium.launch(chromiumOpts)
    const page = await browser.newPage({
      viewport: { width: 1400, height: 1000 },
    })

    const captured: CapturedChapter[] = []
    for (const ch of chapters) {
      log(`capturing /docs/${ch.slug}`)
      const { xhtml, images, staticImages } = await capturePage(page, ch.slug)

      // Sketch snapshots captured from <canvas>.
      for (const img of images) {
        if (!img.dataUrl) continue
        const b64 = img.dataUrl.split(",")[1]
        await fs.writeFile(
          path.join(IMG_DIR, img.name),
          Buffer.from(b64, "base64")
        )
      }

      // Static images referenced from /public (e.g. /images/sol.png). Copy the
      // file and load it as a data URL so it flows through the same pipeline.
      const staticLoaded: SketchImage[] = []
      for (const s of staticImages) {
        const from = path.join(PUBLIC_DIR, s.publicPath)
        try {
          const buf = await fs.readFile(from)
          await fs.writeFile(path.join(IMG_DIR, s.name), buf)
          staticLoaded.push({
            name: s.name,
            dataUrl: `data:${mimeFor(s.name)};base64,${buf.toString("base64")}`,
          })
        } catch {
          log(`  ! missing static image ${s.publicPath} (skipped)`)
        }
      }

      const chapterImages = [
        ...images.filter((i) => i.dataUrl),
        ...staticLoaded,
      ]
      captured.push({ ...ch, xhtml, images: chapterImages })
      log(
        `  -> ${images.length} sketch image(s)` +
          (staticLoaded.length
            ? `, ${staticLoaded.length} static image(s)`
            : "")
      )
    }

    await browser.close()
    browser = null

    // ---- 1. Single combined HTML file in bookOutput ----
    const combinedBody = captured
      .map(
        (c) =>
          `<section class="chapter" id="${c.slug}">\n${c.xhtml}\n</section>`
      )
      .join("\n")

    const combinedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeXml(BOOK_TITLE)}</title>
<style>${BOOK_CSS}</style>
</head>
<body>
<h1>${escapeXml(BOOK_TITLE)}</h1>
${combinedBody}
</body>
</html>
`
    await fs.writeFile(HTML_OUT, combinedHtml, "utf8")
    log(`wrote ${path.relative(__dirname, HTML_OUT)}`)

    // ---- 2. EPUB ----
    await buildEpub(captured)
    log(`wrote ${path.relative(__dirname, EPUB_OUT)}`)
  } finally {
    if (browser) await browser.close().catch(() => {})
    server.kill("SIGTERM")
    // give it a moment, then force
    await Promise.race([
      once(server, "exit"),
      new Promise<void>((r) => setTimeout(r, 3000)),
    ])
    if (!server.killed) server.kill("SIGKILL")
  }
}

async function buildEpub(captured: CapturedChapter[]): Promise<void> {
  const zip = new JSZip()

  // mimetype MUST be first and stored (uncompressed).
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" })

  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
`
  )

  const oebps = zip.folder("OEBPS")
  if (!oebps) throw new Error("failed to create OEBPS folder")
  oebps.file("style.css", BOOK_CSS)

  // Cover image + a dedicated cover page (first in the spine). If the cover
  // file is missing, the book is still built without one.
  let hasCover = false
  try {
    const coverBuf = await fs.readFile(COVER_SRC)
    oebps.file(`images/${COVER_NAME}`, coverBuf)
    oebps.file("cover.xhtml", coverXhtml())
    hasCover = true
  } catch {
    log(
      `  ! no cover image at ${path.relative(__dirname, COVER_SRC)} (skipped)`
    )
  }

  // Chapter XHTML files + images.
  const manifestItems: string[] = []
  const spineItems: string[] = []
  const navItems: string[] = []
  const seenImages = new Set<string>() // an image may be referenced by several chapters

  captured.forEach((c, idx) => {
    const file = `chapter-${String(idx + 1).padStart(2, "0")}.xhtml`
    const id = `chap${idx + 1}`
    oebps.file(file, pageXhtml(c.title, c.xhtml))
    manifestItems.push(
      `<item id="${id}" href="${file}" media-type="application/xhtml+xml"/>`
    )
    spineItems.push(`<itemref idref="${id}"/>`)
    navItems.push(`<li><a href="${file}">${escapeXml(c.title)}</a></li>`)

    c.images.forEach((img) => {
      if (seenImages.has(img.name)) return
      seenImages.add(img.name)
      const b64 = img.dataUrl.split(",")[1]
      oebps.file(`images/${img.name}`, b64, { base64: true })
      manifestItems.push(
        `<item id="img-${img.name.replace(/[^a-z0-9]/gi, "-")}" href="images/${img.name}" media-type="${mimeFor(img.name)}"/>`
      )
    })
  })

  // EPUB3 navigation document.
  const nav = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head><meta charset="utf-8" /><title>${escapeXml(BOOK_TITLE)}</title></head>
<body>
<nav epub:type="toc" id="toc">
<h1>Contents</h1>
<ol>
${navItems.map((n) => `  ${n}`).join("\n")}
</ol>
</nav>
</body>
</html>
`
  oebps.file("nav.xhtml", nav)

  // EPUB2 NCX (for wider reader compatibility).
  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head>
  <meta name="dtb:uid" content="${BOOK_ID}"/>
  <meta name="dtb:depth" content="1"/>
  <meta name="dtb:totalPageCount" content="0"/>
  <meta name="dtb:maxPageNumber" content="0"/>
</head>
<docTitle><text>${escapeXml(BOOK_TITLE)}</text></docTitle>
<navMap>
${captured
  .map(
    (c, idx) => `  <navPoint id="np${idx + 1}" playOrder="${idx + 1}">
    <navLabel><text>${escapeXml(c.title)}</text></navLabel>
    <content src="chapter-${String(idx + 1).padStart(2, "0")}.xhtml"/>
  </navPoint>`
  )
  .join("\n")}
</navMap>
</ncx>
`
  oebps.file("toc.ncx", ncx)

  const modified = new Date().toISOString().replace(/\.\d+Z$/, "Z")
  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="book-id">${BOOK_ID}</dc:identifier>
  <dc:title>${escapeXml(BOOK_TITLE)}</dc:title>
  <dc:creator>${escapeXml(BOOK_AUTHOR)}</dc:creator>
  <dc:language>en</dc:language>
  <meta property="dcterms:modified">${modified}</meta>
${hasCover ? `  <meta name="cover" content="cover-image"/>\n` : ""}</metadata>
<manifest>
  <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  <item id="css" href="style.css" media-type="text/css"/>
${hasCover ? `  <item id="cover-image" href="images/${COVER_NAME}" media-type="${mimeFor(COVER_NAME)}" properties="cover-image"/>\n  <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>\n` : ""}${manifestItems.map((m) => `  ${m}`).join("\n")}
</manifest>
<spine toc="ncx">
${hasCover ? `  <itemref idref="cover" linear="yes"/>\n` : ""}${spineItems.map((s) => `  ${s}`).join("\n")}
</spine>
</package>
`
  oebps.file("content.opf", opf)

  const buf = await zip.generateAsync({
    type: "nodebuffer",
    mimeType: "application/epub+zip",
    compression: "DEFLATE",
  })
  await fs.writeFile(EPUB_OUT, buf)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
