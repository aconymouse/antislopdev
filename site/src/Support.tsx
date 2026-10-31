import { Fragment } from 'react'
import { Footer, Header, repo } from './Chrome'
import { copies, type Lang } from './copy'
import { doors } from './marks'
import { stages } from './roadmap'
import { useTheater, Words } from './theater'
import { track } from './track'

const discussions = `${repo}/discussions/categories`

const ways: Record<string, string> = {
  fp: `${repo}/issues/new?template=false-positive.yml`,
  rule: `${discussions}/rule-proposals`,
  setup: `${discussions}/show-your-setup`,
  guide: `${repo}/blob/main/CONTRIBUTING.md`,
}

const gifts = [
  { key: 'saweria', name: 'Saweria', href: 'https://saweria.co/aconymous' },
  { key: 'paypal', name: 'PayPal', href: 'https://www.paypal.com/paypalme/sarangseo' },
] as const

function inline(text: string) {
  return text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>))
}

const Arrow = () => (
  <svg className="arrow" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
)

export function Support({ lang }: { lang: Lang }) {
  const t = copies[lang].support
  useTheater()
  return (
    <>
      <Header lang={lang} page="support" />
      <main id="content" className="wrap page support">
        <header className="page-head">
          <h1 data-words>
            <Words text={t.title} />
          </h1>
          <p className="lead">{t.lead}</p>
        </header>

        <section className="support-block" aria-labelledby="help-h">
          <h2 id="help-h">{t.help}</h2>
          <ul className="ways">
            {t.ways.map((w) => (
              <li key={w.key}>
                <a href={ways[w.key]} onClick={() => track('support_click', { to: w.key })}>
                  <span className="way-label">{w.label}</span>
                  <span className="way-note">{w.note}</span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="support-block" aria-labelledby="roadmap-h">
          <h2 id="roadmap-h">{t.roadmap}</h2>
          <p className="support-lead">{t.roadmapLead}</p>
          <div className="roadmap">
            {stages.map((s) => (
              <div key={s.name} className="stage">
                <h3>{t.stages[s.name] ?? s.name}</h3>
                <ol>
                  {s.items.map((x) => (
                    <li key={x.item}>
                      <h4>{inline(x.item)}</h4>
                      <p>{inline(x.why)}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <a className="go" href={`${repo}/blob/main/ROADMAP.md`}>
            {t.source}
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 11 11 5M6 5h5v5" />
            </svg>
          </a>
        </section>

        <section className="support-block" aria-labelledby="give-h">
          <h2 id="give-h">{t.give}</h2>
          <p className="support-lead">{t.giveLead}</p>
          <div className="gifts">
            {gifts.map((g) => (
              <a key={g.key} className={`gift is-${g.key}`} href={g.href} target="_blank" rel="noopener" onClick={() => track('support_click', { to: g.key })}>
                <svg className="gift-mark" viewBox={doors[g.key].viewBox} aria-hidden="true">
                  <path fillRule="evenodd" d={doors[g.key].path} />
                </svg>
                <strong>{g.name}</strong>
                <span>{t[g.key]}</span>
                <Arrow />
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}
