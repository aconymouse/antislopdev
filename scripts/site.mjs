import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
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

const pkg = JSON.parse(readFileSync(root + 'package.json', 'utf8'))
const repoUrl = 'https://github.com/aconymouse/antislopdev'
const npmUrl = 'https://www.npmjs.com/package/antislopdev'
const born = '2026-10-30T18:25:06Z'
const ids = {
  site: `${origin}/#website`,
  app: `${origin}/#app`,
  person: 'https://aconymous.com/#person',
  org: 'https://aconymous.com/#organization',
}
const ogImage = () => origin + asset('/og.jpg')
const json = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

const stampFile = root + 'site/lastmod.json'
const stamps = existsSync(stampFile) ? JSON.parse(readFileSync(stampFile, 'utf8')) : {}
const nextStamps = {}
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
const stamp = (path, body) => {
  const text = body
    .replace(/<script\b[^<>]*>[\s\S]*?<\/script\b[^<>]*>/gi, ' ')
    .replace(/<[^<>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const hash = createHash('sha256').update(text).digest('hex').slice(0, 16)
  const old = stamps[path]
  nextStamps[path] = old && old.hash === hash ? old : { hash, modified: now }
  return nextStamps[path].modified
}

const crumbs = (lang, page) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'antiSlopdev', item: origin + href(lang, 'home') },
    { '@type': 'ListItem', position: 2, name: copies[lang].nav[page], item: origin + href(lang, page) },
  ],
})

const graph = (lang, page, modified) => {
  const t = copies[lang]
  const url = origin + href(lang, page)
  const nodes = [
    {
      '@type': 'WebSite',
      '@id': ids.site,
      url: origin + '/',
      name: 'antiSlopdev',
      inLanguage: langs.map((l) => l.code),
      publisher: { '@id': ids.org },
    },
    {
      '@type': 'Person',
      '@id': ids.person,
      name: 'Hafidz Nc',
      url: lang === 'id' ? 'https://aconymous.com/id/tentang' : 'https://aconymous.com/en/about',
      sameAs: ['https://aconymous.com', 'https://github.com/aconymouse', 'https://www.npmjs.com/~aconymous'],
    },
    { '@type': 'Organization', '@id': ids.org, name: 'Aconymous', url: 'https://aconymous.com', founder: { '@id': ids.person } },
  ]
  if (page === 'home') {
    nodes.push({
      '@type': 'SoftwareApplication',
      '@id': ids.app,
      name: 'antiSlopdev',
      description: t.meta.home.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      softwareVersion: pkg.version,
      license: 'https://opensource.org/licenses/MIT',
      url,
      downloadUrl: npmUrl,
      installUrl: origin + href(lang, 'docs', '#skill'),
      sameAs: [repoUrl, npmUrl],
      image: ogImage(),
      inLanguage: lang,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@id': ids.person },
      publisher: { '@id': ids.org },
    })
  }
  if (page === 'docs') {
    nodes.push(
      {
        '@type': 'TechArticle',
        '@id': url + '#article',
        headline: t.meta.docs.title,
        description: t.meta.docs.description,
        url,
        inLanguage: lang,
        image: ogImage(),
        datePublished: born,
        dateModified: modified,
        author: { '@id': ids.person },
        publisher: { '@id': ids.org },
        isPartOf: { '@id': ids.site },
        about: { '@id': ids.app },
      },
      crumbs(lang, 'docs'),
    )
  }
  if (page === 'rules') {
    nodes.push(
      {
        '@type': 'CollectionPage',
        '@id': url + '#page',
        name: t.meta.rules.title,
        description: t.meta.rules.description,
        url,
        inLanguage: lang,
        dateModified: modified,
        isPartOf: { '@id': ids.site },
        about: { '@id': ids.app },
        mainEntity: {
          '@type': 'DefinedTermSet',
          '@id': url + '#set',
          name: lang === 'id' ? 'Aturan antiSlopdev' : 'antiSlopdev rules',
          hasDefinedTerm: catalog.map((r) => ({ '@type': 'DefinedTerm', termCode: r.id, name: r.title, url: `${url}#${r.id}` })),
        },
      },
      crumbs(lang, 'rules'),
    )
  }
  return json({ '@context': 'https://schema.org', '@graph': nodes })
}

