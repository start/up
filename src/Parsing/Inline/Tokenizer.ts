import { escapeForRegex, getRegExpStartingWith, optional, atLeast, ANY_WHITESPACE, WHITESPACE_CHAR } from '../../Patterns'
import { REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { UpConfig } from '../../UpConfig'
import { RichConvention } from './RichConvention'
import { MediaConvention } from './MediaConvention'
import { applyRaisedVoices }  from './RaisedVoices/applyRaisedVoices'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { insertBracketsInsideBracketedConventions } from './insertBracketsInsideBracketedConventions'
import { OnMatch } from './OnMatch'
import { last, contains } from '../../CollectionHelpers'
import { TokenizerGoal } from './TokenizerGoal'
import { TokenizableRichSandwich } from './TokenizableRichSandwich'
import { Bracket } from './Bracket'
import { TokenizableBracket } from './TokenizableBracket'
import { TokenizableMedia } from './TokenizableMedia'
import { FailedGoalTracker } from './FailedGoalTracker'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnTokenizerContextClose } from './OnTokenizerContextClose'
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

  // Any time we open a new convention, we add it to `openContexts`.
  private openContexts: TokenizerContext[] = []

  private failedGoalTracker: FailedGoalTracker = new FailedGoalTracker()

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, usually a PlainTextToken.
  private buffer = ''

  private richBrackets = [
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
  ].map(args => new TokenizableRichSandwich(args))

  // Unlike the rich bracket conventions, these bracket conventions don't produce special tokens.
  //
  // They can only appear inside URLs or media conventions' descriptions, and they allow matching
  // brackets to be included without having to escape any closing brackets.
  private rawBrackets = [
    { goal: TokenizerGoal.ParenthesizedInRawText, bracket: PARENTHESIS },
    { goal: TokenizerGoal.SquareBracketedInRawText, bracket: SQUARE_BRACKET },
    { goal: TokenizerGoal.CurlyBracketedInRawText, bracket: CURLY_BRACKET }
  ].map(args => new TokenizableBracket(args))

  // Link's URLs can be paranthesized, square bracketed, or curly bracketed.
  private bracketedLinkUrls = [
    { goal: TokenizerGoal.ParenthesizedLinkUrl, bracket: PARENTHESIS },
    { goal: TokenizerGoal.SquareBracketedLinkUrl, bracket: SQUARE_BRACKET },
    { goal: TokenizerGoal.CurlyBracketedLinkUrl, bracket: CURLY_BRACKET }
  ].map(args => new TokenizableBracket(args))

  // A rich sandwich:
  //
  // 1. Can contain other inline conventions
  // 2. Involves just two delimiters: one to mark its start, and one to mark its end
  //
  // Some of rich sandwiches rely on user-configurable values, so we assign this field in the
  // `configureConventions` method where we have access to the user's config settings.
  private richSandwichesExceptRichBrackets: TokenizableRichSandwich[]

  // These conventions are for images, audio, and video. They also rely on user-configurable values.
  private mediaConventions: TokenizableMedia[]

  constructor(entireText: string, config: UpConfig) {
    this.consumer = new InlineConsumer(entireText)
    this.configureConventions(config)

    this.tokenize()
  }

  private configureConventions(config: UpConfig): void {
    this.mediaConventions =
      [AUDIO, IMAGE, VIDEO].map(media =>
        new TokenizableMedia(media, config.localizeTerm(media.nonLocalizedTerm)))

    this.richSandwichesExceptRichBrackets = [
      {
        richConvention: SPOILER_CONVENTION,
        startPattern: SQUARE_BRACKET.startPattern + escapeForRegex(config.settings.i18n.terms.spoiler) + ':' + ANY_WHITESPACE,
        endPattern: SQUARE_BRACKET.endPattern
      }, {
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
    ].map(args => new TokenizableRichSandwich(args))
  }

  private tokenize(): void {
    while (!this.isDone()) {

      this.tryToCollectEscapedChar()
        || this.tryToCloseAnyContext()
        || this.performContextSpecificBehavior()
        || this.tryToTokenizeRaisedVoicePlaceholders()
        || this.tryToOpenAnyConvention()
        || this.bufferCurrentChar()
    }

    this.tokens =
      nestOverlappingConventions(
        applyRaisedVoices(
          insertBracketsInsideBracketedConventions(this.tokens)))
  }

  private performContextSpecificBehavior(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const context = this.openContexts[i]

      if (context.afterTryingToCloseOuterContexts()) {
        return true
      }
    }

    return false
  }

  private tryToCollectEscapedChar(): boolean {
    const ESCAPE_CHAR = '\\'

    if (this.consumer.currentChar !== ESCAPE_CHAR) {
      return false
    }

    this.consumer.advanceTextIndex(1)

    return (
      this.consumer.reachedEndOfText()
      || this.bufferCurrentChar()
    )
  }

  private isDone(): boolean {
    return this.consumer.reachedEndOfText() && this.resolveOpenContexts()
  }

  private tryToCloseAnyContext(): boolean {
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

        if (openContext.onCloseFlushBufferTo != null) {
          this.flushBufferToTokenOfKind(openContext.onCloseFlushBufferTo)
        }

        openContext.close()

        if (openContext.closeInnerContextsWhenClosing) {
          this.openContexts.splice(i)
        } else {
          this.openContexts.splice(i, 1)
        }

        return true
      }

      if (openContext.beforeTryingToCloseOuterContexts()) {
        return true
      }

      if (openContext.goal === TokenizerGoal.NakedUrl) {
        innerNakedUrlContextIndex = i
      }
    }

    return false
  }

  private shouldCloseContext(context: TokenizerContext): boolean {
    return this.consumer.advanceAfterMatch({
      pattern: context.endPattern,

      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        if (context.doNotConsumeEndPattern) {
          this.consumer.textIndex -= match.length
        }
      }
    })
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.tryToOpenInlineCode()
      || this.tryToOpenAnyRichSandwich()
      || (this.isDirectlyFollowingLinkBrackets() && this.tryToOpenAnyLinkUrl())
      || this.tryToOpenAnyRichBracket()
      || this.tryToOpenNakedUrl())
  }

  private tryToOpenInlineCode(): boolean {
    return this.tryToOpenContext({
      goal: TokenizerGoal.InlineCode,
      startPattern: INLINE_CODE_DELIMITER_PATTERN,
      flushBufferToPlainTextTokenBeforeOpening: true,
      beforeTryingToCloseOuterContexts: () => this.bufferCurrentChar(),
      endPattern: INLINE_CODE_DELIMITER_PATTERN,
      onCloseFlushBufferTo: TokenKind.InlineCode
    })
  }

  private tryToOpenAnyLinkUrl(): boolean {
    return this.bracketedLinkUrls.some(bracket => this.tryToOpenLinkUrl(bracket))
  }

  private tryToOpenLinkUrl(bracketedLinkUrl: TokenizableBracket): boolean {
    return this.tryToOpenContext({
      goal: bracketedLinkUrl.goal,
      startPattern: bracketedLinkUrl.startPattern,
      flushBufferToPlainTextTokenBeforeOpening: false,
      beforeTryingToCloseOuterContexts: () => this.bufferRawText(),
      endPattern: bracketedLinkUrl.endPattern,
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
    })
  }

  private isDirectlyFollowingLinkBrackets(): boolean {
    const linkableBrackets = [
      TokenKind.ParenthesizedEnd,
      TokenKind.SquareBracketedEnd,
      TokenKind.ActionEnd
    ]

    return (
      this.buffer === ''
      && this.tokens.length
      && contains(linkableBrackets, last(this.tokens).kind)
    )
  }

  private tryToOpenAnyRichBracket(): boolean {
    return this.richBrackets.some(bracket => this.tryToOpenRichSandwich(bracket))
  }

  private tryToOpenAnyRichSandwich(): boolean {
    return this.richSandwichesExceptRichBrackets.some(sandwich => this.tryToOpenRichSandwich(sandwich))
  }

  private tryToOpenRichSandwich(sandwich: TokenizableRichSandwich): boolean {
    return this.tryToOpenContext({
      goal: sandwich.goal,
      startPattern: sandwich.startPattern,
      flushBufferToPlainTextTokenBeforeOpening: true,
      endPattern: sandwich.endPattern,
      onCloseFlushBufferTo: TokenKind.PlainText,

      onClose: (context) => {
        const startToken = new Token({ kind: sandwich.startTokenKind })
        const endToken = new Token({ kind: sandwich.endTokenKind })
        startToken.associateWith(endToken)

        this.insertTokenAtStartOfContext(context, startToken)
        this.tokens.push(endToken)
      }
    })
  }

  private tryToOpenAnyRawTextBracket(): boolean {
    return this.rawBrackets.some(bracket =>
      this.tryToOpenRawBracket(bracket))
  }

  private tryToOpenRawBracket(bracket: TokenizableBracket): boolean {
    return this.tryToOpenContext({
      goal: bracket.goal,
      startPattern: bracket.startPattern,
      flushBufferToPlainTextTokenBeforeOpening: false,
      onOpen: () => { this.buffer += bracket.open },
      endPattern: bracket.endPattern,
      onClose: () => { this.buffer += bracket.close }
    })
  }

  private tryToOpenNakedUrl(): boolean {
    return this.tryToOpenContext({
      goal: TokenizerGoal.NakedUrl,
      startPattern: NAKED_URL_PROTOCOL_PATTERN,
      flushBufferToPlainTextTokenBeforeOpening: true,
      onOpen: urlProtocol => {
        this.createTokenAndAppend({ kind: TokenKind.NakedUrlProtocolAndStart, value: urlProtocol })
      },
      afterTryingToCloseOuterContexts: () => this.bufferRawText(),
      endPattern: NAKED_URL_TERMINATOR_PATTERN,
      doNotConsumeEndPattern: true,
      closeInnerContextsWhenClosing: true,
      onCloseFlushBufferTo: TokenKind.NakedUrlAfterProtocolAndEnd
    })
  }

  private bufferRawText(): boolean {
    return (
      this.tryToOpenAnyRawTextBracket()
      || this.bufferCurrentChar())
  }

  private closeAndRemoveOpenContext(args: { context: TokenizerContext, closeInnerContexts?: boolean }): void {
    const { closeInnerContexts } = args
    const contextToClose = args.context

    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const openContext = this.openContexts[i]
      const foundTheContextToClose = (openContext === contextToClose)

      if (foundTheContextToClose || closeInnerContexts) {
        this.openContexts.splice(i, 1)
      }

      if (foundTheContextToClose) {
        return
      }

      // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed first.
      if (openContext.goal === TokenizerGoal.NakedUrl) {
        this.flushBufferToNakedUrlEndToken()

        // We need to close the naked URL's context, as well as the contexts of any raw text brackets inside it.
        this.openContexts.splice(i)
      }
    }
  }

  private tryToOpenContext(
    convention: TokenizableConvention
  ): boolean {
    const { goal, startPattern, flushBufferToPlainTextTokenBeforeOpening, onOpen } = convention

    return this.canTry(goal) && this.consumer.advanceAfterMatch({
      pattern: startPattern,

      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        if (flushBufferToPlainTextTokenBeforeOpening) {
          this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
        }

        const context = new TokenizerContext(convention, this.getCurrentSnapshot())

        this.openContexts.push(context)

        if (onOpen) {
          onOpen(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
        }
      }
    })
  }

  private getCurrentSnapshot(): TokenizerSnapshot {
    return new TokenizerSnapshot({
      textIndex: this.consumer.textIndex,
      tokens: this.tokens,
      openContexts: this.openContexts,
      bufferedText: this.buffer
    })
  }

  private resolveOpenContexts(): boolean {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      switch (context.goal) {
        case TokenizerGoal.NakedUrl:
          this.flushBufferToNakedUrlEndToken()
          break

        // Raw bracketed text can be left unclosed
        case TokenizerGoal.ParenthesizedInRawText:
        case TokenizerGoal.SquareBracketedInRawText:
        case TokenizerGoal.CurlyBracketedInRawText:
          break;

        default:
          this.resetToBeforeContext(context)
          return false
      }
    }

    this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
    return true
  }

  private resetToBeforeContext(context: TokenizerContext): void {
    this.failedGoalTracker.registerFailure(context)

    this.tokens = context.snapshot.tokens
    this.openContexts = context.snapshot.openContexts
    this.buffer = context.snapshot.bufferedText
    this.consumer.textIndex = context.snapshot.textIndex

    for (const context of this.openContexts) {
      context.reset()
    }
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
    this.createTokenAndAppend({ kind, value: this.flushBuffer() })
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
        this.createTokenAndAppend({ kind: asteriskTokenKind, value: asterisks })
      }
    })
  }

  private createTokenAndAppend(args: NewTokenArgs): void {
    this.tokens.push(new Token(args))
  }

  private insertTokenAtStartOfContext(context: TokenizerContext, token: Token): void {
    const newTokenIndex = context.initialTokenIndex

    this.tokens.splice(newTokenIndex, 0, token)

    for (const openContext of this.openContexts) {
      openContext.registerTokenInsertion({ atIndex: newTokenIndex, onBehalfOfContext: context })
    }
  }

  // This method always returns true. Why?
  //
  // It allows us to cleanly chain it with other boolean tokenizer methods, using this method as a last resort. 
  private bufferCurrentChar(): boolean {
    this.buffer += this.consumer.currentChar
    this.consumer.advanceTextIndex(1)

    return true
  }

  private flushBufferToPlainTextTokenIfBufferIsNotEmpty(): void {
    if (this.buffer) {
      this.flushBufferToTokenOfKind(TokenKind.PlainText)
    }
  }

  private canTry(goal: TokenizerGoal, textIndex = this.consumer.textIndex): boolean {
    return !this.failedGoalTracker.hasFailed(goal, textIndex)
  }

  private hasGoal(...goals: TokenizerGoal[]): boolean {
    return this.openContexts.some(context => contains(goals, context.goal))
  }
}


const PARENTHESIS =
  new Bracket('(', ')')

const SQUARE_BRACKET =
  new Bracket('[', ']')

const CURLY_BRACKET =
  new Bracket('{', '}')


const INLINE_CODE_DELIMITER_PATTERN =
  getRegExpStartingWith('`')

const RAISED_VOICE_DELIMITER_PATTERN =
  getRegExpStartingWith(atLeast(1, escapeForRegex('*')))

const NAKED_URL_PROTOCOL_PATTERN =
  getRegExpStartingWith('http' + optional('s') + '://')

const NAKED_URL_TERMINATOR_PATTERN =
  getRegExpStartingWith(WHITESPACE_CHAR)