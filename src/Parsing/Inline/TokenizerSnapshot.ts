import { TokenizerContext } from './TokenizerContext'
import { RaisedVoiceHandlerSnapshot } from './RaisedVoiceHandlerSnapshot'
import { Token } from './Token'


export class TokenizerSnapshot {
  textIndex: number
  tokens: Token[]
  openContexts: TokenizerContext[]
  raisedVoiceHandlerSnapshot: RaisedVoiceHandlerSnapshot
  buffer: string

  constructor(
    args: {
      textIndex: number
      tokens: Token[]
      openContexts: TokenizerContext[]
      raisedVoiceHandlerSnapshot: RaisedVoiceHandlerSnapshot
      buffer: string
    }
  ) {
    this.textIndex = args.textIndex
    this.tokens = args.tokens.slice()
    this.openContexts = args.openContexts.slice()
    this.raisedVoiceHandlerSnapshot = args.raisedVoiceHandlerSnapshot
    this.buffer = args.buffer
  }
}
