import { Go } from './Chrome'
import { type Copy, href, type Lang } from './copy'
import { Words } from './theater'

const files: [string, number][] = [
  ['ui', 6.4],
  ['sec', 6.2],
  ['tx', 4.5],
  ['seo', 4.4],
  ['cd', 2.8],
  ['id', 2.8],
  ['tr', 1.8],
  ['ax', 1.4],
  ['pf', 1.3],
  ['doc', 1.3],
  ['git', 1.1],
]

function Stage({ name, line }: { name: string; line: string }) {
  if (name === 'rules') {
    const [head, tail] = line.split('dashboard')
    return (
      <div className="fv fv-rules">
        <code className="fv-json">
          <span>"words"</span>: ["dashboard"]
        </code>
        <p className="fv-copy">
          {head}
          <mark>dashboard</mark>
          {tail}
        </p>
        <span className="fv-chip">ACME-01 · warn</span>
      </div>
    )
  }
  if (name === 'levels') {
    return (
      <div className="fv fv-levels">
        <span className="fv-rule">
          <i>TX-04</i> Hype vocabulary
        </span>
        <div className="fv-track">
          <span>warn</span>
          <span>justify</span>
          <span>block</span>
          <b className="fv-knob" />
        </div>
        <code className="fv-json">
          <span>"levels"</span>: {'{'} "TX-04": "justify" {'}'}
        </code>
      </div>
    )
  }
  if (name === 'skill') {
    return (
      <div className="fv fv-skill">
        <div className="fv-files">
          {files.map(([file, kb]) => (
            <span key={file} className={file === 'ui' ? 'is-read' : undefined} style={{ flexGrow: kb }}>
              {file}
            </span>
          ))}
        </div>
        <span className="fv-size">
          <b>ui.md 6 KB</b> / 30 KB
        </span>
      </div>
    )
  }
  return (
    <div className="fv fv-scan">
      <code>
        const name = el.<span>textContent</span>
      </code>
      <i className="fv-link" />
      <code>
        out.<span>innerHTML</span> = name
      </code>
      <span className="fv-chip">SEC-26 · justify</span>
    </div>
  )
}

export function Fit({ t, lang }: { t: Copy['fit']; lang: Lang }) {
  return (
    <section className="fit" aria-labelledby="fit-title">
      <div className="section-head">
        <h2 id="fit-title" data-words>
          <Words text={t.title} />
        </h2>
        <p>{t.p1}</p>
      </div>
      <div className="fit-grid">
        <svg className="fit-thread" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} d="M80 40C260 40 300 150 500 150S760 80 920 170 760 330 500 360 160 380 120 470 360 560 920 560" />
        </svg>
        {t.items.map((item) => (
          <article key={item.key} className="fit-card">
            <div className="fit-stage" aria-hidden="true">
              <Stage name={item.key} line={t.copyLine} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <Go href={href(lang, 'features')}>{t.more}</Go>
    </section>
  )
}
