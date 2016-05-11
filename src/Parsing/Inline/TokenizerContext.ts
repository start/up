import { TokenizerState } from './TokenizerState'


export class TokenizerContext {
  public state: TokenizerState
  public textIndex: number
  public countTokens: number
  public openContexts: TokenizerContext[]
  public plainTextBuffer: string
  public mustClose: boolean

  constructor(
    args: {
      state: TokenizerState,
      textIndex: number
      countTokens: number
      openContexts: TokenizerContext[]
      plainTextBuffer: string
      mustClose: boolean
    }
  ) {
    const { state, textIndex, countTokens, openContexts, plainTextBuffer, mustClose } = args
    
    this.state = state
    this.textIndex = textIndex
    this.countTokens = countTokens
    this.openContexts = openContexts.slice()
    this.plainTextBuffer = plainTextBuffer
    this.mustClose = mustClose
  }
}