const urls = []
for (const page of ['home', 'docs', 'rules']) {
  for (const { code: lang } of langs) {
    const meta = copies[lang].meta[page]
    const path = href(lang, page)
    const body = render(lang, page)
    const modified = stamp(path, body)
    urls.push({ page, lang, path, modified })
    const alternates = langs.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${origin}${href(l.code, page)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${origin}${href('en', page)}">`
    const html = `<!doctype html>
<html lang="${lang}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${origin}${path}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="antiSlopdev">
<meta property="og:url" content="${origin}${path}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:image" content="${ogImage()}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === 'id' ? 'id_ID' : 'en_US'}">
<meta property="og:locale:alternate" content="${lang === 'id' ? 'en_US' : 'id_ID'}">
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
<script type="application/ld+json">${graph(lang, page, modified)}</script>
</head>
<body>
<div id="root" data-page="${page}">${body}</div>
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

const stampText = JSON.stringify(nextStamps, null, 2) + '\n'
if (!existsSync(stampFile) || readFileSync(stampFile, 'utf8') !== stampText) {
  writeFileSync(stampFile, stampText)
  const moved = Object.keys(nextStamps).filter((k) => stamps[k]?.modified !== nextStamps[k].modified)
  if (moved.length) console.log(`site: lastmod moved for ${moved.join(' ')}, commit site/lastmod.json`)
}

const images = (page) => [ogImage(), ...(page === 'home' ? ['bg', 'clouds', 'peak'].map((n) => origin + asset(`/hero/${n}-2400.webp`)) : [])]
writeFileSync(
  out + 'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `<url>
<loc>${origin}${u.path}</loc>
<lastmod>${u.modified}</lastmod>
${langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${origin}${href(l.code, u.page)}"/>`).join('\n')}
<xhtml:link rel="alternate" hreflang="x-default" href="${origin}${href('en', u.page)}"/>
${images(u.page).map((i) => `<image:image><image:loc>${i}</image:loc></image:image>`).join('\n')}
</url>`,
  )
  .join('\n')}
</urlset>
`,
)
writeFileSync(out + 'robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)

const en = copies.en
writeFileSync(
  out + 'llms.txt',
  `# antiSlopdev

> ${en.meta.home.description}

antiSlopdev is an open-source rule list and checker for the generic output AI coding agents ship by default: interface, English and Indonesian copy, code, docs, commits, claims, accessibility, performance, SEO and security. Every rule has a stable ID (for example UI-01 or SEC-01) and a level: block fails the run, justify passes only with a written reason, warn is a smell. ${implemented.length} of the ${catalog.length} rules are checked by the CLI; the rest are for review by eye.

Install the agent skill with \`npx skills add aconymouse/antislopdev\`, or run the checker with \`npx antislopdev check <paths>\`. Current version: ${pkg.version}. License: MIT. Made by Hafidz Nc (Aconymous).

## Docs

- [Docs](${origin}${href('en', 'docs')}): install the skill, run the checker, levels, keeping a finding with antislopdev-allow, options, config, CI and commit hooks
- [Rules](${origin}${href('en', 'rules')}): all ${catalog.length} rules with IDs, levels and how each one is checked
- [RULES.md](https://raw.githubusercontent.com/aconymouse/antislopdev/main/RULES.md): the full rule list as Markdown, the single source of truth
- [SKILL.md](https://raw.githubusercontent.com/aconymouse/antislopdev/main/skills/antislopdev/SKILL.md): the instructions an agent follows when the skill is installed

## Code

- [GitHub](${repoUrl}): source, issues and pull requests
- [npm](${npmUrl}): the antislopdev package with the CLI and the JavaScript API

## Optional

- [Bahasa Indonesia](${origin}${href('id', 'home')}): the same site in Indonesian
- [sarangSEO](https://aconymous.com/tools/sarangseo): audit a live page against SEO rules
- [wowHacker](https://aconymous.com/tools/wowhacker): passive security scan of a domain you own
`,
)
rmSync(staging, { recursive: true, force: true })
console.log(`site: ${urls.length} pages, ${catalog.length} rules, ${implemented.length} checked`)
