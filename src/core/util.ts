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
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  for (const m of clean.matchAll(/([^{}@;]+)\{([^{}]*)\}/g)) {
    out.push({ selector: m[1]!.trim(), body: m[2]!, start: m.index + (m[1]!.length - m[1]!.trimStart().length), bodyStart: m.index + m[1]!.length + 1 })
  }
  return out
}
