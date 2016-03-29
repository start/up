import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { Sandwich } from './Sandwich'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { SANDWICHES } from './Sandwiches'


export function tokenize(text: string): Token[] {
  return new Tokenizer(text).tokens
}

const LINK = new Convention(TokenMeaning.LinkStart, TokenMeaning.LinkUrlAndLinkEnd)

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

    this.massageTokensIntoTreeStructure()
  }

  // Conventions can overlap, which makes it painful to produce an abstract syntax tree. This method rearranges
  // and adds tokens to make that process simpler.
  //
  // Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent Links,
  // however, must not be split into multiple pieces, which means any convention that overlaps with a link must
  // be split instead.
  massageTokensIntoTreeStructure(): void {
    const openConventions: Convention[] = []

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]

      switch (token.meaning) {
        case TokenMeaning.LinkStart:
          // TODO
          continue
          
        case TokenMeaning.LinkUrlAndLinkEnd:
          // TODO
          continue
      }

      const sandwichStartedByThisToken = getSandwichStartedByThisToken(token)

      if (sandwichStartedByThisToken) {
        openConventions.push(sandwichStartedByThisToken.convention)
        continue
      }

      const sandwichEndedByThisToken = getSandwichEndedByThisToken(token)

      if (sandwichEndedByThisToken) {
        const currentOpenConvention = last(openConventions)
        
        if (currentOpenConvention === sandwichEndedByThisToken.convention) {
          // Perfect! The author closed the current convention. Let's mark it as closed and move on.
          openConventions.pop()
          continue
        }
        
        
      }
    }
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

    for (const sandwich of SANDWICHES) {
      if (this.isInside(sandwich.convention) && this.consumer.consumeIfMatches(sandwich.end)) {
        this.addToken(sandwich.convention.endTokenMeaning())
        return true
      }

      const foundStartToken = (
        !this.failureTracker.hasConventionFailed(sandwich.convention, textIndex)
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

    if (this.failureTracker.hasConventionFailed(LINK, textIndex)) {
      return false
    }

    if (!this.isInside(LINK)) {
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
        this.undoLatest(LINK)
      }

      return true
    }

    // We haven't found the URL arrow yet, which means we're still tokenizing the link's contents.
    //
    // If we find a closing brace before finding any URL arrow, that means we're actually looking at regular
    // bracketed text.
    if (this.consumer.consumeIfMatches(']')) {
      this.undoLatest(LINK)
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

  undoLatest(convention: Convention): void {
    this.backtrack(this.indexOfStartOfLatestConvention(convention))
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
        return this.isConventionAtIndexUnclosed(LINK, index)
    }

    // Okay, so this is a sandwich start token. Let's find which sandwich.
    const sandwich = getSandwichStartedByThisToken(token)

    if (!sandwich) {
      throw new Error('Unexpected token')
    }

    return this.isConventionAtIndexUnclosed(sandwich.convention, index)
  }

  isInside(convention: Convention): boolean {
    // We know we're inside a convention if there are more start tokens than end tokens.

    let excessStartTokens = 0

    for (const token of this.tokens) {
      if (token.meaning === convention.startTokenMeaning()) {
        excessStartTokens += 1
      } else if (token.meaning === convention.endTokenMeaning()) {
        excessStartTokens -= 1
      }
    }

    return excessStartTokens > 0
  }

  isConventionAtIndexUnclosed(convention: Convention, index: number): boolean {
    // We know the token at `index` is the start token
    let excessStartTokens = 1
    const startIndex = index + 1

    for (let i = startIndex; i < this.tokens.length; i++) {
      const token = this.tokens[i]

      if (token.meaning === convention.startTokenMeaning()) {
        excessStartTokens += 1
      } else if (token.meaning === convention.endTokenMeaning()) {
        excessStartTokens -= 1
      }

      if (excessStartTokens === 0) {
        // We've reached a point where there is an end token for every start token. This means the convention
        // starting at `index` is complete. For this function, it doesn't matter whether there are any other
        // unclosed instances of this convention later on.
        return false
      }
    }

    return true
  }
  
  indexOfStartOfLatestConvention(convention: Convention): number {
    return this.indexOfLastTokenWithMeaning(convention.startTokenMeaning())
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

function getSandwichStartedByThisToken(token: Token): Sandwich {
  return SANDWICHES.filter(sandwich =>
    sandwich.convention.startTokenMeaning() === token.meaning
  )[0]
}

function getSandwichEndedByThisToken(token: Token): Sandwich {
  return SANDWICHES.filter(sandwich =>
    sandwich.convention.endTokenMeaning() === token.meaning
  )[0]
}