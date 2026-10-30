import { catalog, check, implemented } from '../../src/core/index.js'
import type { Finding, Level, RuleMeta } from '../../src/core/index.js'
import { presets, type Preset } from './presets.js'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!
const track = (name: string, params: Record<string, string | number> = {}) => window.gtag?.('event', name, params)
const rank: Record<Level, number> = { warn: 1, justify: 2, block: 3 }
const names: Record<string, string> = { UI: 'Interface', TX: 'English copy', ID: 'Indonesian copy', CD: 'Code', DOC: 'Docs', GIT: 'Commits', TR: 'Truth', AX: 'Accessibility', PF: 'Performance' }

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

function copyButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy!
      try {
        await navigator.clipboard.writeText(text)
        button.textContent = 'Copied'
      } catch {
        button.textContent = 'Select and copy'
      }
      track('copy_install', { method: button.dataset.method ?? 'unknown' })
      window.setTimeout(() => (button.textContent = 'Copy'), 1600)
    })
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href*="github.com/aconymouse/antislopdev"]')) {
    link.addEventListener('click', () => track('github_click', { place: link.dataset.place ?? 'page' }))
  }
}

function playground(): void {
  const input = $<HTMLTextAreaElement>('#input')
  const mirror = $<HTMLPreElement>('#mirror')
  const list = $<HTMLOListElement>('#findings')
  const summary = $<HTMLParagraphElement>('#summary')
  const caret = $<HTMLParagraphElement>('#caret')
  const kind = $<HTMLSelectElement>('#kind')
  const tabs = $<HTMLDivElement>('#presets')
  const versions = $<HTMLDivElement>('#versions')
  let preset: Preset = presets[0]!
  let version: 'slop' | 'fixed' = 'slop'
  let findings: Finding[] = []
  let timer = 0
  let edited = false

  tabs.innerHTML = presets.map((p) => `<button type="button" data-preset="${p.id}" aria-pressed="false">${escape(p.label)}</button>`).join('')

  const paint = () => {
    const text = input.value
    const levels = new Uint8Array(text.length)
    for (const f of findings) {
      if (f.allowed) continue
      const end = Math.min(text.length, f.offset + Math.max(1, f.length))
      for (let i = f.offset; i < end; i++) if (rank[f.level] > levels[i]!) levels[i] = rank[f.level]
    }
    let html = ''
    let i = 0
    while (i < text.length) {
      const l = levels[i]!
      let j = i
      while (j < text.length && levels[j] === l) j++
      const part = escape(text.slice(i, j))
      html += l ? `<mark class="l${l}">${part}</mark>` : part
      i = j
    }
    mirror.innerHTML = html + '\n'
    mirror.scrollTop = input.scrollTop
  }

  const describe = (f: Finding) => `${f.rule} ${f.title}${f.note ? ` · ${f.note}` : ''}`

  const render = () => {
    const report = check([{ path: kind.value, text: input.value }])
    findings = report.findings.filter((f) => !f.allowed)
    const { block, justify, warn } = report.counts
    summary.textContent = findings.length === 0 ? 'Nothing to flag.' : [block && `${block} block`, justify && `${justify} justify`, warn && `${warn} warn`].filter(Boolean).join(' · ')
    summary.dataset.state = block ? 'block' : justify ? 'justify' : findings.length ? 'warn' : 'clean'
    list.innerHTML = findings
      .map((f, n) => `<li><button type="button" data-n="${n}" class="${f.level}"><span class="lv">${f.level}</span><span class="id">${f.rule}</span><span class="t">${escape(f.title)}</span><span class="ln">line ${f.line}</span></button></li>`)
      .join('')
    paint()
    showCaret()
  }

  const showCaret = () => {
    const at = input.selectionStart
    const here = findings.filter((f) => at >= f.offset && at <= f.offset + f.length).sort((a, b) => rank[b.level] - rank[a.level])[0]
    caret.textContent = here ? describe(here) : ''
  }

  const load = (p: Preset, v: 'slop' | 'fixed') => {
    preset = p
    version = v
    input.value = v === 'slop' ? p.slop : p.fixed
    if (![...kind.options].some((o) => o.value === p.path)) kind.add(new Option(p.path, p.path))
    kind.value = p.path
    for (const b of tabs.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.preset === p.id))
    for (const b of versions.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.version === v))
    input.scrollTop = 0
    edited = false
    render()
  }

  tabs.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-preset]')
    if (!b) return
    const p = presets.find((x) => x.id === b.dataset.preset)!
    load(p, version)
    track('run_checker', { source: p.id, version })
  })
  versions.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-version]')
    if (!b) return
    load(preset, b.dataset.version as 'slop' | 'fixed')
    track('run_checker', { source: preset.id, version })
  })
  input.addEventListener('input', () => {
    if (!edited) {
      edited = true
      for (const b of versions.querySelectorAll('button')) b.setAttribute('aria-pressed', 'false')
      track('run_checker', { source: 'typed' })
    }
    paint()
    window.clearTimeout(timer)
    timer = window.setTimeout(render, 140)
  })
  input.addEventListener('scroll', () => (mirror.scrollTop = input.scrollTop))
  for (const ev of ['keyup', 'click', 'select']) input.addEventListener(ev, showCaret)
  kind.addEventListener('change', render)
  list.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-n]')
    if (!b) return
    const f = findings[Number(b.dataset.n)]
    if (!f) return
    input.focus()
    input.setSelectionRange(f.offset, f.offset + f.length)
    const line = input.value.slice(0, f.offset).split('\n').length - 1
    const height = parseFloat(getComputedStyle(input).lineHeight)
    input.scrollTop = Math.max(0, line * height - input.clientHeight / 3)
    showCaret()
  })

  load(presets[0]!, 'slop')
}

