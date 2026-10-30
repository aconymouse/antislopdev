import type { FileKind, SourceInput } from './types.js'

export interface Span {
  start: number
  end: number
  text: string
}

export interface Tag {
  name: string
  attrs: string
  classes: string
  start: number
  end: number
}

export interface CodeBlock extends Span {
  lang: string
  bodyStart: number
}

const extKinds: Record<string, FileKind> = {
  html: 'markup', htm: 'markup', vue: 'markup', svelte: 'markup', astro: 'markup',
  jsx: 'jsx', tsx: 'jsx',
  css: 'style', scss: 'style', sass: 'style', less: 'style',
  js: 'script', mjs: 'script', cjs: 'script', ts: 'script', mts: 'script', cts: 'script',
  py: 'script', go: 'script', rs: 'script', rb: 'script', php: 'script', java: 'script',
  kt: 'script', swift: 'script', c: 'script', h: 'script', cpp: 'script', cs: 'script', sh: 'script',
  md: 'prose', mdx: 'prose', markdown: 'prose', txt: 'prose', rst: 'prose',
  json: 'config', yaml: 'config', yml: 'config', toml: 'config',
}

const hashComment = new Set(['py', 'rb', 'sh', 'yaml', 'yml', 'toml'])

export function kindOf(path: string): FileKind | undefined {
  const name = path.split(/[\\/]/).pop() ?? path
  if (name === 'package.json') return 'manifest'
  if (name === 'COMMIT_EDITMSG' || name.endsWith('.commit')) return 'commit'
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : ''
  return extKinds[ext]
}

export function clear(chars: string[], start: number, end: number): void {
  for (let i = start; i < end && i < chars.length; i++) if (chars[i] !== '\n') chars[i] = ' '
}

export function paste(chars: string[], text: string, start: number): void {
  for (let i = 0; i < text.length; i++) chars[start + i] = text[i]!
}

export function empty(text: string): string[] {
  const out = new Array<string>(text.length)
  for (let i = 0; i < text.length; i++) out[i] = text[i] === '\n' ? '\n' : ' '
  return out
}

function blankAll(text: string, re: RegExp): string {
  const chars = text.split('')
  for (const m of text.matchAll(re)) clear(chars, m.index, m.index + m[0].length)
  return chars.join('')
}

const idWords = /\b(yang|dan|di|ini|itu|untuk|dengan|tidak|ke|dari|kita|kamu|anda|adalah|bisa|juga|akan|pada|atau|saja|gak)\b/gi
const enWords = /\b(the|and|is|to|of|for|with|that|you|this|are|it|be|on|or|can|will|your|from|not)\b/gi

export class Source {
  readonly path: string
  readonly text: string
  readonly kind: FileKind
  readonly ext: string
  private starts: number[] = [0]
  private cache = new Map<string, unknown>()

  constructor(input: SourceInput & { kind: FileKind }) {
    this.path = input.path
    this.kind = input.kind
    this.text = input.kind === 'commit' ? input.text.replace(/^#.*$/gm, (m) => ' '.repeat(m.length)) : input.text
    this.ext = (this.path.split('.').pop() ?? '').toLowerCase()
    for (let i = 0; i < this.text.length; i++) if (this.text[i] === '\n') this.starts.push(i + 1)
  }

  private memo<T>(key: string, make: () => T): T {
    if (!this.cache.has(key)) this.cache.set(key, make())
    return this.cache.get(key) as T
  }

  get isMarkup(): boolean {
    return this.kind === 'markup' || this.kind === 'jsx'
  }

  get isScript(): boolean {
    return this.kind === 'script' || this.kind === 'jsx'
  }

  get isTest(): boolean {
    return /(^|[\\/])(test|tests|__tests__|spec|e2e|fixtures?)[\\/]|\.(test|spec)\.[a-z]+$/i.test(this.path)
  }

  get isCli(): boolean {
    return /(^|[\\/])(bin|cli|scripts?|tools)[\\/]|(^|[\\/])cli\.[a-z]+$/i.test(this.path)
  }

  get isReadme(): boolean {
    return /(^|[\\/])readme(\.[a-z]+)?$/i.test(this.path)
  }

  position(index: number): { line: number; column: number } {
    let lo = 0
    let hi = this.starts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (this.starts[mid]! <= index) lo = mid
      else hi = mid - 1
    }
    return { line: lo + 1, column: index - this.starts[lo]! + 1 }
  }

