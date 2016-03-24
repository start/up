import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { RichSandwich } from './RichSandwich'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { TokenizerState } from './TokenizerState'
import { applyBackslashEscaping } from '../TextHelpers'
import { FailureTracker } from './FailureTracker'
import { STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE } from './RichSandwiches'


const RICH_SANDWICHES = [
  STRESS, EMPHASIS, REVISION_DELETION, SPOILER, INLINE_ASIDE
]
  
export function tokenize(text: string): Token[] {
  let state = new TokenizerState({
    consumer: new TextConsumer(text),
    tokens: []
  })
  
  const failureTracker = new FailureTracker()

  MainTokenizerLoop:
  while (!state.consumer.done()) {

    // Inline code
    if (state.consumer.consume({
      from: '`',
      upTo: '`',
      then: (rawText) => {
        const code = applyBackslashEscaping(rawText)
        state.tokens.push(new Token(TokenMeaning.InlineCode, code))
      }
    })) {
      continue
    }

    for (const sandwich of RICH_SANDWICHES) {
      const couldSandwichEndHere = (
        hasAnyOpen(sandwich, state.tokens)
        && state.consumer.consumeIfMatches(sandwich.end)
      )
      
      if (couldSandwichEndHere) {
        state.tokens.push(new Token(sandwich.meaningEnd))
        continue MainTokenizerLoop
      }

      const couldSandwichStartHere = (
        state.consumer.consumeIfMatches(sandwich.start)
      )
       
      if (couldSandwichStartHere) {
        state.tokens.push(new Token(sandwich.meaningStart))
        continue MainTokenizerLoop
      }
    }

    state.tokens.push(new Token(TokenMeaning.Text, state.consumer.escapedCurrentChar()))
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