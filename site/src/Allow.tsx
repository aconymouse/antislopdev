import { useEffect, useMemo, useState } from 'react'
import { check } from '../../src/core/index.js'
import type { Copy } from './copy'
import { marked } from './Playground'
import { still, track } from './track'

const before = `export function Wordmark() {
  return (
`
const reason = `    // antislopdev-allow UI-10, UI-11: the wordmark gradient is the brand
`
const after = `    <h1 className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
      Flowly
    </h1>
  )
}
`

export function Allow({ t }: { t: Copy['allow'] }) {
  const [on, setOn] = useState(false)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!on) return setTyped(0)
    if (still()) return setTyped(reason.length)
    const timers: number[] = []
    for (let i = 1; i <= reason.length; i++) timers.push(window.setTimeout(() => setTyped(i), i * 18))
    return () => timers.forEach((x) => window.clearTimeout(x))
  }, [on])

  const text = before + reason.slice(0, typed) + after
  const report = useMemo(() => check([{ path: 'Wordmark.tsx', text }]), [text])
  const open = report.findings.filter((f) => !f.allowed)
  const lines = text.split('\n').length - 1

  return (
    <section className="split allow" aria-labelledby="allow-title">
      <div className="split-copy">
        <h2 id="allow-title">{t.title}</h2>
        <p>{t.p1}</p>
        <button
          type="button"
          className="button"
          aria-pressed={on}
          onClick={() => {
            setOn(!on)
            track('allow_toggle', { on: on ? 0 : 1 })
          }}
        >
          {on ? t.remove : t.toggle}
        </button>
      </div>
      <div className="split-stage" data-demo>
        <div className="code-card">
          <div className="code-top">
            <span>Wordmark.tsx</span>
          </div>
          <div className="code-body">
            <div className="gutter" aria-hidden="true">
              {Array.from({ length: lines }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <pre>
              <code>{marked(text, open)}</code>
            </pre>
          </div>
          <p className={`code-status ${open.length ? 'bad' : 'good'}`} aria-live="polite">
            <span>{open.length ? '✗' : '✓'}</span>
            {open.length ? t.failing : t.passing}
            {report.allowed ? <em> · {report.findings.find((f) => f.allowed)?.allowed}</em> : null}
          </p>
        </div>
      </div>
    </section>
  )
}
