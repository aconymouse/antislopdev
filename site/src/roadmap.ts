import text from '../../ROADMAP.md'

export type Stage = { name: string; items: { item: string; why: string }[] }

export const stages: Stage[] = text
  .split(/^## /m)
  .slice(1)
  .map((block) => {
    const [head = '', ...lines] = block.split('\n')
    const items = lines
      .filter((l) => l.startsWith('| ') && !l.startsWith('| Item |'))
      .map((l) => {
        const [item = '', why = ''] = l.slice(2, -2).split(' | ')
        return { item, why }
      })
    return { name: head.trim(), items }
  })
  .filter((s) => s.items.length > 0)
