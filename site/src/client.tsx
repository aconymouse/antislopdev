import { hydrateRoot } from 'react-dom/client'
import { App } from './App'
import type { Lang, Page } from './copy'

const root = document.getElementById('root')!
const lang = (document.documentElement.lang === 'id' ? 'id' : 'en') as Lang
const page = (root.dataset.page ?? 'home') as Page
hydrateRoot(root, <App lang={lang} page={page} />)
