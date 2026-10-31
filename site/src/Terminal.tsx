import { useEffect, useRef, useState } from 'react'
import type { Copy } from './copy'
import { still } from './track'
import { Typed } from './Typed'
import { Words } from './theater'

type Line = { kind: 'cmd' | 'file' | 'hit' | 'sum' | 'gap' | 'dim'; text: string; level?: 'block' | 'justify' | 'warn' }

const run: Line[] = [
  { kind: 'cmd', text: 'npx antislopdev check src' },
  { kind: 'gap', text: '' },
  { kind: 'file', text: 'src/app/page.tsx' },
  { kind: 'hit', level: 'justify', text: '14:9    UI-11  Gradient text on headings · bg-clip-text text-transparent' },
  { kind: 'hit', level: 'block', text: '26:9    UI-05  Emoji used as icons · "🚀 Why choose us"' },
  { kind: 'hit', level: 'warn', text: '43:14   TX-02  "Not just X, but Y" · "It\'s not just a tool, it\'s"' },
  { kind: 'gap', text: '' },
  { kind: 'file', text: 'src/lib/api.ts' },
  { kind: 'hit', level: 'block', text: '24:3    CD-05  Placeholder implementation · "TODO: implement this"' },
  { kind: 'hit', level: 'justify', text: '6:33    CD-07  Escape-hatch types · : any' },
  { kind: 'gap', text: '' },
  { kind: 'sum', text: '✗ 2 block · 2 justify · 1 warn · 48 files' },
  { kind: 'gap', text: '' },
  { kind: 'cmd', text: 'npx antislopdev check --commit .git/COMMIT_EDITMSG' },
  { kind: 'dim', text: '✓ 0 block · 0 justify · 0 warn · 1 file' },
]

export function Terminal({ t }: { t: Copy['terminal'] }) {
  const [shown, setShown] = useState(run.length)
  const [typed, setTyped] = useState(0)
  const [live, setLive] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(Boolean(e?.isIntersecting)), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!live || still()) return
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const loop = () => {
      setShown(0)
      setTyped(0)
      let ms = 300
      run.forEach((line, i) => {
        if (line.kind === 'cmd') {
          at(ms, () => {
            setShown(i)
            setTyped(0)
          })
          for (let c = 1; c <= line.text.length; c++) at(ms + c * 34, () => setTyped(c))
          ms += line.text.length * 34 + 420
          at(ms, () => setShown(i + 1))
        } else {
          ms += line.kind === 'gap' ? 60 : 170
          at(ms, () => setShown(i + 1))
        }
      })
      at(ms + 5200, loop)
    }
    loop()
    return () => timers.forEach((x) => window.clearTimeout(x))
  }, [live])

  return (
    <section className="split terminal-section" aria-labelledby="terminal-title">
      <div className="split-copy">
        <h2 id="terminal-title" data-words>
          <Words text={t.title} />
        </h2>
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <Typed
          text={`# .github/workflows/ci.yml
- run: npx antislopdev@latest check .

# .git/hooks/commit-msg
npx antislopdev check --commit "$1"`}
        />
      </div>
      <div className="split-stage" ref={box} data-demo>
        <div className="term" aria-hidden="true">
          <div className="term-top">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span>~/generic</span>
          </div>
          <div className="term-body">
            {run.map((line, i) => {
              if (i > shown) return null
              const partial = i === shown
              if (partial && line.kind !== 'cmd') return null
              const text = partial ? line.text.slice(0, typed) : line.text
              return (
                <div key={i} className={`tl ${line.kind} ${line.level ?? ''}`}>
                  {line.kind === 'cmd' ? <span className="ps">$</span> : null}
                  {line.kind === 'hit' ? <span className="lvl">{line.level}</span> : null}
                  <span>{text}</span>
                  {partial ? <i className="cursor" /> : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
