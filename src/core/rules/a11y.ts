import type { Hit } from '../types.js'
import type { Source, Tag } from '../source.js'
import { markup, styled, type ProjectHit, type ProjectRule, type Rule } from '../rule.js'
import { contrast, cssRules, quote, rgb, scan } from '../util.js'

function textOf(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\{[^{}]*\}/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
}

function has(t: Tag, attr: string): boolean {
  return new RegExp(`(^|\\s)${attr}(\\s*=|\\s|$)`).test(t.attrs)
}

function headingLevels(src: Source): { index: number; level: number }[] {
  const out: { index: number; level: number }[] = []
  if (src.kind === 'prose') for (const m of src.prose.matchAll(/^(#{1,6})[ \t]+\S/gm)) out.push({ index: m.index, level: m[1]!.length })
  for (const t of src.tags) {
    const m = t.name.match(/^h([1-6])$/)
    if (m) out.push({ index: t.start, level: Number(m[1]) })
  }
  return out.sort((a, b) => a.index - b.index)
}

const focusable = /^(input|textarea|select|button|a|Button|Link|Input|Textarea|Select|summary)$/

export const a11y: Rule[] = [
  {
    id: 'AX-01',
    on: markup,
    run: (src) =>
      src.tags
        .filter((t) => /^(div|span|li|p|img|td|tr|section|article)$/.test(t.name) && /\bon[Cc]lick\s*=/.test(t.attrs) && !/\brole\s*=|aria-hidden|on[Cc]lick=\{\s*\(?\w*\)?\s*=>\s*\w+\.stopPropagation\(\)\s*\}/.test(t.attrs))
        .map((t) => ({ index: t.start, length: t.end - t.start, note: `clickable <${t.name}>` })),
  },
  {
    id: 'AX-02',
    on: styled,
    run(src) {
      const hits: Hit[] = src.tags
        .filter((t) => (focusable.test(t.name) || /(?<![\w-])focus(-visible)?:/.test(t.classes)) && !/tabIndex=\{?\s*["']?-1/.test(t.attrs) && /(?<![\w-])(focus(-visible)?:)?outline-none\b/.test(t.classes) && !/\b(focus(-visible|-within)?:(ring|outline-(?!none)|border|shadow|bg|underline|decoration))|group-focus|peer-focus/.test(t.classes))
        .map((t) => ({ index: t.start, length: t.end - t.start, note: 'outline removed with no visible focus style' }))
      const sheets = src.sheets
      if (sheets.length && !/:focus-visible/.test(src.text)) {
        for (const r of sheets.flatMap((sh) => cssRules(sh.text).map((x) => ({ ...x, start: x.start + sh.offset })))) {
          if (/:focus|^(button|a|input|select|textarea)\b|[\s,](button|a|input|select|textarea)\b/.test(r.selector) && /outline\s*:\s*(none|0)\b/.test(r.body) && !/box-shadow|border(-color)?\s*:/.test(r.body)) {
            hits.push({ index: r.start, note: `${r.selector}: outline removed` })
          }
        }
      }
      return hits
    },
  },
  {
    id: 'AX-03',
    on: styled,
    run(src) {
      const hits: Hit[] = []
      const blocks: { body: string; at: number }[] = []
      for (const sh of src.sheets) for (const r of cssRules(sh.text)) blocks.push({ body: r.body, at: r.start + sh.offset })
      for (const m of src.text.matchAll(/style="([^"]*)"/g)) blocks.push({ body: m[1]!, at: m.index })
      for (const b of blocks) {
        const fg = b.body.match(/(?:^|[;\s])color\s*:\s*(#[0-9a-f]{3,8}|rgba?\([^)]*\)|white|black)\b/i)
        const bg = b.body.match(/background(?:-color)?\s*:\s*(#[0-9a-f]{3,8}|rgba?\([^)]*\)|white|black)\b/i)
        if (!fg || !bg) continue
        const a = rgb(fg[1]!)
        const c = rgb(bg[1]!)
        if (!a || !c) continue
        const size = Number(b.body.match(/font-size\s*:\s*(\d+(?:\.\d+)?)px/)?.[1] ?? 16)
        const bold = /font-weight\s*:\s*(bold|[6-9]00)/.test(b.body)
        const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5
        const ratio = contrast(a, c)
        if (ratio < need) hits.push({ index: b.at, note: `${fg[1]} on ${bg[1]} is ${ratio.toFixed(2)}:1, needs ${need}:1` })
      }
      return hits
    },
  },
  {
    id: 'AX-04',
    on: markup,
    run(src) {
      const hits: Hit[] = []
      for (const t of src.tags) {
        if (t.name === 'img' && !/\balt\s*=/.test(t.attrs)) hits.push({ index: t.start, length: t.end - t.start, note: '<img> without alt' })
        if (/^(button|Button|a|Link)$/.test(t.name) && !/\baria-label(ledby)?\s*=|\btitle\s*=|aria-hidden|\{\s*\.\.\./.test(t.attrs) && !/\/>\s*$/.test(src.text.slice(t.start, t.end))) {
          const inner = src.inner(t)
          if (/<(svg|[A-Z]\w*)\b/.test(inner) && !textOf(inner) && !/sr-only|visually-hidden|aria-label/.test(inner)) hits.push({ index: t.start, length: t.end - t.start, note: `icon-only <${t.name}> without a name` })
        }
        if (/^(input|textarea|select)$/.test(t.name) && !/\btype\s*=\s*["'](hidden|submit|button|reset|image)["']|(^|\s)hidden(\s|$|=\{true\})/.test(t.attrs) && !/\b(aria-label(ledby)?|id|title)\s*=|\{\s*\.\.\./.test(t.attrs)) {
          const before = src.text.slice(Math.max(0, t.start - 400), t.start)
          const open = Math.max(before.lastIndexOf('<label'), before.lastIndexOf('<Label'), before.search(/<\w*Label\b[^>]*>(?![\s\S]*<\/\w*Label>)/))
          if (open === -1 || Math.max(before.lastIndexOf('</label>'), before.lastIndexOf('</Label>')) > open) hits.push({ index: t.start, length: t.end - t.start, note: `<${t.name}> without a label` })
        }
      }
      return hits
    },
  },
  {
    id: 'AX-06',
    on: ['markup', 'jsx', 'prose'],
    run(src) {
      const hits: Hit[] = []
      const levels = headingLevels(src)
      for (let i = 1; i < levels.length; i++) {
        const prev = levels[i - 1]!
        const cur = levels[i]!
        if (cur.level > prev.level + 1) hits.push({ index: cur.index, note: `h${prev.level} then h${cur.level}` })
      }
      return hits
    },
  },
  {
    id: 'AX-07',
    on: markup,
    run: (src) =>
      src.tags
        .filter((t) => (/^(button|Button|a|Link)$/.test(t.name) || /\brole\s*=\s*["']button/.test(t.attrs)) && (/\bsize-(3|4|5)\b/.test(t.classes) || (/\bh-(3|4|5)\b/.test(t.classes) && /\bw-(3|4|5)\b/.test(t.classes))) && !/\b(p|px|py|min-h|min-w)-/.test(t.classes))
        .map((t) => ({ index: t.start, length: t.end - t.start, note: 'tap target under 24px' })),
  },
  {
    id: 'PF-01',
    on: markup,
    run: (src) =>
      src.tags
        .filter((t) => /^(img|video|iframe)$/.test(t.name) && !(has(t, 'width') && has(t, 'height')) && !/\baspect-|\bsize-\d|\bh-(\d|full)[\w./]*\b.*\bw-(\d|full)|\bw-(\d|full)[\w./]*\b.*\bh-(\d|full)|\babsolute\b.*\binset-0\b/.test(t.classes) && !/aspect-ratio/.test(t.attrs) && !has(t, 'fill') && !/aspect-/.test(src.text.slice(Math.max(0, t.start - 160), t.start)))
        .map((t) => ({ index: t.start, length: t.end - t.start, note: `<${t.name}> without width and height` })),
  },
  {
    id: 'PF-02',
    on: markup,
    run(src) {
      if (!/<h1\b/.test(src.text)) return []
      const h2 = src.text.search(/<h2\b/)
      const fold = h2 === -1 ? 2500 : h2
      return src.tags
        .filter((t) => /^(img|Image)$/.test(t.name) && t.start < fold && /\bloading\s*=\s*\{?\s*["']lazy["']/.test(t.attrs))
        .map((t) => ({ index: t.start, length: t.end - t.start, note: 'above-the-fold image loads lazily' }))
    },
  },
  {
    id: 'PF-03',
    on: ['markup'],
    run(src) {
      const head = src.text.match(/<head\b[\s\S]*?<\/head>/i)
      if (!head || head.index === undefined) return []
      return scan(head[0], /<script\b(?![^>]*\b(async|defer)\b)(?![^>]*type\s*=\s*["']module["'])[^>]*\bsrc\s*=[^>]*>/gi, (m) => quote(m[0])).map((h) => ({ ...h, index: h.index + head.index! }))
    },
  },
  {
    id: 'PF-05',
    on: markup,
    run: (src) => src.tags.filter((t) => t.name === 'video' && /\bautoPlay\b|\bautoplay\b/.test(t.attrs) && !/\bposter\s*=/.test(t.attrs)).map((t) => ({ index: t.start, note: 'autoplay video without a poster' })),
  },
  {
    id: 'PF-06',
    on: styled,
    run(src) {
      const hits = scan(src.text, /transition(?:-property)?\s*:[^;"}]*\b(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*|all)\b/g, (m) => quote(m[0]))
      for (const t of src.tags) {
        const m = t.classes.match(/\btransition-\[(width|height|top|left|margin|padding|max-height)[^\]]*\]/)
        if (m) hits.push({ index: t.start, note: m[0] })
      }
      hits.push(...scan(src.text, /\banimate=\{\{[^}]*\b(width|height|top|left)\s*:/g, (m) => quote(m[0])))
      return hits
    },
  },
]

const animates = /@keyframes\b|\banimation\s*:|(?<![\w-])animate-(?!none)[\w-]+|from\s+['"](framer-motion|motion\/react|motion|gsap|animejs|@react-spring\/web)['"]/
const reduced = /prefers-reduced-motion|motion-reduce:|motion-safe:|useReducedMotion|reducedMotion|MotionConfig/

export const project: ProjectRule[] = [
  {
    id: 'AX-05',
    run(sources) {
      if (sources.some((s) => reduced.test(s.text))) return []
      const first = sources.find((s) => s.kind !== 'prose' && s.kind !== 'commit' && !s.isTest && animates.test(s.text))
      if (!first) return []
      const m = first.text.match(animates)
      return [{ source: first, hit: { index: m?.index ?? 0, note: 'animation with no prefers-reduced-motion anywhere in the project' } }]
    },
  },
  {
    id: 'PF-04',
    run(sources) {
      const out: ProjectHit[] = []
      const libs = ['framer-motion', 'motion', 'gsap', 'animejs', 'aos', '@react-spring/web', 'react-spring', 'lottie-web']
      for (const manifest of sources.filter((s) => s.kind === 'manifest')) {
        const deps = manifest.text.match(/"dependencies"\s*:\s*\{([^}]*)\}/)
        if (!deps) continue
        for (const lib of libs) {
          const at = deps[1]!.indexOf(`"${lib}"`)
          if (at === -1) continue
          const re = new RegExp(`from\\s+['"]${lib.replace(/[/.]/g, '\\$&')}(/[\\w-]+)?['"]|require\\(['"]${lib.replace(/[/.]/g, '\\$&')}['"]\\)`, 'g')
          const uses = sources.reduce((n, s) => n + (s.text.match(re) ?? []).length, 0)
          if (uses <= 1) out.push({ source: manifest, hit: { index: (deps.index ?? 0) + deps[0].indexOf(deps[1]!) + at, note: `${lib} imported ${uses === 0 ? 'nowhere' : 'once'}` } })
        }
      }
      return out
    },
  },
]
