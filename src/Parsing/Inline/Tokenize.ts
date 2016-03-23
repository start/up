import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { RichSandwich } from './RichSandwich'
import { RichSandwichTracker } from './RichSandwichTracker'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { TokenizerState } from './TokenizerState'
import { applyBackslashEscaping } from '../TextHelpers'
import { STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE } from './RichSandwiches'

export function tokenize(text: string): Token[] {
  const state = new TokenizerState({
    consumer: new TextConsumer(text),
    tokens: [],
    richSandwichTrackers: [
      STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
    ].map(sandwich => new RichSandwichTracker(sandwich))
  })

  MainTokenizerLoop:
  while (!state.consumer.done()) {
    const index = state.consumer.lengthConsumed()

    // Inline code
    if (state.consumer.consume({
      from: '`',
      upTo: '`',
      then: (rawText) => {
        const code = applyBackslashEscaping(rawText)
        state.tokens.push(new Token(TokenMeaning.InlineCode, index, code))
      }
    })) {
      continue
    }

    for (const tracker of state.richSandwichTrackers) {
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
  const resultTokens: Token[] = []
  
  for (const token of tokens) {
    const lastToken = last(resultTokens)

    if (lastToken && (lastToken.meaning === TokenMeaning.Text) && (token.meaning === TokenMeaning.Text)) {
      lastToken.value += token.value
    } else {
      resultTokens.push(token)
    }
  }
  
  return resultTokens
}

