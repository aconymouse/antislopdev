import type { Hit } from './types.js'

export const emoji = /(?![\u2713\u2717\u2122\u00a9\u00ae])(?:[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{2B50}\u{2B55}\u{2934}\u{2935}\u{3030}\u{303D}])\u{FE0F}?/gu

export function hasEmoji(text: string): boolean {
  emoji.lastIndex = 0
  const found = emoji.test(text)
  emoji.lastIndex = 0
  return found
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+').replace(/'/g, "['’]")
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&')
}

export interface Block {
  start: number
  end: number
  body: number
  bodyEnd: number
}

export function blocks(text: string, open: RegExp, close: RegExp): Block[] {
  const out: Block[] = []
  const o = new RegExp(open.source, open.flags.replace('g', '') + 'g')
  const c = new RegExp(close.source, close.flags.replace('g', '') + 'g')
  let at = 0
  while (at < text.length) {
    o.lastIndex = at
    const m = o.exec(text)
    if (!m) break
    const body = m.index + m[0].length
    c.lastIndex = body
    const e = c.exec(text)
    if (!e) {
      out.push({ start: m.index, end: text.length, body, bodyEnd: text.length })
      break
    }
    out.push({ start: m.index, end: e.index + e[0].length, body, bodyEnd: e.index })
    at = Math.max(e.index + e[0].length, m.index + 1)
  }
  return out
}

export function words(list: readonly string[], flags = 'giu'): RegExp {
  return new RegExp(`(?<![\\p{L}\\d])(?:${list.map(escape).join('|')})(?![\\p{L}\\d])`, flags)
}

export function scan(text: string, re: RegExp, note?: (m: RegExpMatchArray) => string | undefined): Hit[] {
  const out: Hit[] = []
  const g = re.global ? re : new RegExp(re.source, re.flags + 'g')
  for (const m of text.matchAll(g)) {
    const n = note?.(m)
    const hit: Hit = { index: m.index, length: m[0].length }
    if (n !== undefined) hit.note = n
    out.push(hit)
  }
  return out
}

export function quote(s: string, max = 60): string {
  const t = s.replace(/\s+/g, ' ').trim()
  return `"${t.length > max ? t.slice(0, max - 1) + '…' : t}"`
}

export function rgb(color: string): [number, number, number] | undefined {
  const c = color.trim().toLowerCase()
  const hex = c.match(/^#([0-9a-f]{3,8})$/)
  if (hex) {
    let h = hex[1]!
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map((x) => x + x).join('')
    if (h.length !== 6 && h.length !== 8) return undefined
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const fn = c.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/)
  if (fn) return [Number(fn[1]), Number(fn[2]), Number(fn[3])]
  const named: Record<string, [number, number, number]> = { white: [255, 255, 255], black: [0, 0, 0] }
  return named[c]
}

export function hue([r, g, b]: [number, number, number]): { h: number; s: number; l: number } {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return { h: 0, s: 0, l }
  const s = d / (1 - Math.abs(2 * l - 1))
  let h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4
  h *= 60
  if (h < 0) h += 360
  return { h, s, l }
}

export function contrast(a: [number, number, number], b: [number, number, number]): number {
  const lum = ([r, g, bl]: [number, number, number]) => {
    const f = (v: number) => {
      const x = v / 255
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl)
  }
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

export interface CssRule {
  selector: string
  body: string
  start: number
  bodyStart: number
}

export function cssRules(text: string): CssRule[] {
  const out: CssRule[] = []
  const chars = text.split('')
  for (const b of blocks(text, /\/\*/, /\*\//)) for (let i = b.start; i < b.end; i++) if (chars[i] !== '\n') chars[i] = ' '
  const clean = chars.join('')
  let run = 0
  let from = 0
  let open = -1
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i]
    if (c === '{') {
      open = i > run ? i : -1
      from = run
      run = i + 1
    } else if (c === '}') {
      if (open !== -1) {
        const raw = clean.slice(from, open)
        out.push({ selector: raw.trim(), body: clean.slice(open + 1, i), start: from + (raw.length - raw.trimStart().length), bodyStart: open + 1 })
      }
      open = -1
      run = i + 1
    } else if (c === '@' || c === ';') {
      run = i + 1
    }
  }
  return out
}
