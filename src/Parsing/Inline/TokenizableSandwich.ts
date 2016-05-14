import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerState } from './TokenizerState'
import { startsWith } from '../Patterns'


export class TokenizableSandwich {
  state: TokenizerState
  startPattern: RegExp
  endPattern: RegExp
  onOpen: OnTokenizerMatch
  onClose: OnTokenizerMatch

  constructor(
    args: {
      state: TokenizerState
      startPattern: string
      endPattern: string
      onOpen: OnTokenizerMatch
      onClose: OnTokenizerMatch
    }
  ) {
    this.state = args.state
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.onOpen = args.onOpen
    this.onClose = args.onClose
  }
}
