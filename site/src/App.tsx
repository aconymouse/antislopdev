import type { Lang, Page } from './copy'
import { Docs } from './Docs'
import { Home } from './Home'
import { Rules } from './Rules'
import { Support } from './Support'

export function App({ lang, page }: { lang: Lang; page: Page }) {
  if (page === 'docs') return <Docs lang={lang} />
  if (page === 'rules') return <Rules lang={lang} />
  if (page === 'support') return <Support lang={lang} />
  return <Home lang={lang} />
}
