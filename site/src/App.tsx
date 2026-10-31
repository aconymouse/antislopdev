import type { Lang, Page } from './copy'
import { Docs } from './Docs'
import { Home } from './Home'
import { Rules } from './Rules'
import { Stories } from './Stories'
import type { PageData } from './story-data'
import { Support } from './Support'

export function App({ lang, page, data }: { lang: Lang; page: Page; data?: PageData | undefined }) {
  if (page === 'docs') return <Docs lang={lang} />
  if (page === 'rules') return <Rules lang={lang} />
  if (page === 'support') return <Support lang={lang} />
  if (page === 'stories') return <Stories lang={lang} data={data ?? { count: 0 }} />
  return <Home lang={lang} />
}
