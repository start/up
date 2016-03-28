import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { RichSandwich } from './RichSandwich'
import { LINK } from './Link'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { RICH_SANDWICHES } from './RichSandwiches'


export function tokenize(text: string): Token[] {
  return new Tokenizer(text).tokens
}

class Tokenizer {
  public tokens: Token[] = []
  private failureTracker = new FailureTracker()
  private consumer: TextConsumer

  constructor(text: string) {
    this.consumer = new TextConsumer(text)

    while (true) {
      if (this.consumer.done()) {
        if (this.backtrackIfAnyConventionsAreUnclosed()) {
          continue
        }

        break
      }

      const wasAnythingDiscovered = (
        this.handleInlineCode()
        || this.handleSandwiches()
        || this.handleLink()
      )

      if (wasAnythingDiscovered) {
        continue
      }

      this.treatCurrentCharAsPlainText()
      this.consumer.moveNext()
    }
    
    this.rearrangeTokensToProduceTree()
  }
  
  // Conventions can overlap, which makes it painful to produce an abstract syntax tree. This method rearranges
  // the tokens to make that process simpler.
  rearrangeTokensToProduceTree(): void {
    
  }

  backtrackIfAnyConventionsAreUnclosed(): boolean {
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.isTokenStartOfUnclosedConvention(i)) {
        this.backtrack(i)
        return true
      }
    }

    return false
  }

  handleInlineCode(): boolean {
    return this.consumer.consume({
      from: '`',
      upTo: '`',
      then: code => this.addToken(TokenMeaning.InlineCode, applyBackslashEscaping(code))
    })
  }

  handleSandwiches(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    for (const sandwich of RICH_SANDWICHES) {
      if (this.isInsideSandwich(sandwich) && this.consumer.consumeIfMatches(sandwich.end)) {
        this.addToken(sandwich.convention.endTokenMeaning())
        return true
      }

      const foundStartToken = (
        !this.failureTracker.wasSandwichAlreadyTried(sandwich, textIndex)
        && this.consumer.consumeIfMatches(sandwich.start)
      )

      if (foundStartToken) {
        this.addToken(sandwich.convention.startTokenMeaning(), this.consumer.asBeforeMatch(sandwich.start.length))
        return true
      }
    }
    
    return false
  }


  handleLink(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    if (this.failureTracker.hasFailed(TokenMeaning.LinkStart, textIndex)) {
      return false
    }

    if (!this.isInsideLink()) {
      // If we're not inside a link, that means we can potentially start one. Let's see whether we should...
      const LINK_START = '['

      if (this.consumer.consumeIfMatches(LINK_START)) {
        this.addToken(TokenMeaning.LinkStart, this.consumer.asBeforeMatch(LINK_START.length))
        return true
      }

      // ... Nope. We didn't find anything. Since we're not inside a link, let's bail.
      return false
    }

    // We're inside a link! Are we looking at the URL arrow?
    if (this.consumer.consumeIfMatches(' -> ')) {
      // Okay, we found the URL arrow.
      //
      // Now, let's find the closing bracket and finish up.
      const didFindClosingBracket = this.consumer.consume({
        upTo: ']',
        then: url => this.addToken(TokenMeaning.LinkUrlAndLinkEnd, applyBackslashEscaping(url))
      })

      if (!didFindClosingBracket) {
        // No, the closing bracket is nowehere to be found. This wasn't a link. Oops!
        this.undoLatest(TokenMeaning.LinkStart)
      }

      return true
    }

    // We haven't found the URL arrow yet, which means we're still tokenizing the link's contents.
    //
    // If we find a closing brace before finding any URL arrow, that means we're actually looking at regular
    // bracketed text.
    if (this.consumer.consumeIfMatches(']')) {
      this.undoLatest(TokenMeaning.LinkStart)
      return true
    }

    return false
  }

  addToken(meaning: TokenMeaning, valueOrConsumerBefore?: string | TextConsumer): void {
    this.tokens.push(new Token(meaning, valueOrConsumerBefore))
  }

  treatCurrentCharAsPlainText(): void {
    const currentChar = this.consumer.escapedCurrentChar()
    const lastToken = last(this.tokens)

    if (lastToken && (lastToken.meaning === TokenMeaning.PlainText)) {
      lastToken.value += currentChar
    } else {
      this.tokens.push(new Token(TokenMeaning.PlainText, currentChar))
    }
  }

  undoLatest(meaning: TokenMeaning): void {
    this.backtrack(this.indexOfLastTokenWithMeaning(meaning))
  }

  backtrack(indexOfEarliestTokenToUndo: number): void {
    const token = this.tokens[indexOfEarliestTokenToUndo]

    this.failureTracker.registerFailure(token.meaning, token.textIndex())
    this.consumer = token.consumerBefore
    this.tokens.splice(indexOfEarliestTokenToUndo)
  }

  isTokenStartOfUnclosedConvention(index: number): boolean {
    const token = this.tokens[index]
    
    switch (token.meaning) {
      case TokenMeaning.PlainText:
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
        return this.isLinkAtIndexUnClosed(index)
    }

    // Okay, so this is a sandwich start token. Let's find which sandwich.
    const sandwich =
      RICH_SANDWICHES.filter(sandwich => token.meaning === sandwich.convention.startTokenMeaning())[0]

    if (!sandwich) {
      throw new Error('Unexpected token')
    }

    return this.isSandwichAtIndexUnclosed(sandwich, index)
  }


  isSandwichAtIndexUnclosed(sandwich: RichSandwich, index: number) {
    return this.isConventionAtIndexUnclosed(
      [sandwich.convention.startTokenMeaning(), sandwich.convention.endTokenMeaning()],
      index
    )
  }

  isLinkAtIndexUnClosed(index: number) {
    return this.isConventionAtIndexUnclosed(LINK.tokenMeanings, index)
  }

  isInsideSandwich(sandwich: RichSandwich): boolean {
    return this.isInsideConvention([sandwich.convention.startTokenMeaning(), sandwich.convention.endTokenMeaning()])
  }

  isInsideLink() {
    return this.isInsideConvention(LINK.tokenMeanings)
  }

  isInsideConvention(conventionMeanings: TokenMeaning[]): boolean {
    // We know the tokens appear in proper order.
    //
    // Because of that, we can assume we are "in the middle of tokenizing" unless all meanings appear
    // an equal number of times.
    const meaningCounts: number[] = new Array(conventionMeanings.length)

    for (let i = 0; i < conventionMeanings.length; i++) {
      meaningCounts[i] = 0
    }

    for (const token of this.tokens) {
      for (let i = 0; i < conventionMeanings.length; i++) {
        if (token.meaning === conventionMeanings[i]) {
          meaningCounts[i] += 1
          break
        }
      }
    }

    return meaningCounts.some(count => meaningCounts[0] !== count)
  }

  isConventionAtIndexUnclosed(conventionMeanings: TokenMeaning[], index: number): boolean {
    const meaningCounts: number[] = new Array(conventionMeanings.length)

    // We haven't found any of the convention's meanings so far...
    for (let i = 0; i < conventionMeanings.length; i++) {
      meaningCounts[i] = 0
    }

    // Well, actually, we sort of have. We know the the token at `index` will have the convention's first meaning.
    // Let's skip that token, and let's say we've seen the convention's first meaning once.
    const tokenStartIndex = index + 1
    meaningCounts[0] = 1

    for (let tokenIndex = tokenStartIndex; tokenIndex < this.tokens.length; tokenIndex++) {
      const token = this.tokens[tokenIndex]

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

  indexOfLastTokenWithMeaning(meaning: TokenMeaning): number {
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      if (this.tokens[i].meaning === meaning) {
        return i
      }
    }

    throw new Error('Token not found')
  }
}