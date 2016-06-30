import { TokenKind } from './TokenKind'


export class Token {
  correspondsToToken: Token

  constructor(public kind: TokenKind, public value?: string) { }

  associateWith(other: Token): void {
    this.correspondsToToken = other
    other.correspondsToToken = this
  }
}
