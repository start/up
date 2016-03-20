import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { tokenize } from './Tokenize'


export class ParseResult {
  constructor(public nodes: InlineSyntaxNode[], public countTokensParsed: number) { }
}


export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}


function parseUntil(tokens: Token[], terminator?: TokenMeaning): ParseResult {
  const nodes: InlineSyntaxNode[] = []
  let stillNeedsTerminator = !!terminator
  let countParsed = 0

  ParserLoop:
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    countParsed = index + 1

    switch (token.meaning) {
      case TokenMeaning.Text:
        nodes.push(new PlainTextNode(token.value))
        continue

      case TokenMeaning.EmphasisStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.EmphasisEnd)
        nodes.push(new EmphasisNode(result.nodes))
        index += result.countTokensParsed
        continue
      }

      case TokenMeaning.EmphasisEnd:
        stillNeedsTerminator = false
        break ParserLoop

      default:
        throw new Error('Unexpected token type')
    }
  }

  if (stillNeedsTerminator) {
    throw new Error('Missing token')
  }

  return new ParseResult(nodes, countParsed)
}