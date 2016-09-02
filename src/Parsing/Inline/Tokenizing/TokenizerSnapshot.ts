import { ConventionContext } from './ConventionContext'
import { InflectionHandler } from './InflectionHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  markupIndex: number
  tokens: Token[]
  openContexts: ConventionContext[]
  inflectionHandlers: InflectionHandler[]
  buffer: string
}
