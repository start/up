import { ParseableToken } from '../ParseableToken'
import { TokenRole } from '../TokenRole'


export class Token implements ParseableToken {
  // TODO: Use separate types for start/end tokens?
  correspondingEnclosingToken?: Token

  constructor(
    public role: TokenRole,
    public value?: string
  ) { }

  // Associates a start token with an end token.
  //
  // This helps us determine when conventions overlap.
  enclosesContentBetweenItselfAnd(correspondingEnclosingToken: Token): void {
    this.correspondingEnclosingToken = correspondingEnclosingToken
    correspondingEnclosingToken.correspondingEnclosingToken = this
  }
}
