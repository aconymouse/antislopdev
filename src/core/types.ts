export type Level = 'block' | 'justify' | 'warn'
export type CheckKind = 'static' | 'heuristic' | 'review'

export interface RuleMeta {
  id: string
  title: string
  detail: string
  level: Level
  check: CheckKind
}

export type FileKind = 'markup' | 'jsx' | 'style' | 'script' | 'prose' | 'commit' | 'manifest' | 'config'

export interface SourceInput {
  path: string
  text: string
  kind?: FileKind
}

export interface Hit {
  index: number
  length?: number
  note?: string
}

export interface Finding {
  rule: string
  level: Level
  title: string
  note?: string
  path: string
  line: number
  column: number
  excerpt: string
  escalated?: boolean
  allowed?: string
}

export interface Report {
  findings: Finding[]
  files: number
  failed: boolean
  counts: Record<Level, number>
  allowed: number
}

export interface CheckOptions {
  disable?: readonly string[]
  only?: readonly string[]
}
