import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerState } from './TokenizerState'
import { startsWith } from '../Patterns'

export class TokenizableSandwich {
  public state: TokenizerState
  public startPattern: RegExp
  public endPattern: RegExp
  public onOpen: OnTokenizerMatch
  public onClose: OnTokenizerMatch
  public mustClose: boolean

  constructor(args: {
    state: TokenizerState,
    startPattern: string,
    endPattern: string,
    onOpen: OnTokenizerMatch,
    onClose: OnTokenizerMatch
    mustClose?: boolean
  }) {
    this.state = args.state
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.onOpen = args.onOpen
    this.onClose = args.onClose
    this.mustClose = args.mustClose || (args.mustClose == null) 
  }
}