import { PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION } from './RichConventions'
import { TokenKind } from './TokenKind'
import { Token } from './Token'


// Rich bracket conventions create syntax nodes, just like other conventions. But unlike other conventions,
// their syntax nodes contain their delimiters (brackets) as plain text.
//
// This function adds those plain text brackets. 
export function insertBracketsInsideBracketedConventions(tokens: Token[]): Token[] {
  const resultTokens: Token[] = []

  for (const token of tokens) {
    function addBracketIfTokenIs(bracket: string, kind: TokenKind): void {
      if (token.kind === kind) {
        resultTokens.push(new Token({ kind: TokenKind.PlainText, value: bracket }))
      }
    }

    addBracketIfTokenIs(')', PARENTHESIZED_CONVENTION.endTokenKind)
    addBracketIfTokenIs(']', SQUARE_BRACKETED_CONVENTION.endTokenKind)

    resultTokens.push(token)

    addBracketIfTokenIs('(', PARENTHESIZED_CONVENTION.startTokenKind)
    addBracketIfTokenIs('[', SQUARE_BRACKETED_CONVENTION.startTokenKind)
  }

  return resultTokens
}
