import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'
import { startsWith, escapeForRegex } from '../../Patterns'


export class Bracket {
  startPattern: RegExp
  endPattern: RegExp

  constructor(public startBracket: string, public endBracket: string) {
    this.startPattern = getPattern(startBracket)
    this.endPattern = getPattern(endBracket)
  }
}

function getPattern(bracket: string): RegExp {
  return new RegExp(startsWith(escapeForRegex(bracket)))
}
