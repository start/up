import { PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION } from '../RichConventions'
import { TokenKind } from './TokenKind'
import { Token } from './Token'


// The parenthesized and square bracketed conventions create syntax nodes, just like other rich
// conventions. But unlike other rich conventions, rich bracketed conventions' syntax nodes contain
// their delimiters (brackets) as plain text.
//
// This function adds those plain text brackets.
//
// Why don't we just add the plain text brackets while we're tokenizing those conventions? Because
// this makes tokenizing links much easier. Links always start out a either:
//
//  1. Parenthesized text
//  2. Square bracketed text
//  3. An action (curly bracketed text)
//
//  We replace the tokens surrounding the first convention if it's followed by a bracketed URL.
//
//  If we added the plain text brackets during tokenization, we need to either:
//    
//  1. Hold off adding the plain text brackets for parenthesized and square bracketed text until we
//     knew we weren't followed by a bracketed URL
//  2. Remove the appropriate type of brackets from within parenthesized and square bracketed text
//     after finding a bracketed URL
export function insertPlainTextBracketsInsideBracketedConventions(tokens: Token[]): Token[] {
  const resultTokens: Token[] = []

  for (const token of tokens) {
    function addBracketIfTokenIs(kind: TokenKind, bracket: string): void {
      if (token.kind === kind) {
        resultTokens.push(new Token(TokenKind.PlainText, bracket))
      }
    }

    addBracketIfTokenIs(PARENTHESIZED_CONVENTION.endTokenKind, ')')
    addBracketIfTokenIs(SQUARE_BRACKETED_CONVENTION.endTokenKind, ']')

    resultTokens.push(token)

    addBracketIfTokenIs(PARENTHESIZED_CONVENTION.startTokenKind, '(')
    addBracketIfTokenIs(SQUARE_BRACKETED_CONVENTION.startTokenKind, '[')
  }

  return resultTokens
}
