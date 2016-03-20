import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'

enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
}


class Token {
  constructor(public meaning: TokenMeaning, public index: number, public value: string) { }
}


export function getInlineNodes(text: string): InlineSyntaxNode[] {
  return parse(tokenize(text))
}


function tokenize(text: string): Token[] {
  const consumer = new TextConsumer(text)
  const tokens: Token[] = []

  let isEmphasized = false

  while (!consumer.done()) {
    const index = consumer.lengthConsumed()

    if (consumer.consumeIfMatches('*')) {
      const meaning = (
        isEmphasized
          ? TokenMeaning.EmphasisEnd
          : TokenMeaning.EmphasisStart
      )

      tokens.push(new Token(meaning, index, consumer.escapedCurrentChar()))
      isEmphasized = !isEmphasized
    }

    tokens.push(new Token(TokenMeaning.Text, index, consumer.escapedCurrentChar()))

    consumer.moveNext()
  }

  return mergeConsecutiveTextTokens(tokens)
}


function mergeConsecutiveTextTokens(tokens: Token[]): Token[] {
  return tokens.reduce((withMergeTokens, token) => {
    const lastToken = last(withMergeTokens)

    if (lastToken && (lastToken.meaning === TokenMeaning.Text) && (token.meaning === TokenMeaning.Text)) {
      lastToken.value += token.value
      return withMergeTokens
    }

    return withMergeTokens.concat([token])
  }, [])
}


function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}


class ParseResult {
  constructor(public nodes: InlineSyntaxNode[], public countTokensParsed: number) { }
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