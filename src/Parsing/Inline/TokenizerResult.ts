import { Token } from './Tokens/Token'

export interface TokenizerResult {
  succeeded: boolean
  lengthAdvanced: number 
  tokens: Token[]
}