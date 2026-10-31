import type { FileKind, Hit } from '../types.js'
import { type Rule, coded, markup } from '../rule.js'
import type { Source, Tag } from '../source.js'
import { blocks, escapeRegExp, quote, scan } from '../util.js'

const everywhere: readonly FileKind[] = ['script', 'jsx', 'markup', 'style', 'config', 'manifest', 'prose']
const server: readonly FileKind[] = ['script', 'jsx']
const media = /^(img|Image|source|picture)$/

function attr(t: Tag, name: string): string | undefined {
  const m = t.attrs.match(new RegExp(`(?:^|\\s)${escapeRegExp(name)}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*["'\`]([^"'\`]*)["'\`]\\s*\\})`, 'i'))
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined
}

function has(t: Tag, name: string): boolean {
  return new RegExp(`(?:^|\\s)${escapeRegExp(name)}\\s*=`, 'i').test(t.attrs)
}

function headOf(src: Source): { start: number; end: number } | undefined {
  const b = blocks(src.text, /<head\b[^<>]*>/i, /<\/head\b[^<>]*>/i)[0]
  return b && b.bodyEnd < src.text.length ? { start: b.start, end: b.end } : undefined
}

function inHead(src: Source): Tag[] {
  const h = headOf(src)
  return h ? src.tags.filter((t) => t.start >= h.start && t.start < h.end) : []
}

function meta(tags: Tag[], key: string): Tag | undefined {
  return tags.find((t) => t.name === 'meta' && (attr(t, 'name') ?? attr(t, 'property') ?? '').toLowerCase() === key)
}

function inCode(src: Source, index: number): boolean {
  return src.code[index] !== ' '
}

