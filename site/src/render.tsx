import { renderToString } from 'react-dom/server'
import { App } from './App'
import type { Lang, Page } from './copy'
import { type PageData, setCount } from './story-data'

export const render = (lang: Lang, page: Page, data?: PageData | undefined) => {
  setCount(lang, data?.count ?? 0)
  return renderToString(<App lang={lang} page={page} data={data} />)
}
export { copies, href, langs } from './copy'
export { storyHref, dateText } from './story-data'
export { catalog, implemented } from '../../src/core/index.js'
