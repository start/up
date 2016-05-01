import { Token } from './Tokens/Token'

export interface TokenizerResult {
  failed: boolean
  lengthAdvanced: number 
  tokens: Token[]
}