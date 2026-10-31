import { useEffect } from 'react'
import { copies, href, type Lang } from './copy'
import { dateText, type PageData } from './story-data'
import { track } from './track'

function useCopyButtons(lang: Lang) {
  useEffect(() => {
    const t = copies[lang].stories
    const click = (e: MouseEvent) => {
      const button = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-copy]')
      if (!button) return
      const block = button.closest('figure')?.querySelector('pre code')
      if (!block) return
      const select = () => {
        const range = document.createRange()
        range.selectNodeContents(block)
        const picked = window.getSelection()
        picked?.removeAllRanges()
        picked?.addRange(range)
      }
      navigator.clipboard
        .writeText(block.textContent ?? '')
        .then(() => {
          button.textContent = t.copied
          track('story_copy_code', {})
          window.setTimeout(() => (button.textContent = t.copy), 1400)
        })
        .catch(select)
    }
    for (const b of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) b.textContent = t.copy
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [lang])
}

export function Article({ lang, data }: { lang: Lang; data: PageData }) {
  const t = copies[lang].stories
  const s = data.story!
  useCopyButtons(lang)
  return (
    <main id="content" className="wrap page story">
      <article>
        <header className="story-head">
          <a className="story-back" href={href(lang, 'stories')}>
            ← {t.back}
          </a>
          <h1>{s.title}</h1>
          <p className="story-meta">
            {t.by}{' '}
            <a href="https://aconymous.com" rel="author">
              Hafidz Nc
            </a>{' '}
            · <time dateTime={s.date}>{dateText(lang, s.date)}</time> · {s.minutes} {t.minutes}
            {s.other ? (
              <>
                {' '}
                ·{' '}
                <a href={s.other} hrefLang={lang === 'en' ? 'id' : 'en'} lang={lang === 'en' ? 'id' : 'en'}>
                  {t.other}
                </a>
              </>
            ) : null}
          </p>
        </header>
        {s.cover ? (
          <figure className="story-cover">
            <img src={s.cover.url} alt={s.cover.alt} width={s.cover.width ?? undefined} height={s.cover.height ?? undefined} fetchPriority="high" decoding="async" />
          </figure>
        ) : null}
        {/* antislopdev-allow SEC-05: the body is HTML that aconymous renders from its own CMS, with text escaped and links and images checked before it reaches this build */}
        <div className="story-body prose" dangerouslySetInnerHTML={{ __html: s.html }} />
        {s.tags.length ? (
          <ul className="story-tags" aria-label="Tags">
            {s.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        ) : null}
      </article>
    </main>
  )
}
