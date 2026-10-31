import { useEffect, useState } from 'react'
import { catalog, implemented } from '../../src/core/index.js'
import type { RuleMeta } from '../../src/core/index.js'
import { Footer, Header } from './Chrome'
import { copies, type Lang } from './copy'
import { useTheater, Words } from './theater'

const prefixes = [...new Set(catalog.map((r) => r.id.split('-')[0]!))]

function Detail({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))}
    </>
  )
}

export function Rules({ lang }: { lang: Lang }) {
  const t = copies[lang]
  useTheater()
  const [group, setGroup] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState('')

  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1))
      if (prefixes.includes(h)) setGroup(h)
      else if (/^[A-Z]+-\d+$/.test(h)) {
        setGroup('')
        setOpen(h)
        window.setTimeout(() => document.getElementById(h)?.scrollIntoView({ block: 'center' }), 50)
      }
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  const q = query.trim().toLowerCase()
  const shown = catalog.filter((r) => (!group || r.id.startsWith(group + '-')) && (!q || `${r.id} ${r.title} ${r.detail}`.toLowerCase().includes(q)))
  const sections = prefixes.map((p) => ({ p, rules: shown.filter((r) => r.id.startsWith(p + '-')) })).filter((s) => s.rules.length)

  const row = (r: RuleMeta) => (
    <details key={r.id} id={r.id} open={open === r.id || undefined}>
      <summary>
        <span className="id">{r.id}</span>
        <span className="t">{r.title}</span>
        <span className={`lv ${r.level}`}>{r.level}</span>
      </summary>
      <div className="rule-detail">
        <p>
          <Detail text={r.detail} />
        </p>
        <p className="how">{implemented.includes(r.id) ? `${t.rules.auto} (${r.check})` : t.rules.eye}</p>
      </div>
    </details>
  )

  return (
    <>
      <Header lang={lang} page="rules" />
      <main id="content" className="wrap page">
        <header className="page-head">
          <h1 data-words>
            <Words text={t.rules.title} />
          </h1>
          <p className="lead">{t.rules.lead}</p>
        </header>
        <div className="rules-bar">
          <div className="chips" role="group" aria-label={t.rules.filter}>
            <button type="button" aria-pressed={group === ''} onClick={() => setGroup('')}>
              {t.rules.all} <span>{catalog.length}</span>
            </button>
            {prefixes.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={group === p}
                onClick={() => {
                  setGroup(p)
                  history.replaceState(null, '', `#${p}`)
                }}
              >
                {t.groups.names[p]} <span>{catalog.filter((r) => r.id.startsWith(p + '-')).length}</span>
              </button>
            ))}
          </div>
          <label className="search">
            <span className="visually-hidden">{t.rules.filter}</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.rules.filter} autoComplete="off" />
          </label>
        </div>
        <p className="rules-count">
          {shown.length} {t.rules.of} {catalog.length}
        </p>
        <div className="rules-list" data-demo>
          {sections.length === 0 ? <p className="empty">{t.rules.none}</p> : null}
          {sections.map((s) => (
            <section key={s.p} aria-labelledby={`g-${s.p}`}>
              <h2 id={`g-${s.p}`}>{t.groups.names[s.p]}</h2>
              {s.rules.map(row)}
            </section>
          ))}
        </div>
      </main>
      <Footer lang={lang} />
    </>
  )
}
