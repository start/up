import { ConventionContext } from './ConventionContext'
import { InflectionHandler } from './InflectionHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  markupIndex: number
  bufferedContent: string
  tokens: Token[]
  openContexts: ConventionContext[]
  inflectionHandlers: InflectionHandler[]
}