function ruleList(): void {
  const root = $<HTMLDivElement>('#rules')
  const filter = $<HTMLInputElement>('#filter')
  const groups = $<HTMLDivElement>('#groups')
  const count = $<HTMLParagraphElement>('#rule-count')
  const prefixes = [...new Set(catalog.map((r) => r.id.split('-')[0]!))]
  let group = ''

  groups.innerHTML = [`<button type="button" data-group="" aria-pressed="true">All</button>`, ...prefixes.map((p) => `<button type="button" data-group="${p}" aria-pressed="false">${names[p] ?? p}</button>`)].join('')

  const row = (r: RuleMeta) => `<details id="${r.id}">
  <summary><span class="id">${r.id}</span><span class="t">${escape(r.title)}</span><span class="lv ${r.level}">${r.level}</span></summary>
  <p>${escape(r.detail).replace(/`([^`]+)`/g, '<code>$1</code>')}</p>
  <p class="how">${implemented.includes(r.id) ? `Checked automatically (${r.check}).` : 'Checked by eye during review.'}</p>
</details>`

  const draw = () => {
    const q = filter.value.trim().toLowerCase()
    const shown = catalog.filter((r) => (!group || r.id.startsWith(group + '-')) && (!q || `${r.id} ${r.title} ${r.detail}`.toLowerCase().includes(q)))
    const by = prefixes.map((p) => ({ p, rules: shown.filter((r) => r.id.startsWith(p + '-')) })).filter((g) => g.rules.length)
    root.innerHTML = by.map((g) => `<section aria-labelledby="g-${g.p}"><h3 id="g-${g.p}">${names[g.p] ?? g.p}</h3>${g.rules.map(row).join('')}</section>`).join('') || '<p class="empty">No rule matches that.</p>'
    count.textContent = `${shown.length} of ${catalog.length}`
  }

  groups.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-group]')
    if (!b) return
    group = b.dataset.group ?? ''
    for (const x of groups.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b))
    draw()
  })
  filter.addEventListener('input', draw)
  draw()
  if (location.hash && /^#[A-Z]+-\d+$/.test(location.hash)) {
    const el = document.getElementById(location.hash.slice(1))
    if (el instanceof HTMLDetailsElement) {
      el.open = true
      el.scrollIntoView({ block: 'center' })
    }
  }
}

async function selfCheck(): Promise<void> {
  const out = $<HTMLParagraphElement>('#self')
  try {
    const sheet = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href ?? '/style.css'
    const files = await Promise.all([['/', 'index.html'], [sheet, 'style.css']].map(async ([u, path]) => ({ path: path!, text: await (await fetch(u!, { cache: 'no-store' })).text() })))
    const r = check(files)
    out.textContent = `This page, checked by itself when you opened it: ${r.counts.block} block · ${r.counts.justify} justify · ${r.counts.warn} warn.`
  } catch {
    out.textContent = ''
  }
}

copyButtons()
playground()
ruleList()
void selfCheck()
