import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { Sandwich } from './Sandwich'
import { TextConsumer } from '../TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE, SHOUTING_EMPHASIS, SHOUTING_STRESS } from './Sandwiches'


export function tokenize(text: string): Token[] {
  return new Tokenizer(text).tokens
}

const LINK = new Convention(TokenMeaning.LinkStart, TokenMeaning.LinkUrlAndLinkEnd)

const REGULAR_SANDWICHES = [
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  INLINE_ASIDE
]

const SHOUT_SANDWICHES = [
  STRESS,
  EMPHASIS
]

const ALL_SANDWICHES = REGULAR_SANDWICHES.concat(SHOUT_SANDWICHES)

const POTENTIALLY_UNCLOSED_CONVENTIONS =
  [LINK].concat(ALL_SANDWICHES.map(sandwich => sandwich.convention))


class Tokenizer {
  public tokens: Token[] = []
  private failureTracker = new FailureTracker()
  private consumer: TextConsumer

  // Square brackets must be perfectly balanced within the contents of a link, and this is how we track that.
  //
  // Links cannot be nested, so we'll never be tokenizing more than one link at a time. That's why we can get
  // away with using a single, hackish vartiable like this.
  private countUnclosedSquareBracketsAtLinkStart: number

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
        this.tokenizeInlineCode()
        || this.handleShouting()
        || this.handleRegularSandwiches()
        || this.handleLink()
      )

      if (wasAnythingDiscovered) {
        continue
      }

      this.addPlainTextToken(this.consumer.escapedCurrentChar())
      this.consumer.moveNext()
    }

    this.massageTokensIntoTreeStructure()
  }

  // Conventions can overlap, which makes it painful to produce an abstract syntax tree. This method rearranges
  // and adds tokens to make that process simpler.
  //
  // Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent. Links,
  // however, must not be split into multiple pieces, which means any convention that overlaps with a link must
  // be split instead.
  massageTokensIntoTreeStructure(): void {
    this.massageSandwichesIntoTreeStructure()
    this.splitAnySandwichThatOverlapsWithLinks()
  }

  // Massages sandwich tokens into a tree structure while preserving any overlapping conveyed by the author. This
  // method completely ignores link tokens, and it assumes no tokens are missing.
  massageSandwichesIntoTreeStructure(): void {
    const unclosedSandwiches: Sandwich[] = []

    // Here's our overall strategy:
    //
    // We'll to traverse our token array, keeping track of which sandwiches are still unclosed as of the current
    // position. Once we reach a sandwich end token, we check whether any still-unclosed sandwhiches were opened
    // inside the current sandwich. If so, we essentially chop those sandwiches in half: We add end tokens
    // immediately before the end of the current sandwich, and we add corresponding start tokens immediately
    // after the end of the current sandwich.
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const token = this.tokens[tokenIndex]

      const sandwichStartedByThisToken = getSandwichStartedByThisToken(token)

      if (sandwichStartedByThisToken) {
        unclosedSandwiches.push(sandwichStartedByThisToken)
        continue
      }

      const sandwichEndedByThisToken = getSandwichEndedByThisToken(token)

      if (!sandwichEndedByThisToken) {
        continue
      }

      // Alright, we've found a token that closes one of our unclosed sandwiches. If any other sandwiches were
      // opened between this token and its corresponding start token, those sandwiches overlap this one and will
      // need to be chopped in half.

      let overlappingFromMostRecentToLeast: Sandwich[] = []

      // We'll check the unclosed sandwiches from most recently opened to least recently opened.
      for (let sandwichIndex = unclosedSandwiches.length - 1; sandwichIndex >= 0; sandwichIndex--) {
        const unclosedSandwich = unclosedSandwiches[sandwichIndex]

        if (unclosedSandwich === sandwichEndedByThisToken) {
          // Hooray! We've reached the sandwich that is closed by the current token.
          unclosedSandwiches.splice(sandwichIndex, 1)

          // Any sandwiches opened before this one don't overlap with the current sandwich, so we can bail.
          break
        }

        overlappingFromMostRecentToLeast.push(unclosedSandwich)
      }

      // Okay, now we know which sandwiches overlap the one that's about to close. To preserve overlapping
      // while making it easier to produce an abstract syntax tree, we make the following changes:
      //
      // 1. Just before the end token of the current sandwich, we add a closing token for each unclosed
      //    sandwich. To preserve proper nesting, we close the sandwiches in order of most to least recent.
      //  
      // 2. Just after the end token of the current sandwich, we add a start token for each unclosed sandwich.
      //    To avoid producing a surprising syntax tree, we re-open the sandwiches in their original order.
      this.closeAndReopenSandwichesAroundTokenAtIndex(tokenIndex, overlappingFromMostRecentToLeast)

      const countOverlapping = overlappingFromMostRecentToLeast.length

      // Advance index to reflect the fact that we just added tokens
      tokenIndex += (2 * countOverlapping)
    }
  }

  // This function assumes that any sandwich tokens are already properly nested.
  splitAnySandwichThatOverlapsWithLinks(): void {
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      if (this.tokens[tokenIndex].meaning !== TokenMeaning.LinkStart) {
        continue
      }

      const linkStartIndex = tokenIndex
      let linkEndIndex: number

      for (let i = linkStartIndex + 1; i < this.tokens.length; i++) {
        if (this.tokens[i].meaning === TokenMeaning.LinkUrlAndLinkEnd) {
          linkEndIndex = i
          break
        }
      }

      // Alright, we now know where this link starts and ends. Any overlapping sandwiches will either:

      // 1. Start before the link and end inside the link
      // 2. Start inside the link and end after the link

      const overlappingStartingBefore: Sandwich[] = []
      const overlappingStartingInside: Sandwich[] = []

      for (let insideLinkIndex = linkStartIndex + 1; insideLinkIndex < linkEndIndex; insideLinkIndex++) {
        const token = this.tokens[insideLinkIndex]
        const sandwichStartedByThisToken = getSandwichStartedByThisToken(token)

        if (sandwichStartedByThisToken) {
          // Until we encounter the end token, we'll assume this sandwich overlaps.
          overlappingStartingInside.push(sandwichStartedByThisToken)
          continue
        }

        const sandwichEndedByThisToken = getSandwichEndedByThisToken(token)

        if (sandwichEndedByThisToken) {
          // This function assumes any sandwich conventions are already properly nested into a treee
          // structure. Therefore, if there are any sandwich sonventions that started inside the link,
          // this one must be the most recent.
          if (overlappingStartingInside.length) {
            overlappingStartingInside.pop()
            continue
          }

          // Ahhh, but there were no sandwiches started inside this link! That means this one must have
          // started before it.
          overlappingStartingBefore.push(sandwichEndedByThisToken)
        }
      }

      this.closeAndReopenSandwichesAroundTokenAtIndex(linkEndIndex, overlappingStartingInside)
      this.closeAndReopenSandwichesAroundTokenAtIndex(linkStartIndex, overlappingStartingBefore)

      // Each sandwich we split in half generates two new additional tokens.
      const countTokensAdded = (2 * overlappingStartingBefore.length) + (2 * overlappingStartingInside.length)

      tokenIndex = linkEndIndex + countTokensAdded
    }
  }

  // The purpose of this method is best explained in the `massageSandwichesIntoTreeStructure` method.
  // In short, it chops sandwiches in two around the token at `index`, allowing sandwiches to be nested
  // properly (in a tree structure) while preserving the overlapping intended by the author.
  //
  // Functionally, this method does exactly what its name implies: it adds sandwich end tokens before `index`
  // and sandwich start tokens after `index`.
  closeAndReopenSandwichesAroundTokenAtIndex(index: number, sandwichesInTheOrderTheyShouldClose: Sandwich[]): void {
    const startTokensToAdd =
      sandwichesInTheOrderTheyShouldClose
        .map(sandwich => new Token(sandwich.convention.startTokenMeaning()))
        .reverse()

    const endTokensToAdd =
      sandwichesInTheOrderTheyShouldClose
        .map(sandwich => new Token(sandwich.convention.endTokenMeaning()))

    this.insertTokens(index + 1, startTokensToAdd)
    this.insertTokens(index, endTokensToAdd)
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

  tokenizeInlineCode(): boolean {
    return this.consumer.consume({
      from: '`',
      upTo: '`',
      then: code => this.addToken(TokenMeaning.InlineCode, applyBackslashEscaping(code))
    })
  }

  handleShouting(): boolean {
    const originalTextIndex = this.consumer.lengthConsumed()
    
    let shoutDelimiter: string

    const didMatchShoutDelimiter = this.consumer.consumeIfMatchesPattern({
      pattern: /^\*+/,
      then: match => { shoutDelimiter = match }
    })

    if (!didMatchShoutDelimiter) {
      return false
    }
    
    // TODO: Differentiate between 2 asterisks and 3+ asterisks
    
    // If the previous character in the raw source text was whitespace, we cannot end any shouting sandwiches.
    // Otherwise, we potentially can (assuming one is open). We don't care whether the whitespace character
    // was escaped or not! We only care about the appearance of the raw text.
    
    const lastConsumedRawChar = this.consumer.at(originalTextIndex - 1)
    const NON_WHITESPACE = /\S/
    const canEndSandwich = NON_WHITESPACE.test(lastConsumedRawChar)
    
    // If the next character in the raw source text is whitespace, we cannot start any shouting sandwiches.
    // Otherwise, we can. The next character can even be a backslash! Again, we only care about the appearance
    // of the raw text.
    
    // The text consumer's current char is the next char after the delimiter we just consumed
    const nextRawChar = this.consumer.currentChar()
    const canStartSandwich = NON_WHITESPACE.test(nextRawChar)
    
    if (!canEndSandwich && !canStartSandwich) {
      this.addPlainTextToken(shoutDelimiter)
      return true
    }
    
    return false
  }

  handleRegularSandwiches(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    for (const sandwich of REGULAR_SANDWICHES) {
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
      // Since we're not inside a link, we can potentially start one. Let's see whether we should...
      const LINK_START = '['

      if (this.consumer.consumeIfMatches(LINK_START)) {
        this.addToken(TokenMeaning.LinkStart, this.consumer.asBeforeMatch(LINK_START.length))
        this.countUnclosedSquareBracketsAtLinkStart = this.consumer.countUnclosedSquareBracket
        return true
      }

      // ... Nope. We didn't find anything. Since we're not inside a link, let's bail.
      return false
    }

    // We're inside a link! Are we looking at the URL arrow?
    if (this.consumer.consumeIfMatches(' -> ')) {
      // Okay, we found the URL arrow.

      // Before we go on, let's make sure this link's contents have balanced square brackets.
      if (this.consumer.countUnclosedSquareBracket !== this.countUnclosedSquareBracketsAtLinkStart) {
        // Nope. We're probably looking at either:
        //
        // 1. A bracketed link, which should start with the second opening bracket:
        //  
        //    [I use [Google -> https://google.com]]
        //
        // 2. A bracketed link missing the second closing bracket, which should still start with the second
        //    opening bracket:
        //   
        //    Go to [this [site -> https://stackoverflow.com]!
        this.undoLatest(LINK)
        return true
      }

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

  addPlainTextToken(text: string): void {
    const lastToken = last(this.tokens)

    if (lastToken && (lastToken.meaning === TokenMeaning.PlainText)) {
      lastToken.value += text
    } else {
      this.tokens.push(new Token(TokenMeaning.PlainText, text))
    }
  }

  undoLatest(convention: Convention): void {
    this.backtrack(this.indexOfStartOfLatestInstanceOfConvention(convention))
  }

  backtrack(indexOfEarliestTokenToUndo: number): void {
    const token = this.tokens[indexOfEarliestTokenToUndo]

    this.failureTracker.registerFailure(token.meaning, token.textIndex())
    this.consumer = token.consumerBefore
    this.tokens.splice(indexOfEarliestTokenToUndo)
  }

  isTokenStartOfUnclosedConvention(index: number): boolean {
    const token = this.tokens[index]

    for (let convention of POTENTIALLY_UNCLOSED_CONVENTIONS) {
      if (token.meaning === convention.startTokenMeaning()) {
        return this.isConventionAtIndexUnclosed(convention, index)
      }
    }

    return false
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

  indexOfStartOfLatestInstanceOfConvention(convention: Convention): number {
    return this.indexOfLastTokenWithMeaning(convention.startTokenMeaning())
  }

  indexOfLastTokenWithMeaning(meaning: TokenMeaning): number {
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      if (this.tokens[i].meaning === meaning) {
        return i
      }
    }

    throw new Error('Missing token')
  }

  insertTokens(index: number, tokens: Token[]): void {
    this.tokens.splice(index, 0, ...tokens)
  }
}

function getSandwichStartedByThisToken(token: Token): Sandwich {
  return ALL_SANDWICHES.filter(sandwich =>
    sandwich.convention.startTokenMeaning() === token.meaning
  )[0]
}

function getSandwichEndedByThisToken(token: Token): Sandwich {
  return ALL_SANDWICHES.filter(sandwich =>
    sandwich.convention.endTokenMeaning() === token.meaning
  )[0]
}