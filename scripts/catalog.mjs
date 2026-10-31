import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
const skill = root + 'skills/antislopdev/'
rmSync(skill + 'RULES.md', { force: true })
rmSync(skill + 'rules', { recursive: true, force: true })
mkdirSync(skill + 'rules')
const legend = 'Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.\n\nThese rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.'
const groups = []
for (const part of md.split(/^## /m).slice(1)) {
  const head = part.slice(0, part.indexOf('\n')).trim()
  const prefix = head.match(/^([A-Z]+):/)?.[1]
  if (!prefix) continue
  const body = part.slice(part.indexOf('\n') + 1).replace(/\n---\s*$/, '').trim()
  const count = rules.filter((r) => r.id.startsWith(prefix + '-')).length
  const file = prefix.toLowerCase() + '.md'
  writeFileSync(skill + 'rules/' + file, `# ${head}\n\n${legend}\n\n${body}\n`)
  groups.push({ prefix, file, count })
}
if (groups.reduce((n, g) => n + g.count, 0) !== rules.length) throw new Error('catalog: some rules sit outside a group section')
console.log(`catalog: ${rules.length} rules in ${groups.length} groups`)
