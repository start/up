import { TokenKind } from './TokenKind'
import { NewTokenArgs } from './NewTokenArgs'


export class Token {
  kind: TokenKind
  value: string
  correspondsToToken: Token

  constructor(
    args: NewTokenArgs
  ) {
    this.kind = args.kind
    this.value = args.value
    this.correspondsToToken = args.correspondsToToken
  }
  
  associateWith(other: Token): void {
    this.correspondsToToken = other
    other.correspondsToToken = this
  }
}
