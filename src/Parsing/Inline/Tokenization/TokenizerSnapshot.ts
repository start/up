import { ConventionContext } from './ConventionContext'
import { RaisedVoiceHandler } from './RaisedVoiceHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  markupIndex: number
  tokens: Token[]
  openContexts: ConventionContext[]
  raisedVoiceHandlers: RaisedVoiceHandler[]
  buffer: string
}
