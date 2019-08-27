import { ConventionContext } from './ConventionContext'
import { ForgivingConventionHandler } from './ForgivingConventions/ForgivingConventionHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  markupIndex: number
  markupIndexThatLastOpenedAConvention?: number
  bufferedContent: string
  tokens: Token[]
  openContexts: ConventionContext[]
  forgivingConventionHandlers: ForgivingConventionHandler[]
}
