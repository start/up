import { QUOTE } from '../RichConventions'
import { TokenRole } from '../TokenRole'
import { Token } from './Token'


// The delimiters of some conventions represent actual content that should be preserved
// in the final document. These conventions are: 
//
// 1. Inline quotes
// 2. Normal parentheticals
// 3. Square parentheticals
export function restoreDelimitersRepresentingActualContent(tokens: Token[]): Token[] {
  const resultTokens: Token[] = []

  for (const token of tokens) {
    const addTextIfTokenIs = (role: TokenRole, text: string): void => {
      if (token.role === role) {
        resultTokens.push(new Token(TokenRole.Text, text))
      }
    }

    addTextIfTokenIs(QUOTE.endTokenRole, '"')

    resultTokens.push(token)

    addTextIfTokenIs(QUOTE.startTokenRole, '"')
  }

  return resultTokens
}