import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { catalog } from '../../src/core/index.js'
import type { Copy } from './copy'
import { track } from './track'
import { Words } from './theater'

const parts: string[][] = [['UI-12'], ['UI-02', 'UI-04'], ['UI-11', 'TX-09'], ['TX-05'], ['TX-08', 'UI-16'], ['TR-01', 'UI-21'], ['UI-20'], ['UI-01'], ['UI-06', 'UI-32', 'UI-05'], ['TR-02']]
const total = new Set(parts.flat()).size
const title = (id: string) => catalog.find((r) => r.id === id)?.title ?? id
const level = (id: string) => catalog.find((r) => r.id === id)?.level ?? 'warn'

function Part({ ids, active, onPoint, className, children }: { ids: string[]; active: string[] | null; onPoint: (ids: string[] | null) => void; className: string; children: ReactNode }) {
  const on = active === ids
  return (
    <div
      className={`part ${className} ${on ? 'on' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={ids.map((id) => `${id} ${title(id)}`).join(', ')}
      onMouseEnter={() => onPoint(ids)}
      onMouseLeave={() => onPoint(null)}
      onFocus={() => onPoint(ids)}
      onBlur={() => onPoint(null)}
      onClick={() => onPoint(ids)}
    >
      {children}
      <span className="part-tag" aria-hidden="true">
        {ids.map((id) => (
          <b key={id} className={level(id)}>
            {id}
          </b>
        ))}
      </span>
    </div>
  )
}

export function Xray({ t }: { t: Copy['xray'] }) {
  const [fixed, setFixed] = useState(false)
  const [active, setActive] = useState<string[] | null>(null)
  const [touch, setTouch] = useState(false)
  useEffect(() => setTouch(window.matchMedia('(hover: none)').matches), [])
  const p = { active, onPoint: setActive }
  const rewrite = useRef<HTMLButtonElement>(null)
  const [from, setFrom] = useState(130)
  useLayoutEffect(() => {
    const measure = () => {
      const b = rewrite.current
      if (b) setFrom(Math.round(b.offsetLeft + b.offsetWidth / 2))
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [t])
  const w = from + 100

  return (
    <section className="split xray flip" aria-labelledby="xray-title">
      <div className="split-copy">
        <h2 id="xray-title" data-words>
          <Words text={t.title} />
        </h2>
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <div className="xray-act">
          <div className="xray-switch" role="group">
            {[false, true].map((to) => (
              <button
                key={String(to)}
                ref={to ? rewrite : undefined}
                type="button"
                aria-pressed={fixed === to}
                onClick={() => {
                  if (fixed === to) return
                  setFixed(to)
                  setActive(null)
                  track('xray_toggle', { to: to ? 'rewritten' : 'generated' })
                }}
              >
                {to ? t.rewrite : t.slop}
              </button>
            ))}
          </div>
          {fixed ? (
            <svg key="result" className="scribble to-result" viewBox={`0 0 ${w} 56`} style={{ width: `${w}px` }} aria-hidden="true">
              <path pathLength={1} d={`M${w} 3C${w - 4} 38 ${w * 0.55} 50 44 42C26 38 15 28 8 14`} />
              <path className="head" pathLength={1} d="M6.2 25.9 8 14l10.5 5.7" />
            </svg>
          ) : (
            <svg key="button" className="scribble to-button" viewBox="0 0 96 64" aria-hidden="true">
              <path pathLength={1} d="M90 5c-3 22-24 38-50 41-9 1-18 1-25-1" />
              <path className="head" pathLength={1} d="M26 35 14 45l13 6" />
            </svg>
          )}
        </div>
      </div>
      <div className="split-stage" data-demo>
        <div className="browser">
          <div className="browser-top" aria-hidden="true">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="browser-url">generic.app</span>
          </div>
          <div className={`fx ${fixed ? 'is-fixed' : ''}`}>
            <div className="fx-slop" aria-hidden={fixed}>
              <Part ids={parts[0]!} {...p} className="fx-blobs">
                <i />
                <i />
              </Part>
              <div className="fx-nav">
                <b>Generic</b>
                <span>Product</span>
                <span>Pricing</span>
                <span className="fx-pill-btn">Get started</span>
              </div>
              <div className="fx-hero">
                <Part ids={parts[1]!} {...p} className="fx-badge">
                  <span>✨ New: AI-powered workflows</span>
                </Part>
                <Part ids={parts[2]!} {...p} className="fx-h1">
                  <span>Unlock the power of seamless collaboration</span>
                </Part>
                <Part ids={parts[3]!} {...p} className="fx-lead">
                  <span>In today&apos;s fast-paced world, teams need a robust, intuitive, and powerful platform.</span>
                </Part>
                <Part ids={parts[4]!} {...p} className="fx-ctas">
                  <span className="fx-cta">Get started →</span>
                  <span className="fx-ghost">Learn more →</span>
                </Part>
                <Part ids={parts[5]!} {...p} className="fx-proof">
                  <span className="fx-avatars">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>Trusted by 10,000+ teams</span>
                </Part>
                <Part ids={parts[6]!} {...p} className="fx-logos">
                  <span>ACME</span>
                  <span>Globex</span>
                  <span>Initech</span>
                  <span>Umbrella</span>
                </Part>
              </div>
              <Part ids={parts[7]!} {...p} className="fx-eyebrow">
                <span>FEATURES</span>
              </Part>
              <Part ids={parts[8]!} {...p} className="fx-cards">
                {[
                  ['⚡', 'Lightning fast'],
                  ['🔒', 'Bank-grade security'],
                  ['🚀', 'Scales with you'],
                ].map(([e, h]) => (
                  <span key={h} className="fx-card">
                    <span className="fx-tile">{e}</span>
                    <b>{h}</b>
                    <span className="fx-line" />
                    <span className="fx-line short" />
                  </span>
                ))}
              </Part>
              <Part ids={parts[9]!} {...p} className="fx-quote">
                <span>&ldquo;Generic changed everything.&rdquo;</span>
                <small>Sarah Chen, CEO at TechCorp</small>
              </Part>
            </div>
            <div className="fx-clean" aria-hidden={!fixed}>
              <div className="fx-nav">
                <b>Generic</b>
                <span>How it works</span>
                <span>Pricing</span>
                <span>Sign in</span>
              </div>
              <div className="fx-clean-hero">
                <h3>Shared notes that turn into a task list</h3>
                <p>Write the meeting notes together. Every line that starts with a name becomes a task for that person, linked back to the meeting.</p>
                <div className="fx-clean-actions">
                  <span className="fx-cta plain">Create a workspace</span>
                  <span className="fx-link">See how importing works</span>
                </div>
                <small>Free for teams of up to 5.</small>
              </div>
              <div className="fx-product">
                <div className="fx-notes">
                  <small>Weekly sync · Tue</small>
                  <p>
                    <b>Rani</b> send the new deck to Ops
                  </p>
                  <p>Launch moves to the 14th</p>
                  <p>
                    <b>Dimas</b> check the refund flow
                  </p>
                </div>
                <div className="fx-tasks">
                  <small>Tasks</small>
                  <p>
                    <i /> Send the new deck to Ops <span>Rani</span>
                  </p>
                  <p>
                    <i /> Check the refund flow <span>Dimas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="xray-info" aria-live="polite">
          {fixed ? (
            <span className="clean">
              {t.rewritten} · 0 block · 0 justify · 0 warn
            </span>
          ) : active ? (
            active.map((id) => (
              <span key={id}>
                <b className={level(id)}>{id}</b> {title(id)}
              </span>
            ))
          ) : (
            <span>
              {touch ? t.tap : t.point} · {total} {t.rules}
            </span>
          )}
        </p>
      </div>
    </section>
  )
}
