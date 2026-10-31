import { catalog, implemented } from '../../src/core/index.js'
import { Agents } from './Agents'
import { Allow } from './Allow'
import { Footer, Header, repo, Star } from './Chrome'
import { Hero } from './Hero'
import { Typed } from './Typed'
import { copies, href, type Lang } from './copy'
import { Indo } from './Indo'
import { Playground } from './Playground'
import { Terminal } from './Terminal'
import { track } from './track'
import { Xray } from './Xray'
import { useTheater, Words } from './theater'

const prefixes = [...new Set(catalog.map((r) => r.id.split('-')[0]!))]

export function Home({ lang }: { lang: Lang }) {
  const t = copies[lang]
  useTheater()
  return (
    <>
      <Header lang={lang} page="home" />
      <Hero t={t.hero} />
      <main id="content" className="wrap">
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
            <h2 id="groups-title" data-words>
              <Words text={t.groups.title} />
            </h2>
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
          <h2 id="faq-title" data-words>
            <Words text={t.faq.title} />
          </h2>
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
            <h2 id="source-title" data-words>
              <Words text={t.source.title} />
            </h2>
            <p>{t.source.p1}</p>
            <div className="source-actions">
              <a href={repo} className="button solid" onClick={() => track('github_click', { place: 'source' })}>
                {t.source.button}
              </a>
              <Star label={t.nav.star} large place="source" />
            </div>
          </div>
          <Typed
            text={`git clone ${repo}
cd antislopdev
npm install
npm test
npm run site`}
          />
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}
