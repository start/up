import { TokenizerState } from './TokenizerState'

export interface CloseContext {
  (): boolean
}

export class TokenizerContext {
  public state: TokenizerState
  public textIndex: number
  public countTokens: number
  public plainTextBuffer: string
  public mustClose: boolean
  public ignoreOuterContexts: boolean
  public close: CloseContext

  constructor(
    args: {
      state: TokenizerState,
      textIndex: number
      countTokens: number
      plainTextBuffer: string
      mustClose: boolean
      ignoreOuterContexts: boolean
      close: CloseContext
    }
  ) {
    this.state = args.state
    this.textIndex = args.textIndex
    this.countTokens = args.countTokens
    this.plainTextBuffer = args.plainTextBuffer
    this.mustClose = args.mustClose
    this.ignoreOuterContexts = args.ignoreOuterContexts
    this.close = args.close
  }
}