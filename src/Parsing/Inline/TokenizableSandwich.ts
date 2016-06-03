import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'
import { startsWith } from '../../Patterns'


export class TokenizableSandwich {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(
    args: {
      goal: TokenizerGoal
      startPattern: string
      endPattern: string
      startTokenKind?: TokenKind
      endTokenKind?: TokenKind
    }
  ) {
    this.goal = args.goal
    this.startPattern = new RegExp(startsWith(args.startPattern), 'i')
    this.endPattern = new RegExp(startsWith(args.endPattern), 'i')
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}
