import { renderToString } from 'react-dom/server'
import { App } from './App'
import type { Lang, Page } from './copy'

export const render = (lang: Lang, page: Page) => renderToString(<App lang={lang} page={page} />)
export { copies, href, langs } from './copy'
export { catalog, implemented } from '../../src/core/index.js'
