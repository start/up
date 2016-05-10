import { MediaTokenType } from './Tokens/MediaToken'
import { escapeForRegex } from '../TextHelpers'
import { startsWith, atLeast, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../Patterns'


export class TokenizableMedia {
  public startPattern: RegExp
  public endPattern: RegExp

  constructor(localizedTerm: string, public TokenType: MediaTokenType) {
    this.startPattern = new RegExp(
      startsWith(
        escapeForRegex('[' + localizedTerm + ':') + ANY_WHITESPACE))
        
    this.endPattern = new RegExp(
      startsWith(
        escapeForRegex(']')))
  }
}
