import { catalog } from './catalog.js'
import { Source, kindOf } from './source.js'
import type { ProjectRule, Rule } from './rule.js'
import type { CheckOptions, Finding, Hit, Level, Report, RuleMeta, SourceInput } from './types.js'
import { ui } from './rules/ui.js'
import { writing } from './rules/writing.js'
import { code } from './rules/code.js'
import { docs } from './rules/docs.js'
import { truth } from './rules/truth.js'
import { a11y, project } from './rules/a11y.js'

export const rules: readonly Rule[] = [...ui, ...writing, ...code, ...docs, ...truth, ...a11y]
export const projectRules: readonly ProjectRule[] = project

const meta = new Map<string, RuleMeta>(catalog.map((r) => [r.id, r]))

for (const r of [...rules, ...projectRules]) {
  if (!meta.has(r.id)) throw new Error(`antislopdev: rule ${r.id} is not in RULES.md`)
}

export const implemented: readonly string[] = [...new Set([...rules, ...projectRules].map((r) => r.id))].sort(byId)

function byId(a: string, b: string): number {
  const [pa, na] = a.split('-') as [string, string]
  const [pb, nb] = b.split('-') as [string, string]
  return pa === pb ? Number(na) - Number(nb) : pa.localeCompare(pb)
}

interface Allow {
  ids: string[]
  reason: string
  file: boolean
  line: number
}

function allowances(src: Source): Allow[] {
  const out: Allow[] = []
  for (const m of src.text.matchAll(/antislopdev-allow(-file)?[ \t]+([A-Z]+-\d+(?:[ \t]*,[ \t]*[A-Z]+-\d+)*)[ \t]*:[ \t]*([^\n]*?)[ \t]*(?:\*\/|-->|\}|$)/gm)) {
    const reason = m[3]!.trim()
    if ((reason.match(/\p{L}/gu) ?? []).length < 3) continue
    out.push({ ids: m[2]!.split(',').map((s) => s.trim()), reason, file: Boolean(m[1]), line: src.position(m.index).line })
  }
  return out
}

function nextFilled(src: Source, line: number): number {
  let n = line + 1
  while (n < line + 6 && !src.line(n).trim()) n++
  return n
}

function finding(src: Source, rule: string, hit: Hit): Finding {
  const m = meta.get(rule)!
  const offset = Math.min(hit.index, Math.max(0, src.text.length - 1))
  const { line, column } = src.position(offset)
  const text = src.line(line).trim()
  const length = hit.length ?? Math.max(1, src.line(line).length - column + 1)
  const f: Finding = { rule, level: m.level, title: m.title, path: src.path, line, column, offset, length, excerpt: text.length > 140 ? text.slice(0, 139) + '…' : text }
  if (hit.note !== undefined) f.note = hit.note
  return f
}

export function toSources(inputs: readonly SourceInput[]): Source[] {
  const out: Source[] = []
  for (const input of inputs) {
    const kind = input.kind ?? kindOf(input.path)
    if (kind) out.push(new Source({ ...input, kind }))
  }
  return out
}

export function check(inputs: readonly SourceInput[], options: CheckOptions = {}, extra: readonly Finding[] = []): Report {
  return checkSources(toSources(inputs), options, extra)
}

export function checkSources(sources: readonly Source[], options: CheckOptions = {}, extra: readonly Finding[] = []): Report {
  const enabled = (id: string) => !options.disable?.includes(id) && (!options.only || options.only.some((o) => id === o || id.startsWith(o + '-')))
  const found: Finding[] = [...extra]
  const bySource = new Map<string, Source>()
  for (const src of sources) {
    bySource.set(src.path, src)
    for (const rule of rules) {
      if (!enabled(rule.id) || !rule.on.includes(src.kind)) continue
      for (const hit of rule.run(src)) found.push(finding(src, rule.id, hit))
    }
  }
  for (const rule of projectRules) {
    if (!enabled(rule.id)) continue
    for (const { source, hit } of rule.run(sources)) found.push(finding(source, rule.id, hit))
  }

  const seen = new Set<string>()
  const unique = found.filter((f) => {
    const key = `${f.path}:${f.line}:${f.column}:${f.rule}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const groups = new Map<string, Finding[]>()
  for (const f of unique) {
    if (f.level !== 'warn') continue
    const key = `${f.path}\0${f.rule}`
    groups.set(key, [...(groups.get(key) ?? []), f])
  }
  for (const list of groups.values()) {
    if (list.length < 3) continue
    for (const f of list) {
      f.level = 'justify'
      f.escalated = true
    }
  }

  let allowed = 0
  const cache = new Map<string, Allow[]>()
  for (const f of unique) {
    if (f.level === 'block') continue
    const src = bySource.get(f.path)
    if (!src) continue
    if (!cache.has(f.path)) cache.set(f.path, allowances(src))
    const match = cache.get(f.path)!.find((a) => a.ids.includes(f.rule) && (a.file || a.line === f.line || nextFilled(src, a.line) === f.line))
    if (match) {
      f.allowed = match.reason
      allowed++
    }
  }

  unique.sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.column - b.column || byId(a.rule, b.rule))
  const counts: Record<Level, number> = { block: 0, justify: 0, warn: 0 }
  for (const f of unique) if (!f.allowed) counts[f.level]++
  return { findings: unique, files: sources.length, failed: counts.block > 0 || counts.justify > 0, counts, allowed }
}
