import { escapeForRegex, regExpStartingWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR } from '../../Patterns'
import { REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { UpConfig } from '../../UpConfig'
import { RichConvention } from './RichConvention'
import { MediaConvention } from './MediaConvention'
import { applyRaisedVoices }  from './RaisedVoices/applyRaisedVoices'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { insertBracketsInsideBracketedConventions } from './insertBracketsInsideBracketedConventions'
import { OnMatch } from './OnMatch'
import { last, concat, contains, reversed } from '../../CollectionHelpers'
import { Bracket } from './Bracket'
import { FailedConventionTracker } from './FailedConventionTracker'
import { TokenizerContext } from './TokenizerContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineConsumer } from './InlineConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { NewTokenArgs } from './NewTokenArgs'
import { TokenizableConvention } from './TokenizableConvention'


export class Tokenizer {
  tokens: Token[] = []

  private consumer: InlineConsumer

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, usually a PlainTextToken.
  private buffer = ''

  // Any time we open a new convention, we create a new context for it and add it to this collection.
  private openContexts: TokenizerContext[] = []

  // When a convention is missing its closing delimiter, we backtrack and add the convention to our
  // `failedConventionTracker`.
  private failedConventionTracker: FailedConventionTracker = new FailedConventionTracker()

  // Most of our conventions are thrown in this collection. We try to open these conventions in order. The
  // conventions not included in this collection are:
  //
  // 1. Raw bracket conventions (explained below)
  // 2. Media URL conventions (explained below)
  private conventions: TokenizableConvention[] = []

  // These bracket conventions don't produce special tokens, and they can only appear inside URLs or media
  // descriptions. They allow matching brackets to be included without having to escape any closing brackets.
  private rawBracketConventions = this.getRawBracketConventions()

  // When tokenizing media (i.e. audio, image, or video), we open a context for the description. Once the
  // description reaches its final bracket, we try to convert that media description context into a media URL
  // context.
  //
  // If that fails (either because there isn't an opening bracket for the media URL, or because there isn't a
  // closing bracket), we backtrack to the beginning of the media convention and try something else. 
  private mediaUrlConventions = this.getMediaUrlConventions()

  // As a rule, when a convention containing a naked URL is closed, the naked URL gets closed first.
  //
  // Most of our conventions are just thrown in the `conventions` collection (and this one is, too),
  // but we keep a direct reference to the naked URL convention to help us determine whether another
  // convention contains a naked URL.
  private nakedUrlConvention: TokenizableConvention = {
    startPattern: NAKED_URL_PROTOCOL_PATTERN,
    endPattern: NAKED_URL_TERMINATOR_PATTERN,

    flushBufferToPlainTextTokenBeforeOpening: true,

    onOpen: urlProtocol => {
      this.appendNewToken({ kind: TokenKind.NakedUrlProtocolAndStart, value: urlProtocol })
    },

    insteadOfTryingToOpenUsualConventions: () => this.bufferRawText(),
 
    leaveEndPatternForAnotherConventionToConsume: true,
    onCloseFlushBufferTo: TokenKind.NakedUrlAfterProtocolAndEnd,
    closeInnerContextsWhenClosing: true,

    resolveWhenLeftUnclosed: () => this.flushBufferToNakedUrlEndToken(),
  }

  constructor(entireText: string, private config: UpConfig) {
    this.consumer = new InlineConsumer(entireText)
    this.configureConventions()

    this.tokenize()
  }

  private configureConventions(): void {
    this.conventions.push(...[
      {
        richConvention: FOOTNOTE_CONVENTION,
        startPattern: ANY_WHITESPACE + escapeForRegex('(('),
        endPattern: escapeForRegex('))')
      }, {
        richConvention: REVISION_DELETION_CONVENTION,
        startPattern: '~~',
        endPattern: '~~'
      }, {
        richConvention: REVISION_INSERTION_CONVENTION,
        startPattern: escapeForRegex('++'),
        endPattern: escapeForRegex('++')
      }
    ].map(args => this.getRichSandwichConvention(args)))

    this.conventions.push(
      ...this.getConventionsForRichBracketedTerm({
        richConvention: SPOILER_CONVENTION,
        nonLocalizedTerm: 'spoiler'
      })
    )

    this.conventions.push({
      startPattern: INLINE_CODE_DELIMITER_PATTERN,
      endPattern: INLINE_CODE_DELIMITER_PATTERN,

      flushBufferToPlainTextTokenBeforeOpening: true,

      insteadOfTryingToCloseOuterContexts: () => this.bufferCurrentChar(),
      onCloseFlushBufferTo: TokenKind.InlineCode
    })

    this.conventions.push(
      ...this.getLinkUrlConventions())

    this.conventions.push(
      ...this.getMediaDescriptionConventions())

    this.conventions.push(...[
      {
        richConvention: PARENTHESIZED_CONVENTION,
        startPattern: PARENTHESIS.startPattern,
        endPattern: PARENTHESIS.endPattern
      }, {
        richConvention: SQUARE_BRACKETED_CONVENTION,
        startPattern: SQUARE_BRACKET.startPattern,
        endPattern: SQUARE_BRACKET.endPattern
      }, {
        richConvention: ACTION_CONVENTION,
        startPattern: CURLY_BRACKET.startPattern,
        endPattern: CURLY_BRACKET.endPattern
      }
    ].map(args => this.getRichSandwichConvention(args)))

    this.conventions.push(this.nakedUrlConvention)
  }

  private tokenize(): void {
    while (!this.isDone()) {

      this.tryToCollectEscapedChar()
        || this.tryToCloseAnyConvention()
        || this.performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts()
        || this.tryToTokenizeRaisedVoicePlaceholders()
        || this.tryToOpenAnyConvention()
        || this.bufferCurrentChar()
    }

    this.tokens =
      nestOverlappingConventions(
        applyRaisedVoices(
          insertBracketsInsideBracketedConventions(this.tokens)))
  }

  private isDone(): boolean {
    return this.consumer.reachedEndOfText() && this.resolveUnclosedContexts()
  }

  private tryToCollectEscapedChar(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.consumer.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.consumer.advanceTextIndex(1)

    return this.consumer.reachedEndOfText() || this.bufferCurrentChar()
  }

  private tryToCloseAnyConvention(): boolean {
    let innerNakedUrlContextIndex: number = null

    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const openContext = this.openContexts[i]

      if (this.shouldCloseContext(openContext)) {

        // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed first.
        if (innerNakedUrlContextIndex != null) {
          this.flushBufferToNakedUrlEndToken()

          // We need to close the naked URL's context, as well as the contexts of any raw text brackets
          // inside it.
          this.openContexts.splice(i)
        }

        if (openContext.convention.onCloseFlushBufferTo != null) {
          this.flushBufferToTokenOfKind(openContext.convention.onCloseFlushBufferTo)
        }

        openContext.close()

        const conventionsToTryTransformingTo =
          openContext.convention.onCloseFailIfCannotTranformInto

        if (conventionsToTryTransformingTo) {
          const isAbleToTransform =
            conventionsToTryTransformingTo.some(convention => this.tryToOpen(convention))

          if (!isAbleToTransform) {
            // We couldn't transform, so it's time to fail.
            this.openContexts.splice(i)
            this.resetToBeforeContext(openContext)

            // We've just reset the tokenizer to where it was before we opened this convention.
            //
            // We know we won't be able to close any open conventions at our current position, because if
            // we could, we would have done so the first time around.
            return false
          }

          // So... we've just opened a new context for the convention we're transforming into. However, we
          // actually want to replace this context's convention with the new one instead.
          openContext.convention = this.openContexts.pop().convention

          if (openContext.convention.closeInnerContextsWhenClosing) {
            this.openContexts.splice(i + 1)
          }

          return true
        }

        this.openContexts.splice(i, 1)

        if (openContext.convention.closeInnerContextsWhenClosing) {
          // If we've just removed the context at `i` above, its first inner context will now be at `i`.           
          this.openContexts.splice(i)
        }

        return true
      }

      if (openContext.doIsteadOfTryingToCloseOuterContexts()) {
        return true
      }

      if (openContext.convention === this.nakedUrlConvention) {
        innerNakedUrlContextIndex = i
      }
    }

    return false
  }

  private shouldCloseContext(context: TokenizerContext): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: context.convention.endPattern,

      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        if (context.convention.leaveEndPatternForAnotherConventionToConsume) {
          this.consumer.textIndex -= match.length
        }
      }
    })
  }

  private performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts(): boolean {
    return reversed(this.openContexts)
      .some(context => context.doInsteadOfTryingToOpenUsualContexts())
  }

  private tryToOpenAnyConvention(): boolean {
    return this.conventions.some(convention => this.tryToOpen(convention))
  }

  private isDirectlyFollowing(kinds: TokenKind[]): boolean {
    return (
      this.buffer === ''
      && this.tokens.length
      && contains(kinds, last(this.tokens).kind)
    )
  }

  private bufferRawText(): boolean {
    return (
      this.rawBracketConventions.some(bracket => this.tryToOpen(bracket))
      || this.bufferCurrentChar())
  }

  // This method always returns true, which allows us to cleanly chain it with other boolean tokenizer methods. 
  private bufferCurrentChar(): boolean {
    this.buffer += this.consumer.currentChar
    this.consumer.advanceTextIndex(1)

    return true
  }

  private tryToOpen(convention: TokenizableConvention): boolean {
    const { startPattern, onlyOpenIfDirectlyFollowing, flushBufferToPlainTextTokenBeforeOpening, onOpen } = convention

    return (
      this.canTry(convention)
      && (!onlyOpenIfDirectlyFollowing || this.isDirectlyFollowing(onlyOpenIfDirectlyFollowing))
      && this.consumer.advanceAfterMatch({
        pattern: startPattern,

        then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
          if (flushBufferToPlainTextTokenBeforeOpening) {
            this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
          }

          this.openContexts.push(new TokenizerContext(convention, this.getCurrentSnapshot()))

          if (onOpen) {
            onOpen(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
          }
        }
      })
    )
  }

  private canTry(convention: TokenizableConvention, textIndex = this.consumer.textIndex): boolean {
    const conventionsThisOneTransformTo =
      convention.onCloseFailIfCannotTranformInto

    // If this convention transforms into other conventions, then it can fail as itself *or* fail
    // post-transformation as of those conventions.
    //
    // If a convention fails post-transformation, we don't try it again to see if it could transform
    // into a different convention. If it fails once, we move on. This logic is subject to change,
    // but for now, because all of our "post-transformation" conventions have incompatible start
    // patterns, there's no point in trying again.
    const hasFailedAfterTransitioning = (
      conventionsThisOneTransformTo
      && conventionsThisOneTransformTo.some(convention => this.failedConventionTracker.hasFailed(convention, textIndex))
    )

    if (hasFailedAfterTransitioning) {
      return false
    }

    return !this.failedConventionTracker.hasFailed(convention, textIndex)
  }

  private getCurrentSnapshot(): TokenizerSnapshot {
    return new TokenizerSnapshot({
      textIndex: this.consumer.textIndex,
      tokens: this.tokens,
      openContexts: this.openContexts,
      bufferedText: this.buffer
    })
  }

  private resolveUnclosedContexts(): boolean {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (!context.resolveWhenLeftUnclosed()) {
        this.resetToBeforeContext(context)
        return false
      }
    }

    this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
    return true
  }

  private resetToBeforeContext(context: TokenizerContext): void {
    this.failedConventionTracker.registerFailure(context)

    this.tokens = context.snapshot.tokens
    this.openContexts = context.snapshot.openContexts
    this.buffer = context.snapshot.bufferedText
    this.consumer.textIndex = context.snapshot.textIndex

    for (const context of this.openContexts) {
      context.reset()
    }
  }

  private appendNewToken(args: NewTokenArgs): void {
    this.tokens.push(new Token(args))
  }

  private flushBufferToNakedUrlEndToken(): void {
    this.flushBufferToTokenOfKind(TokenKind.NakedUrlAfterProtocolAndEnd)
  }

  private flushBuffer(): string {
    const buffer = this.buffer
    this.buffer = ''

    return buffer
  }

  private flushBufferToTokenOfKind(kind: TokenKind): void {
    this.appendNewToken({ kind, value: this.flushBuffer() })
  }

  private insertTokenAtStartOfContext(context: TokenizerContext, token: Token): void {
    const newTokenIndex = context.initialTokenIndex

    this.tokens.splice(newTokenIndex, 0, token)

    for (const openContext of this.openContexts) {
      openContext.registerTokenInsertion({ atIndex: newTokenIndex, onBehalfOfContext: context })
    }
  }

  private flushBufferToPlainTextTokenIfBufferIsNotEmpty(): void {
    if (this.buffer) {
      this.flushBufferToTokenOfKind(TokenKind.PlainText)
    }
  }

  private tryToTokenizeRaisedVoicePlaceholders(): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: RAISED_VOICE_DELIMITER_PATTERN,

      then: (asterisks, isTouchingWordEnd, isTouchingWordStart) => {
        const canCloseConvention = isTouchingWordEnd
        const canOpenConvention = isTouchingWordStart

        let asteriskTokenKind = TokenKind.PlainText

        if (canOpenConvention && canCloseConvention) {
          asteriskTokenKind = TokenKind.PotentialRaisedVoiceStartOrEnd
        } else if (canOpenConvention) {
          asteriskTokenKind = TokenKind.PotentialRaisedVoiceStart
        } else if (canCloseConvention) {
          asteriskTokenKind = TokenKind.PotentialRaisedVoiceEnd
        }

        this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
        this.appendNewToken({ kind: asteriskTokenKind, value: asterisks })
      }
    })
  }

  private getLinkUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowing: [
        TokenKind.ParenthesizedEnd,
        TokenKind.SquareBracketedEnd,
        TokenKind.ActionEnd
      ],

      insteadOfTryingToCloseOuterContexts: () => this.bufferRawText(),
      closeInnerContextsWhenClosing: true,

      onClose: () => {
        const url = this.flushBuffer()

        // The last token is guaranteed to be a ParenthesizedEnd, SquareBracketedEnd, or ActionEnd token.
        //
        // We'll replace that end token and its corresponding start token with link tokens.
        const lastToken = last(this.tokens)

        lastToken.correspondsToToken.kind = LINK_CONVENTION.startTokenKind
        lastToken.kind = LINK_CONVENTION.endTokenKind
        lastToken.value = url
      }
    }))
  }

  private getConventionsForRichBracketedTerm(
    args: {
      richConvention: RichConvention
      nonLocalizedTerm: string
    }
  ): TokenizableConvention[] {
    const { richConvention, nonLocalizedTerm } = args

    return BRACKETS.map(bracket =>
      this.getRichSandwichConvention({
        richConvention,
        startPattern: this.getBracketedTermStartPattern(nonLocalizedTerm, bracket),
        endPattern: bracket.endPattern,
        startPatternContainsATerm: true
      }))
  }

  private getRichSandwichConvention(
    args: {
      richConvention: RichConvention
      startPattern: string
      endPattern: string
      startPatternContainsATerm?: boolean
    }
  ): TokenizableConvention {
    const { richConvention, startPattern, endPattern, startPatternContainsATerm } = args

    return {
      // Some of our rich sandwich conventions use a localized term in their start pattern, and we want those
      // terms to be case-insensitive. No other start or end patterns need to be case-insensitive.
      startPattern: regExpStartingWith(startPattern, (startPatternContainsATerm ? 'i' : undefined)),
      endPattern: regExpStartingWith(endPattern),

      flushBufferToPlainTextTokenBeforeOpening: true,
      onCloseFlushBufferTo: TokenKind.PlainText,

      onClose: (context) => {
        const startToken = new Token({ kind: richConvention.startTokenKind })
        const endToken = new Token({ kind: richConvention.endTokenKind })
        startToken.associateWith(endToken)

        this.insertTokenAtStartOfContext(context, startToken)
        this.tokens.push(endToken)
      }
    }
  }

  private getMediaDescriptionConventions(): TokenizableConvention[] {
    return concat(
      [IMAGE, VIDEO, AUDIO].map(media =>
        BRACKETS.map(bracket => (<TokenizableConvention>{
          startPattern: regExpStartingWith(this.getBracketedTermStartPattern(media.nonLocalizedTerm, bracket), 'i'),
          endPattern: regExpStartingWith(bracket.endPattern),

          flushBufferToPlainTextTokenBeforeOpening: true,
          insteadOfTryingToCloseOuterContexts: () => this.bufferRawText(),

          closeInnerContextsWhenClosing: true,
          onCloseFailIfCannotTranformInto: this.mediaUrlConventions,
          onCloseFlushBufferTo: media.descriptionAndStartTokenKind,
        }))))
  }

  private getMediaUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      flushBufferToPlainTextTokenBeforeOpening: true,

      insteadOfTryingToCloseOuterContexts: () => this.bufferRawText(),
      closeInnerContextsWhenClosing: true,
      onCloseFlushBufferTo: TokenKind.MediaUrlAndEnd
    }))
  }

  private getRawBracketConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      onOpen: () => { this.buffer += bracket.start },
      onClose: () => { this.buffer += bracket.end },

      resolveWhenLeftUnclosed: () => true
    }))
  }

  private getBracketedTermStartPattern(nonLocalizedTerm: string, bracket: Bracket): string {
    return (
      bracket.startPattern
      + escapeForRegex(this.config.localizeTerm(nonLocalizedTerm)) + ':'
      + ANY_WHITESPACE)
  }
}


const PARENTHESIS =
  new Bracket('(', ')')

const SQUARE_BRACKET =
  new Bracket('[', ']')

const CURLY_BRACKET =
  new Bracket('{', '}')

const BRACKETS = [
  PARENTHESIS,
  SQUARE_BRACKET,
  CURLY_BRACKET
]


const INLINE_CODE_DELIMITER_PATTERN =
  regExpStartingWith('`')

const RAISED_VOICE_DELIMITER_PATTERN =
  regExpStartingWith(atLeast(1, escapeForRegex('*')))

const NAKED_URL_PROTOCOL_PATTERN =
  regExpStartingWith('http' + optional('s') + '://')

const NAKED_URL_TERMINATOR_PATTERN =
  regExpStartingWith(WHITESPACE_CHAR)