import { TokenKind } from './TokenKind'

export class Token {
  constructor(public kind: TokenKind, public value?: string) { } 
}
