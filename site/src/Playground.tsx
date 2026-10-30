import { useDeferredValue, useMemo, useRef, useState, type ReactNode } from 'react'
import { check } from '../../src/core/index.js'
import type { Finding, Level } from '../../src/core/index.js'
import type { Copy } from './copy'
import { presets } from './presets'
import { track } from './track'

const rank: Record<Level, number> = { warn: 1, justify: 2, block: 3 }
const kinds = ['Hero.tsx', 'page.html', 'README.md', 'produk.md', 'COMMIT_EDITMSG', 'tasks.ts']

export function marked(text: string, findings: Finding[]): ReactNode[] {
  const levels = new Uint8Array(text.length)
  const owner = new Array<Finding | undefined>(text.length)
  for (const f of findings) {
    if (f.allowed) continue
    const end = Math.min(text.length, f.offset + Math.max(1, f.length))
    for (let i = f.offset; i < end; i++) {
      if (rank[f.level] > levels[i]!) {
        levels[i] = rank[f.level]
        owner[i] = f
      }
    }
  }
  const out: ReactNode[] = []
  let i = 0
  while (i < text.length) {
    const l = levels[i]!
    const who = owner[i]
    let j = i
    while (j < text.length && levels[j] === l && owner[j] === who) j++
    const part = text.slice(i, j)
    out.push(l && who ? <mark key={i} className={`l${l}`} data-rule={`${who.rule} ${who.title}`}>{part}</mark> : part)
    i = j
  }
  return out
}

export function Playground({ t }: { t: Copy['play'] }) {
  const [preset, setPreset] = useState(presets[0]!)
  const [version, setVersion] = useState<'slop' | 'fixed' | 'typed'>('slop')
  const [text, setText] = useState(presets[0]!.slop)
  const [kind, setKind] = useState(presets[0]!.path)
  const [caret, setCaret] = useState(0)
  const input = useRef<HTMLTextAreaElement>(null)
  const mirror = useRef<HTMLPreElement>(null)
  const deferred = useDeferredValue(text)

  const report = useMemo(() => check([{ path: kind, text: deferred }]), [deferred, kind])
  const findings = report.findings.filter((f) => !f.allowed)
  const { block, justify, warn } = report.counts
  const here = findings.filter((f) => caret >= f.offset && caret <= f.offset + f.length).sort((a, b) => rank[b.level] - rank[a.level])[0]

  const load = (id: string, v: 'slop' | 'fixed') => {
    const p = presets.find((x) => x.id === id)!
    setPreset(p)
    setVersion(v)
    setText(v === 'slop' ? p.slop : p.fixed)
    setKind(p.path)
    if (input.current) input.current.scrollTop = 0
    track('run_checker', { source: p.id, version: v })
  }

  const jump = (f: Finding) => {
    const el = input.current
    if (!el) return
    el.focus()
    el.setSelectionRange(f.offset, f.offset + f.length)
    const line = text.slice(0, f.offset).split('\n').length - 1
    el.scrollTop = Math.max(0, line * parseFloat(getComputedStyle(el).lineHeight) - el.clientHeight / 3)
    setCaret(f.offset)
  }

  const state = block ? 'block' : justify ? 'justify' : findings.length ? 'warn' : 'clean'

  return (
    <div className="play" id="playground" data-demo>
      <div className="play-bar">
        <div className="play-tabs" role="tablist" aria-label={t.label}>
          {presets.map((p) => (
            <button key={p.id} type="button" role="tab" aria-selected={p.id === preset.id && version !== 'typed'} onClick={() => load(p.id, version === 'fixed' ? 'fixed' : 'slop')}>
              {t.presets[p.id] ?? p.label}
            </button>
          ))}
        </div>
        <div className="play-switch" role="group">
          <button type="button" aria-pressed={version === 'slop'} onClick={() => load(preset.id, 'slop')}>
            {t.generated}
          </button>
          <button type="button" aria-pressed={version === 'fixed'} onClick={() => load(preset.id, 'fixed')}>
            {t.rewritten}
          </button>
        </div>
      </div>
      <div className="play-body">
        <div className="play-editor">
          <pre ref={mirror} className="play-mirror" aria-hidden="true">
            {marked(text, deferred === text ? findings : [])}
            {'\n'}
          </pre>
          <textarea
            ref={input}
            className="play-input"
            value={text}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label={t.label}
            onChange={(e) => {
              if (version !== 'typed') track('run_checker', { source: 'typed' })
              setVersion('typed')
              setText(e.target.value)
              setCaret(e.target.selectionStart)
            }}
            onScroll={(e) => {
              if (mirror.current) mirror.current.scrollTop = e.currentTarget.scrollTop
            }}
            onSelect={(e) => setCaret(e.currentTarget.selectionStart)}
          />
        </div>
        <div className="play-out">
          <p className="play-summary" data-state={state} aria-live="polite">
            {findings.length === 0 ? t.clean : [block && `${block} block`, justify && `${justify} justify`, warn && `${warn} warn`].filter(Boolean).join(' · ')}
          </p>
          <ol className="play-findings">
            {findings.map((f, n) => (
              <li key={`${f.rule}-${f.offset}-${n}`}>
                <button type="button" className={f.level} onClick={() => jump(f)} aria-current={here === f ? 'true' : undefined}>
                  <span className="lv">{f.level}</span>
                  <span className="id">{f.rule}</span>
                  <span className="t">{f.title}</span>
                  <span className="ln">
                    {t.line} {f.line}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="play-status">
        <span className="play-here">{here ? `${here.rule} ${here.title}${here.note ? ` · ${here.note}` : ''}` : t.hint}</span>
        <label className="play-kind">
          {t.readAs}
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="play-local">{t.local}</p>
    </div>
  )
}
