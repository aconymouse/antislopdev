#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { parseArgs } from 'node:util'
import { catalog, checkSources, compileCustom, implemented, kindOf, links, resolveMeta, toSources } from '../core/index.js'
import type { CustomRule, Finding, Level, Report, RuleMeta, SourceInput } from '../core/index.js'

const version = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version as string

const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.turbo', '.vercel', '.output', 'vendor', '.svelte-kit', '.cache', '.astro', 'target', '__pycache__', '.venv', 'venv', '.idea', '.vscode', '.pnpm-store', 'storybook-static'])
const skipFiles = /(\.min\.(js|css)|\.map|\.d\.ts|\.lock|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|\.snap|\.svg)$/i

const help = `antislopdev ${version}

Usage
  antislopdev check [paths...]     check files and folders (default: .)
  antislopdev rules                list every rule
  antislopdev explain <ID>         show one rule

Options
  --json                 print the report as JSON
  --links                open every external link and report dead ones (TR-07)
  --commit <file>        check a commit or PR message (use with a git hook)
  --only <ids>           only these rules or groups, comma separated (UI,TX-04)
  --disable <ids>        skip these rules, comma separated
  --quiet                hide warn findings
  -v, --version
  -h, --help

Config
  antislopdev.json in the working directory:
  {
    "ignore": ["docs/legacy"],
    "disable": ["CD-11"],
    "levels": { "TX-04": "justify" },
    "rules": [{ "id": "ACME-01", "title": "Say workspace, not dashboard", "words": ["dashboard"] }]
  }

Exit code is 1 when a block finding exists, or a justify finding has no
"antislopdev-allow <ID>: reason" next to it.`

interface Config {
  ignore?: string[]
  disable?: string[]
  levels?: Record<string, Level>
  rules?: CustomRule[]
}

function readConfig(cwd: string): Config {
  const file = join(cwd, 'antislopdev.json')
  if (!existsSync(file)) return {}
  let config: Config
  try {
    config = JSON.parse(readFileSync(file, 'utf8')) as Config
  } catch {
    throw new Error('antislopdev.json is not valid JSON')
  }
  if (config.rules !== undefined && !Array.isArray(config.rules)) throw new Error('antislopdev.json: rules must be a list')
  if (config.levels !== undefined && (typeof config.levels !== 'object' || config.levels === null || Array.isArray(config.levels))) throw new Error('antislopdev.json: levels must map rule IDs to block, justify or warn')
  return config
}

function gitignored(cwd: string): string[] {
  const file = join(cwd, '.gitignore')
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((l) => l.trim().replace(/^\/|\/$/g, ''))
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('!') && !/[*?[]/.test(l))
}

function walk(target: string, cwd: string, ignore: string[], out: SourceInput[]): void {
  const rel = relative(cwd, target).split(sep).join('/')
  if (rel && ignore.some((i) => rel === i || rel.startsWith(i + '/'))) return
  let st
  try {
    st = statSync(target)
  } catch {
    throw new Error(`cannot read ${target}`)
  }
  if (st.isDirectory()) {
    for (const name of readdirSync(target).sort()) {
      if (skipDirs.has(name)) continue
      walk(join(target, name), cwd, ignore, out)
    }
    return
  }
  if (!st.isFile() || st.size > 1_000_000 || skipFiles.test(target)) return
  const path = rel || target
  if (!kindOf(path)) return
  out.push({ path, text: readFileSync(target, 'utf8') })
}

async function deadLinks(inputs: SourceInput[]): Promise<Finding[]> {
  const sources = toSources(inputs)
  const jobs = sources.flatMap((s) => links(s).map((l) => ({ s, ...l })))
  const status = new Map<string, Promise<string | undefined>>()
  const probe = async (url: string): Promise<string | undefined> => {
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(10_000), headers: { 'user-agent': `antislopdev/${version} link check` } })
        if (res.ok) return undefined
        if ([401, 403, 429, 999].includes(res.status)) return undefined
        if (method === 'HEAD' && [405, 501, 400].includes(res.status)) continue
        return `HTTP ${res.status}`
      } catch (e) {
        if (method === 'GET') return e instanceof Error ? e.message : 'unreachable'
      }
    }
    return undefined
  }
  const results: Finding[] = []
  const queue = [...jobs]
  const meta = catalog.find((r) => r.id === 'TR-07')!
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        if (!status.has(job.url)) status.set(job.url, probe(job.url))
        const problem = await status.get(job.url)
        if (!problem) continue
        const { line, column } = job.s.position(job.index)
        results.push({ rule: 'TR-07', level: meta.level, title: meta.title, note: `${job.url} (${problem})`, path: job.s.path, line, column, offset: job.index, length: job.url.length, excerpt: job.s.line(line).trim().slice(0, 140) })
      }
    }),
  )
  return results
}

const tty = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code: string) => (s: string) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s)
const dim = paint('2')
const bold = paint('1')
const red = paint('31')
const yellow = paint('33')
const cyan = paint('36')
const green = paint('32')

