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
  loader: { '.md': 'text' },
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
  loader: { '.md': 'text' },
  outdir: out,
  entryNames: '[name]-[hash]',
  chunkNames: 'chunk-[hash]',
  legalComments: 'none',
  metafile: true,
  define,
  logLevel: 'error',
})

const { render, copies, href, langs, catalog, implemented, storyHref } = await import(pathToFileURL(staging + 'render.mjs').href)
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
  if (page === 'features') {
    nodes.push(
      {
        '@type': 'WebPage',
        '@id': url + '#page',
        name: t.meta.features.title,
        description: t.meta.features.description,
        url,
        inLanguage: lang,
        dateModified: modified,
        isPartOf: { '@id': ids.site },
        about: { '@id': ids.app },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: t.features.groups.flatMap((g) => g.items).map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.title, description: item.body })),
        },
      },
      crumbs(lang, 'features'),
    )
  }
  if (page === 'support') {
    nodes.push(
      {
        '@type': 'WebPage',
        '@id': url + '#page',
        name: t.meta.support.title,
        description: t.meta.support.description,
        url,
        inLanguage: lang,
        dateModified: modified,
        isPartOf: { '@id': ids.site },
        about: { '@id': ids.app },
      },
      crumbs(lang, 'support'),
    )
  }
  return json({ '@context': 'https://schema.org', '@graph': nodes })
}

const storiesFile = root + 'site/stories.json'
const slugOk = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const validEntry = (e) => e && slugOk.test(e.slug) && typeof e.title === 'string' && e.title && typeof e.html === 'string'
const loadStories = async () => {
  if (existsSync(storiesFile)) return JSON.parse(readFileSync(storiesFile, 'utf8')).stories ?? []
  if (!process.env.STORIES_URL) return []
  const res = await fetch(process.env.STORIES_URL)
  if (!res.ok) throw new Error(`site: stories feed answered ${res.status}`)
  return (await res.json()).stories ?? []
}
const stories = (await loadStories())
  .filter((st) => st && Number.isInteger(st.id) && st.locales && typeof st.publishedAt === 'string')
  .map((st) => ({ ...st, locales: Object.fromEntries(Object.entries(st.locales).filter(([code, e]) => langs.some((l) => l.code === code) && validEntry(e))) }))
  .filter((st) => Object.keys(st.locales).length)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
const storiesIn = (lang) => stories.filter((st) => st.locales[lang])
const count = (lang) => storiesIn(lang).length
const storyLangs = langs.filter((l) => count(l.code))

