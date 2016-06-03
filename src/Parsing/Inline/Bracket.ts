import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'
import { escapeForRegex } from '../../Patterns'


export class Bracket {
  startBracketPattern: string
  endBracketPattern: string

  constructor(public startBracket: string, public endBracket: string) {
    this.startBracketPattern = escapeForRegex(startBracket)
    this.endBracketPattern = escapeForRegex(endBracket)
  }
}