function print(report: Report, quiet: boolean): void {
  let current = ''
  const shown = report.findings.filter((f) => !(quiet && f.level === 'warn' && !f.allowed))
  const width = Math.max(6, ...shown.map((f) => f.rule.length))
  for (const f of shown) {
    if (f.path !== current) {
      current = f.path
      process.stdout.write(`\n${bold(f.path)}\n`)
    }
    const level = f.allowed ? green('allowed') : f.level === 'block' ? red('block  ') : f.level === 'justify' ? yellow('justify') : cyan('warn   ')
    const where = dim(`${f.line}:${f.column}`.padEnd(8))
    process.stdout.write(`  ${where} ${level}  ${bold(f.rule.padEnd(width))} ${f.title}${f.note ? dim(' · ' + f.note) : ''}${f.escalated ? dim(' · repeated 3+ times in this file') : ''}\n`)
    if (f.allowed) process.stdout.write(`  ${' '.repeat(8)} ${dim('reason: ' + f.allowed)}\n`)
  }
  const { block, justify, warn } = report.counts
  const parts = [`${block} block`, `${justify} justify`, `${warn} warn`]
  if (report.allowed) parts.push(`${report.allowed} allowed`)
  parts.push(`${report.files} ${report.files === 1 ? 'file' : 'files'}`)
  process.stdout.write(`\n${report.failed ? red('✗') : green('✓')} ${parts.join(' · ')}\n`)
  if (justify > 0) process.stdout.write(dim(`  justify findings pass with a reason on the same or previous line: antislopdev-allow ${report.findings.find((f) => f.level === 'justify' && !f.allowed)?.rule ?? 'ID'}: why this is deliberate\n`))
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      json: { type: 'boolean' },
      links: { type: 'boolean' },
      commit: { type: 'string' },
      only: { type: 'string' },
      disable: { type: 'string' },
      quiet: { type: 'boolean' },
      version: { type: 'boolean', short: 'v' },
      help: { type: 'boolean', short: 'h' },
    },
  })
  if (values.version) {
    process.stdout.write(version + '\n')
    return 0
  }
  const [command = values.commit ? 'check' : 'help', ...rest] = positionals
  if (values.help || command === 'help') {
    process.stdout.write(help + '\n')
    return 0
  }
  if (command === 'rules' || command === 'explain') {
    const config = readConfig(process.cwd())
    const custom = compileCustom(config.rules)
    const lookup = resolveMeta(custom.meta, config.levels)
    const own = new Set(custom.meta.map((m) => m.id))
    const checked = (r: RuleMeta) => implemented.includes(r.id) || own.has(r.id)
    const all = [...catalog, ...custom.meta].map((r) => lookup.get(r.id)!)
    if (command === 'rules') {
      for (const r of all) process.stdout.write(`${r.id.padEnd(9)} ${r.level.padEnd(8)} ${(checked(r) ? (own.has(r.id) ? 'custom' : r.check) : 'review').padEnd(10)} ${r.title}\n`)
      process.stdout.write(dim(`\n${catalog.length} rules · ${implemented.length} checked automatically · the rest are for review${own.size ? ` · ${own.size} custom from antislopdev.json` : ''}\n`))
      return 0
    }
    const r = all.find((x) => x.id === rest[0]?.toUpperCase())
    if (!r) {
      process.stderr.write(`unknown rule ${rest[0] ?? ''}\n`)
      return 2
    }
    process.stdout.write(`${bold(r.id)} ${r.title}\n${r.detail ? r.detail + '\n' : ''}\nlevel ${r.level} · ${own.has(r.id) ? 'custom rule from antislopdev.json' : checked(r) ? `checked (${r.check})` : 'review by eye'}\n`)
    return 0
  }
  if (command !== 'check') {
    process.stderr.write(`unknown command ${command}\n\n${help}\n`)
    return 2
  }

  const cwd = process.cwd()
  const config = readConfig(cwd)
  const inputs: SourceInput[] = []
  if (values.commit) {
    inputs.push({ path: values.commit, text: readFileSync(resolve(values.commit), 'utf8'), kind: 'commit' })
  } else {
    const ignore = [...(config.ignore ?? []), ...gitignored(cwd)]
    for (const p of rest.length ? rest : ['.']) walk(resolve(cwd, p), cwd, ignore, inputs)
  }
  const list = (s?: string) => (s ? s.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean) : undefined)
  const only = list(values.only)
  const disable = [...(config.disable ?? []), ...(list(values.disable) ?? [])]
  const extra = values.links ? await deadLinks(inputs) : []
  const options = { disable, ...(only ? { only } : {}), ...(config.levels ? { levels: config.levels } : {}), ...(config.rules ? { rules: config.rules } : {}) }
  const report = checkSources(toSources(inputs), options, extra)
  if (values.json) process.stdout.write(JSON.stringify({ version, ...report }, null, 2) + '\n')
  else print(report, Boolean(values.quiet))
  return report.failed ? 1 : 0
}

main(process.argv.slice(2)).then(
  (code) => process.stdout.write('', () => process.exit(code)),
  (e: unknown) => process.stderr.write(`antislopdev: ${e instanceof Error ? e.message : String(e)}\n`, () => process.exit(2)),
)
