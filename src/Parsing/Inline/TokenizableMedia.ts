import { MediaConvention } from './MediaConvention'
import { MediaTokenType } from './Tokens/MediaToken'
import { escapeForRegex, startsWith, atLeast, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../Patterns'
import { TokenizerGoal } from './TokenizerGoal'


export class TokenizableMedia {
  TokenType: MediaTokenType
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp

  constructor(
    media: MediaConvention,
    localizedTerm: string
  ) {
    this.TokenType = media.TokenType
    this.goal = media.state
    
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
