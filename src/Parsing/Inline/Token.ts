import { TokenKind } from './TokenKind'
import { NewTokenArgs } from './NewTokenArgs'

export class Token {
  public kind: TokenKind
  public value: string
  public correspondsTo: Token

  constructor(
    args: NewTokenArgs
  ) {
    this.kind = args.kind
    this.value = args.value
    this.correspondsTo = args.correspondsTo
  }
}