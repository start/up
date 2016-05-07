import { TokenizerState } from './TokenizerState'

export class TokenizerContext {
  constructor(
    public state: TokenizerState,
    public textIndex: number,
    public countTokens: number,
    public collectedUnmatchedText: string) { }
}