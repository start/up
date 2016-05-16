import { Token } from './Token'

export interface TokenType {
  new(..._: any[]):Token
}
