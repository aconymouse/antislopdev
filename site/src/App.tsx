import type { Lang, Page } from './copy'
import { Docs } from './Docs'
import { Home } from './Home'
import { Rules } from './Rules'

export function App({ lang, page }: { lang: Lang; page: Page }) {
  if (page === 'docs') return <Docs lang={lang} />
  if (page === 'rules') return <Rules lang={lang} />
  return <Home lang={lang} />
}
