import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Sandwich } from './Sandwich'
import { SandwichTracker } from './SandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { TokenizerState } from './TokenizerState'
import { STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE } from './Sandwiches'

export function tokenize(text: string): Token[] {
  const state = new TokenizerState({
    consumer: new TextConsumer(text),
    tokens: [],
    isInlineCode: false,
    sandwichTrackers: [
      STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
    ].map(sandwich => new SandwichTracker(sandwich))
  })

  MainTokenizerLoop:
  while (!state.consumer.done()) {
    const index = state.consumer.lengthConsumed()

    // Inline code
    if (state.consumer.consumeIfMatches('`')) {
      const meaning = (
        state.isInlineCode
          ? TokenMeaning.InlineCodeEnd
          : TokenMeaning.InlineCodeStart
      )

      state.tokens.push(new Token(meaning, index))
      state.isInlineCode = !state.isInlineCode
      continue
    }

    if (state.isInlineCode) {
      state.tokens.push(new Token(TokenMeaning.Text, index, state.consumer.escapedCurrentChar()))
      state.consumer.moveNext()
      continue
    }

    for (const tracker of state.sandwichTrackers) {
      if (tracker.hasAnyOpen() && state.consumer.consumeIfMatches(tracker.sandwich.end)) {
        state.tokens.push(new Token(tracker.sandwich.meaningEnd, index))
        tracker.registerEnd()
        continue MainTokenizerLoop
      }

      if (state.consumer.consumeIfMatches(tracker.sandwich.start)) {
        state.tokens.push(new Token(tracker.sandwich.meaningStart, index))
        tracker.registerStart(index)
        continue MainTokenizerLoop
      }
    }

    state.tokens.push(new Token(TokenMeaning.Text, index, state.consumer.escapedCurrentChar()))
    state.consumer.moveNext()
  }

  return mergeConsecutiveTextTokens(state.tokens)
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

