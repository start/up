import { TokenizerState } from './TokenizerState'

export interface CloseContext {
  (): boolean
}

export interface WhenInsideContext {
  (): void
}

export class TokenizerContext {
  public state: TokenizerState
  public textIndex: number
  public countTokens: number
  public plainTextBuffer: string
  public mustClose: boolean
  public ignoreOuterContexts: boolean
  public whenInside: WhenInsideContext
  public close: CloseContext

  constructor(
    args: {
      state: TokenizerState,
      textIndex: number
      countTokens: number
      plainTextBuffer: string
      mustClose: boolean
      ignoreOuterContexts: boolean
      whenInside: WhenInsideContext
      close: CloseContext
    }
  ) {
    this.state = args.state
    this.textIndex = args.textIndex
    this.countTokens = args.countTokens
    this.plainTextBuffer = args.plainTextBuffer
    this.mustClose = args.mustClose
    this.ignoreOuterContexts = args.ignoreOuterContexts
    this.whenInside = args.whenInside
    this.close = args.close
  }
}