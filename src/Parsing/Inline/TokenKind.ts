import { Token } from './Tokens/Token'

export interface TokenKind {
  new(..._: any[]):Token
}
