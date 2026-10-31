import { catalog } from './catalog.js'
import type { Rule } from './rule.js'
import { coded, written } from './rule.js'
import { backtracks } from './rules/web.js'
import type { Source } from './source.js'
import type { CustomRule, FileKind, Hit, Level, RuleMeta } from './types.js'
import { scan, words } from './util.js'

const levels = new Set<Level>(['block', 'justify', 'warn'])
const idShape = /^[A-Z][A-Z0-9]{0,9}-\d{1,4}$/
const known = new Set(catalog.map((r) => r.id))
const builtIn = new Set(catalog.map((r) => r.id.split('-')[0]!))

const where: Record<NonNullable<CustomRule['in']>, readonly FileKind[]> = {
  copy: written,
  code: coded,
  commit: ['commit'],
  all: ['markup', 'jsx', 'style', 'script', 'prose', 'commit', 'manifest', 'config'],
}

export interface Compiled {
  rules: Rule[]
  meta: RuleMeta[]
}

const fail = (id: string, why: string): never => {
  throw new Error(`custom rule ${id || '(no id)'}: ${why}`)
}

export function compileCustom(list: readonly CustomRule[] = []): Compiled {
  const rules: Rule[] = []
  const meta: RuleMeta[] = []
  const seen = new Set<string>()
  for (const raw of list) {
    const id = typeof raw?.id === 'string' ? raw.id.trim().toUpperCase() : ''
    if (!idShape.test(id)) fail(id, 'id must look like ACME-01')
    if (known.has(id) || builtIn.has(id.split('-')[0]!)) fail(id, `the ${id.split('-')[0]} prefix belongs to a built-in group, pick your own prefix`)
    if (seen.has(id)) fail(id, 'id is used twice')
    seen.add(id)
    const title = typeof raw.title === 'string' ? raw.title.trim() : ''
    if (!title) fail(id, 'needs a title')
    const level = raw.level ?? 'warn'
    if (!levels.has(level)) fail(id, 'level must be block, justify or warn')
    const scope = raw.in ?? 'copy'
    if (!(scope in where)) fail(id, 'in must be copy, code, commit or all')
    const list = Array.isArray(raw.words) ? raw.words.filter((w): w is string => typeof w === 'string' && w.trim() !== '').map((w) => w.trim()) : []
    if (list.some((w) => w.length > 120)) fail(id, 'a word or phrase is longer than 120 characters')
    if (list.length > 500) fail(id, 'more than 500 words, split it into more rules')
    let re: RegExp | null = null
    if (raw.pattern !== undefined) {
      if (typeof raw.pattern !== 'string' || !raw.pattern || raw.pattern.length > 300) fail(id, 'pattern must be a regular expression of at most 300 characters')
      if (backtracks(raw.pattern) >= 0) fail(id, 'pattern can backtrack forever on some input (SEC-22), rewrite the nested repeat')
      const flags = [...new Set(['g', 'u', ...(raw.flags ?? 'i').replace(/[^imsu]/g, '')])].join('')
      try {
        re = new RegExp(raw.pattern, flags)
      } catch (e) {
        fail(id, `pattern does not compile: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    if (!list.length && !re) fail(id, 'needs words or a pattern')
    const listed = list.length ? words(list) : null
    const detail = typeof raw.detail === 'string' ? raw.detail.trim() : ''
    meta.push({ id, title, detail, level, check: 'static' })
    rules.push({
      id,
      on: where[scope],
      run(src: Source): Hit[] {
        const text = scope === 'copy' || scope === 'commit' ? src.prose : src.text
        const hits: Hit[] = []
        if (listed) hits.push(...scan(text, listed, (m) => `"${m[0]}"`))
        if (re) hits.push(...scan(text, re, (m) => `"${m[0].slice(0, 60)}"`).filter((h) => (h.length ?? 0) > 0))
        return hits
      },
    })
  }
  return { rules, meta }
}
