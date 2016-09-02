import { ConventionContext } from './ConventionContext'
import { InflectionHandler } from './InflectionHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  markupIndex: number
  textBuffer: string
  tokens: Token[]
  openContexts: ConventionContext[]
  inflectionHandlers: InflectionHandler[]
}
