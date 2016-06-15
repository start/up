import { EMPHASIS_CONVENTION, STRESS_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from '../RichConventions'
import { escapeForRegex, regExpStartingWith, all, either, optional, exactly } from '../../../PatternHelpers'
import { ANY_WHITESPACE, WHITESPACE_CHAR, LETTER, DIGIT} from '../../../PatternPieces'
import { NON_BLANK_PATTERN } from '../../../Patterns'
import { AUDIO, IMAGE, VIDEO } from '../MediaConventions'
import { UpConfig } from '../../../UpConfig'
import { RichConvention } from '../RichConvention'
import { MediaConvention } from '../MediaConvention'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { insertBracketsInsideBracketedConventions } from './insertBracketsInsideBracketedConventions'
import { OnTextMatch } from './OnTextMatch'
import { last, concat, contains, reversed } from '../../../CollectionHelpers'
import { Bracket } from './Bracket'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineTextConsumer } from './InlineTextConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { NewTokenArgs } from './NewTokenArgs'
import { TokenizableConvention } from './TokenizableConvention'
import { EncloseWithinArgs } from './EncloseWithinArgs'
import { RaisedVoiceHandler } from './RaisedVoiceHandler'


export class Tokenizer {
  tokens: Token[] = []

  private consumer: InlineTextConsumer

  // The this buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, usually a PlainTextToken.
  private buffer = ''

  // Any time we open a new convention, we create a new context for it and add it to this collection.
  private openContexts: ConventionContext[] = []

  // When a convention is missing its closing delimiter, we backtrack and add the convention to our
  // `failedConventionTracker`.
  private failedConventionTracker: FailedConventionTracker = new FailedConventionTracker()

  // Most of our conventions are thrown in this collection. We try to open these conventions in order.
  //
  // The conventions not included in this collection are:
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
    startPattern: NAKED_URL_SCHEME_PATTERN,
    endPattern: NAKED_URL_TERMINATOR_PATTERN,

    flushBufferToPlainTextTokenBeforeOpening: true,

    onOpen: urlScheme => {
      this.appendNewToken({ kind: TokenKind.NakedUrlSchemeAndStart, value: urlScheme })
    },

    insteadOfTryingToOpenUsualConventions: () => this.bufferRawText(),

    leaveEndPatternForAnotherConventionToConsume: true,
    onCloseFlushBufferTo: TokenKind.NakedUrlAfterSchemeAndEnd,
    closeInnerContextsWhenClosing: true,

