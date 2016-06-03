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
    this.startPattern = getPattern(args.startPattern)
    this.endPattern = getPattern(args.endPattern)
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}

function getPattern(pattern: string): RegExp {
  return new RegExp(startsWith(pattern), 'i')
}
