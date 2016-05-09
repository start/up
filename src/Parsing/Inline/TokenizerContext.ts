import { TokenizerState } from './TokenizerState'

export interface CloseContext {
  (): boolean
}

export interface CancelContext {
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
  public cancel: CancelContext

  constructor(
    args: {
      state: TokenizerState,
      textIndex: number
      countTokens: number
      plainTextBuffer: string
      mustClose: boolean
      ignoreOuterContexts: boolean
      close: CloseContext
      cancel: CancelContext
    }
  ) {
    const { state, textIndex, countTokens, plainTextBuffer, mustClose, ignoreOuterContexts, close, cancel } = args
    
    this.state = state
    this.textIndex = textIndex
    this.countTokens = countTokens
    this.plainTextBuffer = plainTextBuffer
    this.mustClose = mustClose
    this.ignoreOuterContexts = ignoreOuterContexts
    this.close = close
    this.cancel = cancel
  }
}