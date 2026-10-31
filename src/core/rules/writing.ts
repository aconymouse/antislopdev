import type { Hit } from '../types.js'
import type { Source } from '../source.js'
import { empty, paste, sentenceAround } from '../source.js'
import { written, type Rule } from '../rule.js'
import { quote, scan, words } from '../util.js'

const withStrings: Rule['on'] = ['markup', 'jsx', 'prose', 'script', 'config']

const masks = new WeakMap<Source, string>()

function stringsMask(src: Source): string {
  const hit = masks.get(src)
  if (hit !== undefined) return hit
  const t = empty(src.text)
  for (const s of src.strings) paste(t, s.text, s.start)
  const made = t.join('')
  masks.set(src, made)
  return made
}

function surfaces(src: Source, strings = false): string[] {
  const out: string[] = []
  if (src.kind === 'markup' || src.kind === 'jsx' || src.kind === 'prose' || (src.kind === 'config' && src.isCopy)) out.push(src.prose)
  if (strings && (src.kind === 'script' || src.kind === 'jsx' || src.kind === 'config')) out.push(stringsMask(src))
  return out
}

function find(src: Source, re: RegExp, strings = false, note: (m: RegExpMatchArray) => string | undefined = (m) => quote(m[0])): Hit[] {
  const seen = new Set<number>()
  const out: Hit[] = []
  for (const text of surfaces(src, strings)) {
    for (const h of scan(text, re, note)) {
      if (seen.has(h.index)) continue
      seen.add(h.index)
      out.push(h)
    }
  }
  return out
}

