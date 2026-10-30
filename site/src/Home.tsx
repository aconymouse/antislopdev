import { useState } from 'react'
import { catalog, implemented } from '../../src/core/index.js'
import { Agents } from './Agents'
import { Allow } from './Allow'
import { Footer, Header, repo, Star } from './Chrome'
import { copies, href, type Lang } from './copy'
import { Indo } from './Indo'
import { Playground } from './Playground'
import { Terminal } from './Terminal'
import { track } from './track'
import { Xray } from './Xray'

const prefixes = [...new Set(catalog.map((r) => r.id.split('-')[0]!))]

function Copyable({ text, label, method, className, done }: { text: string; label?: string; method: string; className: string; done: string }) {
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

export function Home({ lang }: { lang: Lang }) {
  const t = copies[lang]
  return (
    <>
      <Header lang={lang} page="home" />
      <main id="content" className="wrap">
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            <span>{t.hero.line1}</span> <span>{t.hero.line2}</span>
          </h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="actions">
            <Copyable className="button solid install" text="npx skills add aconymouse/antislopdev" method="skills" done={t.hero.copied} />
            <Copyable className="button" text="/plugin marketplace add aconymouse/antislopdev" label={t.hero.plugin} method="claude-code" done={t.hero.copied} />
            <a className="button bare" href="#playground">
              {t.hero.play}
            </a>
          </div>
          <p className="fine">{t.hero.fine}</p>
        </section>

        <section className="showcase" aria-label={t.play.label}>
          <Playground t={t.play} />
        </section>

        <Agents t={t.agents} />
        <Xray t={t.xray} />
        <Terminal t={t.terminal} />
        <Allow t={t.allow} />
        {lang === 'id' ? null : <Indo t={t.indo} />}

        <section className="groups" aria-labelledby="groups-title">
          <div className="section-head">
            <h2 id="groups-title">{t.groups.title}</h2>
            <p>{t.groups.p1}</p>
          </div>
          <ul className="group-grid">
            {prefixes.map((p) => {
              const rules = catalog.filter((r) => r.id.startsWith(p + '-'))
              const auto = rules.filter((r) => implemented.includes(r.id)).length
              return (
                <li key={p}>
                  <a href={href(lang, 'rules', `#${p}`)}>
                    <span className="group-top">
                      <b>{t.groups.names[p]}</b>
                      <span>{rules.length}</span>
                    </span>
                    <span className="group-ex" data-demo>
                      {rules.slice(0, 3).map((r) => (
                        <span key={r.id}>
                          <i>{r.id}</i> {r.title}
                        </span>
                      ))}
                    </span>
                    <span className="group-bar" aria-hidden="true">
                      <i style={{ width: `${(auto / rules.length) * 100}%` }} />
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
          <a className="button" href={href(lang, 'rules')}>
            {t.groups.all}
          </a>
        </section>

        {lang === 'id' ? <Indo t={t.indo} /> : null}

        <section className="faq" id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">{t.faq.title}</h2>
          <div className="faq-list">
            {t.faq.items.map((item) => (
              <details key={item.q}>
                <summary>
                  <span>{item.q}</span>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="source" aria-labelledby="source-title">
          <div>
            <h2 id="source-title">{t.source.title}</h2>
            <p>{t.source.p1}</p>
            <div className="source-actions">
              <a href={repo} className="button solid" onClick={() => track('github_click', { place: 'source' })}>
                {t.source.button}
              </a>
              <Star label={t.nav.star} large place="source" />
            </div>
          </div>
          <pre className="snippet">
            <code>{`git clone ${repo}
cd antislopdev
npm install
npm test
npm run site`}</code>
          </pre>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}
