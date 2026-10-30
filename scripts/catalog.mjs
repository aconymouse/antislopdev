import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const md = readFileSync(root + 'RULES.md', 'utf8')
const row = /^\| ([A-Z]+-\d+) \| \*\*(.+?)\*\* ?(.*?) \| (block|justify|warn) \| (static|heuristic|review) \|$/gm
const rules = []
for (const m of md.matchAll(row)) {
  rules.push({ id: m[1], title: m[2].replace(/\.$/, ''), detail: m[3].trim(), level: m[4], check: m[5] })
}
if (rules.length < 100) throw new Error(`catalog: only ${rules.length} rules parsed from RULES.md`)
const ids = new Set()
for (const r of rules) {
  if (ids.has(r.id)) throw new Error(`catalog: duplicate ${r.id}`)
  ids.add(r.id)
}
const body = `import type { RuleMeta } from './types.js'\n\nexport const catalog: readonly RuleMeta[] = ${JSON.stringify(rules, null, 2)}\n`
writeFileSync(root + 'src/core/catalog.ts', body)
copyFileSync(root + 'RULES.md', root + 'skills/antislopdev/RULES.md')
console.log(`catalog: ${rules.length} rules`)
