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
      if (areAnyOpen(sandwich, tokens) && consumer.consumeIfMatches(sandwich.end)) {
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

    // Links
    if (!isInsideLink(tokens)) {
      const LINK_START = '['

      if (consumer.consumeIfMatches(LINK_START)) {
        tokens.push(new Token(TokenMeaning.LinkStart, consumer.asBeforeMatch(LINK_START.length)))
        continue
      }
    } else {
      if (consumer.consumeIfMatches(' -> ')) {
        const didFindEnd = consumer.consume({
          upTo: ']',
          then: url => tokens.push(new Token(TokenMeaning.LinkUrlAndEnd, applyBackslashEscaping(url)))
        })

        if (didFindEnd) {
          continue
        } else {
          throw Error('TODO: Fail link because it lacks a closing bracket')
        }
      }

      if (consumer.consumeIfMatches(']')) {
        throw Error('TODO: Fail link because it is simply bracketed text')
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
    case TokenMeaning.LinkUrlAndEnd:
      return false;

    case TokenMeaning.LinkStart:

  }

  // Okay, so this is a sandwich start token. Let's find which sandwich.
  const sandwich =
    RICH_SANDWICHES.filter(sandwich => token.meaning === sandwich.meaningStart)[0]

  if (!sandwich) {
    throw new Error('Unexpected token')
  }

  return isSandwichAtIndexUnclosed(sandwich, index, tokens)
}

function isSandwichAtIndexUnclosed(sandwich: RichSandwich, index: number, tokens: Token[]) {
  return isConventionAtIndexUnclosed([sandwich.meaningStart, sandwich.meaningEnd], index, tokens)
}

function areAnyOpen(sandwich: RichSandwich, tokens: Token[]): boolean {
  return isInside([sandwich.meaningStart, sandwich.meaningEnd], tokens)
}

function isInsideLink(tokens: Token[]) {
  return isInside(
    [TokenMeaning.LinkStart, TokenMeaning.LinkUrlAndEnd],
    tokens
  )
}

function isInside(meanings: TokenMeaning[], tokens: Token[]): boolean {
  // We can safely assume the tokens appear in proper order.
  //
  // Because of that, we know that we are "in the middle of tokenizing" unless all meanings appear
  // an equal number of times.
  const meaningCounts: number[] = new Array(meanings.length)

  for (const token of tokens) {
    for (let i = 0; i < meanings.length; i++) {
      meaningCounts[i] = meaningCounts[i] || 0

      if (token.meaning === meanings[i]) {
        meaningCounts[i] += 1
        break
      }
    }
  }

  return meaningCounts.some(count => meaningCounts[0] !== count)
}

function isConventionAtIndexUnclosed(conventionMeanings: TokenMeaning[], index: number, tokens: Token[]): boolean {
  const meaningCounts: number[] = new Array(conventionMeanings.length)
  
  for (let i = 0; i < conventionMeanings.length; i++) {
    meaningCounts[i] =  0
  }

  for (let tokenIndex = index; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    
    for (let meaningIndex = 0; meaningIndex < conventionMeanings.length; meaningIndex++) {
      if (token.meaning === conventionMeanings[meaningIndex]) {
        meaningCounts[meaningIndex] += 1
        break
      }
    }
    
    if (meaningCounts.every(count => count === meaningCounts[0])) {
      return false
    }
  }

  return true
}