const doc = ({ lang, page, path, title, description, alternates, type = 'website', image = ogImage(), imageSize = [1200, 630], extraHead = '', jsonld, body, data }) => {
  const links = alternates.map(([code, url]) => `<link rel="alternate" hreflang="${code}" href="${origin}${url}">`)
  const fallback = alternates.find(([code]) => code === 'en') ?? alternates[0]
  if (fallback) links.push(`<link rel="alternate" hreflang="x-default" href="${origin}${fallback[1]}">`)
  return `<!doctype html>
<html lang="${lang}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${origin}${path}">
${links.join('\n')}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="antiSlopdev">
<meta property="og:url" content="${origin}${path}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
${imageSize[0] ? `<meta property="og:image:width" content="${imageSize[0]}">\n` : ''}${imageSize[1] ? `<meta property="og:image:height" content="${imageSize[1]}">\n` : ''}<meta property="og:locale" content="${lang === 'id' ? 'id_ID' : 'en_US'}">
${alternates.filter(([code]) => code !== lang).map(([code]) => `<meta property="og:locale:alternate" content="${code === 'id' ? 'id_ID' : 'en_US'}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0d0f">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="${asset('/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset('/apple-touch-icon.png')}">
${count(lang) ? `<link rel="alternate" type="application/rss+xml" title="${esc(copies[lang].meta.stories.title)}" href="${origin}${href(lang, 'stories')}feed.xml">\n` : ''}<script>${theme}</script>
<link rel="stylesheet" href="/${sheet}">
<link rel="modulepreload" href="/${app}">
${extraHead}<script type="module" src="/${app}"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TCBSNMBT5C"></script>
<script>${gtag}</script>
<script type="application/ld+json">${jsonld}</script>
${data ? `<script>window.__page=${json(data)}</script>\n` : ''}</head>
<body>
<div id="root" data-page="${page}" data-stories="${count(lang)}">${body}</div>
</body>
</html>
`
}

const write = (path, html) => {
  const dir = out + path.slice(1)
  mkdirSync(dir, { recursive: true })
  const loose = [...html.matchAll(/(?:src|href|content|imagesrcset|srcset)="([^"]+)"/g)]
    .flatMap((m) => m[1].split(',').map((x) => x.trim().split(' ')[0]))
    .map((u) => u.replace(origin, ''))
    .filter((u) => u.startsWith('/') && /\.(svg|png|jpe?g|webp|avif|ico|css|js)$/.test(u) && !stable.has(u) && !/-[0-9a-zA-Z]{8,}\.[a-z0-9]+$/.test(u))
  if (loose.length) throw new Error(`site: ${path} points at unhashed files, browsers would keep stale copies: ${[...new Set(loose)].join(', ')}`)
  writeFileSync(dir + 'index.html', html)
}

const images = (page) => [ogImage(), ...(page === 'home' ? ['bg', 'clouds', 'peak'].map((n) => origin + asset(`/hero/${n}-2400.webp`)) : [])]

const urls = []
for (const page of ['home', 'docs', 'rules', 'support', 'features']) {
  for (const { code: lang } of langs) {
    const meta = copies[lang].meta[page]
    const path = href(lang, page)
    const body = render(lang, page, { count: count(lang) })
    const modified = stamp(path, count(lang) ? render(lang, page, { count: 0 }) : body)
    urls.push({ path, modified, alternates: langs.map((l) => [l.code, href(l.code, page)]), images: images(page) })
    const extraHead = page === 'home' ? ['peak', 'bg'].map((n) => `<link rel="preload" as="image" type="image/webp" imagesrcset="${asset(`/hero/${n}-1280.webp`)} 1280w, ${asset(`/hero/${n}-2400.webp`)} 2400w" imagesizes="100vw" fetchpriority="high">`).join('\n') + '\n' : ''
    write(path, doc({ lang, page, path, title: meta.title, description: meta.description, alternates: langs.map((l) => [l.code, href(l.code, page)]), extraHead, jsonld: graph(lang, page, modified), body }))
  }
}

const storyGraph = (lang, entry, st, path) => {
  const url = origin + path
  return json({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': ids.site, url: origin + '/', name: 'antiSlopdev', publisher: { '@id': ids.org } },
      { '@type': 'Person', '@id': ids.person, name: 'Hafidz Nc', url: 'https://aconymous.com' },
      { '@type': 'Organization', '@id': ids.org, name: 'Aconymous', url: 'https://aconymous.com', founder: { '@id': ids.person } },
      {
        '@type': st.kind === 'tutorial' ? 'TechArticle' : st.kind === 'news' ? 'NewsArticle' : 'BlogPosting',
        '@id': url + '#article',
        headline: entry.title,
        description: entry.seoDescription || entry.excerpt,
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
        image: entry.cover ? [entry.cover.url] : [ogImage()],
        datePublished: st.publishedAt,
        dateModified: st.modifiedAt || st.publishedAt,
        timeRequired: `PT${entry.readingMinutes}M`,
        keywords: entry.tags.length ? entry.tags.join(', ') : undefined,
        author: { '@id': ids.person },
        publisher: { '@id': ids.org },
        isPartOf: { '@id': ids.site },
        about: { '@id': ids.app },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'antiSlopdev', item: origin + href(lang, 'home') },
          { '@type': 'ListItem', position: 2, name: copies[lang].nav.stories, item: origin + href(lang, 'stories') },
          { '@type': 'ListItem', position: 3, name: entry.title, item: url },
        ],
      },
    ],
  })
}

for (const { code: lang } of storyLangs) {
  const list = storiesIn(lang)
  const path = href(lang, 'stories')
  const cards = list.map((st) => ({ id: st.id, href: storyHref(lang, st.locales[lang].slug), title: st.locales[lang].title, excerpt: st.locales[lang].excerpt, date: st.publishedAt, minutes: st.locales[lang].readingMinutes }))
  const data = { count: list.length, cards }
  const modified = list.map((st) => st.modifiedAt || st.publishedAt).sort().at(-1)
  const meta = copies[lang].meta.stories
  const alternates = storyLangs.map((l) => [l.code, href(l.code, 'stories')])
  urls.push({ path, modified, alternates, images: [ogImage()] })
  const jsonld = json({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': ids.site, url: origin + '/', name: 'antiSlopdev', publisher: { '@id': ids.org } },
      { '@type': 'Organization', '@id': ids.org, name: 'Aconymous', url: 'https://aconymous.com' },
      {
        '@type': 'Blog',
        '@id': origin + path + '#blog',
        name: meta.title,
        description: meta.description,
        url: origin + path,
        inLanguage: lang,
        dateModified: modified,
        isPartOf: { '@id': ids.site },
        publisher: { '@id': ids.org },
        blogPost: cards.map((c) => ({ '@type': 'BlogPosting', headline: c.title, url: origin + c.href, datePublished: c.date })),
      },
      crumbs(lang, 'stories'),
    ],
  })
  write(path, doc({ lang, page: 'stories', path, title: meta.title, description: meta.description, alternates, jsonld, body: render(lang, 'stories', data), data }))

  for (const st of list) {
    const entry = st.locales[lang]
    const own = storyHref(lang, entry.slug)
    const alt = Object.fromEntries(langs.map((l) => [l.code, st.locales[l.code] ? storyHref(l.code, st.locales[l.code].slug) : href(l.code, 'stories')]))
    const otherLang = lang === 'en' ? 'id' : 'en'
    const view = { title: entry.title, date: st.publishedAt, modified: st.modifiedAt || st.publishedAt, minutes: entry.readingMinutes, cover: entry.cover, tags: entry.tags, html: entry.html, other: st.locales[otherLang] ? storyHref(otherLang, st.locales[otherLang].slug) : null }
    const pageData = { count: list.length, story: view, alt }
    const alternates = langs.filter((l) => st.locales[l.code]).map((l) => [l.code, storyHref(l.code, st.locales[l.code].slug)])
    urls.push({ path: own, modified: view.modified, alternates, images: entry.cover ? [entry.cover.url] : [] })
    const extraHead = `<meta property="article:published_time" content="${st.publishedAt}">\n<meta property="article:modified_time" content="${view.modified}">\n<meta property="article:author" content="https://aconymous.com">\n${entry.tags.map((t) => `<meta property="article:tag" content="${esc(t)}">`).join('\n')}${entry.tags.length ? '\n' : ''}`
    write(
      own,
      doc({
        lang,
        page: 'stories',
        path: own,
        title: entry.seoTitle || entry.title,
        description: entry.seoDescription || entry.excerpt,
        alternates,
        type: 'article',
        image: entry.cover?.url ?? ogImage(),
        imageSize: entry.cover ? [entry.cover.width, entry.cover.height] : [1200, 630],
        extraHead,
        jsonld: storyGraph(lang, entry, st, own),
        body: render(lang, 'stories', pageData),
        data: { ...pageData, story: { ...view, html: '' } },
      }),
    )
  }

  const xml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${xml(meta.title)}</title>
<link>${origin}${path}</link>
<description>${xml(meta.description)}</description>
<language>${lang === 'id' ? 'id-ID' : 'en-US'}</language>
<lastBuildDate>${new Date(modified).toUTCString()}</lastBuildDate>
<atom:link href="${origin}${path}feed.xml" rel="self" type="application/rss+xml"/>
${list
  .map((st) => {
    const e = st.locales[lang]
    const link = origin + storyHref(lang, e.slug)
    return `<item>
<title>${xml(e.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${new Date(st.publishedAt).toUTCString()}</pubDate>
<dc:creator>Hafidz Nc</dc:creator>
${e.tags.map((t) => `<category>${xml(t)}</category>`).join('\n')}
<description>${xml(e.excerpt)}</description>
<content:encoded><![CDATA[${e.html.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
</item>`
  })
  .join('\n')}
</channel>
</rss>
`
  writeFileSync(out + path.slice(1) + 'feed.xml', feed)
}

const stampText = JSON.stringify(nextStamps, null, 2) + '\n'
if (!existsSync(stampFile) || readFileSync(stampFile, 'utf8') !== stampText) {
  writeFileSync(stampFile, stampText)
  const moved = Object.keys(nextStamps).filter((k) => stamps[k]?.modified !== nextStamps[k].modified)
  if (moved.length) console.log(`site: lastmod moved for ${moved.join(' ')}, commit site/lastmod.json`)
}

writeFileSync(
  out + 'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `<url>
<loc>${origin}${u.path}</loc>
<lastmod>${u.modified}</lastmod>
${u.alternates.map(([code, url]) => `<xhtml:link rel="alternate" hreflang="${code}" href="${origin}${url}"/>`).join('\n')}
<xhtml:link rel="alternate" hreflang="x-default" href="${origin}${(u.alternates.find(([code]) => code === 'en') ?? u.alternates[0])[1]}"/>
${u.images.map((i) => `<image:image><image:loc>${i.replace(/&/g, '&amp;')}</image:loc></image:image>`).join('\n')}
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
- [Features](${origin}${href('en', 'features')}): everything antiSlopdev does, from the rules and the checker to custom rules, levels, the agent skill and CI
- [Support](${origin}${href('en', 'support')}): how to contribute, the roadmap and donations
- [ROADMAP.md](https://raw.githubusercontent.com/aconymouse/antislopdev/main/ROADMAP.md): what is planned now, next and later
- [CHANGELOG.md](https://raw.githubusercontent.com/aconymouse/antislopdev/main/CHANGELOG.md): what changed in each release

${
  storyLangs.length
    ? `## Stories

${stories
  .map((st) => {
    const code = st.locales.en ? 'en' : 'id'
    const e = st.locales[code]
    return `- [${e.title}](${origin}${storyHref(code, e.slug)}): ${e.excerpt}`
  })
  .join('\n')}

`
    : ''
}## Code

- [GitHub](${repoUrl}): source, issues and pull requests
- [npm](${npmUrl}): the antislopdev package with the CLI and the JavaScript API

## Optional

- [Bahasa Indonesia](${origin}${href('id', 'home')}): the same site in Indonesian
- [sarangSEO](https://aconymous.com/tools/sarangseo): audit a live page against SEO rules
- [wowHacker](https://aconymous.com/tools/wowhacker): passive security scan of a domain you own
`,
)
rmSync(staging, { recursive: true, force: true })
console.log(`site: ${urls.length} pages, ${stories.length} stories, ${catalog.length} rules, ${implemented.length} checked`)