function sourced(src: Source, index: number): boolean {
  const { start, end } = sentenceAround(src.text, index)
  const s = src.text.slice(Math.max(0, start - 2), Math.min(src.text.length, end + 120))
  return /\]\(https?:|<a\s[^>]*href|href=|\[\^?\d+\]|\(\s*(?:source|sumber)\s*:/i.test(s)
}

function headings(src: Source): { index: number; text: string }[] {
  const out: { index: number; text: string }[] = []
  if (src.kind === 'prose') {
    for (const m of src.prose.matchAll(/^(#{1,6})[ \t]+(.+?)[ \t#]*$/gm)) out.push({ index: m.index, text: m[2]! })
  }
  for (const t of src.tags) {
    if (/^(h[1-6]|title)$/.test(t.name)) {
      const text = src.inner(t).split(/<[^<>]*>/).join(' ').replace(/\{[^{}]*\}/g, ' ').replace(/\s+/g, ' ').trim()
      if (text) out.push({ index: t.start, text })
    }
  }
  return out
}

function controls(src: Source): { index: number; text: string }[] {
  const out: { index: number; text: string }[] = []
  for (const t of src.tags) {
    if (!/^(a|button|Button|Link|NextLink)$/.test(t.name)) continue
    const text = src.inner(t).replace(/<[^>]*>/g, ' ').replace(/\{[^{}]*\}/g, ' ').replace(/\s+/g, ' ').trim()
    if (text) out.push({ index: t.start, text })
  }
  if (src.kind === 'prose') {
    for (const m of src.text.matchAll(/(?<!!)\[([^[\]\n]+)\]\([^()\s]+\)/g)) out.push({ index: m.index, text: m[1]! })
  }
  return out
}

function overLimit(src: Source, re: RegExp, per: number, label: string): Hit[] {
  const hits = scan(src.prose, re)
  const allowed = Math.max(1, Math.floor(src.proseWords / per))
  if (hits.length <= allowed) return []
  return hits.slice(allowed).map((h) => ({ ...h, note: `${hits.length} ${label} in ${src.proseWords} words` }))
}

function each(list: { index: number; text: string }[], test: (text: string) => boolean): Hit[] {
  return list.filter((x) => test(x.text)).map((x) => ({ index: x.index, note: quote(x.text) }))
}

const adjectives = new Set(['fast', 'simple', 'easy', 'powerful', 'secure', 'modern', 'clean', 'smart', 'scalable', 'reliable', 'flexible', 'intuitive', 'beautiful', 'lightweight', 'elegant', 'seamless', 'robust', 'efficient', 'effective', 'accessible', 'affordable', 'fun', 'friendly', 'safe', 'quick', 'smooth', 'sleek', 'bold', 'fresh', 'free', 'open', 'private', 'personal', 'innovative', 'engaging', 'responsive', 'dynamic', 'stunning', 'polished'])
const hype = words(['seamless', 'seamlessly', 'effortless', 'effortlessly', 'revolutionary', 'revolutionize', 'revolutionise', 'game-changing', 'game-changer', 'cutting-edge', 'next-level', 'supercharge', 'supercharged', 'unleash', 'unleashes', 'elevate', 'elevates', 'empower', 'empowers', 'empowering', 'transformative', 'robust', 'leverage', 'leverages', 'leveraging', 'harness', 'harnessing', 'delve', 'delves', 'delving', 'tapestry', 'realm', 'testament', 'beacon', 'synergy', 'holistic', 'paradigm', 'world-class', 'best-in-class', 'state-of-the-art', 'meticulous', 'meticulously', 'bustling', 'vibrant', 'embark', 'navigate the complexities', 'ever-evolving', 'in the realm of', 'a myriad of', 'myriad'])
const openers = words(["in today's fast-paced world", "in today's digital age", "in today's digital landscape", "in today's world", 'in the ever-evolving world of', 'in the ever-evolving landscape of', 'in an era where', 'in an age where', 'have you ever wondered', "let's dive in", "let's dive into", "let's delve into", 'in this article, we will', "in this article, we'll", "in this blog post, we'll", 'in this blog post, we will', 'buckle up', 'picture this:'])
const signoffs = words(['happy coding', 'happy hacking', 'happy building', 'hope this helps', 'hope you found this helpful', 'feel free to reach out', "don't hesitate to reach out", "don't hesitate to contact", 'let me know if you have any questions', 'let me know if you have any other questions'])
const ctaEn = /^(get started|learn more|click here|read more|discover more|find out more|explore more|see more|start now)[.!→›»\s-]*$/i
const ctaId = /^(mulai sekarang|selengkapnya|klik di sini|pelajari lebih lanjut|baca selengkapnya|lihat selengkapnya|cari tahu lebih lanjut|lihat lebih banyak)[.!→›»\s-]*$/i
const formula = /\bunlock (the (full )?(power|potential) of|your)\b|\b[\w-]+ made (simple|easy|effortless)\b|\bthe future of [\w -]{1,30} is here\b|\bsupercharge your\b|\btake your [\w -]{1,30} to the next level\b|\b(elevate|transform|revolutioni[sz]e) your\b/i
const hedges = words(['might potentially', 'could potentially', 'may potentially', 'could possibly', 'might possibly', "it's worth noting that", 'it is worth noting that', "it's important to note that", 'it is important to note that', "it's important to remember that", 'it is important to remember that', 'it should be noted that', 'needless to say'])
const inflated = words(['stands as a testament to', 'is a testament to', 'serves as a testament to', 'a testament to', 'plays a pivotal role', 'plays a crucial role', 'plays a vital role', 'plays a key role', 'marks a significant milestone', 'marks a major milestone', 'marks a pivotal', 'leaves a lasting legacy', 'leaves a lasting impact', 'a pivotal moment', 'at the forefront of', 'a beacon of', 'stands as a symbol of', 'rich tapestry', 'enduring legacy'])
const authority = /\b(experts|analysts|researchers|scientists|critics|observers) (say|agree|believe|suggest|warn|note|argue)\b|\bmany (experts|people|developers|users|believe|say)\b|\b(studies|research|surveys|data) (show|shows|have shown|has shown|suggest|suggests|indicate|indicates|prove|proves)\b|\bindustry (leaders|experts|observers|insiders) (say|agree|note|believe)\b|\bit is (widely|generally|commonly) (believed|accepted|known|regarded|acknowledged)\b|\baccording to (experts|studies|research|many)\b/i
const residue = /(?<![\p{L}])(Certainly!|Of course! Here|Absolutely! Here|Sure! Here['’]s|Great question|As an AI(?: language model)?\b|As a large language model|I hope this helps|I['’]d be happy to help|I['’]m happy to help|Here['’]s (?:a|an|the) (?:revised|updated|improved|rewritten|polished|refined) version|as of my (?:last )?(?:knowledge|training) (?:cutoff|update)|I don['’]t have (?:access to )?real-time)/iu
const slots = /\[(?:Your|Insert|Add|Enter|Company|Product|Brand|Client|Name|Date|Link|URL|Title|Author|Email|Phone|Address)\b[^\]\n]{0,30}\](?!\()|\b(?:19|20)\d\d-(?:xx|XX)-(?:xx|XX)\b|\bXX\/XX\/(?:XXXX|20XX)\b/
const idOpeners = words(['di era digital saat ini', 'di era digital seperti sekarang', 'di era digital', 'di zaman yang serba cepat', 'di zaman serba cepat', 'di zaman modern ini', 'di zaman sekarang ini', 'di era modern ini', 'di era globalisasi', 'seiring perkembangan teknologi', 'seiring dengan perkembangan teknologi', 'seiring berkembangnya teknologi', 'seiring kemajuan teknologi', 'seiring perkembangan zaman', 'pernahkah kamu bertanya-tanya', 'pernahkah anda bertanya-tanya', 'pernahkah kalian bertanya-tanya', 'mari kita selami', 'mari kita bahas', 'mari kita kupas', 'mari kita telusuri', 'pada artikel kali ini kita akan membahas', 'pada artikel ini kita akan membahas', 'dalam artikel ini, kita akan membahas', 'dalam artikel ini kita akan membahas', 'dalam artikel ini, kami akan membahas', 'artikel ini akan membahas'])
const idPromo = words(['solusi terbaik', 'solusi terdepan', 'solusi inovatif', 'solusi komprehensif', 'revolusioner', 'memberdayakan', 'mengoptimalkan secara maksimal', 'tingkatkan pengalaman', 'meningkatkan pengalaman', 'transformasi digital', 'era baru', 'lompatan besar', 'secara komprehensif', 'holistik', 'bersinergi', 'mutakhir', 'canggih dan modern', 'kelas dunia', 'terdepan di kelasnya'])
const idClosers = words(['semoga bermanfaat', 'semoga artikel ini bermanfaat', 'semoga informasi ini bermanfaat', 'kesimpulannya', 'dapat disimpulkan bahwa', 'dengan demikian', 'demikianlah artikel ini', 'demikian artikel ini', 'demikianlah pembahasan', 'demikian pembahasan', 'demikian ulasan', 'demikianlah ulasan', 'demikian informasi', 'jangan lupa share', 'jangan lupa bagikan', 'sampai jumpa di artikel berikutnya', 'sampai jumpa di artikel selanjutnya'])
const idCalque = words(['ini adalah penting', 'adalah penting untuk', 'hal ini adalah', 'penting untuk dicatat', 'perlu dicatat bahwa', 'merupakan sebuah', 'adalah merupakan'])
const idHello = /\b(halo|hai|hi),? sobat\b|\bsobat [A-Z][\p{L}]+\b|\byuk,? (simak|kepoin|cek)\b|\bkuy\b|\bcekidot\b/iu
const idInflated = words(['menjadi bukti nyata', 'bukti nyata bahwa', 'memainkan peran penting', 'memainkan peran krusial', 'memainkan peran vital', 'memainkan peran kunci', 'tonggak sejarah', 'warisan abadi', 'babak baru', 'angin segar', 'tak lekang oleh waktu'])
const idAuthority = /\bpara (ahli|pakar|pengamat|peneliti) (mengatakan|menyebut|menilai|sepakat|percaya|berpendapat)\b|\bbanyak (orang|pihak|ahli) (yang )?(percaya|menilai|mengatakan|berpendapat)\b|\b(studi|penelitian|riset|survei|data) (menunjukkan|membuktikan|menyebutkan)\b|\bberbagai sumber menyebutkan\b|\bmenurut (para )?(ahli|pakar)\b/i
const idResidue = /(?<![\p{L}])(Tentu!|Tentu saja! Berikut|Tentu, berikut|Berikut adalah (?:versi|ringkasan|artikel|draf) (?:yang )?(?:sudah )?(?:direvisi|diperbarui|diperbaiki)|Pertanyaan (?:yang )?(?:bagus|menarik)!|Sebagai (?:model bahasa|AI)\b|Semoga (?:jawaban ini )?membantu!?|Saya harap ini membantu)/iu

export const writing: Rule[] = [
  { id: 'TX-01', on: written, run: (src) => overLimit(src, /—/g, 150, 'em dashes') },
  {
    id: 'TX-02',
    on: written,
    run: (src) => find(src, /\b(?:it['’]?s|this is|that['’]?s|is|are|was|were)\s+not\s+(?:just|only|merely|simply)\b[^.!?\n]{1,80}?[,;—–-]\s*(?:but|it['’]?s|they['’]?re|this is)\b|\bnot\s+(?:just|only|merely)\s+(?:a|an|the|about)?\s*[^.!?\n]{1,60}?,?\s+but\s+(?:also\s+)?|\b(?:isn['’]?t|aren['’]?t|wasn['’]?t) (?:just|only|merely|simply|about)\b[^.!?\n]{1,60}?[.,;—–]\s*(?:it['’]?s|they['’]?re)\b/gi),
  },
  {
    id: 'TX-03',
    on: written,
    run(src) {
      if (src.lang !== 'en') return []
      const hits = find(src, /\b([\p{L}-]+), ([\p{L}-]+),? and ([\p{L}-]+)\b/giu).filter((h) => {
        const w = (h.note ?? '').replace(/["“”]/g, '').split(/,\s*(?:and\s+)?|\s+and\s+/).map((x) => x.trim().toLowerCase())
        return w.length === 3 && w.filter((x) => adjectives.has(x) || /(ful|ive|less|able|ible|ous|ic|ant|ent|ary)$/.test(x)).length >= 2
      })
      return hits.length >= 3 ? hits : []
    },
  },
  { id: 'TX-04', on: written, run: (src) => find(src, hype) },
  { id: 'TX-05', on: written, run: (src) => find(src, openers) },
  { id: 'TX-06', on: written, run: (src) => find(src, /\b(in conclusion|to sum up|in summary|to summari[sz]e|all in all)\b/gi) },
  { id: 'TX-07', on: ['markup', 'jsx', 'prose', 'commit'], run: (src) => find(src, signoffs, true) },
  { id: 'TX-08', on: written, run: (src) => each(controls(src), (t) => ctaEn.test(t)) },
  { id: 'TX-09', on: written, run: (src) => each(headings(src), (t) => formula.test(t)) },
  {
    id: 'TX-10',
    on: written,
    run: (src) => (src.lang === 'en' ? overLimit(src, /!(?!=)/g, 300, 'exclamation marks') : []),
  },
  {
    id: 'TX-11',
    on: written,
    run(src) {
      if (src.lang !== 'en') return []
      const titled = headings(src).filter(({ text }) => {
        const w = text.match(/\p{L}[\p{L}'’-]*/gu) ?? []
        if (w.length < 4) return false
        const rest = w.slice(1).filter((x) => x.length > 3)
        const caps = rest.filter((x) => /^\p{Lu}/u.test(x) && !/^\p{Lu}+$/u.test(x))
        return rest.length >= 3 && caps.length / rest.length >= 0.8
      })
      return titled.length >= 2 ? titled.map((h) => ({ index: h.index, note: quote(h.text) })) : []
    },
  },
  { id: 'TX-12', on: written, run: (src) => find(src, hedges) },
  { id: 'TX-13', on: written, run: (src) => find(src, /\bwhether you['’]re (?:a |an )?[^,.!?\n]{1,40}? or (?:a |an )?[^,.!?\n]{1,40}/gi) },
  {
    id: 'TX-14',
    on: written,
    run(src) {
      const paras = src.paragraphs.filter((p) => !/^\s*([-*+]|\d+\.|#|\||>)/.test(p.text))
      if (paras.length < 4) return []
      const bold = (p: { start: number; end: number }) => /\*\*[^*\n]+\*\*|__[^_\n]+__|<(strong|b)>/.test(src.text.slice(p.start, p.end))
      const marked = paras.filter(bold)
      return marked.length / paras.length >= 0.5 ? [{ index: marked[0]!.start, note: `bold in ${marked.length} of ${paras.length} paragraphs` }] : []
    },
  },
  {
    id: 'TX-15',
    on: written,
    run(src) {
      const hits = scan(src.text, /^[ \t]*(?:[-*+]|\d+\.)[ \t]+(?:\*\*|__)[^*_\n]{1,60}?(?:\*\*|__)[ \t]*[:—–-]?[ \t]+\S|<li>\s*<(?:strong|b)>[^<]{1,60}<\/(?:strong|b)>\s*[:—–-]?/gm)
      return hits.length >= 3 ? hits.map((h) => ({ ...h, note: 'bulleted line with a bold lead-in' })) : []
    },
  },
  { id: 'TX-16', on: written, run: (src) => find(src, /,\s+(?:thereby\s+)?(highlighting|underscoring|emphasi[sz]ing|reflecting|showcasing|signal(?:l)?ing|cementing|solidifying|reinforcing|illustrating|paving the way for|contributing to the)\b[^.!?\n]{0,40}/gi) },
  { id: 'TX-17', on: written, run: (src) => find(src, inflated) },
  { id: 'TX-18', on: written, run: (src) => find(src, new RegExp(authority.source, 'gi')).filter((h) => !sourced(src, h.index)) },
  { id: 'TX-19', on: written, run: (src) => find(src, /\bfrom (?:[\p{L}-]+ ){0,2}(?:startups?|beginners?|novices?|small businesses|individuals|freelancers|hobbyists|ideas?|concepts?|design|prototypes?|sketch|solo developers?) to (?:[\p{L}-]+ ){0,2}(?:enterprises?|experts?|pros?|professionals|large (?:corporations|teams|companies)|organi[sz]ations|launch|production|deployment|reality|scale|global brands)\b/giu) },
  { id: 'TX-20', on: written, run: (src) => find(src, /\bNo [\p{L}-]+[.,]\s+No [\p{L}-]+[.,!](?:\s+(?:No [\p{L}-]+[.,]\s+)?(?:Just|Only)\s[^.!?\n]{1,40}[.!])?|\bno [\p{L}-]+, no [\p{L}-]+(?:, no [\p{L}-]+)?,? (?:just|only) /gu) },
  {
    id: 'TX-21',
    on: written,
    run: (src) =>
      find(src, /\b(The (?:result|catch|twist|answer|best part|kicker|secret|truth)\?|Here['’]s the (?:thing|kicker|catch|deal|truth)\s*:|Spoiler(?: alert)?\s*:)/g).filter((h) => /(^|[.!?]\s*|\n\s*|>\s*)$/.test(src.prose.slice(Math.max(0, h.index - 3), h.index).trimEnd() || '')),
  },
  { id: 'TX-22', on: written, run: (src) => find(src, /\bthis (powerhouse|gem|game[- ]changer|beast|workhorse|marvel)\b/gi) },
  { id: 'TX-23', on: withStrings, run: (src) => find(src, new RegExp(residue.source, 'giu'), true) },
  {
    id: 'TX-24',
    on: withStrings,
    run(src) {
      const hits = find(src, new RegExp(slots.source, 'g'))
      if (src.isScript || src.kind === 'config') hits.push(...scan(stringsMask(src), /(?<![/\w])\[(?:Your|Insert|Add|Enter) [^\]\n]{1,30}\](?!\()|\b(?:19|20)\d\d-(?:xx|XX)-(?:xx|XX)\b/g, (m) => quote(m[0])))
      if (src.kind === 'prose' || src.kind === 'markup') hits.push(...scan(src.prose, /\{\{?\s*(company|product|name|brand|client|first_name)(_name)?\s*\}?\}/gi, (m) => m[0]))
      return hits
    },
  },
  { id: 'TX-25', on: written, run: (src) => each(headings(src), (t) => /^(challenges and (future )?(prospects|opportunities)|future (outlook|prospects|directions)|looking ahead|the road ahead|what['’]?s next\??|final thoughts)$/i.test(t.trim())) },

  { id: 'ID-01', on: written, run: (src) => find(src, idOpeners) },
  { id: 'ID-02', on: written, run: (src) => find(src, /\btidak (?:hanya|cuma|sekadar|sekedar)\b[^.!?\n]{1,80}?\b(?:tetapi|tapi|namun|melainkan) juga\b|\bbukan (?:hanya|sekadar|sekedar|cuma)\b[^.!?\n]{1,80}?\b(?:melainkan|tetapi|tapi|namun)\b/gi) },
  { id: 'ID-03', on: written, run: (src) => find(src, idPromo) },
  {
    id: 'ID-04',
    on: written,
    run: (src) => find(src, idClosers).concat(each(headings(src), (t) => /^(kesimpulan|penutup|akhir kata|rangkuman)$/i.test(t.trim()))),
  },
  {
    id: 'ID-05',
    on: written,
    run(src) {
      const hits = find(src, idCalque)
      const anda = scan(src.prose, /\bAnda (dapat|bisa)\b/g)
      if (anda.length >= 4) hits.push(...anda.map((h) => ({ ...h, note: `"Anda dapat" ${anda.length} times` })))
      const dimana = scan(src.prose, /\b(di ?mana)\b(?![^.!?\n]*\?)/gi)
      if (dimana.length >= 3) hits.push(...dimana.map((h) => ({ ...h, note: '"di mana" used as a connector' })))
      return hits
    },
  },
  { id: 'ID-06', on: written, run: (src) => find(src, new RegExp(idHello.source, 'giu')) },
  {
    id: 'ID-07',
    on: written,
    run(src) {
      const hits: Hit[] = []
      for (const p of src.paragraphs) {
        const pron = /\bAnda\b/.test(p.text) && /\b(kamu|lo|lu|kalian)\b/i.test(p.text)
        const neg = /\btidak\b/i.test(p.text) && /\b(gak|nggak|enggak|ngga)\b/i.test(p.text)
        if (pron || neg) hits.push({ index: p.start, note: pron ? '"Anda" and "kamu" in one paragraph' : '"tidak" and "gak" in one paragraph' })
      }
      return hits
    },
  },
  { id: 'ID-08', on: written, run: (src) => each(controls(src), (t) => ctaId.test(t)) },
  { id: 'ID-09', on: written, run: (src) => (src.lang === 'id' ? overLimit(src, /!(?!=)/g, 300, 'tanda seru') : []) },
  { id: 'ID-10', on: written, run: (src) => find(src, /,\s*(?:yang\s+)?(?:menunjukkan|menegaskan|mencerminkan|menandakan|membuktikan|menggarisbawahi|memperlihatkan)\s+(?:pentingnya|komitmen|perubahan|betapa|keseriusan|kuatnya)\b[^.!?\n]{0,40}/gi) },
  { id: 'ID-11', on: written, run: (src) => find(src, idInflated) },
  { id: 'ID-12', on: written, run: (src) => find(src, new RegExp(idAuthority.source, 'gi')).filter((h) => !sourced(src, h.index)) },
  { id: 'ID-13', on: withStrings, run: (src) => find(src, new RegExp(idResidue.source, 'giu'), true) },
  { id: 'ID-14', on: written, run: (src) => find(src, /\bmulai dari (?:[\p{L}-]+ ){0,2}[\p{L}-]+ (?:hingga|sampai) (?:[\p{L}-]+ ){0,2}[\p{L}-]+\b|\bdari hulu (?:ke|hingga) hilir\b/giu).filter((h) => !/\d/.test(h.note ?? '')) },
]
