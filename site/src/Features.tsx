import { Footer, Header } from './Chrome'
import { copies, href, type Lang, type Page } from './copy'
import { track } from './track'
import { useTheater, Words } from './theater'

const Arrow = () => (
  <svg className="arrow" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
)

const target = (lang: Lang, to: string) => {
  const [page, hash] = to.split('#') as [Page, string | undefined]
  return href(lang, page, hash ? `#${hash}` : '')
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function Features({ lang }: { lang: Lang }) {
  const t = copies[lang].features
  useTheater()
  return (
    <>
      <Header lang={lang} page="features" />
      <main id="content" className="wrap page features">
        <header className="page-head">
          <h1 data-words>
            <Words text={t.title} />
          </h1>
          <p className="lead">{t.lead}</p>
        </header>
        {t.groups.map((g) => (
          <section key={g.name} className="feature-group" aria-labelledby={`f-${slug(g.name)}`}>
            <h2 id={`f-${slug(g.name)}`}>{g.name}</h2>
            <ul className="ways">
              {g.items.map((item) => (
                <li key={item.title}>
                  <a href={target(lang, item.to)} onClick={() => track('feature_click', { to: item.to })}>
                    <span className="way-label">{item.title}</span>
                    <span className="way-note">{item.body}</span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer lang={lang} />
    </>
  )
}
