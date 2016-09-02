import { TokenMeaning } from '../TokenMeaning'


export class Token {
  correspondingDelimiter: Token

  constructor(public kind: TokenMeaning, public value?: string) { }

  // Associates a start token with an end token.
  enclosesContentBetweenItselfAnd(correspondingDelimiter: Token): void {
    this.correspondingDelimiter = correspondingDelimiter
    correspondingDelimiter.correspondingDelimiter = this
  }
}
