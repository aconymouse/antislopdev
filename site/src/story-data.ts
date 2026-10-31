import type { Lang } from './copy'

export type Cover = { url: string; width: number | null; height: number | null; alt: string } | null

export type Entry = { slug: string; title: string; excerpt: string; seoTitle: string; seoDescription: string; cover: Cover; readingMinutes: number; tags: string[]; html: string }

export type Story = { id: number; kind: string; publishedAt: string; modifiedAt: string; locales: Partial<Record<Lang, Entry>> }

export type Card = { id: number; href: string; title: string; excerpt: string; date: string; minutes: number }

export type View = { title: string; date: string; modified: string; minutes: number; cover: Cover; tags: string[]; html: string; other: string | null }

export type PageData = { count: number; cards?: Card[] | undefined; story?: View | undefined; alt?: Partial<Record<Lang, string>> | undefined }

const ownPath = /^\/(?:id\/)?stories\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)?$/

export const safePath = (path: string | null | undefined): string | undefined => (path && ownPath.test(path) ? path : undefined)

export const storyHref = (lang: Lang, slug: string) => `${lang === 'en' ? '/' : '/id/'}stories/${slug}/`

const counts: Partial<Record<Lang, number>> = {}

export const setCount = (lang: Lang, n: number) => {
  counts[lang] = n
}

export const hasStories = (lang: Lang) => (counts[lang] ?? 0) > 0

export const dateText = (lang: Lang, iso: string) => new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(iso))
