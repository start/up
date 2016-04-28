import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { SandwichConvention } from './SandwichConvention'
import { InlineTextConsumer } from './InlineTextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { applyRaisedVoicesToRawTokens }  from './RaisedVoices/ApplyRaisedVoicesToRawTokens'
import { getMediaTokenizer }  from './GetMediaTokenizer'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './SandwichConventions'
import { massageTokensIntoTreeStructure } from './MassageTokensIntoTreeStructure'


export function tokenize(text: string): Token[] {
  const rawTokens = new RawTokenizer(text).tokens
  const tokensWithRaisedVoicesApplied = applyRaisedVoicesToRawTokens(rawTokens)
  
  return massageTokensIntoTreeStructure(tokensWithRaisedVoicesApplied)
}


const LINK = new Convention(TokenMeaning.LinkStart, TokenMeaning.LinkUrlAndLinkEnd)

const REGULAR_SANDWICHES = [
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE
]

const ALL_SANDWICHES = REGULAR_SANDWICHES.concat(STRESS, EMPHASIS)

const POTENTIALLY_UNCLOSED_CONVENTIONS =
  [LINK].concat(REGULAR_SANDWICHES.map(sandwich => sandwich.convention))

const MEDIA_TOKENIZERS = [
  AUDIO,
  IMAGE,
  VIDEO
].map(mediaConvention => getMediaTokenizer(mediaConvention))


class RawTokenizer {
  public tokens: Token[] = []
  private failureTracker = new FailureTracker()
  private consumer: InlineTextConsumer
  
  constructor(text: string) {
    this.consumer = new InlineTextConsumer(text)

    while (true) {
      if (this.consumer.done()) {
        if (this.backtrackIfAnyConventionsAreUnclosed()) {
          continue
        }

        break
      }

      const wasAnythingDiscovered = (
        this.tokenizeInlineCode()
        || this.tokenizeRaisedVoicePlaceholders()
        || this.handleRegularSandwiches()
        || this.tokenizeMedia()
        || this.handleLink()
        || this.tokenizeNakedUrl()
      )

      if (wasAnythingDiscovered) {
        continue
      }

      this.addPlainTextToken(this.consumer.escapedCurrentChar())
      this.consumer.advanceToNextChar()
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

  tokenizeInlineCode(): boolean {
    return this.consumer.consume({
      from: '`',
      upTo: '`',
      then: code => this.addToken(TokenMeaning.InlineCode, applyBackslashEscaping(code))
    })
  }

  tokenizeMedia(): boolean {
    for (const tokenizeMedia of MEDIA_TOKENIZERS) {
      const wasMediaFound = tokenizeMedia({
        text: this.consumer.remainingText(),
        then: (lengthConsumed, tokens) => {
          this.consumer.advanceAfterMatch(lengthConsumed)
          this.tokens.push(...tokens)
        }
      })
      
      if (wasMediaFound) {
        return true
      }
    }

    return false
  }

  // Handle emphasis and stress conventions
  tokenizeRaisedVoicePlaceholders(): boolean {
    const originalTextIndex = this.consumer.lengthConsumed()

    let raisedVoiceDelimiter: string
    const didMatchRaisedVoiceDelimiter = this.consumer.consumeIfMatchesPattern({
      pattern: /^\*+/,
      then: match => { raisedVoiceDelimiter = match }
    })

    if (!didMatchRaisedVoiceDelimiter) {
      return false
    }

    // If the previous character in the raw source text was whitespace, this delimiter cannot end any raised-voice
    // conventions. That's because delimiter needs to look like it's touching the end of the text it's affecting.
    //
    // We're only concerned with how the asterisks appear in the surrounding raw text. Therefore, at least for now,
    // we don't care whether any preceding whitespace is escaped or not.

    const prevRawCharacter = this.consumer.at(originalTextIndex - 1)
    const NON_WHITESPACE = /\S/
    const canCloseConvention = NON_WHITESPACE.test(prevRawCharacter)

    // Likewise, a delimiter cannot begin any raised-voice conventions if the next character in the raw source text 
    // is whitespace. That's because the delimiter must look like it's touching the beginning of the text it's
    // affecting. At least for now, the next raw character can even be a backslash!

    // The text consumer's current char is actually the next char after the delimiter we just consumed.
    const nextRawChar = this.consumer.currentChar()
    const canOpenConvention = NON_WHITESPACE.test(nextRawChar)

    let meaning: TokenMeaning

    if (canOpenConvention && canCloseConvention) {
      meaning = TokenMeaning.PotentialRaisedVoiceStartOrEnd
    } else if (canOpenConvention) {
      meaning = TokenMeaning.PotentialRaisedVoiceStart
    } else if (canCloseConvention) {
      meaning = TokenMeaning.PotentialRaisedVoiceEnd
    } else {
      this.addPlainTextToken(raisedVoiceDelimiter)
      return true
    }

    this.addToken(meaning, raisedVoiceDelimiter)
    return true
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
        return true
      }

      // ... Nope. We didn't find anything. Since we're not inside a link, let's bail.
      return false
    }

    // We're inside a link! Are we looking at the URL arrow?
    if (this.consumer.consumeIfMatches(' -> ')) {
      // Okay, we found the URL arrow. Now, let's find the closing bracket and finish up.
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
  
  tokenizeNakedUrl(): boolean {
    const SCHEME_PATTERN = /^(?:https?)?:\/\//
    
    let urlScheme: string
    
    if (!this.consumer.consumeIfMatchesPattern({
      pattern: SCHEME_PATTERN,
      then: (match) => urlScheme = match
    })) {
      return false
    }
    
    const NON_WHITESPACE_CHAR_PATTERN = /^\S/
    
    let restOfUrl = ''
    
    // TODO: fix escaping
    
    while(this.consumer.consumeIfMatchesPattern({
      pattern: NON_WHITESPACE_CHAR_PATTERN,
      then: (char) => restOfUrl += char
    })) { }
    
    this.addToken(TokenMeaning.LinkStart)
    this.addPlainTextToken(restOfUrl)
    this.addToken(TokenMeaning.LinkUrlAndLinkEnd, urlScheme + restOfUrl)
    
    return true
  }

  addToken(meaning: TokenMeaning, valueOrConsumerBefore?: string | InlineTextConsumer): void {
    this.tokens.push(new Token(meaning, valueOrConsumerBefore))
  }

  addPlainTextToken(text: string): void {
    const lastToken = last(this.tokens)
 
    // We combine consecutive plain-text tokens (i.e. plain text characters) during parsing into a single
    // PlainTextNode.
    //
    // Certain tokens ultimately produce no syntax nodes. Plain-text tokens surrounding those "dud" tokens need
    // to be combined, so we have no choice but to perform that task once tokenization is completed.
    //
    // So why do we spend time doing it tokenization, too?
    //  
    // Every single time `isInside` is called, we have to iterate through every token. And we call `isInside`
    // frequently. Until we reduce the frequency of iteration, we'll try to minimize the number of tokens we
    // have. 
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

    let meaning = token.meaning

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
    // We guaranteed to be inside a convention if there are more start tokens than end tokens.
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
}
