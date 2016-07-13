import { TokenKind } from './TokenKind'


export class Token {
  correspondingDelimiter: Token

  constructor(public kind: TokenKind, public value?: string) { }

  get isDelimiter(): boolean {
    return this.correspondingDelimiter != null
  }

  associateWith(other: Token): void {
    this.correspondingDelimiter = other
    other.correspondingDelimiter = this
  }
}
