import { ConventionContext } from './ConventionContext'
import { RaisedVoiceHandler } from './RaisedVoiceHandler'
import { Token } from './Token'


export interface TokenizerSnapshot {
  textIndex: number
  tokens: Token[]
  openContexts: ConventionContext[]
  raisedVoiceHandlers: RaisedVoiceHandler[]
  buffer: string
}
