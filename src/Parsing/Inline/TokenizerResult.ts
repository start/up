import { Token } from './Tokens/Token'

export class TokenizerResult {
  public failed: boolean
  public lengthAdvanced: number = 0
  public tokens: Token[] = []
}