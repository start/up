import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'
import { startsWith, escapeForRegex } from '../../Patterns'


export class TokenizableBracket {
  goal: TokenizerGoal
  startBracket: string
  endBracket: string
  startPattern: RegExp
  endPattern: RegExp 
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(
    args: {
      goal: TokenizerGoal
      startBracket: string
      endBracket: string
      startTokenKind?: TokenKind
      endTokenKind?: TokenKind
    }
  ) {
    this.goal = args.goal
    this.startBracket = args.startBracket
    this.endBracket = args.endBracket
    this.startPattern = getPattern(args.startBracket)
    this.endPattern = getPattern(args.endBracket)    
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}

function getPattern(bracket: string): RegExp {
  return new RegExp(startsWith(escapeForRegex(bracket)))
}
