import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { RichSandwich } from './RichSandwich'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { RICH_SANDWICHES } from './RichSandwiches'


export function tokenize(text: string): Token[] {
  let consumer = new TextConsumer(text)
  const tokens: Token[] = []
  const failureTracker = new FailureTracker()

  MainTokenizerLoop:
  while (true) {

    if (consumer.done()) {
      // Should we backtrack, or did everything parse correctly?
      for (let i = 0; i < tokens.length; i++) {
        if (isTokenUnmatched(i, tokens)) {
          const token = tokens[i]

          failureTracker.registerFailure(token.meaning, token.index())
          consumer = token.consumerBefore
          tokens.splice(i)

          continue MainTokenizerLoop
        }
      }

      break
    }

    // Inline code
    if (consumer.consume({
      from: '`', upTo: '`', then: (rawText) => {
        const code = applyBackslashEscaping(rawText)
        tokens.push(new Token(TokenMeaning.InlineCode, code))
      }
    })) {
      continue
    }

    const currentIndex = consumer.lengthConsumed()



    for (const sandwich of RICH_SANDWICHES) {
      if (hasAnyOpen(sandwich, tokens) && consumer.consumeIfMatches(sandwich.end)) {
        tokens.push(new Token(sandwich.meaningEnd))
        continue MainTokenizerLoop
      }

      const sandwichStart = sandwich.start

      const wasStartToken = (
        !failureTracker.wasSandwichAlreadyTried(sandwich, currentIndex)
        && consumer.consumeIfMatches(sandwichStart)
      )

      if (wasStartToken) {
        tokens.push(new Token(sandwich.meaningStart, consumer.asBeforeMatch(sandwichStart.length)))
        continue MainTokenizerLoop
      }
    }

    const currentChar = consumer.escapedCurrentChar()
    const lastToken = last(tokens)

    if (lastToken && (lastToken.meaning === TokenMeaning.Text)) {
      lastToken.value += currentChar
    } else {
      tokens.push(new Token(TokenMeaning.Text, currentChar))
    }

    consumer.moveNext()
  }

  return tokens
}

function isTokenUnmatched(index: number, tokens: Token[]): boolean {
  const token = tokens[index]

  // Text, inline code, and sandwich end tokens cannot be unmatched.
  switch (token.meaning) {
    case TokenMeaning.Text:
    case TokenMeaning.EmphasisEnd:
    case TokenMeaning.InlineAsideEnd:
    case TokenMeaning.InlineCode:
    case TokenMeaning.RevisionDeletionEnd:
    case TokenMeaning.RevisionInsertionEnd:
    case TokenMeaning.SpoilerEnd:
    case TokenMeaning.StressEnd:
      return false;
  }

  // Okay, so this is a sandwich start token. Let's find which sandwich.
  const sandwich =
    RICH_SANDWICHES.filter(sandwich => token.meaning === sandwich.meaningStart)[0]

  if (!sandwich) {
    throw new Error('Unexpected token')
  }

  return isSandwichAtIndexOpen(sandwich, index, tokens)
}

function isSandwichAtIndexOpen(sandwich: RichSandwich, index: number, tokens: Token[]) {
  // We know that token[index] is a sandwich start token, so we'll start checking tokens
  // at index + 1, and we'll start our countOpen at 1
  const startIndex = index + 1
  let countOpen = 1

  for (let i = startIndex; i < tokens.length; i++) {
    const meaning = tokens[i].meaning

    if (meaning === sandwich.meaningStart) {
      countOpen += 1
    } else if (meaning === sandwich.meaningEnd) {
      countOpen -= 1
    }

    // We've closed the current sandwich! We don't care if others might be open.
    if (countOpen === 0) {
      return false
    }
  }

  return true
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

function isParsing(meanings: TokenMeaning[], tokens: Token[]): boolean {
  // We can safely assume the tokens appear in order.
  //
  // Because of that, we actually only need to verify that each token appears 
  // an equal number of times
  const counts: number[] = new Array(meanings.length)


  for (const token of tokens) {
    for (let i = 0; i < meanings.length; i++) {
      if (token.meaning === meanings[i]) {
        counts[i] = (counts[i] || 0) + 1
      }
    }
  }

  return counts.every(count => counts[0] === count)
}