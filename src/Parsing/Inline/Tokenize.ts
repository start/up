import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { TokenizerResult } from './TokenizerResult'
import { TokenizerContext } from './TokenizerContext'
import { SandwichConvention } from './SandwichConvention'
import { TextConsumer } from './TextConsumer'
import { tokenizeNakedUrl } from './TokenizeNakedUrl'
import { last, lastChar, swap } from '../CollectionHelpers'
import { applyBackslashEscaping } from '../TextHelpers'
import { applyRaisedVoicesToRawTokens }  from './RaisedVoices/ApplyRaisedVoicesToRawTokens'
import { getMediaTokenizer }  from './GetMediaTokenizer'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './SandwichConventions'
import { massageTokensIntoTreeStructure } from './MassageTokensIntoTreeStructure'
import { UpConfig } from '../../UpConfig'
import { AudioToken } from './Tokens/AudioToken'
import { EmphasisEndToken } from './Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokens/EmphasisStartToken'
import { FootnoteEndToken } from './Tokens/FootnoteEndToken'
import { FootnoteStartToken } from './Tokens/FootnoteStartToken'
import { ImageToken } from './Tokens/ImageToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { PotentialRaisedVoiceEndToken } from './Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from './Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from './Tokens/PotentialRaisedVoiceStartToken'
import { SpoilerEndToken } from './Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { StressEndToken } from './Tokens/StressEndToken'
import { StressStartToken } from './Tokens/StressStartToken'
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokens/RevisionDeletionEndToken'
import { VideoToken } from './Tokens/VideoToken'
import { Token, TokenType } from './Tokens/Token'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'

export function tokenize(text: string, config: UpConfig): Token[] {
  const result = new Tokenizer(new TokenizerContext(text), config).result

  const tokensWithRaisedVoicesApplied =
    applyRaisedVoicesToRawTokens(result.tokens)

  return massageTokensIntoTreeStructure(tokensWithRaisedVoicesApplied)
}


const REGULAR_SANDWICHES =
  [REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE]

const MEDIA_TOKENIZERS =
  [AUDIO, IMAGE, VIDEO].map(getMediaTokenizer)


class OldTokenizer {
  public tokens: Token[] = []
  private consumer: TextConsumer

