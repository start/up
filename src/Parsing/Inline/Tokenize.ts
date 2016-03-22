import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Sandwich } from './Sandwich'
import { SandwichTracker } from './SandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE } from './Sandwiches'

export function tokenize(text: string): Token[] {
  const consumer = new TextConsumer(text)
  const tokens: Token[] = []

  const SANDWICH_TRACKERS = [
    STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
  ].map(russianDoll => new SandwichTracker(russianDoll))

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
    
    for (const tracker of SANDWICH_TRACKERS) {
      if (tracker.hasAnyOpen() && consumer.consumeIfMatches(tracker.sandwich.end)) {
        tokens.push(new Token(tracker.sandwich.meaningEnd, index))
        tracker.registerEnd()
        continue MainTokenizerLoop
      }
      
      if (consumer.consumeIfMatches(tracker.sandwich.start)) {
        tokens.push(new Token(tracker.sandwich.meaningStart, index))
        tracker.registerStart(index)
        continue MainTokenizerLoop
      }
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

