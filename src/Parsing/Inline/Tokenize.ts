import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'


export function tokenize(text: string): Token[] {
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

