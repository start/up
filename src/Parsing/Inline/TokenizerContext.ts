import { TokenizerState } from './TokenizerState'

export interface CloseContext {
  (): boolean
}

export class TokenizerContext {
  constructor(
    public state: TokenizerState,
    public textIndex: number,
    public countTokens: number,
    public plainTextBuffer: string,
    public mustClose: boolean,
    public close: () => boolean
  ) { }
}