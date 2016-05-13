import { MediaTokenType } from './Tokens/MediaToken'
import { escapeForRegex, startsWith, atLeast, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../Patterns'
import { TokenizerState } from './TokenizerState'


export class TokenizableMedia {
  public startPattern: RegExp
  public endPattern: RegExp

  constructor(
    public TokenType: MediaTokenType,
    public state: TokenizerState,
    localizedTerm: string
  ) {
    this.startPattern = new RegExp(
      startsWith(
        escapeForRegex('[' + localizedTerm + ':') + ANY_WHITESPACE))

    this.endPattern = new RegExp(
      startsWith(
        escapeForRegex(']')))
  }
}
