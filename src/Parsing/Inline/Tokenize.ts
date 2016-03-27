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

          failureTracker.registerFailure(token.meaning, token.textIndex())
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
      if (isInsideSandwich(sandwich, tokens) && consumer.consumeIfMatches(sandwich.end)) {
        tokens.push(new Token(sandwich.meaningEnd))
        continue MainTokenizerLoop
      }

      const sandwichStart = sandwich.start

      const foundStartToken = (
        !failureTracker.wasSandwichAlreadyTried(sandwich, currentIndex)
        && consumer.consumeIfMatches(sandwichStart)
      )

      if (foundStartToken) {
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
        const didFindLinkEnd = consumer.consume({
          upTo: ']',
          then: url => tokens.push(new Token(TokenMeaning.LinkUrlAndLinkEnd, applyBackslashEscaping(url)))
        })

        if (!didFindLinkEnd) {
          const failedLinkIndex = indexOfLastToken(TokenMeaning.LinkStart, tokens)
          const linkStartToken = tokens[failedLinkIndex]
          
          failureTracker.registerFailure(TokenMeaning.LinkStart, linkStartToken.textIndex())
          consumer = linkStartToken.consumerBefore
          tokens.splice(failedLinkIndex)
        }
          
          continue
      }

      if (consumer.consumeIfMatches(']')) {
          const failedLinkIndex = indexOfLastToken(TokenMeaning.LinkStart, tokens)
          const linkStartToken = tokens[failedLinkIndex]
          
          failureTracker.registerFailure(TokenMeaning.LinkStart, linkStartToken.textIndex())
          consumer = linkStartToken.consumerBefore
          tokens.splice(failedLinkIndex)
          
          continue
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

const LINK_CONVENTIONS = [TokenMeaning.LinkStart, TokenMeaning.LinkUrlAndLinkEnd]

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
    case TokenMeaning.LinkUrlAndLinkEnd:
      return false;

    case TokenMeaning.LinkStart:
      return isLinkAtIndexUnClosed(index, tokens)
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

function isLinkAtIndexUnClosed(index: number, tokens: Token[]) {
  return isConventionAtIndexUnclosed(LINK_CONVENTIONS, index, tokens)
}

function isInsideSandwich(sandwich: RichSandwich, tokens: Token[]): boolean {
  return isInsideConvention([sandwich.meaningStart, sandwich.meaningEnd], tokens)
}

function isInsideLink(tokens: Token[]) {
  return isInsideConvention(LINK_CONVENTIONS, tokens)
}

function isInsideConvention(conventionMeanings: TokenMeaning[], tokens: Token[]): boolean {
  // We know the tokens appear in proper order.
  //
  // Because of that, we can assume we are "in the middle of tokenizing" unless all meanings appear
  // an equal number of times.
  const meaningCounts: number[] = new Array(conventionMeanings.length)

  for (let i = 0; i < conventionMeanings.length; i++) {
    meaningCounts[i] = 0
  }

  for (const token of tokens) {
    for (let i = 0; i < conventionMeanings.length; i++) {
      if (token.meaning === conventionMeanings[i]) {
        meaningCounts[i] += 1
        break
      }
    }
  }

  return meaningCounts.some(count => meaningCounts[0] !== count)
}

function isConventionAtIndexUnclosed(conventionMeanings: TokenMeaning[], index: number, tokens: Token[]): boolean {
  const meaningCounts: number[] = new Array(conventionMeanings.length)

  // We haven't seen any of the convention's meanings so far...
  for (let i = 0; i < conventionMeanings.length; i++) {
    meaningCounts[i] = 0
  }

  // Well, actually, we sort of have. We know the the token at `index` will have the convention's first meaning.
  // Let's skip that token, and let's say we've seen the convention's first meaning once.
  const tokenStartIndex = index + 1
  meaningCounts[0] = 1

  for (let tokenIndex = tokenStartIndex; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]

    for (let meaningIndex = 0; meaningIndex < conventionMeanings.length; meaningIndex++) {
      if (token.meaning === conventionMeanings[meaningIndex]) {
        meaningCounts[meaningIndex] += 1
        break
      }
    }

    if (meaningCounts.every(count => count === meaningCounts[0])) {
      // We've seen every token in this convention an equal number of times! That guarantees the one we started
      // with is closed. We don't care if there are unclosed ones later on, so our work here is done.
      return false
    }
  }

  return true
}

function indexOfLastToken(meaning: TokenMeaning, tokens: Token[]): number {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].meaning === meaning) {
      return i
    }
  }
  
  throw new Error('Token not found')
}