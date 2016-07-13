import { TokenKind } from './TokenKind'


export class Token {
  correspondingDelimiter: Token

  constructor(public kind: TokenKind, public value?: string) { }

  isTheCorrespondingDelimiterFor(other: Token): void {
    this.correspondingDelimiter = other
    other.correspondingDelimiter = this
  }
}
