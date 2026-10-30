import { readFile, writeFile } from 'node:fs/promises'

export interface Entry {
  date: string
  hours: number
  note: string
}

export async function load(path: string): Promise<Entry[]> {
  const raw = await readFile(path, 'utf8')
  return raw
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => {
      const [date = '', hours = '0', note = ''] = line.split(',')
      return { date, hours: Number(hours), note }
    })
    .filter((entry) => entry.hours > 0)
}

export async function save(path: string, entries: Entry[]): Promise<void> {
  const body = entries.map((e) => `${e.date},${e.hours},${e.note}`).join('\n')
  try {
    await writeFile(path, `date,hours,note\n${body}\n`)
  } catch (error) {
    throw new Error(`could not write ${path}`, { cause: error })
  }
}
