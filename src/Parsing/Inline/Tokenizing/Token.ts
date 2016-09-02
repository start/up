import { TokenKind } from './TokenKind'


export class Token {
  correspondingDelimiter: Token

  constructor(public kind: TokenKind, public value?: string) { }

  // Associates a start token with an end token.
  enclosesContentBetweenItselfAnd(correspondingDelimiter: Token): void {
    this.correspondingDelimiter = correspondingDelimiter
    correspondingDelimiter.correspondingDelimiter = this
  }
}