    resolveWhenLeftUnclosed: () => this.flushBufferToNakedUrlEndToken(),
  }

  // "Raised voices" means emphasis and stress.
  //
  // We handle emphasis and stress in a manner incompatible with the rest of our conventions, so we throw
  // all that special logic into the RaisedVoiceHandler class. More information can be found in that class.
  private raisedVoiceHandlers = ['*', '_'].map(
    delimiterChar => new RaisedVoiceHandler({
      delimiterChar,

      encloseWithin: (args) => {
        this.closeNakedUrlContextIfOneIsOpen()
        this.encloseWithin(args)
      },

      insertPlainTextTokenAt: (args) => {
        this.insertToken({
          token: new Token({ kind: TokenKind.PlainText, value: args.text }),
          atIndex: args.atIndex
        })
      }
    }))

  constructor(entireText: string, private config: UpConfig) {
    this.consumer = new InlineTextConsumer(entireText)
    this.configureConventions()

    this.tokenize()
  }

  private configureConventions(): void {
    this.conventions.push(
      ...this.getFootnoteConventions())

    this.conventions.push(...concat([
      {
        richConvention: SPOILER_CONVENTION,
        nonLocalizedTerm: 'spoiler'
      }, {
        richConvention: NSFW_CONVENTION,
        nonLocalizedTerm: 'nsfw'
      }, {
        richConvention: NSFL_CONVENTION,
        nonLocalizedTerm: 'nsfl'
      }
    ].map(args => this.getConventionsForRichBracketedTerm(args))))

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

    this.conventions.push(
      ...this.getLinkifyingUrlConventions())

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

    this.conventions.push(...[
      {
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
      this.nakedUrlConvention)
  }

  private tokenize(): void {
    while (!this.isDone()) {
      this.tryToCollectEscapedChar()
        || this.tryToCloseAnyConvention()
        || this.performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts()
        || this.tryToOpenAnyConvention()
        || this.bufferCurrentChar()
    }

    this.tokens =
      nestOverlappingConventions(
        insertBracketsInsideBracketedConventions(this.tokens))
  }

  private isDone(): boolean {
    return this.consumer.reachedEndOfText() && this.resolveUnclosedContexts()
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

    for (const raisedVoiceHandler of this.raisedVoiceHandlers) {
      raisedVoiceHandler.treatUnusedStartDelimitersAsPlainText()
    }

    return true
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
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const openContext = this.openContexts[i]
      const { convention } = openContext

      if (this.shouldCloseContext(openContext)) {
        // If `closeOrUndoContext` fails, it resets the tokenizer to where it was before we opened the
        // context, then returns false.
        //
        // We know we won't be able to close any outer conventions at our current position, because we
        // already failed to do so when we opened the now-failed context.
        return this.closeOrUndoContext({ atIndex: i })
      }

      if (openContext.doIsteadOfTryingToCloseOuterContexts()) {
        return true
      }
    }

    return this.tryToCloseAnyRaisedVoices()
  }


  private shouldCloseContext(context: ConventionContext): boolean {
    const { convention } = context

    return this.consumer.consume({
      pattern: convention.endPattern,
      thenBeforeAdvancingTextIndex: match => {
        if (convention.leaveEndPatternForAnotherConventionToConsume) {
          this.consumer.textIndex -= match.length
        }
      }
    })
  }

  // This method returns true if the context was able to be closed.
  //
  // Otherwise, the tokenizer is reset to where it was before the context was opened, and this method
  // returns false. 
  private closeOrUndoContext(args: { atIndex: number }): boolean {
    const contextIndex = args.atIndex
    const openContext = this.openContexts[contextIndex]
    const { convention } = openContext

    for (let i = this.openContexts.length - 1; i > contextIndex; i--) {
      if (this.openContexts[i].convention === this.nakedUrlConvention) {
        // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed first.
        this.flushBufferToNakedUrlEndToken()

        // We need to close the naked URL's context, as well as the contexts of any raw text brackets
        // inside it.
        this.openContexts.splice(i)
        break
      }
    }

    if (convention.onCloseFlushBufferTo != null) {
      this.flushBufferToTokenOfKind(convention.onCloseFlushBufferTo)
    }

    openContext.close()

    if (convention.onCloseFailIfCannotTranformInto) {
      return this.tryToTransformConvention({ belongingToContextAtIndex: contextIndex })
    }

    this.openContexts.splice(contextIndex, 1)

    if (convention.closeInnerContextsWhenClosing) {
      // Since we just removed the context at `contextIndex`, its inner contexts will now start at
      // `contextIndex`.           
      this.openContexts.splice(contextIndex)
    }

    return true
  }

  private tryToTransformConvention(args: { belongingToContextAtIndex: number }): boolean {
    const contextIndex = args.belongingToContextAtIndex
    const context = this.openContexts[contextIndex]

    const couldTransform =
      context.convention.onCloseFailIfCannotTranformInto.some(convention => this.tryToOpen(convention))

    if (!couldTransform) {
      // We couldn't transform, so it's time to fail.
      this.openContexts.splice(contextIndex)
      this.resetToBeforeContext(context)

      return false
    }

    // So... we've just opened a new context for the convention we're transforming into. However, we
    // actually want to replace this context's convention with the new one instead.
    context.convention = this.openContexts.pop().convention

    if (context.convention.closeInnerContextsWhenClosing) {
      this.openContexts.splice(contextIndex + 1)
    }

    return true
  }

  private tryToCloseAnyRaisedVoices(): boolean {
    if (!this.consumer.isFollowingNonWhitespace) {
      // For a delimiter to close any raised voice conventions, it must look like it's touching the end
      // of some content. If instead, the delimiter is directly following whitespace (or is the first
      // character the text), we don't try to close anything with it.
      return false
    }

    return this.raisedVoiceHandlers.some(handler => {
      let didCloseAnyRaisedVoices = false

      this.consumer.consume({
        pattern: handler.delimiterPattern,

        thenBeforeAdvancingTextIndex: delimiter => {
          didCloseAnyRaisedVoices = handler.tryToCloseAnyRaisedVoices(delimiter)

          if (!didCloseAnyRaisedVoices) {
            this.consumer.textIndex -= delimiter.length
          }
        }
      })

      return didCloseAnyRaisedVoices
    })
  }

  private closeNakedUrlContextIfOneIsOpen(): void {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      if (this.openContexts[i].convention === this.nakedUrlConvention) {
        this.flushBufferToNakedUrlEndToken()

        // We need to close the naked URL's context, as well as the contexts of any raw text brackets
        // inside it.
        this.openContexts.splice(i)
      }
    }
  }

  private encloseContextWithin(richConvention: RichConvention, context: ConventionContext): void {
    this.encloseWithin({ richConvention, startingBackAt: context.startTokenIndex })
  }

  private encloseWithin(args: EncloseWithinArgs): void {
    const { richConvention, startingBackAt } = args

    this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()

    const startToken = new Token({ kind: richConvention.startTokenKind })
    const endToken = new Token({ kind: richConvention.endTokenKind })
    startToken.associateWith(endToken)

    this.insertToken({ token: startToken, atIndex: startingBackAt })
    this.tokens.push(endToken)
  }

  private performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts(): boolean {
    return reversed(this.openContexts)
      .some(context => context.doInsteadOfTryingToOpenUsualContexts())
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.conventions.some(convention => this.tryToOpen(convention))
      || this.tryToHandleRaisedVoiceDelimiter())
  }

  private tryToHandleRaisedVoiceDelimiter(): boolean {
    return this.raisedVoiceHandlers.some(handler =>
      this.consumer.consume({
        pattern: handler.delimiterPattern,

        thenBeforeAdvancingTextIndex: (delimiter, matchPrecedesNonWhitespace) => {
          if (!matchPrecedesNonWhitespace) {
            // If the match doesn't precede non-whitespace, then we treat the delimiter as plain text.
            // We already know the delimiter wasn't able to close any raised voice conventions, and we
            // we now know it can't open any, either (because the delimiter needs to look like it's
            // touching the beginning of some content).
            this.buffer += delimiter
            return
          }

          this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
          handler.addStartDelimiter(delimiter, this.tokens.length)
        }
      })
    )
  }

  private isDirectlyFollowingTokenOfKind(kinds: TokenKind[]): boolean {
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
    const { startPattern, onlyOpenIfDirectlyFollowingTokenOfKind, flushBufferToPlainTextTokenBeforeOpening, onOpen } = convention

    return (
      this.canTry(convention)

      && this.consumer.consume({
        pattern: startPattern,

        thenBeforeAdvancingTextIndex: (match, matchPrecedesNonWhitespace, ...captures) => {
          if (flushBufferToPlainTextTokenBeforeOpening) {
            this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
          }

          this.openContexts.push(new ConventionContext(convention, this.getCurrentSnapshot()))

          if (onOpen) {
            onOpen(match, matchPrecedesNonWhitespace, ...captures)
          }
        }
      })
    )
  }

  private getCurrentSnapshot(): TokenizerSnapshot {
    return new TokenizerSnapshot({
      textIndex: this.consumer.textIndex,
      tokens: this.tokens,
      openContexts: this.openContexts.map(context => context.clone()),
      raisedVoiceHandlerSnapshots: this.raisedVoiceHandlers.map(handler => handler.getCurrentSnapshot()),
      buffer: this.buffer
    })
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

    const { onlyOpenIfDirectlyFollowingTokenOfKind } = convention

    return (
      !this.failedConventionTracker.hasFailed(convention, textIndex)
      && (!onlyOpenIfDirectlyFollowingTokenOfKind || this.isDirectlyFollowingTokenOfKind(onlyOpenIfDirectlyFollowingTokenOfKind))
    )
  }

  private resetToBeforeContext(context: ConventionContext): void {
    this.failedConventionTracker.registerFailure(context)

    const { snapshot } = context

    this.tokens = snapshot.tokens
    this.buffer = snapshot.buffer
    this.consumer.textIndex = snapshot.textIndex
    this.openContexts = snapshot.openContexts 

    for (let i = 0; i < this.raisedVoiceHandlers.length; i++) {
      this.raisedVoiceHandlers[i].reset(snapshot.raisedVoiceHandlerSnapshots[i])
    }
  }

  private appendNewToken(args: NewTokenArgs): void {
    this.tokens.push(new Token(args))
  }

  private flushBufferToNakedUrlEndToken(): void {
    this.flushBufferToTokenOfKind(TokenKind.NakedUrlAfterSchemeAndEnd)
  }

  private flushBuffer(): string {
    const buffer = this.buffer
    this.buffer = ''

    return buffer
  }

  private flushBufferToTokenOfKind(kind: TokenKind): void {
    this.appendNewToken({ kind, value: this.flushBuffer() })
  }

  private insertToken(args: { token: Token, atIndex: number }): void {
    const { token } = args
    let { atIndex } = args

    this.tokens.splice(atIndex, 0, token)

    for (const openContext of this.openContexts) {
      openContext.registerTokenInsertion({ atIndex })
    }

    for (const raisedVoiceHandler of this.raisedVoiceHandlers) {
      raisedVoiceHandler.registerTokenInsertion({ atIndex })
    }
  }

  private flushBufferToPlainTextTokenIfBufferIsNotEmpty(): void {
    if (this.buffer) {
      this.flushBufferToTokenOfKind(TokenKind.PlainText)
    }
  }

  private applyConfigSettingsToUrl(url: string): string {
    url = url.trim()

    if (!url) {
      return url
    }

    switch (url[0]) {
      case '/':
        return this.config.settings.baseForUrlsStartingWithSlash + url

      case '#':
        return this.config.settings.baseForUrlsStartingWithFragmentIdentifier + url
    }

    if (!URL_SCHEME_PATTERN.test(url)) {
      return this.config.settings.defaultUrlScheme + url
    }

    return url
  }

  private getLinkUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowingTokenOfKind: [
        TokenKind.ParenthesizedEnd,
        TokenKind.SquareBracketedEnd,
        TokenKind.ActionEnd
      ],

      insteadOfTryingToCloseOuterContexts: () => this.bufferRawText(),
      closeInnerContextsWhenClosing: true,

      onClose: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())

        // The last token is guaranteed to be a ParenthesizedEnd, SquareBracketedEnd, or ActionEnd token.
        //
        // We'll replace that end token and its corresponding start token with link tokens.
        const originalEndToken = last(this.tokens)
        originalEndToken.value = url
        originalEndToken.kind = LINK_CONVENTION.endTokenKind

        originalEndToken.correspondsToToken.kind = LINK_CONVENTION.startTokenKind
      }
    }))
  }

  // Okay, this method name is a bit confusing.
  //
  // Spoilers, NSFW/NSFL conventions, and footnotes can be "linkified" by immediately following their closing bracket
  // with a parenthesized/bracketed URL. They remain spoilers, NSFW/NSFL conventions, or footnotes, but their entire
  // contents are placed into a link. 
  private getLinkifyingUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowingTokenOfKind: [
        TokenKind.SpoilerEnd,
        TokenKind.NsfwEnd,
        TokenKind.NsflEnd,
        TokenKind.FootnoteEnd,
      ],

      insteadOfTryingToCloseOuterContexts: () => this.bufferRawText(),
      closeInnerContextsWhenClosing: true,

      onClose: (context) => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())

        const linkEndToken = new Token({ kind: LINK_CONVENTION.endTokenKind, value: url })
        const linkStartToken = new Token({ kind: LINK_CONVENTION.startTokenKind })
        linkStartToken.associateWith(linkEndToken)

        // We'll insert our new link end token right before the original end token, and we'll insert a our new link
        // start token right after the original end token's corresponding start token.

        const indexOfOriginalEndToken = this.tokens.length - 1
        this.insertToken({ token: linkEndToken, atIndex: indexOfOriginalEndToken })

        const originalStartToken = last(this.tokens).correspondsToToken
        const indexAfterOriginalStartToken = this.tokens.indexOf(originalStartToken) + 1
        this.insertToken({ token: linkStartToken, atIndex: indexAfterOriginalStartToken })
      }
    }))
  }

  private getFootnoteConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket =>
      this.getRichSandwichConvention({
        richConvention: FOOTNOTE_CONVENTION,
        startPattern: ANY_WHITESPACE + exactly(2, bracket.startPattern),
        endPattern: exactly(2, bracket.endPattern)
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

  private getBracketedTermStartPattern(nonLocalizedTerm: string, bracket: Bracket): string {
    return (
      bracket.startPattern
      + escapeForRegex(this.config.localizeTerm(nonLocalizedTerm)) + ':'
      + ANY_WHITESPACE)
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
        this.encloseContextWithin(richConvention, context)
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

      onClose: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        this.appendNewToken({ kind: TokenKind.MediaUrlAndEnd, value: url })
      }
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

const NAKED_URL_SCHEME_PATTERN =
  regExpStartingWith('http' + optional('s') + '://')

const URL_SCHEME_PATTERN =
  regExpStartingWith(
    LETTER + all(either(LETTER, DIGIT, '-', escapeForRegex('+'), escapeForRegex('.'))) + ':')

const NAKED_URL_TERMINATOR_PATTERN =
  regExpStartingWith(WHITESPACE_CHAR)