function file(url: string): string {
  return (url.split(/[?#]/)[0] ?? '').split('/').pop() ?? ''
}

function images(src: Source): { tag: Tag; url: string }[] {
  return src.tags
    .filter((t) => media.test(t.name))
    .map((tag) => ({ tag, url: attr(tag, 'src') ?? (attr(tag, 'srcset') ?? attr(tag, 'srcSet') ?? '').trim().split(/[\s,]/)[0] ?? '' }))
    .filter((i) => i.url && !/^(data:|blob:)/.test(i.url))
}

const local = /^(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::|\/|$)|\.(?:test|local|localhost)(?::|\/|$)/
const strong = [
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bsk-(?:proj-|ant-(?:api\d+-)?)?[A-Za-z0-9_-]{32,}/g,
  /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{60,}\b/g,
  /\bxox[abprs]-[A-Za-z0-9-]{20,}/g,
  /\bAIza[0-9A-Za-z_-]{35}\b/g,
  /\b[rs]k_live_[0-9A-Za-z]{20,}\b/g,
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g,
]
const assigned = /\b(api[_-]?key|secret(?:[_-]?key)?|access[_-]?token|auth[_-]?token|client[_-]?secret|passw(?:or)?d)\b["']?\s*[:=]\s*["']([^"'\s]{16,})["']/gi
const placeholder = /your|example|xxx|changeme|placeholder|dummy|sample|test|redacted|<|\$\{|\*{3}/i
const sql = /\b(select\b[\s\S]{1,2000}?\bfrom|insert\s+into|update\s+[\w."`[\]]+\s+set|delete\s+from)\b/i


const domText = /\.(?:textContent|innerText|outerText)\b|\.dataset\b|\.getAttribute\s*\(|\blocation\.(?:hash|search)\b|\bdocument\.(?:referrer|URL|documentURI)\b|\bwindow\.name\b|\bsearchParams\.get\s*\(/
const htmlSink = /\.(?:innerHTML|outerHTML)\s*\+?=(?!=)|\.insertAdjacentHTML\s*\(|\bdocument\.write(?:ln)?\s*\(|\bdangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:|\.(?:href|src|action|formAction)\s*=(?!=)|(?<![\w$.-])(?:href|src|action|formAction)\s*=\s*\{|\blocation(?:\.href)?\s*=(?!=)|\blocation\.(?:assign|replace)\s*\(|\bwindow\.open\s*\(|\.setAttribute\s*\(\s*["'](?:href|src|action|formaction)["']\s*,/g
const cleaned = /DOMPurify|sanitiz|escape|encodeURI|safe[A-Z][\w$]*\s*\(|allowed|Number\s*\(|parseInt|parseFloat|Boolean\s*\(|\.test\s*\(|startsWith\s*\(/i

function sinkValue(text: string, from: number, sink: string): string {
  const open = sink.trim().endsWith('{') || sink.endsWith(':') ? '{' : sink.trim().endsWith('(') || sink.trim().endsWith(',') ? '(' : ''
  const limit = Math.min(text.length, from + 400)
  if (!open) {
    let i = from
    while (i < limit && text[i] !== ';' && text[i] !== '\n') i++
    return text.slice(from, i)
  }
  const close = open === '{' ? '}' : ')'
  let depth = 1
  let i = from
  for (; i < limit && depth > 0; i++) {
    if (text[i] === open) depth++
    else if (text[i] === close) depth--
  }
  return text.slice(from, depth === 0 ? i - 1 : i)
}

const passthrough = new Set(['String', 'parse', 'decodeURIComponent', 'decodeURI', 'atob', 'URLSearchParams', 'unescape', 'trim', 'get'])

function wrapped(rhs: string): boolean {
  const at = rhs.search(domText)
  if (at < 0) return false
  const call = rhs.slice(0, at).match(/([\w$]+)\s*\(\s*[\w$.?[\]]*$/)
  return Boolean(call && !passthrough.has(call[1]!))
}

function tainted(src: Source): { name: string; at: number }[] {
  const out: { name: string; at: number }[] = []
  const decls = [...src.text.matchAll(/\b(?:const|let|var)\s+([\w$]+)(?:\s*:\s*[\w$<>[\],.| ]{1,60})?\s*=\s*([^;\n]{1,240})/g)].filter((m) => inCode(src, m.index))
  const named = (rhs: string) => out.some((t) => new RegExp(`(?<![\\w$.])${escapeRegExp(t.name)}(?![\\w$])`).test(rhs))
  for (let pass = 0; pass < 3; pass++) {
    const before = out.length
    for (const m of decls) {
      const rhs = m[2]!
      if (out.some((t) => t.at === m.index) || cleaned.test(rhs) || wrapped(rhs)) continue
      if (domText.test(rhs) || named(rhs)) out.push({ name: m[1]!, at: m.index })
    }
    if (out.length === before) break
  }
  return out
}

interface Atom {
  start: number
  min: number
  max: number
  pump: boolean
}

function pumpable(alt: Atom[]): boolean {
  let open = 0
  let needed = 0
  for (const a of alt) {
    if (a.max === Infinity || a.pump) open++
    if (a.min > 0) needed++
  }
  return open > 0 && needed <= 1 && alt.every((a) => a.min === 0 || a.max === Infinity || a.pump)
}

export function backtracks(p: string): number {
  const stack: { start: number; alts: Atom[][] }[] = [{ start: 0, alts: [[]] }]
  let i = 0
  while (i < p.length) {
    const c = p[i]!
    let atom: Atom
    if (c === '\\') {
      atom = { start: i, min: 1, max: 1, pump: false }
      i += 2
    } else if (c === '[') {
      let j = i + 1
      if (p[j] === '^') j++
      if (p[j] === ']') j++
      while (j < p.length && p[j] !== ']') j += p[j] === '\\' ? 2 : 1
      atom = { start: i, min: 1, max: 1, pump: false }
      i = j + 1
    } else if (c === '(') {
      stack.push({ start: i, alts: [[]] })
      i++
      if (p[i] === '?') {
        const m = p.slice(i, i + 40).match(/^\?(?:<[=!]|[:=!]|<[\w$]+>)/)
        i += m ? m[0].length : 1
      }
      continue
    } else if (c === '|') {
      stack.at(-1)!.alts.push([])
      i++
      continue
    } else if (c === ')') {
      if (stack.length < 2) return -1
      const g = stack.pop()!
      atom = { start: g.start, min: 1, max: 1, pump: g.alts.some(pumpable) }
      i++
    } else if (c === '^' || c === '$') {
      i++
      continue
    } else {
      atom = { start: i, min: 1, max: 1, pump: false }
      i++
    }
    const q = p[i]
    if (q === '*' || q === '+' || q === '?') {
      atom.min = q === '+' ? 1 : 0
      atom.max = q === '?' ? 1 : Infinity
      i++
    } else if (q === '{') {
      const m = p.slice(i, i + 24).match(/^\{(\d+)(,(\d*))?\}/)
      if (m) {
        atom.min = Number(m[1])
        atom.max = m[2] === undefined ? atom.min : m[3] ? Number(m[3]) : Infinity
        i += m[0].length
      }
    }
    if (p[i] === '?') i++
    if (atom.pump && atom.max === Infinity) return atom.start
    stack.at(-1)!.alts.at(-1)!.push(atom)
  }
  return -1
}

function patterns(src: Source): { index: number; text: string }[] {
  const out = src.regexes.map((r) => ({ index: r.start - 1, text: r.text }))
  for (const s of src.strings) {
    if (!/\bRegExp\(\s*$/.test(src.text.slice(Math.max(0, s.start - 24), s.start - 1))) continue
    out.push({ index: s.start - 1, text: s.text.replace(/\$\{[^{}]*\}/g, 'x').replace(/\\\\/g, '\\') })
  }
  return out
}

function firstArgument(text: string, from: number): string {
  let depth = 0
  let quote = ''
  const end = Math.min(text.length, from + 400)
  for (let i = from; i < end; i++) {
    const c = text[i]!
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = ''
      continue
    }
    if (c === '"' || c === "'" || c === '`') quote = c
    else if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') {
      if (depth === 0) return text.slice(from, i)
      depth--
    } else if (c === ',' && depth === 0) return text.slice(from, i)
  }
  return text.slice(from, end)
}

const input = /\b(?:req|request|params|searchParams|query|body|search|term|keyword|input|value|filter|text|name|user|word|q)\b/i

const unpinnable = /^(?:https?:)?\/\/(?:www\.googletagmanager\.com|www\.google-analytics\.com|fonts\.googleapis\.com|js\.stripe\.com|challenges\.cloudflare\.com|static\.cloudflareinsights\.com|www\.google\.com\/recaptcha|www\.gstatic\.com\/recaptcha|maps\.googleapis\.com|plausible\.io|connect\.facebook\.net|platform\.twitter\.com|www\.youtube\.com|securepubads\.g\.doubleclick\.net|pagead2\.googlesyndication\.com|www\.googletagservices\.com)\//i

const rules: Rule[] = [
  {
    id: 'SEO-01',
    on: ['markup'],
    run(src) {
      const h = headOf(src)
      if (!h) return []
      const tags = inHead(src)
      const hits: Hit[] = []
      if (!tags.some((t) => t.name === 'title')) hits.push({ index: h.start, length: 6, note: 'no <title>' })
      if (!meta(tags, 'description')) hits.push({ index: h.start, length: 6, note: 'no meta description' })
      return hits
    },
  },
  {
    id: 'SEO-02',
    on: markup,
    run(src) {
      const hits: Hit[] = []
      for (const t of src.tags) {
        if (t.name === 'title') {
          const text = src.inner(t).replace(/\s+/g, ' ').trim()
          if (text.length > 60 && !/[{}]/.test(text)) hits.push({ index: t.start, note: `title is ${text.length} characters` })
        }
        if (t.name === 'meta' && (attr(t, 'name') ?? '').toLowerCase() === 'description') {
          const text = attr(t, 'content') ?? ''
          if (text.length > 160) hits.push({ index: t.start, note: `description is ${text.length} characters` })
        }
      }
      return hits
    },
  },
  {
    id: 'SEO-03',
    on: ['markup'],
    run(src) {
      const h = headOf(src)
      if (!h) return []
      return inHead(src).some((t) => t.name === 'link' && /\bcanonical\b/i.test(attr(t, 'rel') ?? '')) ? [] : [{ index: h.start, length: 6, note: 'no rel="canonical"' }]
    },
  },
  {
    id: 'SEO-04',
    on: markup,
    run(src) {
      const h1 = src.tags.filter((t) => t.name === 'h1')
      return h1.length > 1 ? [{ index: h1[1]!.start, note: `${h1.length} h1 elements` }] : []
    },
  },
  {
    id: 'SEO-05',
    on: markup,
    run: (src) => src.tags.filter((t) => t.name === 'html' && !has(t, 'lang')).map((t) => ({ index: t.start, note: '<html> without lang' })),
  },
  {
    id: 'SEO-06',
    on: ['markup'],
    run(src) {
      const h = headOf(src)
      if (!h) return []
      const tags = inHead(src)
      const missing = ['og:title', 'og:description', 'og:image', 'twitter:card'].filter((k) => !meta(tags, k))
      return missing.length ? [{ index: h.start, length: 6, note: `missing ${missing.join(', ')}` }] : []
    },
  },
  {
    id: 'SEO-07',
    on: markup,
    run(src) {
      return src.tags
        .filter((t) => t.name === 'meta' && /^(og:image(:url)?|twitter:image)$/i.test(attr(t, 'property') ?? attr(t, 'name') ?? ''))
        .filter((t) => {
          const c = attr(t, 'content')
          return c !== undefined && c !== '' && !/^(https?:)?\/\//i.test(c)
        })
        .map((t) => ({ index: t.start, note: quote(attr(t, 'content') ?? '') }))
    },
  },
  {
    id: 'SEO-08',
    on: markup,
    run(src) {
      const hits: Hit[] = []
      for (const t of src.tags) {
        if (t.name !== 'script' || !/application\/ld\+json/i.test(attr(t, 'type') ?? '')) continue
        const body = src.inner(t).trim()
        if (!body || /^\{\s*(JSON|`)|\{\{|\{@|\$\{|<%|\{\s*\w+\s*\}/.test(body)) continue
        let data: unknown
        try {
          data = JSON.parse(body)
        } catch {
          hits.push({ index: t.start, note: 'not valid JSON' })
          continue
        }
        const nodes = (Array.isArray(data) ? data : [data]) as Record<string, unknown>[]
        for (const n of nodes) {
          if (!n || typeof n !== 'object') continue
          if (!('@context' in n)) hits.push({ index: t.start, note: 'no @context' })
          const graph = Array.isArray(n['@graph']) ? (n['@graph'] as Record<string, unknown>[]) : [n]
          if (graph.some((g) => g && typeof g === 'object' && !('@type' in g))) hits.push({ index: t.start, note: 'an item without @type' })
        }
      }
      return hits
    },
  },
  {
    id: 'SEO-10',
    on: [...markup, 'script'],
    run(src) {
      const hits: Hit[] = src.tags
        .filter((t) => t.name === 'meta' && /^(robots|googlebot)$/i.test(attr(t, 'name') ?? '') && /noindex/i.test(attr(t, 'content') ?? ''))
        .map((t) => ({ index: t.start, note: 'noindex' }))
      if (src.isScript) hits.push(...scan(src.code, /\brobots\s*:\s*\{[^}]*\bindex\s*:\s*false/g, () => 'robots index: false'))
      return hits
    },
  },
  {
    id: 'SEO-11',
    on: markup,
    run: (src) =>
      images(src)
        .filter((i) => /\.(png|jpe?g)$/i.test(file(i.url)) && !/(logo|icon|favicon|badge|sprite|screenshot|screen|ui-|diagram|chart|og|apple-touch|wordmark)/i.test(file(i.url)))
        .map((i) => ({ index: i.tag.start, note: quote(file(i.url)) })),
  },
  {
    id: 'SEO-12',
    on: markup,
    run: (src) =>
      images(src)
        .filter((i) => /\.(png|jpe?g|webp|gif)$/i.test(file(i.url)) && /(logo|icon|badge|wordmark|diagram|arrow|glyph)/i.test(file(i.url)) && !/(favicon|apple-touch|android-chrome|maskable)/i.test(file(i.url)))
        .map((i) => ({ index: i.tag.start, note: quote(file(i.url)) })),
  },
  {
    id: 'SEO-13',
    on: ['markup'],
    run(src) {
      const icons = inHead(src).filter((t) => t.name === 'link' && /(^|\s)icon(\s|$)/i.test(attr(t, 'rel') ?? ''))
      return icons.length && !icons.some((t) => /\.ico(\?|$)/i.test(attr(t, 'href') ?? '')) ? [{ index: icons[0]!.start, note: 'no .ico among the favicons' }] : []
    },
  },
  {
    id: 'SEO-14',
    on: markup,
    run(src) {
      return src.tags
        .filter((t) => t.name === 'a')
        .filter((t) => {
          const href = attr(t, 'href')
          if (href === undefined) return !has(t, 'href') && /\b(onClick|@click|on:click|v-on:click)\b/.test(t.attrs)
          return href === '#' || /^javascript:/i.test(href)
        })
        .map((t) => ({ index: t.start, note: quote(src.text.slice(t.start, t.end)) }))
    },
  },
  {
    id: 'SEO-19',
    on: markup,
    run(src) {
      const hits: Hit[] = []
      for (const i of images(src)) {
        const name = file(i.url)
        const alt = (attr(i.tag, 'alt') ?? '').trim()
        if (/^(img|dsc|dscn|pxl|mvimg|screenshot|screen[ _-]?shot|image|photo|picture|untitled|download|unnamed)[-_ ]?\(?\d*\)?\.\w+$/i.test(name)) hits.push({ index: i.tag.start, note: quote(name) })
        else if (alt && alt.toLowerCase() === name.replace(/\.\w+$/, '').toLowerCase()) hits.push({ index: i.tag.start, note: `alt repeats the file name ${quote(name)}` })
      }
      return hits
    },
  },
  {
    id: 'SEO-20',
    on: markup,
    run: (src) =>
      src.tags
        .filter((t) => t.name === 'meta' && /^robots$/i.test(attr(t, 'name') ?? ''))
        .filter((t) => {
          const c = attr(t, 'content') ?? ''
          return c && !/noindex/i.test(c) && !/max-image-preview\s*:\s*large/i.test(c)
        })
        .map((t) => ({ index: t.start, note: quote(attr(t, 'content') ?? '') })),
  },
  {
    id: 'SEC-01',
    on: everywhere,
    run(src) {
      const hits: Hit[] = []
      for (const re of strong) hits.push(...scan(src.text, re, (m) => `${m[0].slice(0, 6)}… looks like a live key`))
      if ((src.isScript || src.kind === 'config') && !src.isTest) {
        for (const m of src.text.matchAll(assigned)) {
          const value = m[2]!
          if (placeholder.test(value) || !/[A-Za-z]/.test(value) || !/\d/.test(value) || /^(process|import)\.|^env\./.test(value)) continue
          hits.push({ index: m.index, length: m[0].length, note: `${m[1]} written in the source` })
        }
      }
      return hits
    },
  },
  {
    id: 'SEC-02',
    on: ['config'],
    run: (src) => (/(^|[\\/])\.env(\.(?!example|sample|template|dist|defaults)[\w.-]+)?$/i.test(src.path) ? [{ index: 0, length: 1, note: `${src.path} is in the tree` }] : []),
  },
  {
    id: 'SEC-03',
    on: [...coded, 'config', 'manifest'],
    run: (src) => scan(src.text, /\b(?:NEXT_PUBLIC|VITE|PUBLIC|EXPO_PUBLIC|REACT_APP|NUXT_PUBLIC|GATSBY|NG_APP)_[A-Z0-9_]*(?:SECRET|PRIVATE|PASSWORD|PASSWD|SERVICE_ROLE|ADMIN_KEY|DATABASE_URL)[A-Z0-9_]*/g, (m) => m[0]),
  },
  {
    id: 'SEC-04',
    on: ['script', 'jsx', 'markup'],
    run: (src) => scan(src.code, /(?<![.\w$])eval\s*\(|\bnew\s+Function\s*\(|\bset(?:Timeout|Interval)\s*\(\s*["'`]/g, (m) => quote(m[0])),
  },
  {
    id: 'SEC-05',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      const hits: Hit[] = scan(src.code, /dangerouslySetInnerHTML\s*=\s*\{\{\s*__html\s*:(?!\s*(?:JSON\.stringify|DOMPurify|sanitize|purify|xss\())/g, () => 'dangerouslySetInnerHTML')
      for (const m of src.code.matchAll(/\.(?:innerHTML|outerHTML)\s*\+?=\s*|\.insertAdjacentHTML\s*\(\s*["'`][^,]*,\s*/g)) {
        const at = m.index + m[0].length
        const next = src.text[at]
        if (next === '"' || next === "'") continue
        if (next === '`' && !src.text.slice(at, src.text.indexOf('`', at + 1)).includes('${')) continue
        if (/^(DOMPurify|sanitize|purify)/.test(src.text.slice(at, at + 12))) continue
        hits.push({ index: m.index, note: quote(src.text.slice(m.index, at + 24)) })
      }
      if (src.kind === 'markup') hits.push(...scan(src.text, /\bv-html\s*=\s*["'](?![^"']*(sanitize|purify))|\{@html(?!\s+\w*(sanitize|purify))/gi, (m) => quote(m[0])))
      return hits
    },
  },
  {
    id: 'SEC-06',
    on: server,
    run(src) {
      const hits: Hit[] = []
      for (const s of src.strings) {
        if (!sql.test(s.text)) continue
        const q = src.text[s.start - 1]
        if (q === '`') {
          if (!s.text.includes('${')) continue
          const tag = src.text.slice(Math.max(0, s.start - 40), s.start - 1).match(/([\w$.]+)\s*$/)
          if (tag && !/unsafe/i.test(tag[1]!)) continue
          hits.push({ index: s.start - 1, note: 'SQL in a template string with ${…}' })
        } else if (/^\s*\+\s*[\w$(]/.test(src.text.slice(s.end + 1, s.end + 12)) || /[\w$)]\s*\+\s*$/.test(src.text.slice(Math.max(0, s.start - 12), s.start - 1))) {
          hits.push({ index: s.start - 1, note: 'SQL glued together with +' })
        }
      }
      return hits
    },
  },
  {
    id: 'SEC-07',
    on: server,
    run: (src) =>
      scan(src.text, /\b(?:exec|execSync|execa\.command|execaCommand)\s*\(\s*(?:`[^`]*\$\{|["'][^"'\n]*["']\s*\+)/g, (m) => quote(m[0])).filter((h) => inCode(src, h.index)),
  },
  {
    id: 'SEC-08',
    on: [...coded, 'config'],
    run: (src) =>
      src.isTest ? [] : scan(src.text, /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED["']?\s*[=:]\s*["']?0|\bverify\s*=\s*False\b|InsecureSkipVerify\s*:\s*true|CURLOPT_SSL_VERIFYPEER\s*,\s*(?:false|0)\b|strictSSL\s*:\s*false/g, (m) => m[0]),
  },
  {
    id: 'SEC-09',
    on: [...coded],
    run(src) {
      const hits: Hit[] = []
      for (const t of src.tags) {
        const url = /^(script|img|iframe|source|video|audio|embed|track)$/i.test(t.name) ? attr(t, 'src') : t.name === 'link' && /(stylesheet|preload|modulepreload|icon|manifest)/i.test(attr(t, 'rel') ?? '') ? attr(t, 'href') : undefined
        if (url && /^http:\/\//i.test(url) && !local.test(url.slice(7))) hits.push({ index: t.start, note: quote(url) })
      }
      if (src.isScript) hits.push(...scan(src.text, /\b(?:fetch|axios(?:\.\w+)?|got|ky|ofetch|\$fetch)\s*\(\s*["'`]http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])[a-z0-9][^"'`\s$]*/gi, (m) => quote(m[0])).filter((h) => inCode(src, h.index)))
      for (const s of src.sheets) hits.push(...scan(s.text, /url\(\s*["']?http:\/\/(?!localhost|127\.0\.0\.1)[^)"']+/g, (m) => quote(m[0])).map((h) => ({ ...h, index: h.index + s.offset })))
      return hits
    },
  },
  {
    id: 'SEC-10',
    on: [...coded, 'config'],
    run: (src) => scan(src.text, /Access-Control-Allow-Origin["']?\s*[,:=]\s*["']\*["']|\borigin\s*:\s*["']\*["']|\bcors\(\s*\)/gi, (m) => m[0]),
  },
  {
    id: 'SEC-11',
    on: server,
    run: (src) => scan(src.text, /createHash\(\s*["'](?:md5|sha1)["']|hashlib\.(?:md5|sha1)\(|\b(?:md5|sha1)\s*\(\s*\w*pass/gi, (m) => m[0]).filter((h) => inCode(src, h.index)),
  },
  {
    id: 'SEC-12',
    on: server,
    run(src) {
      const hits: Hit[] = []
      for (const m of src.code.matchAll(/^.*Math\.random\(\).*$/gm)) {
        if (/(token|secret|passw|otp|nonce|salt|session|api_?key|reset|invite|verif|csrf)/i.test(src.text.slice(m.index, m.index + m[0].length))) hits.push({ index: m.index + m[0].indexOf('Math.random'), length: 13, note: quote(src.text.slice(m.index, m.index + m[0].length)) })
      }
      return hits
    },
  },
  {
    id: 'SEC-13',
    on: server,
    run: (src) =>
      scan(src.text, /console\.(?:log|info|debug|warn|error)\s*\([^\n]*?\b(password|passwd|token|secret|authorization|cookie|api_?key|req\.body|request\.body|req\.headers|request\.headers)\b/gi, (m) => `logs ${m[1]}`).filter((h) => inCode(src, h.index)),
  },
  {
    id: 'SEC-14',
    on: server,
    run: (src) =>
      scan(src.text, /\b(?:res\.redirect|redirect|permanentRedirect|Response\.redirect|NextResponse\.redirect|location\.(?:href|assign|replace))\s*(?:\(|=)\s*(?:new URL\(\s*)?(?:req\.(?:query|body)|request\.(?:query|body)|(?:[\w.]+\.)?searchParams\.get\(|params\.(?:next|redirect|returnTo|url|callback))/g, (m) => quote(m[0])).filter((h) => inCode(src, h.index)),
  },
  {
    id: 'SEC-15',
    on: ['manifest'],
    run(src) {
      let pkg: Record<string, unknown>
      try {
        pkg = JSON.parse(src.text) as Record<string, unknown>
      } catch {
        return []
      }
      const hits: Hit[] = []
      for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
        const deps = pkg[field]
        if (!deps || typeof deps !== 'object') continue
        for (const [name, version] of Object.entries(deps as Record<string, unknown>)) {
          if (typeof version !== 'string' || !/^(\*|latest|x|(?:github:|git\+|git:|https:\/\/github\.com\/)[^#]+)$/.test(version)) continue
          const at = src.text.indexOf(`"${name}"`)
          hits.push({ index: Math.max(0, at), note: `${name}: ${version}` })
        }
      }
      return hits
    },
  },
  {
    id: 'SEC-20',
    on: server,
    run(src) {
      const hits: Hit[] = []
      for (const m of src.text.matchAll(/(?:cookies\(\)\.set|cookieStore\.set|cookies\.set|res\.cookie|response\.cookies\.set|setCookie)\s*\(((?:[^()]|\([^()]*\))*)\)/g)) {
        if (!inCode(src, m.index)) continue
        if (/(session|token|auth|sid|jwt|refresh)/i.test(m[1]!) && !/httpOnly/i.test(m[1]!)) hits.push({ index: m.index, note: 'auth cookie without httpOnly' })
      }
      hits.push(...scan(src.code, /document\.cookie\s*=/g, () => 'document.cookie').filter((h) => /(token|session|auth|jwt)/i.test(src.line(src.position(h.index).line))))
      return hits
    },
  },
  {
    id: 'SEC-21',
    on: server,
    run: (src) => scan(src.text, /\b(?:json|send|end|Response\.json|NextResponse\.json)\s*\([^\n]{0,200}?\b\w+\.stack\b/g, (m) => quote(m[0])).filter((h) => inCode(src, h.index)),
  },
  {
    id: 'SEC-22',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      const hits: Hit[] = []
      for (const r of patterns(src)) {
        const at = backtracks(r.text)
        if (at !== -1) hits.push({ index: r.index, note: quote(`/${r.text}/`) })
      }
      return hits
    },
  },
  {
    id: 'SEC-23',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      const hits: Hit[] = []
      for (const r of src.regexes) {
        if (!/^<[\s\S]{0,40}?(?:\[\^<?>|\.\*\??>|\[\\s\\S\]|script|style|iframe)/i.test(r.text)) continue
        if (!/\.replace(?:All)?\(\s*$/.test(src.text.slice(Math.max(0, r.start - 24), r.start - 1))) continue
        const after = src.text.slice(r.end + 1, r.end + 24)
        if (!/^[a-z]*\s*,\s*(["'`])\1/.test(after)) continue
        hits.push({ index: r.start - 1, note: quote(`/${r.text}/`) })
      }
      return hits
    },
  },
  {
    id: 'SEC-24',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      const hits: Hit[] = []
      for (const m of src.code.matchAll(/\bnew\s+RegExp\s*\(|(?<![\w$.])RegExp\s*\(/g)) {
        const arg = firstArgument(src.text, m.index + m[0].length).trim()
        const parts = arg.startsWith('`') ? [...arg.matchAll(/\$\{([^{}]*)\}/g)].map((x) => x[1]!) : /^["'].*["']\s*\+|\+\s*["']/.test(arg) ? [arg.replace(/(["'])(?:\\.|(?!\1)[^\\])*\1/g, '')] : []
        if (/\\\$&|RegExp\.escape|escapeRegExp/.test(src.text.slice(Math.max(0, m.index - 300), m.index))) continue
        if (parts.some((x) => input.test(x) && !/escape|quote|sanitiz|\.source\b/i.test(x))) hits.push({ index: m.index, note: quote(`RegExp(${arg})`) })
      }
      hits.push(...scan(src.text, /\.replace\(\s*(["'])(?:\\.|[<>&"'])\1\s*,\s*(["'`])(?:\\\\|&)/g, (m) => quote(m[0])).filter((h) => inCode(src, h.index)))
      return hits
    },
  },
  {
    id: 'SEC-25',
    on: ['markup', 'jsx'],
    run(src) {
      const hits: Hit[] = []
      for (const t of src.tags) {
        const url = /^script$/i.test(t.name) ? attr(t, 'src') : t.name === 'link' && /\b(stylesheet|modulepreload)\b/i.test(attr(t, 'rel') ?? '') ? attr(t, 'href') : undefined
        if (!url || !/^(?:https?:)?\/\//i.test(url) || unpinnable.test(url) || local.test(url.replace(/^(?:https?:)?\/\//i, ''))) continue
        if (!has(t, 'integrity')) hits.push({ index: t.start, note: quote(url) })
      }
      return hits
    },
  },
  {
    id: 'SEC-26',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      if (!domText.test(src.text)) return []
      const names = tainted(src)
      const hits: Hit[] = []
      for (const m of src.text.matchAll(htmlSink)) {
        if (!inCode(src, m.index)) continue
        const rest = sinkValue(src.text, m.index + m[0].length, m[0])
        if (!rest || cleaned.test(rest)) continue
        if (!/HTML|write|__html/.test(m[0]) && /^\s*(["'`])(?:\/|#|https?:|mailto:|tel:)/.test(rest)) continue
        const near = names.filter((t) => t.at < m.index && m.index - t.at < 4000).map((t) => t.name)
        const used = near.find((n) => new RegExp(`(?<![\\w$.])${escapeRegExp(n)}(?![\\w$])`).test(rest))
        if (used || (domText.test(rest) && !wrapped(rest))) hits.push({ index: m.index, note: quote(`${m[0].trim()} ${used ?? rest.trim()}`) })
      }
      return hits
    },
  },
]

const everyFile = new Set(['SEC-01', 'SEC-02', 'SEC-15'])

export const web: Rule[] = rules.map((r) => (r.id.startsWith('SEC-') && !everyFile.has(r.id) ? { ...r, run: (src) => (src.isTest ? [] : r.run(src)) } : r))
