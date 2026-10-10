// Writes public/sitemap.xml from the MDX pages in src/pages. Runs before `next build`.
import { readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const SITE_URL = 'https://docs.sheetdb.io'
const pagesDir = new URL('../src/pages', import.meta.url).pathname
const outFile = new URL('../public/sitemap.xml', import.meta.url).pathname

function findPages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    let path = join(dir, entry.name)
    if (entry.isDirectory()) return findPages(path)
    return entry.name.endsWith('.mdx') ? [path] : []
  })
}

let urls = findPages(pagesDir)
  .map((file) => '/' + relative(pagesDir, file).replace(/\.mdx$/, ''))
  .map((path) => (path === '/index' ? '' : path))
  .sort()
  .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)

writeFileSync(
  outFile,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
)
