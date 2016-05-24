import { OnTokenizerMatch } from './OnTokenizerMatch'
import { TokenizerGoal } from './TokenizerGoal'
import { startsWith } from '../Patterns'


export class TokenizableSandwich {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp
  onOpen: OnTokenizerMatch
  onClose: OnTokenizerMatch

  constructor(
    args: {
      goal: TokenizerGoal
      startPattern: string
      endPattern: string
      onOpen: OnTokenizerMatch
      onClose: OnTokenizerMatch
    }
  ) {
    this.goal = args.goal
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.onOpen = args.onOpen
    this.onClose = args.onClose
  }
}
