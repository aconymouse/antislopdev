import type { Hit } from '../types.js'
import type { Source, Span } from '../source.js'
import { type Rule } from '../rule.js'
import { hasEmoji, quote, scan } from '../util.js'

const scripts: Rule['on'] = ['script', 'jsx', 'markup']
const verbs = /^(increment|decrement|returns?|sets?|gets?|calls?|creates?|initiali[sz]e|init|defines?|imports?|declares?|loop|iterate|checks?|adds?|updates?|handles?|renders?|exports?|fetch(es)?|logs?|saves?|stores?|assigns?|uses?|loads?|parses?|converts?|calculates?|computes?|sends?)\b/i
const stop = new Set(['the', 'a', 'an', 'to', 'of', 'for', 'and', 'with', 'from', 'in', 'on', 'new', 'all', 'this', 'that', 'our', 'it', 'is', 'value', 'values'])

function lineComment(src: Source, c: Span): boolean {
  const head = src.text.slice(c.start, c.start + 3)
  return head.startsWith('//') || head.startsWith('#') || (head.startsWith('/*') && !head.startsWith('/**') && !c.text.includes('\n'))
}

function nextCodeLine(src: Source, from: number): string {
  const code = src.code
  let i = code.indexOf('\n', from)
  while (i !== -1 && i < code.length) {
    const end = code.indexOf('\n', i + 1)
    const line = code.slice(i + 1, end === -1 ? code.length : end)
    if (line.trim()) return src.text.slice(i + 1, end === -1 ? code.length : end)
    if (end === -1) break
    i = end
  }
  return ''
}

function inCode(src: Source, index: number): boolean {
  return src.code[index] === src.text[index] && src.text[index] !== ' '
}

function split(name: string): string[] {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').toLowerCase().split(/\s+/).filter(Boolean)
}

