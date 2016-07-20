import { ConventionContext } from './ConventionContext'
import { RaisedVoiceHandler } from './RaisedVoiceHandler'
import { Token } from './Token'


export class TokenizerSnapshot {
  textIndex: number
  tokens: Token[]
  openContexts: ConventionContext[]
  raisedVoiceHandlers: RaisedVoiceHandler[]
  buffer: string

  constructor(
    args: {
      textIndex: number
      tokens: Token[]
      openContexts: ConventionContext[]
      raisedVoiceHandlers: RaisedVoiceHandler[]
      buffer: string
    }
  ) {
    this.textIndex = args.textIndex
    this.tokens = args.tokens.slice()
    this.openContexts = args.openContexts.map(context => context.clone())
    this.raisedVoiceHandlers = args.raisedVoiceHandlers.map(handler => handler.clone())
    this.buffer = args.buffer
  }
}
