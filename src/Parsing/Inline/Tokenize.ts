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
  let state = new TokenizerState({
    consumer: new TextConsumer(text).clone(),
    tokens: [],
    richSandwichTrackers: [
      STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
    ].map(sandwich => new RichSandwichTracker(sandwich))
  })

  MainTokenizerLoop:
  while (true) {
    let failedSandwiches: TokenMeaning[] = []
    
    if (state.consumer.done()) {
      const trackersWithFailedSandwiches =
        state.richSandwichTrackers.filter((tracker) => tracker.isAnySandwichOpen())

      if (!trackersWithFailedSandwiches.length) {
        break
      }

      const trackerWithEarliestFailure =
        getTrackerWithEarliestFailure(trackersWithFailedSandwiches)
      
      state = trackerWithEarliestFailure.stateBeforeFirstIncompleteSandwich()
      failedSandwiches.push(trackerWithEarliestFailure.sandwich.meaningStart)
    }

    const indexBeforeToken = state.index()

    // Inline code
    if (state.consumer.consume({
      from: '`',
      upTo: '`',
      then: (rawText) => {
        const code = applyBackslashEscaping(rawText)
        state.tokens.push(new Token(TokenMeaning.InlineCode, indexBeforeToken, code))
      }
    })) {
      continue
    }
    
    const potentialSandwichTrackers =
      state.richSandwichTrackers.filter(
        tracker => !failedSandwiches.some(failure => failure === tracker.sandwich.meaningStart))

    for (const tracker of potentialSandwichTrackers) {
      if (tracker.isAnySandwichOpen() && state.consumer.consumeIfMatches(tracker.sandwich.end)) {
        state.tokens.push(new Token(tracker.sandwich.meaningEnd, indexBeforeToken))
        tracker.registerCompleteSandwich()
        continue MainTokenizerLoop
      }

      if (state.consumer.consumeIfMatches(tracker.sandwich.start)) {
        state.tokens.push(new Token(tracker.sandwich.meaningStart, indexBeforeToken))
        tracker.registerPotentialSandwich(state)
        continue MainTokenizerLoop
      }
    }

    state.tokens.push(new Token(TokenMeaning.Text, indexBeforeToken, state.consumer.escapedCurrentChar()))
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

function getTrackerWithEarliestFailure(trackers: RichSandwichTracker[]): RichSandwichTracker {
  return trackers.reduce((prev, current) =>
    prev.stateBeforeFirstIncompleteSandwich().index() < current.stateBeforeFirstIncompleteSandwich().index()
      ? prev
      : current
  )
}