  constructor(text: string, config: UpConfig) {
    this.consumer = new TextConsumer(text)

    while (!this.consumer.done()) {
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

  tokenizeInlineCode(): boolean {
    return this.consumer.consume({
      from: '`',
      upTo: '`',
      then: code => this.addToken(new InlineCodeToken(applyBackslashEscaping(code)))
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

    let asterisks: string
    const didMatchRaisedVoiceDelimiter = this.consumer.consumeIfMatchesPattern({
      pattern: /^\*+/,
      then: match => { asterisks = match }
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

    let PotentialType: PotentialRaisedVoiceTokenType

    if (canOpenConvention && canCloseConvention) {
      PotentialType = PotentialRaisedVoiceStartOrEndToken
    } else if (canOpenConvention) {
      PotentialType = PotentialRaisedVoiceStartToken
    } else if (canCloseConvention) {
      PotentialType = PotentialRaisedVoiceEndToken
    } else {
      this.addPlainTextToken(asterisks)
      return true
    }

    this.addToken(new PotentialType(asterisks))
    return true
  }

  handleRegularSandwiches(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    for (const sandwich of REGULAR_SANDWICHES) {
      if (this.isInsideSandwich(sandwich) && this.consumer.consumeIfMatches(sandwich.end)) {
        this.addToken(new sandwich.EndTokenType())
        return true
      }

      const foundStartToken = this.consumer.consumeIfMatches(sandwich.start)

      if (foundStartToken) {
        this.addToken(new sandwich.StartTokenType())
        return true
      }
    }

    return false
  }

  handleLink(): boolean {
    const textIndex = this.consumer.lengthConsumed()

    if (!this.isInsideLink()) {
      // Since we're not inside a link, we can potentially start one. Let's see whether we should...
      const LINK_START = '['

      if (this.consumer.consumeIfMatches(LINK_START)) {
        this.addToken(new LinkStartToken())
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
        then: url => this.addToken(new LinkEndToken(applyBackslashEscaping(url)))
      })

      if (!didFindClosingBracket) {
        // No, the closing bracket is nowehere to be found. This wasn't a link. Oops!
        // TODO: Fail
      }

      return true
    }

    // We haven't found the URL arrow yet, which means we're still tokenizing the link's contents.
    //
    // If we find a closing brace before finding any URL arrow, that means we're actually looking at regular
    // bracketed text.
    if (this.consumer.consumeIfMatches(']')) {
      // TODO: Fail
      return true
    }

    return false
  }

  tokenizeNakedUrl(): boolean {
    return tokenizeNakedUrl({
      text: this.consumer.remainingText(),
      then: (lengthConsumed, tokens) => {
        this.consumer.advanceAfterMatch(lengthConsumed)
        this.tokens.push(...tokens)
      }
    })
  }

  addToken(token: Token): void {
    this.tokens.push(token)
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
    if (lastToken instanceof PlainTextToken) {
      lastToken.text += text
    } else {
      this.addToken(new PlainTextToken(text))
    }
  }

  isInsideSandwich(sandwich: SandwichConvention): boolean {
    return this.isInside(sandwich.StartTokenType, sandwich.EndTokenType)
  }

  isInsideLink(): boolean {
    return this.isInside(LinkStartToken, LinkEndToken)
  }

  isInside(StartTokenType: TokenType, EndTokenType: TokenType): boolean {
    // We guaranteed to be inside a convention if there are more start tokens than end tokens.
    let excessStartTokens = 0

    for (const token of this.tokens) {
      if (token instanceof StartTokenType) {
        excessStartTokens += 1
      } else if (token instanceof EndTokenType) {
        excessStartTokens -= 1
      }
    }

    return excessStartTokens > 0
  }
}


class Tokenizer {
  public result: TokenizerResult
  private tokens: Token[] = []

  // The tokenizer collects text that doesn't match any conventions' delimiters. Eventually, this text is flushed
  // to a token.
  //
  // Usually, this non-matching text is flushed to a PlainTextToken, but it can also be flushed to other kinds of
  // tokens (like InlineCodeTokens).
  private collcetedUnmatchedText = ''

  constructor(private context: TokenizerContext, private config: UpConfig) {
    if (this.context.initialToken) {
      this.tokens.push(this.context.initialToken)
    }

    while (!this.context.done()) {
      if (this.context.currentChar === '\\') {
        this.context.advance(1)
        this.collectCurrentChar()
        continue
      }

      if (this.context.isInlineCodeOpen) {
        if (this.closeInlineCode()) {
          return
        }
      } else {
        if (this.context.countSpoilersOpen && this.closeSpoiler() && this.context.isSpoilerInnermostOpenConvention()) {
          return
        }

        if (this.context.countFootnotesOpen && this.closeFootnote() && this.context.isFootnoteInnermostOpenConvention()) {
          return
        }

        const didTokenizeConvention = (
          this.tokenizeInlineCode()
          || this.tokenizeRaisedVoicePlaceholders()
          || this.tokenizeSpoiler()
          || this.tokenizeFootnote()
        )

        if (didTokenizeConvention) {
          continue
        }
      }

      this.collectCurrentChar()
    }

    this.flushUnmatchedTextToPlainTextToken()

    this.result = {
      succeeded: !this.context.failed(),
      lengthAdvanced: this.context.lengthAdvanced,
      tokens: this.tokens
    }
  }

  private collectCurrentChar(): void {
    this.collcetedUnmatchedText += this.context.currentChar
    this.context.advance(1)
  }

  private flushUnmatchedText(): string {
    const unmatchedText = this.collcetedUnmatchedText
    this.collcetedUnmatchedText = ''

    return unmatchedText
  }

  private flushUnmatchedTextToPlainTextToken(): void {
    const unmatchedText = this.flushUnmatchedText()

    if (unmatchedText) {
      this.tokens.push(new PlainTextToken(unmatchedText))
    }
  }

  private flushUnmatchedTextToPlainTextTokenThenAddTokens(...tokens: Token[]): void {
    this.flushUnmatchedTextToPlainTextToken()
    this.tokens.push(...tokens)
  }

  private tokenizeInlineCode(): boolean {
    return this.tokenizeConvention({
      pattern: /^`/,
      getNewContext: () => this.context.withInlineCodeOpen()
    })
  }

  private closeInlineCode(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^`/ })) {
      this.context.closeInlineCode()
      this.result = this.getResultFor(new InlineCodeToken(this.flushUnmatchedText()))
      return true
    }

    return false
  }

  private tokenizeSpoiler(): boolean {
    return this.tokenizeConvention({
      pattern: new RegExp(`^\\[${this.config.settings.i18n.terms.spoiler}:\\s*`, 'i'),
      getNewContext: () => this.context.withAdditionalSpoilerOpen()
    })
  }

  private closeSpoiler(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^\]/ })) {
      this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new SpoilerEndToken())
      this.context.closeSpoiler()
      this.result = this.getResult()
      return true
    }

