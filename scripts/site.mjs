import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
  define: { 'process.env.NODE_ENV': '"production"' },
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
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'error',
})

const { render, copies, href, langs, catalog, implemented } = await import(pathToFileURL(staging + 'render.mjs').href)
const app = Object.entries(client.metafile.outputs).find(([, o]) => o.entryPoint?.endsWith('client.tsx'))[0].split('/').pop()
const css = readFileSync(root + 'site/style.css')
const sheet = `style-${createHash('sha256').update(css).digest('hex').slice(0, 10)}.css`
writeFileSync(out + sheet, css)
cpSync(root + 'site/public', out, { recursive: true })

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
<meta property="og:image" content="${origin}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === 'id' ? 'id_ID' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0d0f">
<link rel="icon" href="/favicon.ico?v=2" sizes="32x32">
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<script>${theme}</script>
<link rel="stylesheet" href="/${sheet}">
<link rel="modulepreload" href="/${app}">
${page === 'home' ? ['peak', 'bg'].map((n) => `<link rel="preload" as="image" type="image/webp" imagesrcset="/hero/${n}-1280.webp 1280w, /hero/${n}-2400.webp 2400w" imagesizes="100vw" fetchpriority="high">`).join('\n') : ''}
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
