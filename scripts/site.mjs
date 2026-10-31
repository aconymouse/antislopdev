import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const out = root + 'site/dist/'
const staging = root + 'site/.build/'
const alias = {
  react: 'preact/compat',
  'react-dom': 'preact/compat',
  'react-dom/client': 'preact/compat/client',
  'react-dom/server': 'preact/compat/server',
  'react/jsx-runtime': 'preact/jsx-runtime',
}
const origin = 'https://antislopdev.aconymous.com'

rmSync(out, { recursive: true, force: true })
rmSync(staging, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const stable = new Set(['/favicon.ico', '/robots.txt', '/sitemap.xml'])
const assets = {}
const hashed = []
const walk = (dir, base = '') => {
  for (const name of readdirSync(dir)) {
    const full = dir + '/' + name
    const url = base + '/' + name
    if (statSync(full).isDirectory()) walk(full, url)
    else if (!stable.has(url)) {
      const sum = createHash('sha256').update(readFileSync(full)).digest('hex').slice(0, 10)
      const dot = url.lastIndexOf('.')
      assets[url] = `${url.slice(0, dot)}-${sum}${url.slice(dot)}`
      hashed.push([full, assets[url]])
    }
  }
}
walk(root + 'site/public')
const define = { 'process.env.NODE_ENV': '"production"', __ASSETS__: JSON.stringify(assets) }
const asset = (url) => assets[url] ?? url

await build({
  entryPoints: [root + 'site/src/render.tsx'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  jsx: 'automatic',
  alias,
  outfile: staging + 'render.mjs',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  define,
  logLevel: 'error',
})

const client = await build({
  entryPoints: { app: root + 'site/src/client.tsx' },
  bundle: true,
  minify: true,
  splitting: true,
  format: 'esm',
  target: 'es2022',
  platform: 'browser',
  jsx: 'automatic',
  alias,
  outdir: out,
  entryNames: '[name]-[hash]',
  chunkNames: 'chunk-[hash]',
  legalComments: 'none',
  metafile: true,
  define,
  logLevel: 'error',
})

const { render, copies, href, langs, catalog, implemented } = await import(pathToFileURL(staging + 'render.mjs').href)
const app = Object.entries(client.metafile.outputs).find(([, o]) => o.entryPoint?.endsWith('client.tsx'))[0].split('/').pop()
const css = readFileSync(root + 'site/style.css')
const sheet = `style-${createHash('sha256').update(css).digest('hex').slice(0, 10)}.css`
writeFileSync(out + sheet, css)
cpSync(root + 'site/public', out, { recursive: true })
for (const [from, to] of hashed) {
  mkdirSync(out + to.slice(1, to.lastIndexOf('/') + 1), { recursive: true })
  cpSync(from, out + to.slice(1))
}

const theme = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('asd:theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}catch(e){document.documentElement.dataset.theme='dark'}`
const gtag = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-TCBSNMBT5C');`
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const ld = (lang) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'antiSlopdev',
    description: copies[lang].meta.home.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    license: 'https://opensource.org/licenses/MIT',
    url: origin + href(lang, 'home'),
    codeRepository: 'https://github.com/aconymouse/antislopdev',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'Hafidz Nc', url: 'https://aconymous.com/en/about' },
  })

const urls = []
for (const page of ['home', 'docs', 'rules']) {
  for (const { code: lang } of langs) {
    const meta = copies[lang].meta[page]
    const path = href(lang, page)
    urls.push(path)
    const alternates = langs.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${origin}${href(l.code, page)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${origin}${href('en', page)}">`
    const html = `<!doctype html>
<html lang="${lang}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${origin}${path}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="antiSlopdev">
<meta property="og:url" content="${origin}${path}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:image" content="${origin}${asset('/og.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === 'id' ? 'id_ID' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0d0f">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="${asset('/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset('/apple-touch-icon.png')}">
<script>${theme}</script>
<link rel="stylesheet" href="/${sheet}">
<link rel="modulepreload" href="/${app}">
${page === 'home' ? ['peak', 'bg'].map((n) => `<link rel="preload" as="image" type="image/webp" imagesrcset="${asset(`/hero/${n}-1280.webp`)} 1280w, ${asset(`/hero/${n}-2400.webp`)} 2400w" imagesizes="100vw" fetchpriority="high">`).join('\n') : ''}
<script type="module" src="/${app}"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TCBSNMBT5C"></script>
<script>${gtag}</script>
${page === 'home' ? `<script type="application/ld+json">${ld(lang)}</script>` : ''}
</head>
<body>
<div id="root" data-page="${page}">${render(lang, page)}</div>
</body>
</html>
`
    const dir = out + path.slice(1)
    mkdirSync(dir, { recursive: true })
    const loose = [...html.matchAll(/(?:src|href|content|imagesrcset|srcset)="([^"]+)"/g)]
      .flatMap((m) => m[1].split(',').map((x) => x.trim().split(' ')[0]))
      .map((u) => u.replace(origin, ''))
      .filter((u) => u.startsWith('/') && /\.(svg|png|jpe?g|webp|avif|ico|css|js)$/.test(u) && !stable.has(u) && !/-[0-9a-zA-Z]{8,}\.[a-z0-9]+$/.test(u))
    if (loose.length) throw new Error(`site: ${path} points at unhashed files, browsers would keep stale copies: ${[...new Set(loose)].join(', ')}`)
    writeFileSync(dir + 'index.html', html)
  }
}

writeFileSync(
  out + 'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${origin}${u}</loc></url>`).join('\n')}
</urlset>
`,
)
writeFileSync(out + 'robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
rmSync(staging, { recursive: true, force: true })
console.log(`site: ${urls.length} pages, ${catalog.length} rules, ${implemented.length} checked`)
