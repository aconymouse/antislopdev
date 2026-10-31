import { Footer, Header } from './Chrome'
import { copies, href, type Lang } from './copy'
import { Article } from './Article'
import { dateText, type PageData } from './story-data'

const Arrow = () => (
  <svg className="arrow" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
)

function Index({ lang, data }: { lang: Lang; data: PageData }) {
  const t = copies[lang].stories
  return (
    <main id="content" className="wrap page stories">
      <header className="page-head">
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
      </header>
      <ol className="story-list">
        {(data.cards ?? []).map((c) => (
          <li key={c.id}>
            <a href={c.href}>
              <time dateTime={c.date}>{dateText(lang, c.date)}</time>
              <span className="story-card">
                <h2>{c.title}</h2>
                <span>{c.excerpt}</span>
              </span>
              <span className="story-min">
                {c.minutes} {t.minutes}
              </span>
              <Arrow />
            </a>
          </li>
        ))}
      </ol>
      <a className="go feed-link" href={`${href(lang, 'stories')}feed.xml`}>
        {t.feed}
        <Arrow />
      </a>
    </main>
  )
}

export function Stories({ lang, data }: { lang: Lang; data: PageData }) {
  return (
    <>
      <Header lang={lang} page="stories" alt={data.alt} />
      {data.story ? <Article lang={lang} data={data} /> : <Index lang={lang} data={data} />}
      <Footer lang={lang} />
    </>
  )
}
