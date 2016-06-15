import { ConventionContextSnapshot } from './ConventionContextSnapshot'
import { RaisedVoiceHandlerSnapshot } from './RaisedVoiceHandlerSnapshot'
import { Token } from './Token'


export class TokenizerSnapshot {
  textIndex: number
  tokens: Token[]
  conventionContextSnapshots: ConventionContextSnapshot[]
  raisedVoiceHandlerSnapshots: RaisedVoiceHandlerSnapshot[]
  buffer: string

  constructor(
    args: {
      textIndex: number
      tokens: Token[]
      conventionContextSnapshots: ConventionContextSnapshot[]
      raisedVoiceHandlerSnapshots: RaisedVoiceHandlerSnapshot[]
      buffer: string
    }
  ) {
    this.textIndex = args.textIndex
    this.tokens = args.tokens.slice()
    this.conventionContextSnapshots = args.conventionContextSnapshots
    this.raisedVoiceHandlerSnapshots = args.raisedVoiceHandlerSnapshots
    this.buffer = args.buffer
  }
}
