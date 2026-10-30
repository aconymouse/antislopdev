import type { FileKind, Hit } from './types.js'
import type { Source } from './source.js'

export interface Rule {
  id: string
  on: readonly FileKind[]
  run(src: Source): Hit[]
}

export interface ProjectHit {
  source: Source
  hit: Hit
}

export interface ProjectRule {
  id: string
  run(sources: readonly Source[]): ProjectHit[]
}

export const markup: readonly FileKind[] = ['markup', 'jsx']
export const styled: readonly FileKind[] = ['markup', 'jsx', 'style']
export const written: readonly FileKind[] = ['markup', 'jsx', 'prose', 'config']
export const coded: readonly FileKind[] = ['script', 'jsx', 'markup', 'style']
