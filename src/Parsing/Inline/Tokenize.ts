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
import { FailureTracker } from './FailureTracker'
import { STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE } from './RichSandwiches'

export function tokenize(text: string): Token[] {
  let state = new TokenizerState({
    consumer: new TextConsumer(text),
    tokens: []
  })

  const RICH_SANDWICH_TRACKERS = [
    STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
  ].map(sandwich => new RichSandwichTracker(sandwich))
  
  const failureTracker = new FailureTracker()

  MainTokenizerLoop:
  while (true) {

    if (state.consumer.done()) {
      const trackerWithEarliestFailure = getTrackerWithEarliestFailure(RICH_SANDWICH_TRACKERS)

      if (!trackerWithEarliestFailure) {
        break
      }
      
      failureTracker.registerSandwichTrackerFailure(trackerWithEarliestFailure)

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
      const couldSandwichEndHere = (
        hasAnyOpen(tracker.sandwich, state.tokens)
        && state.consumer.consumeIfMatches(tracker.sandwich.end)
      )
      
      if (couldSandwichEndHere) {
        state.tokens.push(new Token(tracker.sandwich.meaningEnd, indexBeforeToken))
        tracker.registerCompleteSandwich()
        continue MainTokenizerLoop
      }

      const couldSandwichStartHere = (
        !failureTracker.wasSandwichAlreadyTried(tracker.sandwich, indexBeforeToken)
        && state.consumer.consumeIfMatches(tracker.sandwich.start)
      )
       
      if (couldSandwichStartHere) {
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

function hasAnyOpen(sandwich: RichSandwich, tokens: Token[]): boolean {
  let countOpen = 0
  
  // We can safely assume the tokens are in order. We don't need to worry about an end token
  // appearing before a start token.
  for (const token of tokens) {
    const meaning = token.meaning
    
    if (meaning === sandwich.meaningStart) {
      countOpen += 1
    } else if (meaning === sandwich.meaningEnd) {
      countOpen -= 1
    }
  }
  
  return countOpen > 0
}