import { TokenKind } from './TokenKind'
import { NewTokenArgs } from './NewTokenArgs'


export class Token {
  public kind: TokenKind
  public value: string
  public correspondsToToken: Token

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