  line(n: number): string {
    const start = this.starts[n - 1] ?? 0
    const end = this.starts[n] ?? this.text.length + 1
    return this.text.slice(start, end - 1)
  }

  get jsxText(): Span[] {
    return this.memo('jsxText', () => {
      const out: Span[] = []
      if (this.kind !== 'jsx') return out
      for (const m of this.text.matchAll(/(?<=[^=\-\s]\s*)>([^<>]+)</g)) {
        const raw = m[1]!
        if (!/\p{L}/u.test(raw)) continue
        if (/=>|&&|\|\||;\s*$|^\s*[)\]}]|\b(return|const|let|function|import|export)\b|^\s*=/.test(raw)) continue
        const start = m.index + 1
        const chars = raw.split('')
        let depth = 0
        let open = -1
        for (let i = 0; i < raw.length; i++) {
          if (raw[i] === '{') {
            if (depth === 0) open = i
            depth++
          } else if (raw[i] === '}' && depth > 0) {
            depth--
            if (depth === 0) clear(chars, open, i + 1)
          }
        }
        if (depth > 0) continue
        out.push({ start, end: start + raw.length, text: chars.join('') })
      }
      return out
    })
  }

  get prose(): string {
    return this.memo('prose', () => {
      const t = this.text
      if (this.kind === 'prose' || this.kind === 'commit') {
        let p = t
        p = blankAll(p, /^---\n[\s\S]*?\n---\n/g)
        const pc = p.split('')
        for (const b of this.codeBlocks) clear(pc, b.start, b.end)
        p = pc.join('')
        p = blankAll(p, /<!--[\s\S]*?-->/g)
        p = blankAll(p, /`[^`\n]+`/g)
        p = blankAll(p, /(?<=\]\()[^)\s]+(?:\s+"[^"]*")?(?=\))/g)
        p = blankAll(p, /<https?:[^>\s]+>/g)
        p = blankAll(p, /!(?=\[)/g)
        p = blankAll(p, /<\/?[a-zA-Z][^>]*>/g)
        p = blankAll(p, /^\s*\[[^\]]+\]:\s*\S+.*$/gm)
        return p
      }
      if (this.kind === 'markup') {
        let p = t
        p = blankAll(p, /<script\b[\s\S]*?<\/script>/gi)
        p = blankAll(p, /<style\b[\s\S]*?<\/style>/gi)
        p = blankAll(p, /<!--[\s\S]*?-->/g)
        if (this.ext === 'astro') p = blankAll(p, /^---\n[\s\S]*?\n---\n/g)
        if (this.ext === 'vue') p = blankAll(p, /\{\{[\s\S]*?\}\}/g)
        if (this.ext === 'svelte' || this.ext === 'astro') p = blankAll(p, /\{[^{}]*\}/g)
        p = blankAll(p, /<[^>]*>/g)
        return p
      }
      if (this.kind === 'jsx') {
        const p = empty(t)
        for (const s of this.jsxText) paste(p, s.text, s.start)
        return p.join('')
      }
      if (this.kind === 'config' && this.isCopy) {
        const p = empty(t)
        for (const s of this.strings) {
          if (/^\s*:/.test(t.slice(s.end + 1, s.end + 4))) continue
          paste(p, s.text, s.start)
        }
        return p.join('')
      }
      return empty(t).join('')
    })
  }

  get isCopy(): boolean {
    return /(^|[\\/])(messages|locales?|i18n|lang|langs|translations|copy|content)[\\/]/i.test(this.path) || /(^|[\\/])(en|id|[a-z]{2}(-[A-Z]{2})?)\.(json|ya?ml)$/.test(this.path)
  }

  get proseWords(): number {
    return this.memo('words', () => (this.prose.match(/\p{L}[\p{L}'’-]*/gu) ?? []).length)
  }

  get lang(): 'id' | 'en' {
    return this.memo('lang', () => {
      const p = this.prose + ' ' + this.strings.map((s) => s.text).join(' ')
      const id = (p.match(idWords) ?? []).length
      const en = (p.match(enWords) ?? []).length
      return id > en ? 'id' : 'en'
    })
  }

  get codeBlocks(): CodeBlock[] {
    return this.memo('codeBlocks', () => {
      const out: CodeBlock[] = []
      if (this.kind !== 'prose') return out
      for (const m of this.text.matchAll(/^([ \t]*)(`{3,}|~{3,})[ \t]*([\w+#.-]*)[^\n]*\n([\s\S]*?)^\1\2[ \t]*$/gm)) {
        const bodyStart = m.index + m[0].indexOf('\n') + 1
        out.push({ start: m.index, end: m.index + m[0].length, text: m[4]!, lang: m[3]!.toLowerCase(), bodyStart })
      }
      return out
    })
  }

  private tokenize(): { comments: Span[]; strings: Span[]; code: string } {
    const comments: Span[] = []
    const strings: Span[] = []
    const base = this.text.split('')
    for (const s of this.jsxText) clear(base, s.start, s.end)
    if (this.kind === 'markup') {
      const only = empty(this.text)
      for (const m of this.text.matchAll(/(<script\b[^>]*>)([\s\S]*?)<\/script>/gi)) paste(only, m[2]!, m.index + m[1]!.length)
      for (const m of this.text.matchAll(/<!--([\s\S]*?)-->/g)) comments.push({ start: m.index, end: m.index + m[0].length, text: m[1]! })
      base.splice(0, base.length, ...only)
    }
    const t = base.join('')
    const code = base
    const hash = hashComment.has(this.ext)
    const css = this.kind === 'style'
    let i = 0
    const n = t.length
    while (i < n) {
      const c = t[i]!
      const next = t[i + 1]
      if (!hash && c === '/' && next === '/' && !css) {
        const end = t.indexOf('\n', i)
        const e = end === -1 ? n : end
        comments.push({ start: i, end: e, text: t.slice(i + 2, e) })
        clear(code, i, e)
        i = e
        continue
      }
      if (!hash && c === '/' && next === '*') {
        const end = t.indexOf('*/', i + 2)
        const e = end === -1 ? n : end + 2
        comments.push({ start: i, end: e, text: t.slice(i + 2, end === -1 ? n : end) })
        clear(code, i, e)
        i = e
        continue
      }
      if (hash && c === '#' && (i === 0 || /[\s;]/.test(t[i - 1]!))) {
        const end = t.indexOf('\n', i)
        const e = end === -1 ? n : end
        comments.push({ start: i, end: e, text: t.slice(i + 1, e) })
        clear(code, i, e)
        i = e
        continue
      }
      if (!hash && !css && c === '/' && regexAllowed(t, i)) {
        let j = i + 1
        let klass = false
        while (j < n && t[j] !== '\n') {
          if (t[j] === '\\') {
            j += 2
            continue
          }
          if (t[j] === '[') klass = true
          else if (t[j] === ']') klass = false
          else if (t[j] === '/' && !klass) break
          j++
        }
        if (j < n && t[j] === '/') {
          clear(code, i + 1, j)
          i = j + 1
          while (i < n && /[a-z]/.test(t[i]!)) i++
          continue
        }
      }
      if (c === '"' || c === "'" || (c === '`' && !hash)) {
        const triple = hash && t.startsWith(c.repeat(3), i)
        const q = triple ? c.repeat(3) : c
        let j = i + q.length
        while (j < n) {
          if (t[j] === '\\') {
            j += 2
            continue
          }
          if (t.startsWith(q, j)) break
          if (!triple && c !== '`' && t[j] === '\n') break
          j++
        }
        const end = Math.min(j + q.length, n)
        strings.push({ start: i + q.length, end: j, text: t.slice(i + q.length, j) })
        clear(code, i + q.length, j)
        i = end
        continue
      }
      i++
    }
    return { comments, strings, code: code.join('') }
  }

  get comments(): Span[] {
    return this.memo('tokens', () => this.tokenize()).comments
  }

  get strings(): Span[] {
    return this.memo('tokens', () => this.tokenize()).strings
  }

  get code(): string {
    return this.memo('tokens', () => this.tokenize()).code
  }

  get tags(): Tag[] {
    return this.memo('tags', () => {
      const out: Tag[] = []
      if (!this.isMarkup) return out
      const re = /<([A-Za-z][\w.:-]*)\b((?:[^<>"'`{}]|"[^"]*"|'[^']*'|`[^`]*`|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*)\/?>/g
      for (const m of this.text.matchAll(re)) {
        const attrs = m[2] ?? ''
        out.push({ name: m[1]!, attrs, classes: classesOf(attrs), start: m.index, end: m.index + m[0].length })
      }
      return out
    })
  }

  inner(tag: Tag): string {
    if (this.text.slice(tag.start, tag.end).endsWith('/>')) return ''
    const close = this.text.indexOf(`</${tag.name}>`, tag.end)
    if (close === -1 || close - tag.end > 4000) return ''
    return this.text.slice(tag.end, close)
  }

  get sheets(): { text: string; offset: number }[] {
    return this.memo('sheets', () => {
      if (this.kind === 'style') return [{ text: this.text, offset: 0 }]
      if (!this.isMarkup) return []
      return [...this.text.matchAll(/(<style\b[^>]*>)([\s\S]*?)<\/style>/gi)].map((m) => ({ text: m[2]!, offset: m.index + m[1]!.length }))
    })
  }

  get paragraphs(): Span[] {
    return this.memo('paragraphs', () => {
      const out: Span[] = []
      const p = this.prose
      for (const m of p.matchAll(/[^\n]+(?:\n(?![ \t]*\n)[^\n]*)*/g)) {
        if (m[0].trim()) out.push({ start: m.index, end: m.index + m[0].length, text: m[0] })
      }
      return out
    })
  }
}

function regexAllowed(t: string, i: number): boolean {
  let k = i - 1
  while (k >= 0 && (t[k] === ' ' || t[k] === '\t')) k--
  if (k < 0) return true
  const p = t[k]!
  if ('(,=:[!&|?{};+-*%<>~^\n'.includes(p)) return true
  return /\b(return|typeof|case|in|of|delete|void|throw|new|yield|await)$/.test(t.slice(Math.max(0, k - 8), k + 1))
}

export function classesOf(attrs: string): string {
  const parts: string[] = []
  const re = /\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\}|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*(?:cn|clsx|cx|twMerge|classNames|tw)\(([\s\S]*?)\)\s*\})/g
  for (const m of attrs.matchAll(re)) {
    const fn = m[6]
    if (fn !== undefined) {
      for (const s of fn.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)) parts.push(s[1] ?? s[2] ?? s[3] ?? '')
    } else {
      parts.push(m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '')
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

export function sentenceAround(text: string, index: number): { start: number; end: number } {
  let s = index
  while (s > 0 && !/[.!?\n]/.test(text[s - 1]!)) s--
  let e = index
  while (e < text.length && !/[.!?\n]/.test(text[e]!)) e++
  return { start: s, end: e }
}
