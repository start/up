import { MediaConvention } from './MediaConvention'
import { TokenType } from './Tokens/TokenType'
import { escapeForRegex, startsWith, atLeast, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../Patterns'
import { TokenizerGoal } from './TokenizerGoal'


export class TokenizableMedia {
  StartTokenType: TokenType
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp

  constructor(
    media: MediaConvention,
    localizedTerm: string
  ) {
    this.StartTokenType = media.StartTokenType
    this.goal = media.goal
    
    this.startPattern = getPattern(
      escapeForRegex('[' + localizedTerm + ':') + ANY_WHITESPACE,
      'i')

    this.endPattern = getPattern(
      escapeForRegex(']'))
  }
}

function getPattern(pattern: string, flags?: string): RegExp {
  return new RegExp(startsWith(pattern), flags)
}
