import { TokenizerState } from './TokenizerState'

export class TokenizerContext {
  public mustBeResolved: boolean

  constructor(
    public state: TokenizerState,
    public textIndex: number,
    public countTokens: number,
    public collectedUnmatchedText: string,
    otherArgs?: {
      mustBeResolved?: boolean
    }) {
    this.mustBeResolved = !otherArgs || otherArgs.mustBeResolved
  }
}