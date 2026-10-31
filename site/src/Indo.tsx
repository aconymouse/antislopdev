import { check } from '../../src/core/index.js'
import type { Copy } from './copy'
import { marked } from './Playground'
import { Words } from './theater'

const sample = `Di era digital saat ini, bisnis Anda butuh solusi terbaik yang revolusioner.

Flowly tidak hanya cepat, tetapi juga aman. Para ahli mengatakan aplikasi ini menjadi bukti nyata transformasi digital, mulai dari UMKM hingga korporasi.

Tentu! Berikut adalah versi yang sudah direvisi.

Semoga bermanfaat!`

export function Indo({ t }: { t: Copy['indo'] }) {
  const report = check([{ path: 'produk.md', text: sample }])
  const ids = [...new Set(report.findings.map((f) => f.rule))]
  return (
    <section className="split indo flip" aria-labelledby="indo-title">
      <div className="split-copy">
        <h2 id="indo-title" data-words>
          <Words text={t.title} />
        </h2>
        <p>{t.p1}</p>
        <p className="fine">{t.p2}</p>
      </div>
      <div className="split-stage" data-demo>
        <div className="paper">
          <pre className="paper-text">{marked(sample, report.findings)}</pre>
          <ul className="paper-ids">
            {ids.map((id) => {
              const f = report.findings.find((x) => x.rule === id)!
              return (
                <li key={id} className={f.level}>
                  <b>{id}</b> {f.title}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
