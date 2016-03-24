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
    consumer: new TextConsumer(text),
    tokens: []
  })

  const RICH_SANDWICH_TRACKERS = [
    STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
  ].map(sandwich => new RichSandwichTracker(sandwich))

  MainTokenizerLoop:
  while (true) {

    if (state.consumer.done()) {
      const trackerWithEarliestFailure = getTrackerWithEarliestFailure(RICH_SANDWICH_TRACKERS)

      if (true || !trackerWithEarliestFailure) {
        break
      }

      state = trackerWithEarliestFailure.stateBeforeFirstFailure().clone()

      for (const tracker of RICH_SANDWICH_TRACKERS) {
        tracker.reset()
      }
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

    for (const tracker of RICH_SANDWICH_TRACKERS) {
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
  const trackersWithFailures = trackers.filter(tracker => tracker.isAnySandwichOpen())

  if (!trackersWithFailures.length) {
    return null
  }

  return trackersWithFailures.reduce((prev, current) =>
    prev.stateBeforeFirstFailure().index() < current.stateBeforeFirstFailure().index()
      ? prev
      : current
  )
}