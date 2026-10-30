import { useEffect, useRef, useState } from 'react'
import type { Copy } from './copy'
import { marks } from './marks'
import { still } from './track'

type Level = 'block' | 'justify' | 'warn'

const scenes: { client: string; target: string; found: [Level, string, string][]; after: string }[] = [
  {
    client: 'Claude Code',
    target: 'app/pricing',
    found: [
      ['block', 'UI-05', 'Emoji used as icons'],
      ['justify', 'UI-10', 'Blue to purple gradient'],
      ['justify', 'UI-11', 'Gradient text on headings'],
      ['warn', 'TX-04', 'Hype vocabulary'],
    ],
    after: '0 block · 0 justify · 0 warn · 1 allowed',
  },
  {
    client: 'Cursor',
    target: 'README.md',
    found: [
      ['block', 'DOC-01', 'Emoji headings'],
      ['block', 'DOC-03', 'Feature list of adjectives'],
      ['warn', 'TX-13', "Whether you're X or Y"],
    ],
    after: '0 block · 0 justify · 0 warn',
  },
  {
    client: 'Codex',
    target: '--commit .git/COMMIT_EDITMSG',
    found: [
      ['block', 'GIT-01', 'Emoji or hype in commit messages'],
      ['warn', 'GIT-02', 'Commit body that narrates the diff'],
    ],
    after: '0 block · 0 justify · 0 warn',
  },
]

const agents: { name: string; mark?: keyof typeof marks }[] = [
  { name: 'Claude Code', mark: 'claude' },
  { name: 'Cursor', mark: 'cursor' },
  { name: 'Codex' },
  { name: 'GitHub Copilot', mark: 'copilot' },
  { name: 'Gemini', mark: 'gemini' },
  { name: 'Windsurf', mark: 'windsurf' },
  { name: 'Cline', mark: 'cline' },
]

export function Agents({ t }: { t: Copy['agents'] }) {
  const [scene, setScene] = useState(0)
  const [typed, setTyped] = useState(0)
  const [shown, setShown] = useState(99)
  const [live, setLive] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const now = scenes[scene]!
  const words = t.scenes[scene]!
  const steps = 4 + now.found.length

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(Boolean(e?.isIntersecting)), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!live) return
    if (still()) {
      setTyped(words.prompt.length)
      setShown(99)
      const next = window.setTimeout(() => setScene((s) => (s + 1) % scenes.length), 7000)
      return () => window.clearTimeout(next)
    }
    setTyped(0)
    setShown(0)
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    for (let i = 1; i <= words.prompt.length; i++) at(i * 30, () => setTyped(i))
    const start = words.prompt.length * 30 + 500
    for (let i = 1; i <= steps; i++) at(start + i * 520, () => setShown(i))
    at(start + steps * 520 + 3600, () => setScene((s) => (s + 1) % scenes.length))
    return () => timers.forEach((x) => window.clearTimeout(x))
  }, [scene, live, words.prompt, steps])

  const n = now.found.length
  return (
    <section className="split agents" aria-labelledby="agents-title">
      <div className="split-copy">
        <h2 id="agents-title">{t.title}</h2>
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <ul className="agent-list">
          {agents.map((a) => (
            <li key={a.name}>
              {a.mark ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d={marks[a.mark]} />
                </svg>
              ) : (
                <span className="agent-blank" aria-hidden="true" />
              )}
              {a.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="split-stage" ref={stage} data-demo>
        <div className="chat" aria-hidden="true">
          <div className="chat-top">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span>{now.client}</span>
          </div>
          <div className="chat-body">
            <p className="chat-you">
              <b>{t.you}</b>
              <span>
                {words.prompt.slice(0, typed)}
                {typed < words.prompt.length ? <i className="cursor" /> : null}
              </span>
            </p>
            <ol className="chat-steps">
              <li className={shown >= 1 ? 'on' : ''}>{words.wrote}</li>
              <li className={`cmd ${shown >= 2 ? 'on' : ''}`}>$ npx antislopdev check {now.target}</li>
              {now.found.map(([lv, id, title], i) => (
                <li key={id} className={`hit ${lv} ${shown >= 3 + i ? 'on' : ''}`}>
                  <span>{lv}</span>
                  <span>{id}</span>
                  {title}
                </li>
              ))}
              <li className={shown >= 3 + n ? 'on' : ''}>{words.fixed}</li>
              <li className={`cmd ok ${shown >= 4 + n ? 'on' : ''}`}>
                $ npx antislopdev check {now.target}
                <span>✓ {now.after}</span>
              </li>
            </ol>
            <div className={`chat-note ${shown >= 4 + n ? 'on' : ''}`}>
              <b>{t.note}</b>
              <span>{words.kept}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
