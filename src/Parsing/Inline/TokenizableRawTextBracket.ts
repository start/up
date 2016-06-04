import { TokenizerGoal } from './TokenizerGoal'
import { Bracket } from './Bracket'
import { startsWith } from '../../Patterns'

export class TokenizableRawTextBracket {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp

  constructor(args: { goal: TokenizerGoal, bracket: Bracket }) {
    this.goal = args.goal
    this.startPattern = getPattern(args.bracket.startPattern)
    this.endPattern = getPattern(args.bracket.endPattern)
  }
}

function getPattern(bracketPattern: string): RegExp {
  return new RegExp(startsWith(bracketPattern))
}
