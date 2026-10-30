import type { Hit } from '../types.js'
import { type Rule } from '../rule.js'
import { emoji, hasEmoji, quote, scan } from '../util.js'

const bulletEmoji = new RegExp(`^[ \\t]*[-*+][ \\t]+(?:\\*\\*)?(?:${emoji.source})`, 'gmu')
const adjectives = /^[ \t]*[-*+][ \t]+(?:\*\*)?(blazing(ly)?[- ]fast|lightning[- ]fast|secure by default|beautiful(ly designed)?( ui| interface| design)?|developer[- ]friendly|fully customi[sz]able|production[- ]ready|easy to use|highly performant|super easy|zero config|batteries included)\b/gim
const hype = /\b(amazing|awesome|massive|huge|epic|incredible|revolutionary|comprehensive|significant improvements|supercharge|game-?changing|blazing)\b/i

export const docs: Rule[] = [
  {
    id: 'DOC-01',
    on: ['prose'],
    run: (src) => scan(src.prose, /^#{1,6}[ \t]+.*$/gm, (m) => m[0]).filter((h) => hasEmoji(h.note ?? '')).map((h) => ({ ...h, note: quote(h.note ?? '') })),
  },
  {
    id: 'DOC-02',
    on: ['prose'],
    run(src) {
      const top = src.text.split('\n').slice(0, 40).join('\n')
      const badges = scan(top, /!\[[^\]]*\]\(https?:\/\/(img\.shields\.io|badge\.fury\.io|badgen\.net|github\.com\/[^)]*\/badge\.svg|codecov\.io[^)]*|app\.netlify\.com[^)]*badge)[^)]*\)|<img[^>]+src=["']https?:\/\/(img\.shields\.io|badgen\.net)[^>]*>/g)
      return badges.length > 4 ? [{ index: badges[0]!.index, note: `${badges.length} badges at the top` }] : []
    },
  },
  {
    id: 'DOC-03',
    on: ['prose'],
    run: (src) => scan(src.prose, bulletEmoji, (m) => quote(m[0])).concat(scan(src.prose, adjectives, (m) => quote(m[0]))),
  },
  {
    id: 'DOC-04',
    on: ['prose'],
    run(src) {
      const m = src.prose.match(/^#{1,3}[ \t]*(table of contents|contents|toc|daftar isi)[ \t]*$/im)
      return m && m.index !== undefined && src.proseWords < 400 ? [{ index: m.index, note: `${src.proseWords} words` }] : []
    },
  },
  {
    id: 'DOC-05',
    on: ['prose'],
    run(src) {
      const hits: Hit[] = scan(src.text, /\b(built|made|crafted) with (❤️|❤|♥️|♥|love)|with (❤️|❤|♥️|♥) by\b/giu, (m) => m[0])
      const heads = [...src.prose.matchAll(/^(#{1,3})[ \t]*(star history|acknowledg(e)?ments|roadmap|contributors|show your support|support)[ \t]*$/gim)]
      for (const h of heads) {
        const after = src.prose.slice(h.index + h[0].length)
        const next = after.search(/^#{1,3}\s/m)
        const body = next === -1 ? after : after.slice(0, next)
        const n = (body.match(/\p{L}+/gu) ?? []).length
        if (n < 12) hits.push({ index: h.index, note: `"${h[2]}" with ${n} words under it` })
      }
      return hits
    },
  },
  {
    id: 'GIT-01',
    on: ['commit'],
    run(src) {
      const subject = src.text.split('\n').find((l) => l.trim()) ?? ''
      const at = src.text.indexOf(subject)
      if (hasEmoji(subject) || /:[a-z_]+:/.test(subject) || hype.test(subject)) return [{ index: at, length: subject.length, note: quote(subject) }]
      return []
    },
  },
  { id: 'GIT-02', on: ['commit'], run: (src) => scan(src.text, /\bthis (commit|change|pr|pull request) (updates|modifies|changes|adds|removes|introduces|refactors)\b/gi, (m) => m[0]) },
  { id: 'GIT-03', on: ['commit'], run: (src) => scan(src.text, /\bthis (pr|pull request) (introduces|implements|adds|brings) (comprehensive|significant|several|various|major|numerous) (improvements|enhancements|changes|updates)\b|\benhanc(e|es|ing) (the )?(overall )?(user experience|functionality|maintainability|code quality|robustness)\b/gi, (m) => m[0]) },
]
