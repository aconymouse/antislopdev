import { useEffect, useRef, useState } from 'react'
import { asset } from './asset'
import { copies, href, langs, type Lang, type Page } from './copy'
import { marks } from './marks'
import { hasStories, safePath } from './story-data'
import { track } from './track'

export const repo = 'https://github.com/aconymouse/antislopdev'

export function Logo() {
  return (
    <>
      <img className="logo logo-light" src={asset('/logo.svg')} alt="" width={126} height={30} />
      <img className="logo logo-ink" src={asset('/logo-ink.svg')} alt="" width={126} height={30} />
    </>
  )
}

export function Go({ href, children, onClick }: { href: string; children: string; onClick?: () => void }) {
  return (
    <a className="go" href={href} onClick={onClick}>
      {children}
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
      </svg>
    </a>
  )
}

export function Star({ label, large = false, place }: { label: string; large?: boolean; place: string }) {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    let cached: string | null = null
    try {
      cached = sessionStorage.getItem('asd:stars')
    } catch {}
    if (cached) return setCount(Number(cached))
    fetch('https://api.github.com/repos/aconymouse/antislopdev', { headers: { accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { stargazers_count?: number } | null) => {
        if (typeof d?.stargazers_count !== 'number') return
        setCount(d.stargazers_count)
        try {
          sessionStorage.setItem('asd:stars', String(d.stargazers_count))
        } catch {}
      })
      .catch(() => setCount(null))
  }, [])
  return (
    <a className={large ? 'star star-large' : 'star'} href={repo} onClick={() => track('github_click', { place })}>
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="gh">
        <path d={marks.github} />
      </svg>
      <span>{label}</span>
      {count ? <b>{count}</b> : null}
    </a>
  )
}

function ThemeButton({ label, onPick }: { label: string; onPick?: () => void }) {
  const flip = () => {
    const now = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = now
    try {
      localStorage.setItem('asd:theme', now)
    } catch {}
    onPick?.()
  }
  return (
    <button type="button" className="icon-button" onClick={flip} aria-label={label} title={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="sun">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="moon">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  )
}

function LangPick({ lang, page, label, up = false, alt }: { lang: Lang; page: Page; label: string; up?: boolean; alt?: Partial<Record<Lang, string>> | undefined }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const now = langs.find((l) => l.code === lang) ?? langs[0]!

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <div className={up ? 'lang-pick up' : 'lang-pick'} ref={box}>
      <button type="button" aria-expanded={open} aria-label={`${label}: ${now.name}`} onClick={() => setOpen(!open)}>
        {now.name}
        <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      {open ? (
        <ul className="lang-menu">
          {langs.map((l) => (
            <li key={l.code}>
              <a
                href={safePath(alt?.[l.code]) ?? href(l.code, page)}
                hrefLang={l.code}
                lang={l.code}
                aria-current={l.code === lang ? 'true' : undefined}
                onClick={(e) => {
                  track('lang_switch', { to: l.code })
                  // antislopdev-allow SEC-26: the hash goes after a path that href() builds, so it cannot change the scheme
                  if (!alt) e.currentTarget.href = href(l.code, page, location.hash)
                }}
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function Header({ lang, page, alt }: { lang: Lang; page: Page; alt?: Partial<Record<Lang, string>> | undefined }) {
  const t = copies[lang].nav
  const menu = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const links: [Page | 'play', string, string][] = [
    ['play', t.playground, href(lang, 'home', '#playground')],
    ['docs', t.docs, href(lang, 'docs')],
    ['rules', t.rules, href(lang, 'rules')],
    ['support', t.support, href(lang, 'support')],
    ...(hasStories(lang) ? [['stories', t.stories, href(lang, 'stories')] as [Page, string, string]] : []),
  ]
  const toggle = (next: boolean) => {
    const d = menu.current
    if (!d) return
    if (next) d.showModal()
    else d.close()
    setOpen(next)
  }
  return (
    <header className="site-head">
      <a className="skip" href="#content">
        {t.skip}
      </a>
      <div className="site-bar">
        <div className="site-bar-in">
          <a className="brand" href={href(lang, 'home')} aria-label="antiSlopdev">
            <Logo />
          </a>
          <nav className="site-nav" aria-label={t.menu}>
            {links.map(([key, label, url]) => (
              <a key={key} href={url} aria-current={key === page ? 'page' : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className="site-bar-end">
            <ThemeButton label={t.theme} />
            <LangPick lang={lang} page={page} label={t.language} alt={alt} />
            <Star label={t.star} place="header" />
            <a className="top-cta" href={href(lang, 'home', '#playground')}>
              {t.cta}
            </a>
            <button type="button" className="burger" aria-label={t.menu} aria-expanded={open} onClick={() => toggle(true)}>
              <span className="burger-lines" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>
      <dialog className="site-menu" ref={menu} onClose={() => setOpen(false)} aria-label={t.menu}>
        <div className="site-menu-top">
          <a className="brand" href={href(lang, 'home')} aria-label="antiSlopdev">
            <Logo />
          </a>
          <ThemeButton label={t.theme} />
          <button type="button" className="burger is-open" aria-label={t.close} onClick={() => toggle(false)}>
            <span className="burger-lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
        <ol className="site-menu-links">
          {[...links, ['github', t.github, repo] as const].map(([key, label, url]) => (
            <li key={key}>
              <a href={url} onClick={() => toggle(false)} aria-current={key === page ? 'page' : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ol>
        <div className="site-menu-foot">
          <LangPick lang={lang} page={page} label={t.language} up alt={alt} />
          <Star label={t.star} place="menu" />
        </div>
      </dialog>
    </header>
  )
}

export function Footer({ lang }: { lang: Lang }) {
  const t = copies[lang]
  return (
    <footer className="site-foot">
      <div className="site-foot-in">
        <p>
          {t.foot.rights} · {t.foot.made}{' '}
          <a className="credit" href="https://aconymous.com" onClick={() => track('creator_click', { place: 'footer' })}>
            Hafidz Nc
          </a>
          , {t.foot.creator}
        </p>
        <nav aria-label="Footer">
          <a href={href(lang, 'docs')}>{t.nav.docs}</a>
          <a href={href(lang, 'rules')}>{t.nav.rules}</a>
          <a href={href(lang, 'features')}>{t.nav.features}</a>
          <a href={href(lang, 'support')}>{t.nav.support}</a>
          {hasStories(lang) ? <a href={href(lang, 'stories')}>{t.nav.stories}</a> : null}
          <a href={href(lang, 'home', '#faq')}>{t.foot.faq}</a>
          <a href={repo} onClick={() => track('github_click', { place: 'footer' })}>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/antislopdev">npm</a>
          <a href={`${repo}/blob/main/LICENSE`}>MIT</a>
        </nav>
      </div>
    </footer>
  )
}
