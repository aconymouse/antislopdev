import type { Hit } from '../types.js'
import type { Source, Tag } from '../source.js'
import { markup, styled, type Rule } from '../rule.js'
import { cssRules, hasEmoji, hue, quote, rgb, scan } from '../util.js'

const iconPackages = /from\s+['"](lucide-react|lucide-vue-next|lucide-svelte|@lucide\/[\w-]+|@heroicons\/react[\w/-]*|react-icons\/\w+|@tabler\/icons-react|@phosphor-icons\/react|phosphor-react|@radix-ui\/react-icons|@iconify\/react|react-feather)['"]/
const sparkle = new Set(['sparkle', 'sparkles', 'wand', 'wand2', 'wandsparkles', 'magicwand', 'stars', 'aisparkle', 'magic'])
const stock = new Set(['zap', 'rocket', 'brain', 'bot', 'shieldcheck', 'checkcircle', 'checkcircle2', 'circlecheck', 'circlecheckbig', 'star', 'gem', 'layers', 'lightbulb', 'target', 'trendingup', 'award', 'bolt', 'lightningbolt', 'cpu', 'globe', 'lock', 'users', 'heart', 'thumbsup', 'crown', 'flame'])

function base(name: string): string {
  return name
    .replace(/^(Icon|Fa|Fa6|Hi|Hi2|Md|Io|Io5|Ri|Bs|Bi|Ai|Tb|Lu|Pi|Gi|Fi)(?=[A-Z0-9])/, '')
    .replace(/(Icon|Outline|Solid|Fill|Bold|Duotone|Light)+$/, '')
    .toLowerCase()
}

function textOf(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\{[^{}]*\}/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
}

function previousTag(src: Source, tag: Tag): Tag | undefined {
  const i = src.tags.indexOf(tag)
  return i > 0 ? src.tags[i - 1] : undefined
}

function inMap(src: Source, index: number): boolean {
  const before = src.text.slice(Math.max(0, index - 240), index)
  return /\.map\(\s*(\([^)]*\)|\w+)\s*=>\s*\(?\s*$/.test(before) || /\.map\(\s*(\([^)]*\)|\w+)\s*=>\s*\(\s*<[^>]*>\s*$/.test(before)
}

function headingAfter(src: Source, index: number, within: number, levels = '1-3'): boolean {
  return new RegExp(`<(h[${levels}]|Heading|CardTitle)\\b`).test(src.text.slice(index, index + within))
}

function styleText(src: Source): string {
  if (src.kind === 'style') return src.text
  let t = src.text.replace(/[^\n]/g, ' ')
  for (const m of src.text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>|style=\{\{([\s\S]*?)\}\}|style="([^"]*)"/g)) {
    const body = m[1] ?? m[2] ?? m[3] ?? ''
    const at = m.index + m[0].indexOf(body)
    t = t.slice(0, at) + body + t.slice(at + body.length)
  }
  return t
}

const tagHits = (src: Source, test: (t: Tag) => string | false | undefined): Hit[] =>
  src.tags.flatMap((t) => {
    const r = test(t)
    return r ? [{ index: t.start, length: t.end - t.start, note: r }] : []
  })

export const ui: Rule[] = [
  {
    id: 'UI-01',
    on: markup,
    run(src) {
      const found = src.tags.filter((t) => {
        const c = t.classes
        if (/^h[1-6]$/.test(t.name)) return false
        const looks = (/\buppercase\b/.test(c) && /\btracking-(wide|wider|widest|\[)/.test(c)) || /\b(eyebrow|kicker|overline|pretitle|section-label)\b/.test(c)
        return looks && headingAfter(src, t.end, 400)
      })
      if (found.length < 2) return []
      return found.map((t) => ({ index: t.start, length: t.end - t.start, note: `${found.length} labels sit above headings in this file` }))
    },
  },
  {
    id: 'UI-02',
    on: markup,
    run: (src) =>
      tagHits(src, (t) => {
        if (!/\brounded-full\b/.test(t.classes) || !/\b(border|bg-|ring)/.test(t.classes)) return false
        const inner = textOf(src.inner(t))
        if (!/\b(new|introducing|announcing|now (in|live|available)|beta|launch(ing|ed)?|v\d+(\.\d+)*)\b|✨/i.test(inner)) return false
        return headingAfter(src, t.end, 600, '1') && quote(inner)
      }),
  },
  {
    id: 'UI-04',
    on: markup,
    run(src) {
      const hits: Hit[] = []
      for (const m of src.text.matchAll(/<([A-Z][\w]*)\b/g)) {
        if (sparkle.has(base(m[1]!)) && iconPackages.test(src.text)) hits.push({ index: m.index, length: m[0].length, note: m[1]! })
      }
      hits.push(...scan(src.text, /data-lucide=["'](sparkles?|wand[\w-]*)["']|\bfa-(wand-magic-sparkles|wand-sparkles|magic)\b|\bph-(sparkle|magic-wand)\b|\bi-lucide-(sparkles?|wand[\w-]*)\b/g, (m) => m[0]))
      for (const t of src.tags) {
        if (/^(button|Button|a|Link|span|Badge)$/.test(t.name) && /✨/.test(textOf(src.inner(t)))) hits.push({ index: t.start, note: '✨ in a control' })
      }
      return hits
    },
  },
  {
    id: 'UI-03',
    on: markup,
    run(src) {
      const hits: Hit[] = []
      const packaged = iconPackages.test(src.text)
      for (const m of src.text.matchAll(/<([A-Z][\w]*)\b[^>]*\/?>/g)) {
        const b = base(m[1]!)
        if (!packaged || !stock.has(b) || sparkle.has(b)) continue
        if (headingAfter(src, m.index, 300, '1-4') || inMap(src, m.index)) hits.push({ index: m.index, length: m[0].length, note: m[1]! })
      }
      for (const m of src.text.matchAll(/data-lucide=["']([\w-]+)["']|\bfa-(?:solid|regular|light)?\s*fa-([\w-]+)|\bph\s+ph-([\w-]+)/g)) {
        const b = (m[1] ?? m[2] ?? m[3] ?? '').replace(/-/g, '')
        if (stock.has(b) && headingAfter(src, m.index, 300, '1-4')) hits.push({ index: m.index, length: m[0].length, note: m[0] })
      }
      return hits
    },
  },
  {
    id: 'UI-05',
    on: markup,
    run: (src) =>
      tagHits(src, (t) => {
        if (!/^(h[1-6]|button|Button|a|Link|li|label|summary|nav|th|CardTitle|NavLink|MenuItem|Tab|TabsTrigger)$/.test(t.name)) return false
        const inner = textOf(src.inner(t))
        if (/^(button|Button)$/.test(t.name) && /^\S{1,4}$/.test(inner) && /emoji|reaction|react/i.test(src.text)) return false
        if (/^[\u2610-\u2612]$/.test(inner)) return false
        return hasEmoji(inner) && quote(inner)
      }),
  },
  {
    id: 'UI-06',
    on: markup,
    run(src) {
      const h1 = src.text.search(/<h1\b/)
      if (h1 === -1) return []
      for (const t of src.tags) {
        if (t.start < h1 || !/(^|\s)(\w+:)?grid-cols-3\b/.test(t.classes)) continue
        const block = src.text.slice(t.end, t.end + 4000)
        const cards = (block.match(/<(h3|CardTitle)\b/g) ?? []).length
        if (cards >= 3 || (cards >= 1 && /\.map\(/.test(block.slice(0, 400)))) return [{ index: t.start, length: t.end - t.start, note: 'hero followed by a three-column card row' }]
      }
      return []
    },
  },
  {
    id: 'UI-07',
    on: markup,
    run: (src) =>
      tagHits(src, (t) => {
        const c = t.classes
        if (!/\brounded(-\w+)?\b/.test(c) || !/\b(border|shadow)(-\w+)?\b/.test(c) || !/\bp-\d/.test(c)) return false
        return inMap(src, t.start) && /grid-cols-|grid /.test(src.text.slice(Math.max(0, t.start - 600), t.start)) && 'every item in the grid gets the same card'
      }),
  },
  {
    id: 'UI-09',
    on: markup,
    run(src) {
      const hits = scan(src.text, />\s*0[1-9]\.?\s*</g, (m) => m[0].replace(/[<>\s]/g, ''))
      return new Set(hits.map((h) => h.note)).size >= 3 ? hits : []
    },
  },
  {
    id: 'UI-10',
    on: styled,
    run(src) {
      const hits: Hit[] = []
      const blue = '(blue|sky|cyan|indigo)'
      const purple = '(purple|violet|fuchsia|indigo|pink)'
      for (const t of src.tags) {
        const c = t.classes
        const from = c.match(new RegExp(`\\bfrom-${blue}-\\d+|\\bfrom-${purple}-\\d+`))
        const to = c.match(new RegExp(`\\b(to|via)-${purple}-\\d+|\\b(to|via)-${blue}-\\d+`))
        if (!from || !to) continue
        const pair = from[0] + ' ' + to[0]
        if (new RegExp(blue).test(pair) && /(purple|violet|fuchsia|pink)/.test(pair)) hits.push({ index: t.start, length: t.end - t.start, note: pair })
      }
      const css = styleText(src)
      for (const m of css.matchAll(/(linear|radial|conic)-gradient\(([^;]*?)\)\s*[;"'}\n]/g)) {
        const colors = [...m[2]!.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi)].map((c) => rgb(c[0])).filter((c) => c !== undefined)
        const hues = colors.map(hue).filter((x) => x.s > 0.35)
        const b = hues.some((x) => x.h >= 185 && x.h <= 245)
        const p = hues.some((x) => x.h >= 255 && x.h <= 330)
        if (b && p) hits.push({ index: m.index, length: m[0].length, note: 'blue to purple gradient' })
      }
      return hits
    },
  },
  {
    id: 'UI-11',
    on: styled,
    run(src) {
      const hits = tagHits(src, (t) => /\bbg-clip-text\b/.test(t.classes) && /\btext-transparent\b/.test(t.classes) && 'bg-clip-text text-transparent')
      return hits.concat(scan(styleText(src), /(-webkit-)?background-clip\s*:\s*text/g, () => 'background-clip: text'))
    },
  },
  {
    id: 'UI-12',
    on: styled,
    run(src) {
      const hits = tagHits(src, (t) => /\bblur-(2xl|3xl|\[\d{2,}px\])/.test(t.classes) && /\brounded-full\b/.test(t.classes) && /\b(absolute|fixed)\b/.test(t.classes) && 'blurred blob')
      for (const m of styleText(src).matchAll(/filter\s*:\s*blur\((\d+)px\)/g)) if (Number(m[1]) >= 40) hits.push({ index: m.index, length: m[0].length, note: m[0] })
      return hits
    },
  },
  {
    id: 'UI-13',
    on: styled,
    run(src) {
      const hits = tagHits(src, (t) => /\bbg-(grid|dot|dots|grid-pattern|dot-pattern)\b|bg-\[(radial|linear)-gradient\([^\]]*1px/.test(t.classes) && 'patterned background')
      return hits.concat(scan(styleText(src), /(radial|linear)-gradient\([^;]*?\b1px\b[^;]*?transparent[^;]*?\)/g, () => 'grid or dot background'))
    },
  },
  {
    id: 'UI-14',
    on: styled,
    run(src) {
      const hits = tagHits(src, (t) => /\bbackdrop-blur(-\w+)?\b/.test(t.classes) && 'backdrop-blur')
      hits.push(...scan(styleText(src), /^(?![ \t]*@supports)[^\n]*?(?<!-webkit-)backdrop-filter\s*:\s*blur/gm, () => 'backdrop-filter'))
      return hits.length > 2 ? hits : []
    },
  },
  {
    id: 'UI-15',
    on: markup,
    run(src) {
      const same = src.tags.filter((t) => /\brounded-(xl|2xl|3xl)\b/.test(t.classes) && /\bshadow-(md|lg|xl|2xl)\b/.test(t.classes))
      return same.length >= 5 ? [{ index: same[0]!.start, note: `${same.length} elements share the same radius and shadow` }] : []
    },
  },
  {
    id: 'UI-16',
    on: markup,
    run(src) {
      const controls = src.tags.filter((t) => /^(a|button|Button|Link)$/.test(t.name))
      const arrowed = controls.filter((t) => {
        const inner = src.inner(t)
        return /(→|›|»|->)\s*$/.test(textOf(inner)) || /<(ArrowRight|ChevronRight|ArrowUpRight|MoveRight|ArrowRightIcon|ChevronRightIcon)\b/.test(inner)
      })
      if (arrowed.length < 3 || arrowed.length / controls.length < 0.6) return []
      return [{ index: arrowed[0]!.start, note: `${arrowed.length} of ${controls.length} buttons and links end in an arrow` }]
    },
  },
  {
    id: 'UI-17',
    on: markup,
    run: (src) =>
      tagHits(src, (t) => {
        if (!/^(div|article|li|section|Card|figure)$/.test(t.name)) return false
        if (!/(?<![\w-])hover:(scale-|-translate-y|translate-y-|-mt-)/.test(t.classes)) return false
        if (/\b(onClick|href|role=["']button|tabIndex|onKeyDown)\b/.test(t.attrs)) return false
        const prev = previousTag(src, t)
        if (prev && /^(a|Link|NextLink|button|label)$/.test(prev.name) && t.start - prev.end < 200) return false
        return 'lifts on hover but does nothing on click'
      }),
  },
  {
    id: 'UI-18',
    on: markup,
    run(src) {
      const centred = src.tags.filter((t) => /^(section|header|div|main)$/.test(t.name) && /(^|\s)text-center\b/.test(t.classes) && headingAfter(src, t.end, 300, '1-2'))
      return centred.length >= 4 ? [{ index: centred[0]!.start, note: `${centred.length} centred sections` }] : []
    },
  },
  {
    id: 'UI-22',
    on: markup,
    run: (src) => scan(src.text, /\b(react-type-animation|typewriter-effect|typed\.js|typeit|TypeAnimation|Typewriter|TextGenerateEffect|FlipWords)\b/g, (m) => m[0]),
  },
  {
    id: 'UI-23',
    on: styled,
    run(src) {
      if (/pause|play-state|prefers-reduced-motion|motion-reduce/.test(src.text)) return []
      return scan(src.text, /<marquee\b|\banimate-(marquee|scroll|infinite-scroll)\b|@keyframes\s+(marquee|scroll-x|infinite-scroll)\b|react-fast-marquee|InfiniteMovingCards/g, (m) => m[0])
    },
  },
  {
    id: 'UI-25',
    on: markup,
    run: (src) => scan(src.text, /href=(?:"#?"|'#?'|\{\s*["'`]#?["'`]\s*\})|href=["']javascript:void\(0\);?["']|on[Cc]lick=\{\s*\(\)\s*=>\s*(\{\s*\}|null|undefined)\s*\}/g, (m) => m[0]),
  },
  {
    id: 'UI-28',
    on: ['markup', 'jsx', 'style', 'script', 'prose', 'config'],
    run: (src) => scan(src.text, /\b(picsum\.photos|source\.unsplash\.com|images\.unsplash\.com\/photo-[\w-]+\?[^"'\s]*random|placehold\.(co|it)|via\.placeholder\.com|placeholder\.com|dummyimage\.com|placekitten\.com|loremflickr\.com|i\.pravatar\.cc|randomuser\.me\/api\/portraits|fakeimg\.pl|picsum\.dev)\b/g, (m) => m[0]),
  },
  {
    id: 'UI-31',
    on: markup,
    run(src) {
      const boxy = (t: Tag) => /\brounded(-\w+)?\b/.test(t.classes) && /\b(border|shadow)(-[\w/]+)?\b/.test(t.classes) && /\bp-\d/.test(t.classes)
      const hits: Hit[] = []
      for (const t of src.tags) {
        if (!boxy(t)) continue
        const close = src.text.indexOf(`</${t.name}>`, t.end)
        if (close === -1) continue
        const inside = src.tags.find((u) => u.start > t.end && u.start < close && u.name === t.name && boxy(u))
        if (inside && !hits.some((h) => h.index === inside.start)) hits.push({ index: inside.start, length: inside.end - inside.start, note: 'card nested in a card' })
      }
      return hits
    },
  },
  {
    id: 'UI-32',
    on: markup,
    run(src) {
      const tiles = src.tags.filter((t) => {
        const c = t.classes
        return /\b(size|h|w)-(8|9|10|11|12|14|16)\b/.test(c) && /\brounded(-\w+)?\b/.test(c) && /\bbg-[\w-]+(\/\d+|-(50|100))\b/.test(c) && /\bjustify-center\b/.test(c)
      })
      return tiles.length >= 3 || tiles.some((t) => inMap(src, t.start)) ? tiles.map((t) => ({ index: t.start, length: t.end - t.start, note: 'tinted icon tile' })) : []
    },
  },
  {
    id: 'UI-33',
    on: markup,
    run: (src) =>
      tagHits(src, (t) => {
        const bg = t.classes.match(/\bbg-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|primary)-(400|500|600|700|800|900)\b/)
        const fg = t.classes.match(/\btext-(gray|slate|zinc|neutral|stone)-(300|400|500|600)\b/)
        return bg && fg ? `${fg[0]} on ${bg[0]}` : false
      }),
  },
  {
    id: 'UI-34',
    on: styled,
    run(src) {
      const hits = tagHits(src, (t) => {
        const m = t.classes.match(/\b(shadow|drop-shadow)-(cyan|fuchsia|pink|lime|green|emerald|teal)-(300|400|500)(\/\d+)?\b|drop-shadow-\[0_0_[^\]]*(#0ff|#00ffff|#39ff14|#ff00ff|cyan|lime|magenta)[^\]]*\]/)
        return m ? m[0] : false
      })
      for (const m of styleText(src).matchAll(/(box|text)-shadow\s*:\s*0(px)?\s+0(px)?\s+\d+px[^;]*?(#[0-9a-f]{3,8}|rgba?\([^)]*\))/gi)) {
        const c = rgb(m[4]!)
        if (!c) continue
        const { h, s, l } = hue(c)
        const neon = s > 0.75 && l > 0.4 && l < 0.7 && ((h >= 165 && h <= 200) || (h >= 85 && h <= 150) || (h >= 285 && h <= 330))
        if (neon) hits.push({ index: m.index, length: m[0].length, note: 'neon glow' })
      }
      return hits
    },
  },
  {
    id: 'UI-35',
    on: styled,
    run(src) {
      const hits = tagHits(src, (t) => /^(h[1-3]|p|body|main)$/.test(t.name) && /\bfont-mono\b/.test(t.classes) && `font-mono on <${t.name}>`)
      for (const sh of src.sheets) {
        for (const r of cssRules(sh.text)) {
          if (/(^|[\s,>])(h[1-3]|body|html|p)\s*($|[,:{])/.test(r.selector) && /font-family\s*:[^;]*\bmono/i.test(r.body)) hits.push({ index: r.start + sh.offset, note: `${r.selector} in a monospace face` })
        }
      }
      return hits
    },
  },
  {
    id: 'UI-36',
    on: styled,
    run(src) {
      const hits = scan(src.text, /\banimate-bounce\b|\bease\s*:\s*["'](backOut|backInOut|elastic|bounce\w*)["']|type\s*:\s*["']spring["'][^}]*\bbounce\s*:\s*0?\.[3-9]/g, (m) => m[0])
      for (const m of src.text.matchAll(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g)) {
        const y1 = Number(m[2])
        const y2 = Number(m[4])
        if (y1 > 1 || y2 > 1 || y1 < 0 || y2 < 0) hits.push({ index: m.index, length: m[0].length, note: 'overshooting curve' })
      }
      return hits
    },
  },
]
