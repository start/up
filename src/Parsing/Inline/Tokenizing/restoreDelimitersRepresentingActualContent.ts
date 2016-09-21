import { NORMAL_PARENTHETICAL, SQUARE_PARENTHETICAL, QUOTE } from '../RichConventions'
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

    addTextIfTokenIs(NORMAL_PARENTHETICAL.endTokenRole, ')')
    addTextIfTokenIs(SQUARE_PARENTHETICAL.endTokenRole, ']')
    addTextIfTokenIs(QUOTE.endTokenRole, '"')

    resultTokens.push(token)

    addTextIfTokenIs(NORMAL_PARENTHETICAL.startTokenRole, '(')
    addTextIfTokenIs(SQUARE_PARENTHETICAL.startTokenRole, '[')
    addTextIfTokenIs(QUOTE.startTokenRole, '"')
  }

  return resultTokens
}