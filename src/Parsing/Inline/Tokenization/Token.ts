import { TokenKind } from './TokenKind'


export class Token {
  correspondingDelimiter: Token

  constructor(public kind: TokenKind, public value?: string) { }

  associateWith(other: Token): void {
    this.correspondingDelimiter = other
    other.correspondingDelimiter = this
  }
}
