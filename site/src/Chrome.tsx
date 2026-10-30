import { useEffect, useRef, useState } from 'react'
import { copies, href, langs, type Lang, type Page } from './copy'
import { marks } from './marks'
import { track } from './track'

export const repo = 'https://github.com/aconymouse/antislopdev'

export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" />
      <path d="M5 17.5c1.4-3.2 4.1-3.2 5.5 0s4.1 3.2 5.5 0 4.1-3.2 5.5 0 4.1 3.2 5.5 0" />
    </svg>
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
      {count !== null ? <b>{count}</b> : null}
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

function LangPick({ lang, page, label }: { lang: Lang; page: Page; label: string }) {
  return (
    <label className="lang-pick">
      <span className="visually-hidden">{label}</span>
      <select
        value={lang}
        onChange={(e) => {
          const next = e.target.value as Lang
          track('lang_switch', { to: next })
          location.href = href(next, page, location.hash)
        }}
      >
        {langs.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Header({ lang, page }: { lang: Lang; page: Page }) {
  const t = copies[lang].nav
  const menu = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const links: [Page | 'play', string, string][] = [
    ['play', t.playground, href(lang, 'home', '#playground')],
    ['docs', t.docs, href(lang, 'docs')],
    ['rules', t.rules, href(lang, 'rules')],
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
            <Mark />
            <span>antiSlopdev</span>
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
            <LangPick lang={lang} page={page} label={t.language} />
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
          <a className="brand" href={href(lang, 'home')}>
            <Mark />
            <span>antiSlopdev</span>
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
          <LangPick lang={lang} page={page} label={t.language} />
          <Star label={t.star} place="menu" />
        </div>
      </dialog>
    </header>
  )
}

export function Footer({ lang }: { lang: Lang }) {
  const t = copies[lang]
  const [self, setSelf] = useState('')
  useEffect(() => {
    const run = async () => {
      const { check } = await import('../../src/core/index.js')
      const sheet = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href
      const page = await (await fetch(location.pathname, { cache: 'no-store' })).text()
      const doc = new DOMParser().parseFromString(page, 'text/html')
      for (const demo of doc.querySelectorAll('[data-demo], pre, code')) demo.replaceWith(doc.createComment('example'))
      const files = [{ path: 'index.html', text: '<!doctype html>\n' + doc.documentElement.outerHTML }]
      if (sheet) files.push({ path: 'style.css', text: await (await fetch(sheet)).text() })
      const r = check(files)
      setSelf(t.foot.self(r.counts.block, r.counts.justify, r.counts.warn))
    }
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 800))
    idle(() => void run().catch(() => setSelf('')))
  }, [t])
  return (
    <footer className="site-foot">
      <div className="site-foot-in">
        <p>{t.foot.rights}</p>
        <nav aria-label="Footer">
          <a href={href(lang, 'docs')}>{t.nav.docs}</a>
          <a href={href(lang, 'rules')}>{t.nav.rules}</a>
          <a href={href(lang, 'home', '#faq')}>{t.foot.faq}</a>
          <a href={repo} onClick={() => track('github_click', { place: 'footer' })}>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/antislopdev">npm</a>
          <a href={`${repo}/blob/main/LICENSE`}>MIT</a>
        </nav>
      </div>
      <p className="self" aria-live="polite">
        {self}
      </p>
    </footer>
  )
}