function looksLikeCode(text: string): boolean {
  const t = text.trim()
  return /[;{}]\s*$|^(const|let|var|if|for|while|return|import|export|function|await|def|class|from)\b|^\w+(\.\w+)*\s*=\s*[\w'"(\[{]|^\w+(\.\w+)*\(.*\)\s*;?$/.test(t)
}

const besteffort = /localStorage|sessionStorage|indexedDB|JSON\.parse|navigator\.|clipboard|vibrate|decodeURI|new URL\(|structuredClone|matchMedia|Notification|serviceWorker|\.close\(\)|\.abort\(\)|\.cancel\(\)|unlink|\brm\(|removeItem|releasePointerCapture|setPointerCapture|requestFullscreen|exitFullscreen|\.play\(\)|\.focus\(|\.select\(\)|showPicker|scrollIntoView/

const oneLiners = new Set(['is-odd', 'is-even', 'is-number', 'left-pad', 'pad-left', 'uuid', 'node-fetch', 'cross-fetch', 'isomorphic-fetch', 'moment', 'object-assign', 'array-includes', 'es6-promise', 'abort-controller', 'is-array', 'is-string', 'lodash.clonedeep', 'deep-copy', 'string-includes', 'array-flatten', 'request'])

export const code: Rule[] = [
  {
    id: 'CD-01',
    on: scripts,
    run(src) {
      const hits: Hit[] = []
      for (const c of src.comments) {
        if (!lineComment(src, c)) continue
        const text = c.text.replace(/^[\s/*#]+/, '').trim()
        const w = text.split(/\s+/)
        if (w.length > 10 || !verbs.test(text)) continue
        if (/\b(because|since|why|so that|otherwise|note|hack|workaround|todo|fixme|eslint|prettier|biome|ts-|@|see|unless|until|instead|avoid|must|never|only)\b/i.test(text)) continue
        const next = nextCodeLine(src, c.end).toLowerCase()
        if (!next) continue
        const nouns = w.slice(1).flatMap(split).map((x) => x.replace(/[^a-z0-9]/g, '')).filter((x) => x.length >= 3 && !stop.has(x))
        const verb = w[0]!.toLowerCase().replace(/s$/, '')
        const keyword = /^(return|import|export)$/.test(verb) && new RegExp(`\\b${verb}\\b`).test(next)
        if (keyword || (nouns.length > 0 && nouns.some((n) => next.includes(n)))) hits.push({ index: c.start, length: c.end - c.start, note: quote(text) })
      }
      return hits
    },
  },
  {
    id: 'CD-02',
    on: ['script', 'jsx', 'style'],
    run(src) {
      if (src.text.split('\n').length > 600) return []
      return src.comments.filter((c) => /([=\-*#~_])\1{3,}/.test(c.text) && !/^\s*\*?\s*@/.test(c.text)).map((c) => ({ index: c.start, length: c.end - c.start, note: quote(c.text) }))
    },
  },
  {
    id: 'CD-03',
    on: ['script', 'jsx'],
    run(src) {
      const hits: Hit[] = []
      for (const m of src.text.matchAll(/^.*\b(console\.\w+|print|println!?|logger\.\w+|log\.\w+|echo|printf|fmt\.Print\w*|puts|spinner\.\w+|ora\()\b.*$/gm)) {
        if (hasEmoji(m[0]) && inCode(src, m.index + m[0].indexOf(m[1]!))) hits.push({ index: m.index, length: m[0].length, note: quote(m[0].trim()) })
      }
      return hits
    },
  },
  {
    id: 'CD-04',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      const hits = scan(src.code, /\bdebugger\b\s*;?|\bbreakpoint\(\)|\bpdb\.set_trace\(\)|\bbinding\.pry\b|\bdbg!\(/g, (m) => m[0])
      if (!src.isTest && !src.isCli) hits.push(...scan(src.code, /\bconsole\.(log|debug|table|dir)\(/g, (m) => m[0]))
      let run: Span[] = []
      const flush = () => {
        if (run.length >= 3 && run.filter((c) => looksLikeCode(c.text)).length >= run.length * 0.7) hits.push({ index: run[0]!.start, note: `${run.length} lines of commented-out code` })
        run = []
      }
      for (const c of src.comments) {
        const prev = run[run.length - 1]
        const adjacent = prev && src.position(c.start).line === src.position(prev.start).line + 1
        if (!lineComment(src, c) || (prev && !adjacent)) flush()
        if (lineComment(src, c)) run.push(c)
      }
      flush()
      return hits
    },
  },
  {
    id: 'CD-05',
    on: ['script', 'jsx', 'markup'],
    run(src) {
      const hits: Hit[] = []
      for (const c of src.comments) {
        if (/\b(TODO|FIXME|XXX)\b\s*:?\s*(implement|add (real|actual)|replace (with|this|me)|finish|wire up|hook up)|\.\.\.\s*(rest of|existing|remaining|other) (the )?(code|implementation|logic|methods|fields|components)|\b(your|the) (code|logic|implementation) (goes )?here\b|\b(add|implement|insert) (your|the) (logic|implementation|code) here\b|\bsame as (before|above)\b|\bunchanged\b\s*$/i.test(c.text)) {
          hits.push({ index: c.start, length: c.end - c.start, note: quote(c.text) })
        }
      }
      hits.push(...scan(src.text, /throw new Error\(\s*['"`](not implemented|todo|implement me)[^'"`]*['"`]\s*\)|raise NotImplementedError|\btodo!\(\)|\bunimplemented!\(\)/gi, (m) => m[0]).filter((h) => inCode(src, h.index)))
      if (!src.isTest && !/(^|[\\/])(mocks?|__mocks__|fixtures?|stories|storybook|demo|examples?|seed)[\\/]|\.stories\./i.test(src.path)) {
        hits.push(...scan(src.code, /\b(mock|fake|dummy)(Data|Users?|Posts?|Items?|Products?|Response|Results?|Orders?|Stats)\b/g, (m) => m[0]))
      }
      return hits
    },
  },
  {
    id: 'CD-06',
    on: ['script', 'jsx'],
    run: (src) =>
      scan(src.code, /\bcatch\s*(\(\s*\w*\s*(:\s*\w+)?\s*\))?\s*\{\s*\}|\bcatch\s*\(\s*(\w+)\s*\)\s*\{\s*console\.(error|log|warn)\(\s*\3\s*\)\s*;?\s*\}|\.catch\(\s*\(\s*\w*\s*\)\s*=>\s*\{\s*\}\s*\)|\bexcept(\s+[\w.]+(\s+as\s+\w+)?)?\s*:\s*\n?\s*pass\b/g, (m) => quote(m[0])).filter((h) => {
        const before = src.text.slice(Math.max(0, h.index - 400), h.index)
        const tryAt = before.lastIndexOf('try')
        const body = tryAt === -1 ? before.slice(-160) : before.slice(tryAt)
        return !besteffort.test(body)
      }),
  },
  {
    id: 'CD-07',
    on: ['script', 'jsx'],
    run(src) {
      const hits: Hit[] = []
      if (/^(ts|tsx|mts|cts)$/.test(src.ext)) hits.push(...scan(src.code, /:\s*any\b(?![\w-])|\bas any\b|<any>|\bas unknown as\b/g, (m) => m[0].trim()))
      for (const c of src.comments) {
        const m = c.text.match(/@ts-ignore|@ts-nocheck|eslint-disable(-next-line|-line)?|type:\s*ignore|\bnoqa\b|biome-ignore|oxlint-disable/)
        if (m) hits.push({ index: c.start, length: c.end - c.start, note: m[0] })
      }
      return hits
    },
  },
  {
    id: 'CD-08',
    on: ['script', 'jsx'],
    run(src) {
      const hits: Hit[] = []
      const same = (name: string, desc: string) => {
        const d = split(desc.replace(/[.,:;]/g, ' ')).filter((x) => !stop.has(x) && !/^(given|provided|passed|input|param|parameter|object|string|number)$/.test(x))
        const n = split(name)
        return d.length > 0 && d.length <= n.length + 1 && d.every((x) => n.includes(x) || n.includes(x.replace(/s$/, '')))
      }
      const docs: { at: number; text: string }[] = src.comments.filter((c) => src.text.startsWith('/**', c.start)).map((c) => ({ at: c.start, text: c.text }))
      for (const s of src.strings) if (/\b(Args|Arguments|Parameters|Returns):/.test(s.text)) docs.push({ at: s.start, text: s.text })
      for (const d of docs) {
        let bad = 0
        let total = 0
        for (const m of d.text.matchAll(/@param\s+(?:\{[^}]*\}\s+)?\[?(\w+)[^\s\]]*\]?\s*-?\s*([^\n@]*)|^\s{2,}(\w+)\s*(?:\([^)]*\))?\s*:\s*([^\n]+)$/gm)) {
          const name = m[1] ?? m[3] ?? ''
          const desc = (m[2] ?? m[4] ?? '').trim()
          if (!desc) continue
          total++
          if (same(name, desc)) bad++
        }
        if (total > 0 && bad === total) hits.push({ index: d.at, note: 'every parameter description repeats its name' })
      }
      return hits
    },
  },
  {
    id: 'CD-11',
    on: ['script', 'jsx'],
    run(src) {
      const hits = scan(src.code, /\b(?:const|let|var|function|def)\s+(temp|tmp|foo|baz|stuff|thing|things|data\d|result\d|[a-z]+[A-Z][a-z]\w*?[2-9])\b/g, (m) => m[1])
      if (/(^|[\\/])(utils\d|helpers\d|misc|stuff|new-[\w-]+|[\w-]+-(final|new|copy|old|backup|v\d))\.\w+$/i.test(src.path)) hits.push({ index: 0, note: src.path.split(/[\\/]/).pop()! })
      return hits
    },
  },
  {
    id: 'CD-13',
    on: ['manifest'],
    run(src) {
      const hits: Hit[] = []
      for (const m of src.text.matchAll(/"(dependencies|devDependencies)"\s*:\s*\{([^}]*)\}/g)) {
        for (const d of m[2]!.matchAll(/"([^"]+)"\s*:/g)) {
          if (oneLiners.has(d[1]!)) hits.push({ index: m.index + m[0].indexOf(d[0]), length: d[0].length, note: d[1]! })
        }
      }
      return hits
    },
  },
  {
    id: 'CD-15',
    on: ['script', 'jsx', 'config', 'prose', 'style'],
    run(src) {
      if (src.kind === 'prose') {
        return src.codeBlocks
          .filter((b) => !/^(text|txt|md|markdown|plain|plaintext|prose)$/.test(b.lang))
          .flatMap((b) => scan(b.text, /[“”‘’]/g).map((h) => ({ index: b.bodyStart + h.index, length: 1, note: `curly quote in a ${b.lang || 'code'} block` })))
      }
      if (src.kind === 'config') return scan(src.text, /[“”]\s*:|:\s*[“”]|=\s*[“”‘’]|^\s*-\s*[“”]/gm, () => 'curly quote used as a delimiter')
      return scan(src.code, /[“”‘’]/g, () => 'curly quote in code')
    },
  },
]
