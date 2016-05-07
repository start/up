import { TokenizerState } from './TokenizerState'

export class FallibleTokenizerContext {
  constructor(
    public state: TokenizerState,
    public textIndex: number,
    public countTokens: number,
    public plainTextBuffer: string) { }
}