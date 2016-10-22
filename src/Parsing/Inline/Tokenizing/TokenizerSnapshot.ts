import { ConventionContext } from './ConventionContext'
import { ForgivingConventionHandler } from './ForgivingConventionHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  markupIndex: number
  markupIndexWeLastOpenedAConvention: number
  bufferedContent: string
  tokens: Token[]
  openContexts: ConventionContext[]
  forgivingConventionHandlers: ForgivingConventionHandler[]
}
