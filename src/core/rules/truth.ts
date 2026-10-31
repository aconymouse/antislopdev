import type { Hit } from '../types.js'
import { empty, paste, type Source } from '../source.js'
import { written, type Rule } from '../rule.js'
import { quote, scan } from '../util.js'

const everywhere: Rule['on'] = ['markup', 'jsx', 'prose', 'script', 'config', 'style', 'commit', 'manifest']
const copyAndData: Rule['on'] = ['markup', 'jsx', 'prose', 'script', 'config']

const copies = new WeakMap<Source, string>()

function copyText(src: Source): string {
  const hit = copies.get(src)
  if (hit !== undefined) return hit
  const made = makeCopy(src)
  copies.set(src, made)
  return made
}

function makeCopy(src: Source): string {
  if (src.isTest) return empty(src.text).join('')
  const t = src.kind === 'script' || src.kind === 'config' ? empty(src.text) : src.prose.split('')
  for (const s of src.strings) {
    if (/(placeholder|example|defaultValue|pattern)\s*[=:]\s*\{?\s*$/.test(src.text.slice(Math.max(0, s.start - 20), s.start - 1))) continue
    if (src.kind === 'jsx' && /\b(className|class|href|src|id|key|type|name|rel|target)\s*=\s*\{?\s*$/.test(src.text.slice(Math.max(0, s.start - 14), s.start - 1))) continue
    paste(t, s.text, s.start)
  }
  return t.join('')
}

const fakeNames = /\b(Sarah (Chen|Johnson|Mitchell|Williams|Kim|Martinez)|Alex (Rivera|Chen|Johnson|Morgan|Thompson|Kim)|Marcus (Chen|Johnson|Rodriguez|Williams|Thompson)|Emily (Rodriguez|Chen|Davis|Watson|Zhang)|David (Kim|Park|Chen|Rodriguez)|Priya (Sharma|Patel)|Jordan (Lee|Smith|Taylor)|Michael (Torres|Chen|Rodriguez)|Jessica (Martinez|Lee|Wong)|Elena (Rodriguez|Petrova|Vasquez)|James (Wilson|Rodriguez)|Maya (Patel|Chen|Rodriguez)|Lisa (Wang|Chen|Thompson)|Ryan (Mitchell|Cooper)|Rachel (Kim|Green))\b/g
const roleAt = /\b(CEO|CTO|COO|CFO|CMO|Founder|Co-?founder|Head of [A-Z][\w ]{1,20}|VP(?: of)? [A-Z][\w ]{1,20}|Product (?:Manager|Designer|Lead)|(?:Senior |Lead |Staff |Principal )?(?:Software |Frontend |Front-end |Backend |Full[- ]?stack )?(?:Engineer|Developer|Designer)|Marketing (?:Manager|Director|Lead)|Director of [A-Z][\w ]{1,20})\s*(?:,|at|@|·|-|–|—)\s*[A-Z][\w&.]+/g

export const truth: Rule[] = [
  {
    id: 'TR-01',
    on: copyAndData,
    run: (src) => scan(copyText(src), /\b(?:\d{1,3}(?:[,.]\d{3})+\+?|\d{3,}\+?|\d+(?:[.,]\d+)?\s*[kKmM]\+?|\d+\+)\s*(?:happy |active |satisfied |trusted )?(users|customers|developers|teams|companies|downloads|businesses|clients|creators|members|pengguna|pelanggan|perusahaan|klien)\b|\b99\.9+\s*%\s*(uptime|availability|accuracy)|\b\d+(?:\.\d+)?\s*[x×]\s*(faster|better|more productive|cheaper|more efficient|lebih cepat|lebih hemat)\b|\b\d{2,3}\s*%\s*(faster|less time|more conversions|increase in|lebih cepat)\b/gi, (m) => quote(m[0])),
  },
  {
    id: 'TR-02',
    on: copyAndData,
    run(src) {
      const text = copyText(src)
      const hits: Hit[] = scan(text, fakeNames, (m) => m[0])
      if (/testimonial|review|quote|blockquote|what (our )?(customers|users|people) say/i.test(src.text)) hits.push(...scan(text, roleAt, (m) => quote(m[0])))
      return hits
    },
  },
  {
    id: 'TR-03',
    on: copyAndData,
    run: (src) => scan(copyText(src), /\b(John Doe|Jane Doe|John Smith|Jane Smith|Acme(?: Inc\.?| Corp\.?| Corporation| Co\.)?|TechCorp|InnovateCo|StartupXYZ|Company Name|Your Company)\b|\b[Ll]orem ipsum\b|\bdolor sit amet\b|\b(example|user|test|john|jane)@(example|test|email|domain)\.com\b|\b123 Main St(reet)?\b|\(555\)\s*\d{3}|\b555-\d{4}\b/g, (m) => m[0]),
  },
  {
    id: 'TR-04',
    on: copyAndData,
    run: (src) => scan(copyText(src), /\b(SOC ?2(?: Type (?:I{1,2}|1|2))?(?: compliant| certified)?|HIPAA[- ]compliant|GDPR[- ](?:compliant|ready)|ISO ?27001(?: certified)?|PCI[- ]DSS(?: compliant)?|bank[- ]grade (?:security|encryption)|military[- ]grade (?:security|encryption)|enterprise[- ]grade security|end-to-end encrypted)\b/gi, (m) => m[0]),
  },
  {
    id: 'TR-05',
    on: written,
    run: (src) => scan(src.prose, /\b(lightning[- ]fast|blazing(?:ly)?[- ]fast|loads instantly|instant(?:ly)? load(?:ing|s)?|zero latency|super[- ]?fast|ultra[- ]fast|secepat kilat|super cepat)\b/gi, (m) => m[0]),
  },
  {
    id: 'TR-06',
    on: copyAndData,
    run: (src) => scan(copyText(src), /\b[A-Z][a-z]+ (?:from|in|di|dari) [A-Z][\w ]{1,20} just (?:signed up|purchased|bought|joined|subscribed|ordered)\b|\bonly \d+ (?:left|spots? left|seats? left|remaining)\b|\boffer ends in\b|\b\d+ (?:people|others|users|orang) (?:are )?(?:viewing|looking at|sedang melihat) this\b|\btinggal \d+ (?:slot|kursi|unit)\b/gi, (m) => quote(m[0])),
  },
  {
    id: 'TR-08',
    on: everywhere,
    run: (src) => scan(src.text, /oaicite|:?contentReference\[|\bturn\d+(?:search|view|news|file|image)\d+\b|utm_source=(?:chatgpt\.com|openai|perplexity(?:\.ai)?|copilot\.com|claude\.ai|gemini)|【\d+†[^】]*】|\bfilecite\b|\bciteturn\d/g, (m) => m[0]),
  },
]

export function links(src: Source): { url: string; index: number }[] {
  const out: { url: string; index: number }[] = []
  if (src.kind === 'prose') {
    const p = src.text
    for (const m of p.matchAll(/(?<!!)\[[^[\]\n]*\]\((https?:\/\/[^()\s]+)\)|<(https?:\/\/[^<>\s]+)>/g)) {
      const inCode = src.codeBlocks.some((b) => m.index >= b.start && m.index < b.end)
      if (!inCode) out.push({ url: (m[1] ?? m[2])!, index: m.index })
    }
  }
  if (src.isMarkup) {
    for (const t of src.tags) {
      const m = t.attrs.match(/\bhref\s*=\s*(?:\{\s*)?["'`](https?:\/\/[^"'`\s]+)["'`]/)
      if (m) out.push({ url: m[1]!, index: t.start })
    }
  }
  return out.filter((l) => !/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|[\w.-]*example\.(com|org|net))([:/]|$)/.test(l.url))
}
