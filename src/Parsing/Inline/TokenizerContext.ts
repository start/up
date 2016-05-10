import { TokenizerState } from './TokenizerState'


export class TokenizerContext {
  public state: TokenizerState
  public textIndex: number
  public countTokens: number
  public plainTextBuffer: string
  public mustClose: boolean
  public ignoreOuterContexts: boolean

  constructor(
    args: {
      state: TokenizerState,
      textIndex: number
      countTokens: number
      plainTextBuffer: string
      mustClose: boolean
      ignoreOuterContexts: boolean
    }
  ) {
    const { state, textIndex, countTokens, plainTextBuffer, mustClose, ignoreOuterContexts } = args
    
    this.state = state
    this.textIndex = textIndex
    this.countTokens = countTokens
    this.plainTextBuffer = plainTextBuffer
    this.mustClose = mustClose
    this.ignoreOuterContexts = ignoreOuterContexts
  }
}