    return false
  }

  private tokenizeFootnote(): boolean {
    return this.tokenizeConvention({
      pattern: /^\s*\(\(/,
      getNewContext: () => this.context.withAdditionalFootnoteOpen()
    })
  }

  private closeFootnote(): boolean {
    if (this.context.advanceIfMatch({ pattern: /^\)\)/ })) {
      this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new FootnoteEndToken())
      this.context.closeFootnote()
      this.result = this.getResult()
      return true
    }

    return false
  }

  private tokenizeConvention(args: OpenConventionArgs): boolean {
    let newContext: TokenizerContext

    const canOpenPattern = this.context.match({
      pattern: args.pattern,
      then: match => {
        newContext = args.getNewContext()
        newContext.advance(match.length)
      }
    })

    if (!canOpenPattern) {
      return false
    }

    return this.tokenizeRestOfConvention(newContext)
  }

  private tokenizeRestOfConvention(context: TokenizerContext): boolean {
    const result = new Tokenizer(context, this.config).result

    if (!result.succeeded) {
      return false
    }

    this.flushUnmatchedTextToPlainTextTokenThenAddTokens(...result.tokens)
    this.context.advance(result.lengthAdvanced)
    return true
  }

  private getResult(): TokenizerResult {
    return this.getResultFor(...this.tokens)
  }

  private getResultFor(...tokens: Token[]): TokenizerResult {
    return {
      succeeded: true,
      lengthAdvanced: this.context.lengthAdvanced,
      tokens: tokens
    }
  }

  // Handle emphasis and stress conventions
  private tokenizeRaisedVoicePlaceholders(): boolean {
    const ASTERISKS_PATTERN = /^\*+/

    return this.context.advanceIfMatch({
      pattern: ASTERISKS_PATTERN,

      then: (asterisks, isTouchingWordEnd, isTouchingWordStart) => {
        // If the previous character in the raw source text was whitespace, this token cannot end any raised-voice
        // conventions. That's because the token needs to look like it's touching the end of the text it's affecting.
        //
        // We're only concerned with how the asterisks appear in the surrounding raw text. Therefore, at least for now,
        // we don't care whether any preceding whitespace is escaped or not.
        const canCloseConvention = isTouchingWordEnd

        // Likewise, a token cannot begin any raised-voice conventions if the next character in the raw source text 
        // is whitespace. That's because the token must look like it's touching the beginning of the text it's
        // affecting. At least for now, the next raw character can even be a backslash!
        const canOpenConvention = isTouchingWordStart

        let AsteriskTokenType: new (asterisks: string) => Token

        if (canOpenConvention && canCloseConvention) {
          AsteriskTokenType = PotentialRaisedVoiceStartOrEndToken
        } else if (canOpenConvention) {
          AsteriskTokenType = PotentialRaisedVoiceStartToken
        } else if (canCloseConvention) {
          AsteriskTokenType = PotentialRaisedVoiceEndToken
        } else {
          AsteriskTokenType = PlainTextToken
        }

        this.flushUnmatchedTextToPlainTextTokenThenAddTokens(new AsteriskTokenType(asterisks))
      }
    })
  }
}

interface OpenConventionArgs {
  pattern: RegExp,
  getNewContext: () => TokenizerContext
}