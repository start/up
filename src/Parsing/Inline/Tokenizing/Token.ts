import { TokenMeaning } from '../TokenMeaning'
import { ParseableToken } from '../ParseableToken'


export class Token implements ParseableToken {
  correspondingEnclosingToken: Token

  constructor(
    public meaning: TokenMeaning,
    public value?: string) { }

  // Associates a start token with an end token.
  //
  // This helps us determine when conventions overlap.
  enclosesContentBetweenItselfAnd(correspondingEnclosingToken: Token): void {
    this.correspondingEnclosingToken = correspondingEnclosingToken
    correspondingEnclosingToken.correspondingEnclosingToken = this
  }
}
