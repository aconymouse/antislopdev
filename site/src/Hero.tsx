import { useEffect, useRef, useState } from 'react'
import type { Copy } from './copy'
import { Words } from './theater'
import { still, track } from './track'

export function Copyable({ text, label, method, className, done }: { text: string; label?: string; method: string; className: string; done: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {}
        track('copy_install', { method })
      }}
    >
      {label ? <span>{label}</span> : <code>{text}</code>}
      <span className="copy-mark" aria-hidden="true">
        {copied ? (
          <svg viewBox="0 0 16 16" width="15" height="15">
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="15" height="15">
            <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
            <path d="M3 10.5V3.8C3 3.4 3.4 3 3.8 3h6.7" />
          </svg>
        )}
      </span>
      <span className="visually-hidden" aria-live="polite">
        {copied ? done : ''}
      </span>
    </button>
  )
}

const ratio = 1672 / 941
const head = 384 / 941

const layers = [
  ['bg', 'hz-bg'],
  ['clouds', 'hz-clouds'],
  ['peak', 'hz-peak'],
] as const

export function Hero({ t }: { t: Copy['hero'] }) {
  const stage = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    setReady(true)
    let frame = 0
    let px = 0
    let py = 0
    const paint = () => {
      frame = 0
      const y = Math.min(window.scrollY, el.offsetHeight)
      el.style.setProperty('--s', String(y))
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
    }
    const ask = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      px = e.clientX / window.innerWidth - 0.5
      py = e.clientY / window.innerHeight - 0.5
      ask()
    }
    const fit = () => {
      const copy = el.querySelector<HTMLElement>('.hz-copy')
      if (!copy || !window.matchMedia('(min-width: 761px)').matches) {
        el.style.removeProperty('--top')
        el.style.removeProperty('--w')
        el.style.removeProperty('--top-pct')
        return
      }
      const H = el.clientHeight
      const floor = copy.offsetTop + copy.offsetHeight + 18
      let w = window.innerWidth * 1.04
      let h = w / ratio
      let top = floor - head * h
      if (top + h < H) {
        h = (H - floor) / (1 - head)
        w = Math.max(w, h * ratio)
        h = w / ratio
        top = floor - head * h
      }
      el.style.setProperty('--w', `${Math.round(w)}px`)
      el.style.setProperty('--top', `${Math.round(top)}px`)
      el.style.setProperty('--top-pct', `${((Math.max(top, 0) / H) * 100).toFixed(1)}%`)
    }
    fit()
    window.addEventListener('resize', fit)
    if (still()) return () => window.removeEventListener('resize', fit)
    paint()
    window.addEventListener('scroll', ask, { passive: true })
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', ask)
      window.removeEventListener('resize', fit)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <section className={`hz ${ready ? 'is-ready' : ''}`} ref={stage} aria-labelledby="hero-title">
      <div className="hz-scene" aria-hidden="true">
        {layers.map(([name, cls], i) => (
          <img
            key={name}
            className={`hz-layer ${cls}`}
            src={`/hero/${name}-1280.webp`}
            srcSet={`/hero/${name}-1280.webp 1280w, /hero/${name}-2400.webp 2400w`}
            sizes="100vw"
            width={2400}
            height={1351}
            alt=""
            decoding="async"
            fetchPriority={i === 1 ? 'low' : 'high'}
          />
        ))}
        <div className="hz-shade" />
      </div>
      <div className="hz-copy wrap">
        <h1 id="hero-title" data-words>
          <span>
            <Words text={t.line1} />
          </span>{' '}
          <span>
            <Words text={t.line2} start={t.line1.split(' ').length} />
          </span>
        </h1>
        <p className="lead">{t.lead}</p>
        <div className="actions">
          <Copyable className="button solid install" text="npx skills add aconymouse/antislopdev" method="skills" done={t.copied} />
          <Copyable className="button" text="/plugin marketplace add aconymouse/antislopdev" label={t.plugin} method="claude-code" done={t.copied} />
          <a className="button bare" href="#playground" onClick={() => track('hero_play')}>
            {t.play}
          </a>
        </div>
        <p className="fine">{t.fine}</p>
      </div>
    </section>
  )
}
