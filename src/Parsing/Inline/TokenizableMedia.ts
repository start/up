import { MediaConvention } from './MediaConvention'
import { TokenKind } from './TokenKind'
import { escapeForRegex, getRegExpStartingWith, atLeast, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../../Patterns'
import { TokenizerGoal } from './TokenizerGoal'


export class TokenizableMedia {
  startTokenKind: TokenKind
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp

  constructor(
    media: MediaConvention,
    localizedTerm: string
  ) {
    this.startTokenKind = media.startTokenKind
    this.goal = media.goal
    
    this.startPattern = getRegExpStartingWith(
      escapeForRegex('[' + localizedTerm + ':') + ANY_WHITESPACE,
      'i')

    this.endPattern = getRegExpStartingWith(
      escapeForRegex(']'))
  }
}