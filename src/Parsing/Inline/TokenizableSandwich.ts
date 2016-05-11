import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerState } from './TokenizerState'
import { startsWith } from '../Patterns'
import { defaultTrue } from '../BooleanHelpers'


export class TokenizableSandwich {
  public state: TokenizerState
  public startPattern: RegExp
  public endPattern: RegExp
  public mustClose: boolean
  public onOpen: OnTokenizerMatch
  public onClose: OnTokenizerMatch

  constructor(
    args: {
      state: TokenizerState
      startPattern: string
      endPattern: string
      mustClose?: boolean
      onOpen: OnTokenizerMatch
      onClose: OnTokenizerMatch
    }
  ) {
    this.state = args.state
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.mustClose = defaultTrue(args.mustClose)
    this.onOpen = args.onOpen
    this.onClose = args.onClose
  }
}