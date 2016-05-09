import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerState } from './TokenizerState'
import { startsWith } from '../Patterns'
import { defaultTrue } from '../BooleanHelpers'
import { WhenInsideContext } from './TokenizerContext'

export class TokenizableSandwich {
  public state: TokenizerState
  public startPattern: RegExp
  public endPattern: RegExp
  public mustClose: boolean
  public ignoreOuterContexts: boolean
  public onOpen: OnTokenizerMatch
  public whenInside: WhenInsideContext
  public onClose: OnTokenizerMatch

  constructor(args: {
    state: TokenizerState
    startPattern: string
    endPattern: string
    mustClose?: boolean
    ignoreOuterContexts?: boolean
    onOpen: OnTokenizerMatch
    whenInside?: WhenInsideContext
    onClose: OnTokenizerMatch
  }) {
    this.state = args.state
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.mustClose = defaultTrue(args.mustClose)
    this.ignoreOuterContexts = args.ignoreOuterContexts
    this.onOpen = args.onOpen
    this.whenInside = args.whenInside || (() => {})
    this.onClose = args.onClose
  }
}