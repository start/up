import { Token } from './Tokens/Token'

export interface TokenType {
  new(..._: any[]):Token
}
