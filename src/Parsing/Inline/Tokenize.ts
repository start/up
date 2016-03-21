import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Sandwich } from './Sandwich'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'


export function tokenize(text: string): Token[] {
  const consumer = new TextConsumer(text)
  const tokens: Token[] = []
  
  let isStressed = false
  let isEmphasized = false
  let isRevisionDeleted = false
  let isInlineCode = false

  while (!consumer.done()) {
    const index = consumer.lengthConsumed()
    

    // Inline code
    if (consumer.consumeIfMatches('`')) {
      const meaning = (
        isInlineCode
          ? TokenMeaning.InlineCodeEnd
          : TokenMeaning.InlineCodeStart
      )

      tokens.push(new Token(meaning, index))
      isInlineCode = !isInlineCode
      continue
    }
    
    if (isInlineCode) {
      tokens.push(new Token(TokenMeaning.Text, index, consumer.escapedCurrentChar()))
      consumer.moveNext()
      continue
    }

    // Stress
    if (consumer.consumeIfMatches('**')) {
      const meaning = (
        isStressed
          ? TokenMeaning.StressEnd
          : TokenMeaning.StressStart
      )

      tokens.push(new Token(meaning, index))
      isStressed = !isStressed
      continue
    }
    
    // Emphasis
    if (consumer.consumeIfMatches('*')) {
      const meaning = (
        isEmphasized
          ? TokenMeaning.EmphasisEnd
          : TokenMeaning.EmphasisStart
      )

      tokens.push(new Token(meaning, index))
      isEmphasized = !isEmphasized
      continue
    }
    
    // Revision deletion
    if (consumer.consumeIfMatches('~~')) {
      const meaning = (
        isRevisionDeleted
          ? TokenMeaning.RevisionDeletionEnd
          : TokenMeaning.RevisionDeletionStart
      )

      tokens.push(new Token(meaning, index))
      isRevisionDeleted = !isRevisionDeleted
      continue
    }
    
    if (consumer.consumeIfMatches('[<_<]')) {
      tokens.push(new Token(TokenMeaning.SpoilerStart, index))
      continue
    }
    
    if (consumer.consumeIfMatches('[>_>]')) {
      tokens.push(new Token(TokenMeaning.SpoilerEnd, index))
      continue
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

