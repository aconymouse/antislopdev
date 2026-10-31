import { hydrateRoot } from 'react-dom/client'
import { App } from './App'
import type { Lang, Page } from './copy'
import { type PageData, setCount } from './story-data'

const root = document.getElementById('root')!
const lang = (document.documentElement.lang === 'id' ? 'id' : 'en') as Lang
const page = (root.dataset.page ?? 'home') as Page
const raw = document.getElementById('page-data')?.textContent
const data: PageData = raw ? JSON.parse(raw) : { count: Number(root.dataset.stories ?? 0) }
if (data.story) data.story.html = root.querySelector('.story-body')?.innerHTML ?? ''
setCount(lang, data.count)
hydrateRoot(root, <App lang={lang} page={page} data={data} />)
