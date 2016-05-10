import { MediaTokenType } from './Tokens/MediaToken'

export class TokenizableMedia {
  constructor(
    public localizedTerm: string,
    public TokenType: MediaTokenType) { }
}
