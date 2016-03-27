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
  return new Tokenizer(text).tokens
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

class Tokenizer {
  public tokens: Token[] = []
  private failureTracker = new FailureTracker()
  private consumer: TextConsumer

  constructor(text: string) {
    this.consumer = new TextConsumer(text)

    MainTokenizerLoop:
    while (true) {

      if (this.consumer.done()) {
        // Should we backtrack, or did everything parse correctly?
        for (let i = 0; i < this.tokens.length; i++) {
          if (isTokenUnmatched(i, this.tokens)) {
            const token = this.tokens[i]

            this.failureTracker.registerFailure(token.meaning, token.textIndex())
            this.consumer = token.consumerBefore
            this.tokens.splice(i)

            continue MainTokenizerLoop
          }
        }

        break
      }

      if (this.tokenizeInlineCode()) {
        continue
      }

      if (this.handleSandwiches()) {
        continue
      }

      // Links
      if (this.handleLink()) {
        continue
      }

      const currentChar = this.consumer.escapedCurrentChar()
      const lastToken = last(this.tokens)

      if (lastToken && (lastToken.meaning === TokenMeaning.Text)) {
        lastToken.value += currentChar
      } else {
        this.tokens.push(new Token(TokenMeaning.Text, currentChar))
      }

      this.consumer.moveNext()
    }
  }

  tokenizeInlineCode(): boolean {
    return this.consumer.consume({
      from: '`',
      upTo: '`',
      then: (rawText) => {
        const code = applyBackslashEscaping(rawText)
        this.tokens.push(new Token(TokenMeaning.InlineCode, code))
      }
    })
  }

  handleSandwiches(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    for (const sandwich of RICH_SANDWICHES) {
      if (isInsideSandwich(sandwich, this.tokens) && this.consumer.consumeIfMatches(sandwich.end)) {
        this.tokens.push(new Token(sandwich.meaningEnd))
        return true
      }

      const sandwichStart = sandwich.start

      const foundStartToken = (
        !this.failureTracker.wasSandwichAlreadyTried(sandwich, textIndex)
        && this.consumer.consumeIfMatches(sandwichStart)
      )

      if (foundStartToken) {
        this.tokens.push(new Token(sandwich.meaningStart, this.consumer.asBeforeMatch(sandwichStart.length)))
        return true
      }
    }
  }

  handleLink(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    if (this.failureTracker.hasFailed(TokenMeaning.LinkStart, textIndex)) {
      return false
    }

    if (!isInsideLink(this.tokens)) {
      // If we're not inside a link, that means we can potentially start one. Let's see whether we should...
      const LINK_START = '['

      if (this.consumer.consumeIfMatches(LINK_START)) {
        this.tokens.push(new Token(TokenMeaning.LinkStart, this.consumer.asBeforeMatch(LINK_START.length)))
        return true
      }

      // ... Nope. We didn't find anything. Since we're not inside a link, let's bail
      return false
    }

    // We're insied a link! Are we looking at the URL arrow?
    if (this.consumer.consumeIfMatches(' -> ')) {
      const didFindLinkEnd = this.consumer.consume({
        upTo: ']',
        then: url => this.tokens.push(new Token(TokenMeaning.LinkUrlAndLinkEnd, applyBackslashEscaping(url)))
      })

      if (!didFindLinkEnd) {
        this.undoLatest(TokenMeaning.LinkStart)
      }

      return true
    }

    // We're not looking at the URL arrow, which means we're still tokenizing link's contents.

    if (this.consumer.consumeIfMatches(']')) {
      // Uh-oh! The link's opening brace was just closed. That means we were looking at regular bracketed text
      // all along. Oops!
      this.undoLatest(TokenMeaning.LinkStart)
      return true
    }


    return false
  }

  undoLatest(meaning: TokenMeaning): void {
    this.backtrack(indexOfLastToken(meaning, this.tokens))
  }

  backtrack(indexOfEarliestTokenToUndo: number): void {
    const token = this.tokens[indexOfEarliestTokenToUndo]

    this.failureTracker.registerFailure(token.meaning, token.textIndex())
    this.consumer = token.consumerBefore
    this.tokens.splice(indexOfEarliestTokenToUndo)
  }
}