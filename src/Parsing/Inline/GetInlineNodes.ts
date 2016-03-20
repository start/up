import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'

enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd
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

  while (!consumer.done()) {
    const index = consumer.lengthConsumed()

    tokens.push(new Token(TokenMeaning.Text, index, consumer.escapedCurrentChar()))

    consumer.moveNext()
  }

  return withMergedConsecutiveTextTokens(tokens)
}

function withMergedConsecutiveTextTokens(tokens: Token[]): Token[] {
  return tokens.reduce((cleaned, current) => {
    const lastToken = last(cleaned)

    if (lastToken && (lastToken.meaning === TokenMeaning.Text) && (current.meaning === TokenMeaning.Text)) {
      lastToken.value += current.value
      return cleaned
    }

    return cleaned.concat([current])
  }, [])
}


function parse(tokens: Token[]): InlineSyntaxNode[] {
  const nodes: InlineSyntaxNode[] = []

  for (const token of tokens) {
    switch (token.meaning) {
      case TokenMeaning.Text:
        nodes.push(new PlainTextNode(token.value))
        continue

      default:
        throw new Error('Unexpected token type')
    }
  }

  return nodes
}
