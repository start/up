import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Sandwich } from './Sandwich'
import { SandwichTracker } from './SandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { STRESS, EMPHASIS, REVISION_DELETION } from './Sandwiches'

export function tokenize(text: string): Token[] {
  const consumer = new TextConsumer(text)
  const tokens: Token[] = []
  
  const SANDWICHES_TRACKERS = [
    STRESS, EMPHASIS, REVISION_DELETION
  ].map(sandwich => new SandwichTracker(sandwich))
  
  let isInlineCode = false

  MainTokenizerLoop:
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
    
    for (const tracker of SANDWICHES_TRACKERS) {
      if (consumer.consumeIfMatches(tracker.sandwich.bun)) {
        const meaning = tracker.registerBunAndGetMeaning(index)
        tokens.push(new Token(meaning, index))
        continue MainTokenizerLoop
      }
    }
    
    // Spoiler
    if (consumer.consumeIfMatches('[<_<]')) {
      tokens.push(new Token(TokenMeaning.SpoilerStart, index))
      continue
    }
    
    if (consumer.consumeIfMatches('[>_>]')) {
      tokens.push(new Token(TokenMeaning.SpoilerEnd, index))
      continue
    }
    
    // Inline aside
    if (consumer.consumeIfMatches('((')) {
      tokens.push(new Token(TokenMeaning.InlineAsideStart, index))
      continue
    }
    
    if (consumer.consumeIfMatches('))')) {
      tokens.push(new Token(TokenMeaning.InlineAsideEnd, index))
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

