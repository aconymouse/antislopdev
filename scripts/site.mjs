import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const out = root + 'site/dist/'
const { catalog, implemented } = await import(root + 'dist/core/index.js')

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const result = await build({
  entryPoints: { app: root + 'site/src/main.ts' },
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  platform: 'browser',
  outdir: out,
  entryNames: '[name]-[hash]',
  legalComments: 'none',
  metafile: true,
})
const app = Object.keys(result.metafile.outputs).find((f) => f.endsWith('.js')).split('/').pop()
const css = readFileSync(root + 'site/style.css')
const cssName = `style-${createHash('sha256').update(css).digest('hex').slice(0, 10)}.css`
writeFileSync(out + cssName, css)
const html = readFileSync(root + 'site/index.html', 'utf8')
  .replaceAll('{{rules}}', String(catalog.length))
  .replaceAll('{{checked}}', String(implemented.length))
  .replace('href="/style.css"', `href="/${cssName}"`)
  .replace('src="/app.js"', `src="/${app}"`)
writeFileSync(out + 'index.html', html)
cpSync(root + 'site/public', out, { recursive: true })
console.log(`site: ${catalog.length} rules, ${implemented.length} checked`)
