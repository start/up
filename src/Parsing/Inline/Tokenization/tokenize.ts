import { EMPHASIS_CONVENTION, STRESS_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from '../RichConventions'
import { escapeForRegex, regExpStartingWith, solely, everyOptional, either, optional, atLeast, exactly, followedBy, notFollowedBy, anyCharMatching, anyCharNotMatching, capture } from '../../PatternHelpers'
import { SOME_WHITESPACE, ANY_WHITESPACE, WHITESPACE_CHAR, DIGIT } from '../../PatternPieces'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { ESCAPER_CHAR } from '../../Strings'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from '../MediaConventions'
import { UpConfig } from '../../../UpConfig'
import { RichConvention } from '../RichConvention'
import { MediaConvention } from '../MediaConvention'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { insertBracketsInsideBracketedConventions } from './insertBracketsInsideBracketedConventions'
import { last, concat, reversed } from '../../../CollectionHelpers'
import { Bracket } from './Bracket'
import { BRACKETS } from './Brackets'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineTextConsumer } from './InlineTextConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { EncloseWithinRichConventionArgs } from './EncloseWithinRichConventionArgs'
import { TokenizableConvention, OnConventionEvent } from './TokenizableConvention'
import { RaisedVoiceHandler } from './RaisedVoiceHandler'


// Returns a collection of tokens representing inline conventions and their components.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
// For more information about this process, see the comments in `nestOverlappingConventions.ts`.
export function tokenize(text: string, config: UpConfig): Token[] {
  const textWithoutLeadingWhitespace =
    text.replace(LEADING_WHITESPACE_PATTERN, '')

  return new Tokenizer(textWithoutLeadingWhitespace, config).tokens
}

const LEADING_WHITESPACE_PATTERN =
  regExpStartingWith(ANY_WHITESPACE)


// When tokenizing a link, we always start with one of the following conventions. If followed by a
// (valid!) bracketed URL, the original convention is replaced by a link.
const CONVENTIONS_THAT_ARE_REPLACED_BY_LINK_IF_FOLLOWED_BY_BRACKETED_URL = [
  PARENTHESIZED_CONVENTION,
  SQUARE_BRACKETED_CONVENTION,
  ACTION_CONVENTION
]

// In contrast, the following conventions are "linkified" if followed by a bracketed URL. The original
// conventions aren't replaced, but their entire contents are placed inside a link.
const COVENTIONS_WHOSE_CONTENTS_ARE_LINKIFIED_IF_FOLLOWED_BY_BRACKETED_URL = [
  SPOILER_CONVENTION,
  NSFW_CONVENTION,
  NSFL_CONVENTION,
  FOOTNOTE_CONVENTION
]


class Tokenizer {
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
  // Most of our conventions are just thrown in the `conventions` collection (and this one is, too), but we
  // keep a direct reference to the naked URL convention to help us determine whether another convention
  // contains a naked URL.
  private nakedUrlConvention: TokenizableConvention = {
    startPattern: regExpStartingWith('http' + optional('s') + '://'),
    isCutShortByWhitespace: true,

    flushesBufferToPlainTextTokenBeforeOpening: true,

    whenOpening: urlScheme => {
      this.appendNewToken(TokenKind.NakedUrlSchemeAndStart, urlScheme)
    },

    insteadOfOpeningUsualConventionsWhileOpen: () => this.bufferRawText(),

    whenClosingItFlushesBufferTo: TokenKind.NakedUrlAfterSchemeAndEnd,
    whenClosingItAlsoClosesInnerConventions: true,

    insteadOfFailingWhenLeftUnclosed: () => this.flushBufferToNakedUrlEndToken(),
  }

  // "Raised voices" means emphasis and stress.
  //
  // We handle emphasis and stress in a manner incompatible with the rest of our conventions, so we throw
  // all that special logic into the RaisedVoiceHandler class. More information can be found in that class.
  private raisedVoiceHandlers = ['*', '_'].map(
    delimiterChar => new RaisedVoiceHandler({
      delimiterChar,

      encloseWithinRichConvention: (richConvention, startingBackAtIndex) => {
        this.closeNakedUrlContextIfOneIsOpen()
        this.encloseWithin({ richConvention, startingBackAtIndex })
      },

      insertPlainTextToken: (text, atIndex) => {
        this.insertToken({
          token: new Token(TokenKind.PlainText, text),
          atIndex: atIndex
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
      startPattern: regExpStartingWith('`'),
      endPattern: regExpStartingWith('`'),

      flushesBufferToPlainTextTokenBeforeOpening: true,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferCurrentChar(),
      whenClosingItFlushesBufferTo: TokenKind.InlineCode
    })

    this.conventions.push(
      ...this.getLinkUrlConventions())

    this.conventions.push(
      ...this.getConventionsForWhitespaceFollowedByLinkUrl())

    this.conventions.push(
      ...this.getMediaDescriptionConventions())

    this.conventions.push(
      ...this.getLinkifyingUrlConventions())

    this.conventions.push(
      ...this.getConventionsForWhitespaceFollowedByLinkifyingUrl())

    this.conventions.push(...[
      {
        richConvention: PARENTHESIZED_CONVENTION,
        startDelimiter: '(',
        endDelimiter: ')'
      }, {
        richConvention: SQUARE_BRACKETED_CONVENTION,
        startDelimiter: '[',
        endDelimiter: ']'
      }, {
        richConvention: ACTION_CONVENTION,
        startDelimiter: '{',
        endDelimiter: '}'
      }, {
        richConvention: REVISION_DELETION_CONVENTION,
        startDelimiter: '~~',
        endDelimiter: '~~',
      }, {
        richConvention: REVISION_INSERTION_CONVENTION,
        startDelimiter: '++',
        endDelimiter: '++',
      }
    ].map(args => this.getRichSandwichConventionNotRequiringBacktracking(args)))

    this.conventions.push(
      this.nakedUrlConvention)
  }

  private tokenize(): void {
    while (true) {
      this.bufferContentThatCannotOpenOrCloseAnyConventions()

      if (this.isDone()) {
        break
      }

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

      if (!context.doInsteadOfFailingWhenLeftUnclosed()) {
        this.backtrackToBeforeContext(context)
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
    if (this.consumer.currentChar === ESCAPER_CHAR) {
      this.consumer.advanceTextIndex(1)
      return this.consumer.reachedEndOfText() || this.bufferCurrentChar()
    }

    return false
  }

  // This method exists purely for optimization.
  private bufferContentThatCannotOpenOrCloseAnyConventions(): void {
    const tryToBuffer = (pattern: RegExp) =>
      this.consumer.consume({
        pattern,
        thenBeforeAdvancingTextIndex: match => { this.buffer += match }
      })

    // Normally, whitespace doesn't have much of an impact on tokenization:
    //
    // - It can't close most conventions
    // - It can only open conventions when followed by a start bracket (footnotes, some bracketed URLs)
    //
    // However, some conventions:
    //
    // - Are cut short by whitespace (naked URLs)
    // - Fail if whitespace is encountered before they close (some bracketed URLs)
    //
    // Under normal circumstances, we can skip over (i.e. simply buffer) any whitespace that isn't followed
    // bt a start bracket. That's great news, because documents have whitespace all over the place! However,
    // if any of our open conventions rely on whitespace, then we don't have that luxury.
    //
    // NOTE: This is pretty fragile! To determine whether any of our open conventions rely on whitespace,
    // we check only two properties:
    //
    // 1. isCutShortByWhitespace
    // 2. failsIfWhitespaceIsEnounteredBeforeClosing
    //
    // This is completely sufficient for now, but it wouldn't work if any of our conventions had any leading
    // whitespace in their end patterns.
    const canTryToBufferWhitespace =
      this.openContexts.every(context =>
        !context.convention.isCutShortByWhitespace
        && !context.convention.failsIfWhitespaceIsEnounteredBeforeClosing)

    do {
      // First, let's try to skip any content that will *never* open or close any conventions.
      tryToBuffer(CONTENT_THAT_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN)
    } while (
      // Next, if we can try to buffer whitespace...
      canTryToBufferWhitespace
      // ... then let's try! If we succeed, then we'll try to skip more non-whitespace characters. Otherwise,
      // we've got to bail, because the current character can't be skipped.     
      && tryToBuffer(WHITESPACE_THAT_NORMALLY_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN))
  }

  private tryToCloseAnyConvention(): boolean {
    for (let i = this.openContexts.length - 1; i >= 0; i--) {
      const openContext = this.openContexts[i]
      const { convention } = openContext

      if (this.shouldCloseContext(openContext)) {
        // If `closeContextOrBacktrackToBeforeIt` fails, it resets the tokenizer to where it was before we
        // opened the context, then returns false.
        //
        // If that happens, we're happy immediately return false from this method, too, because we know for
        // a fact that won't be able to close any outer conventions at our current position (we already failed
        // to do so when we opened the now-failed context).
        return this.tryToCloseContextOrBacktrack({ atIndex: i })
      }

      if (this.shouldBacktrackToBeforeContext(openContext)) {
        this.backtrackToBeforeContext(openContext)
        return true
      }

      if (openContext.doIsteadOfTryingToCloseOuterContexts()) {
        return true
      }
    }

    return this.tryToCloseAnyRaisedVoices()
  }

  private shouldBacktrackToBeforeContext(context: ConventionContext): boolean {
    return (
      context.convention.failsIfWhitespaceIsEnounteredBeforeClosing
      && this.isCurrentCharWhitespace())
  }

  private isCurrentCharWhitespace(): boolean {
    return WHITESPACE_CHAR_PATTERN.test(this.consumer.currentChar)
  }

  private shouldCloseContext(context: ConventionContext): boolean {
    const { convention } = context

    return (
      (convention.isCutShortByWhitespace && this.isCurrentCharWhitespace())
      || (
        convention.endPattern
        && this.consumer.consume({ pattern: convention.endPattern })))
  }

  // Returns true if the context was successfully closed.
  //
  // Otherwise, if the context couldn't be closed, the tokenizer is reset to where it was before the context
  // was opened, and this method returns false. 
  private tryToCloseContextOrBacktrack(args: { atIndex: number }): boolean {
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

    if (convention.whenClosingItFlushesBufferTo != null) {
      this.flushBufferToTokenOfKind(convention.whenClosingItFlushesBufferTo)
    }

    openContext.close()

    if (convention.whenClosingItFailsIfItCannotTranformInto) {
      return this.tryToTransformConventionOrBacktrack({ belongingToContextAtIndex: contextIndex })
    }

    this.openContexts.splice(contextIndex, 1)

    if (convention.whenClosingItAlsoClosesInnerConventions) {
      // Since we just removed the context at `contextIndex`, its inner contexts will now start at
      // `contextIndex`.           
      this.openContexts.splice(contextIndex)
    }

    return true
  }

  private tryToTransformConventionOrBacktrack(args: { belongingToContextAtIndex: number }): boolean {
    const contextIndex = args.belongingToContextAtIndex
    const context = this.openContexts[contextIndex]

    const couldTransform =
      context.convention.whenClosingItFailsIfItCannotTranformInto.some(convention => this.tryToOpen(convention))

    if (!couldTransform) {
      // We couldn't transform, so it's time to fail.
      this.backtrackToBeforeContext(context)
      return false
    }

    // So... we've just opened a new context for the convention we're transforming into. However, we
    // actually want to replace this context's convention with the new one instead.
    context.convention = this.openContexts.pop().convention

    if (context.convention.whenClosingItAlsoClosesInnerConventions) {
      this.openContexts.splice(contextIndex + 1)
    }

    return true
  }

  private tryToCloseAnyRaisedVoices(): boolean {
    // For a delimiter to close any raised voice conventions, it must look like it's touching the end
    // of some content (i.e. it must be following a non-whitespace character).
    if (!NON_BLANK_PATTERN.test(this.consumer.previousChar)) {
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

  private encloseContextWithinRichConvention(richConvention: RichConvention, context: ConventionContext): void {
    this.encloseWithin({ richConvention, startingBackAtIndex: context.startTokenIndex })
  }

  private encloseWithin(args: EncloseWithinRichConventionArgs): void {
    const { richConvention, startingBackAtIndex} = args
    this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()

    const startToken = new Token(richConvention.startTokenKind)
    const endToken = new Token(richConvention.endTokenKind)
    startToken.associateWith(endToken)

    this.insertToken({ token: startToken, atIndex: startingBackAtIndex })
    this.tokens.push(endToken)
  }

  private performContextSpecificBehaviorInsteadOfTryingToOpenUsualContexts(): boolean {
    return reversed(this.openContexts).some(context => context.doInsteadOfTryingToOpenUsualContexts())
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.conventions.some(convention => this.tryToOpen(convention))
      || this.tryToHandleRaisedVoiceStartDelimiter()
      || this.tryToTokenizeInlineCodeOrUnmatchedBackticks())
  }

  private tryToHandleRaisedVoiceStartDelimiter(): boolean {
    return this.raisedVoiceHandlers.some(handler =>
      this.consumer.consume({
        pattern: handler.delimiterPattern,

        thenBeforeAdvancingTextIndex: (delimiter, charAfterMatch) => {
          // For a delimiter to open any raiased voices, it must appear to be touching the beginning of some
          // content (i.e. it must be followed by a non-whitespace character).
          if (NON_BLANK_PATTERN.test(charAfterMatch)) {
            this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
            handler.addStartDelimiter(delimiter, this.tokens.length)
          } else {
            // If the delimiter isn't followed by a non-whitespace character, we treat the delimiter as plain
            // text. We already know the delimiter wasn't able to close any raised voice conventions, and we
            // we now know it can't open any, either.
            this.buffer += delimiter
          }
        }
      })
    )
  }

  private tryToTokenizeInlineCodeOrUnmatchedBackticks(): boolean {
    return false
  }

  private isDirectlyFollowing(conventions: RichConvention[]): boolean {
    if (this.buffer || !this.tokens.length) {
      return false
    }

    const lastToken = last(this.tokens)

    return conventions.some(convention => lastToken.kind === convention.endTokenKind)
  }

  // This method always returns true, allowing us to cleanly chain it with other boolean tokenizer methods. 
  private bufferCurrentChar(): boolean {
    this.buffer += this.consumer.currentChar
    this.consumer.advanceTextIndex(1)

    return true
  }

  private tryToOpen(convention: TokenizableConvention): boolean {
    const { startPattern, flushesBufferToPlainTextTokenBeforeOpening, whenOpening } = convention

    return (
      this.canTry(convention)

      && this.consumer.consume({
        pattern: startPattern,

        thenBeforeAdvancingTextIndex: (match, charAfterMatch, ...captures) => {
          if (flushesBufferToPlainTextTokenBeforeOpening) {
            this.flushBufferToPlainTextTokenIfBufferIsNotEmpty()
          }

          this.openContexts.push(new ConventionContext(convention, this.getCurrentSnapshot()))

          if (whenOpening) {
            whenOpening(match, charAfterMatch, ...captures)
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
      raisedVoiceHandlers: this.raisedVoiceHandlers.map(handler => handler.clone()),
      buffer: this.buffer
    })
  }

  private canTry(convention: TokenizableConvention, textIndex = this.consumer.textIndex): boolean {
    const conventionsThisOneTransformTo =
      convention.whenClosingItFailsIfItCannotTranformInto

    // If this convention transforms into other conventions, then it can fail as itself *or* fail
    // post-transformation as of those conventions.
    //
    // If a convention fails post-transformation, we don't try it again to see if it could transform
    // into a different convention. If it fails once, we move on. This logic is subject to change,
    // but for now, because all of our "post-transformation" conventions have incompatible start
    // patterns, there's no point in trying again.
    const hasPreviouslyFailedAfterTransformingIntoAnotherConvention =
      conventionsThisOneTransformTo
      && conventionsThisOneTransformTo.some(convention => this.failedConventionTracker.hasFailed(convention, textIndex))

    if (hasPreviouslyFailedAfterTransformingIntoAnotherConvention) {
      return false
    }

    const { onlyOpenIfDirectlyFollowing } = convention

    return (
      !this.failedConventionTracker.hasFailed(convention, textIndex)
      && (!onlyOpenIfDirectlyFollowing || this.isDirectlyFollowing(onlyOpenIfDirectlyFollowing)))
  }

  private backtrackToBeforeContext(context: ConventionContext): void {
    this.failedConventionTracker.registerFailure(context)

    const { snapshot } = context

    this.tokens = snapshot.tokens
    this.buffer = snapshot.buffer
    this.consumer.textIndex = snapshot.textIndex
    this.openContexts = snapshot.openContexts
    this.raisedVoiceHandlers = snapshot.raisedVoiceHandlers
  }

  private appendNewToken(kind: TokenKind, value?: string): void {
    this.tokens.push(new Token(kind, value))
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
    this.appendNewToken(kind, this.flushBuffer())
  }

  private insertToken(args: { token: Token, atIndex: number }): void {
    const { token, atIndex } = args

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

    const { settings } = this.config

    switch (url[0]) {
      case FORWARD_SLASH:
        return settings.baseForUrlsStartingWithSlash + url

      case HASH_MARK:
        return settings.baseForUrlsStartingWithHashMark + url
    }

    return (
      URL_SCHEME_PATTERN.test(url)
        ? url
        : settings.defaultUrlScheme + url)
  }

  private insertPlainTextTokenAtContextStart(text: string, context: ConventionContext): void {
    this.insertToken({
      token: new Token(TokenKind.PlainText, text),
      atIndex: context.startTokenIndex
    })
  }

  // These conventions are for link URLs that directly follow linked content:
  //
  // You should try [Typescript](http://www.typescriptlang.org).
  //
  // We allow whitespace between a link's content and its URL, but that isn't handled by these
  // conventions. For that, see `getConventionsForWhitespaceFollowedByLinkUrl`.
  private getLinkUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: this.getBracketedUrlStartPattern(bracket),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowing: CONVENTIONS_THAT_ARE_REPLACED_BY_LINK_IF_FOLLOWED_BY_BRACKETED_URL,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        this.closeLink(url)
      }
    }))
  }

  // Normally, a link's URL directly follows its content.
  //
  // However, if we're very sure that the author is intending to produce a link, we allow whitespace
  // between the content and the URL. For example:
  //
  // You should try [Typescript] (http://www.typescriptlang.org).
  //
  // To ensure the author actually intends to produce a link, we apply some extra rules if there is
  // any whitespace between a link's content and its URL.
  //
  // 1. First, the URL must either:
  //    * Have a scheme (like "mailto:" or "https://")
  //    * Start with a slash
  //    * Start with a hash mark ("#")
  //    * Have a top-level domain.
  //      
  // 2. Second, the URL must not contain any unescaped whitespace.
  //
  // 3. If the URL merely has a top-level domain:
  //    * The top-level domain must consist solely of letters
  //    * The URL must start with a number or a letter
  //    * There must not be consecutive periods anywhere in the domain part of the URL. However,
  //      cconsecutive periods are allowed in the resource path.
  private getConventionsForWhitespaceFollowedByLinkUrl(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: this.getPatternForWhitespaceFollowedByBracketedUrl(bracket),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowing: CONVENTIONS_THAT_ARE_REPLACED_BY_LINK_IF_FOLLOWED_BY_BRACKETED_URL,
      whenOpening: (_1, _2, urlPrefix) => { this.buffer += urlPrefix },

      failsIfWhitespaceIsEnounteredBeforeClosing: true,
      insteadOfClosingOuterConventionsWhileOpen: () => { this.bufferRawText() },
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: (context) => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())

        if (this.probablyWasNotIntendedToBeAUrl(url)) {
          this.backtrackToBeforeContext(context)
        } else {
          this.closeLink(url)
        }
      }
    }))
  }

  private probablyWasNotIntendedToBeAUrl(url: string): boolean {
    return SOLELY_URL_PREFIX_PATTERN.test(url)
  }

  private closeLink(url: string) {
    // We know the last token is a ParenthesizedEnd, SquareBracketedEnd, or ActionEnd token.
    //
    // We'll replace that end token and its corresponding start token with link tokens.
    const originalEndToken = last(this.tokens)
    originalEndToken.value = url
    originalEndToken.kind = LINK_CONVENTION.endTokenKind
    originalEndToken.correspondsToToken.kind = LINK_CONVENTION.startTokenKind
  }

  // Certain conventions can be "linkified" if followed by a bracketed URL. The original conventions aren't
  // replaced, but their entire contents are placed inside a link.
  private getLinkifyingUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: this.getBracketedUrlStartPattern(bracket),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowing: COVENTIONS_WHOSE_CONTENTS_ARE_LINKIFIED_IF_FOLLOWED_BY_BRACKETED_URL,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: (context) => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        this.closeLinkifyingUrl(url)
      }
    }))
  }

  // Like with link URLs, if we're sure the author intends to "linkfiy" a convention, we allow whitespace
  // between the linkifying URL and the original convention.
  //
  // For more information, see `getLinkifyingUrlConventions` and `getLinkUrlConventions`.
  private getConventionsForWhitespaceFollowedByLinkifyingUrl(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: this.getPatternForWhitespaceFollowedByBracketedUrl(bracket),
      endPattern: regExpStartingWith(bracket.endPattern),

      onlyOpenIfDirectlyFollowing: COVENTIONS_WHOSE_CONTENTS_ARE_LINKIFIED_IF_FOLLOWED_BY_BRACKETED_URL,
      whenOpening: (_1, _2, urlPrefix) => { this.buffer += urlPrefix },

      failsIfWhitespaceIsEnounteredBeforeClosing: true,
      insteadOfClosingOuterConventionsWhileOpen: () => { this.bufferRawText() },
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: (context) => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())

        if (this.probablyWasNotIntendedToBeAUrl(url)) {
          this.backtrackToBeforeContext(context)
        } else {
          this.closeLinkifyingUrl(url)
        }
      }
    }))
  }

  private getBracketedUrlStartPattern(bracket: Bracket): RegExp {
    return regExpStartingWith(
      bracket.startPattern +
      // If the first character of the URL is escaped, we don't produce a link.
      notFollowedBy(escapeForRegex(ESCAPER_CHAR)))
  }

  private getPatternForWhitespaceFollowedByBracketedUrl(bracket: Bracket): RegExp {
    return regExpStartingWith(
      SOME_WHITESPACE + bracket.startPattern + capture(
        either(
          EXPLICIT_URL_PREFIX,
          // If there's no URL prefix, there must be a top-level domain.
          DOMAIN_PART_WITH_TOP_LEVEL_DOMAIN + either(
            FORWARD_SLASH,
            // If the top-level domain isn't followed by a forward slash, it must be followed by the closing
            // bracket.
            followedBy(bracket.endPattern)))))
  }

  private bufferRawText(): void {
    this.rawBracketConventions.some(bracket => this.tryToOpen(bracket))
      || this.bufferCurrentChar()
  }

  private closeLinkifyingUrl(url: string): void {
    const linkEndToken = new Token(LINK_CONVENTION.endTokenKind, url)
    const linkStartToken = new Token(LINK_CONVENTION.startTokenKind)
    linkStartToken.associateWith(linkEndToken)

    // We'll insert our new link end token right before the original end token, and we'll insert a our new link
    // start token right after the original end token's corresponding start token.

    const indexOfOriginalEndToken = this.tokens.length - 1
    this.insertToken({ token: linkEndToken, atIndex: indexOfOriginalEndToken })

    const originalStartToken = last(this.tokens).correspondsToToken
    const indexAfterOriginalStartToken = this.tokens.indexOf(originalStartToken) + 1
    this.insertToken({ token: linkStartToken, atIndex: indexAfterOriginalStartToken })
  }

  private getFootnoteConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket =>
      this.getRichSandwichConvention({
        richConvention: FOOTNOTE_CONVENTION,
        startPattern: ANY_WHITESPACE + bracket.startPattern + escapeForRegex('^'),
        endPattern: bracket.endPattern
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

  private getRichSandwichConventionNotRequiringBacktracking(
    args: {
      richConvention: RichConvention
      startDelimiter: string
      endDelimiter: string
    }
  ): TokenizableConvention {
    const { richConvention, startDelimiter, endDelimiter } = args

    return this.getRichSandwichConvention({
      richConvention,
      startPattern: escapeForRegex(startDelimiter),
      endPattern: escapeForRegex(endDelimiter),

      insteadOfFailingWhenLeftUnclosed: (context) => {
        this.insertPlainTextTokenAtContextStart(startDelimiter, context)
      }
    })
  }

  private getRichSandwichConvention(
    args: {
      richConvention: RichConvention
      startPattern: string
      endPattern: string
      startPatternContainsATerm?: boolean
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
    }
  ): TokenizableConvention {
    const { richConvention, startPattern, endPattern, startPatternContainsATerm, insteadOfFailingWhenLeftUnclosed } = args

    return {
      // Some of our rich sandwich conventions use a localized term in their start pattern, and we want those
      // terms to be case-insensitive. No other start or end patterns need to be case-insensitive.
      startPattern: regExpStartingWith(startPattern, (startPatternContainsATerm ? 'i' : undefined)),
      endPattern: regExpStartingWith(endPattern),

      flushesBufferToPlainTextTokenBeforeOpening: true,
      whenClosingItFlushesBufferTo: TokenKind.PlainText,

      whenClosing: (context) => {
        this.encloseContextWithinRichConvention(richConvention, context)
      },

      insteadOfFailingWhenLeftUnclosed
    }
  }

  private getMediaDescriptionConventions(): TokenizableConvention[] {
    return concat(
      [IMAGE_CONVENTION, VIDEO_CONVENTION, AUDIO_CONVENTION].map(media =>
        BRACKETS.map(bracket => (<TokenizableConvention>{
          startPattern: regExpStartingWith(this.getBracketedTermStartPattern(media.nonLocalizedTerm, bracket), 'i'),
          endPattern: regExpStartingWith(bracket.endPattern),

          flushesBufferToPlainTextTokenBeforeOpening: true,
          insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),

          whenClosingItAlsoClosesInnerConventions: true,
          whenClosingItFailsIfItCannotTranformInto: this.mediaUrlConventions,
          whenClosingItFlushesBufferTo: media.descriptionAndStartTokenKind,
        }))))
  }

  private getMediaUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(ANY_WHITESPACE + bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      flushesBufferToPlainTextTokenBeforeOpening: true,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        this.appendNewToken(TokenKind.MediaUrlAndEnd, url)
      }
    }))
  }

  private getRawBracketConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => (<TokenizableConvention>{
      startPattern: regExpStartingWith(bracket.startPattern),
      endPattern: regExpStartingWith(bracket.endPattern),

      whenOpening: () => { this.buffer += bracket.start },
      whenClosing: () => { this.buffer += bracket.end },

      insteadOfFailingWhenLeftUnclosed: () => { /* Neither fail nor do anything special */ }
    }))
  }
}


const WHITESPACE_CHAR_PATTERN =
  new RegExp(WHITESPACE_CHAR)


// Our URL patterns and associated string constants serve two purposes:
//
// 1. To apply URL config settings
// 2. To determine when bracketed text is intended to be a link URL. For more information, see the comments
//    for the `getWhitespaceFollowedByLinkUrlConventions` method.
//
// One important thing to note about that second point:
//
// We aren't in the business of exhaustively excluding every invalid URL. Instead, we simply want to avoid
// surprising the author by producing a link when they probably didn't intend to produce one.

export const LETTER_CLASS =
  'a-zA-Z'

export const LETTER_CHAR =
  anyCharMatching(LETTER_CLASS)

const URL_SCHEME_NAME =
  LETTER_CHAR + everyOptional(
    anyCharMatching(
      LETTER_CLASS, DIGIT, ...['-', '+', '.'].map(escapeForRegex)))

const URL_SCHEME =
  URL_SCHEME_NAME + ':' + everyOptional('/')

const URL_SCHEME_PATTERN =
  regExpStartingWith(URL_SCHEME)

const FORWARD_SLASH =
  '/'

const HASH_MARK =
  '#'

const SUBDOMAIN =
  anyCharMatching(LETTER_CLASS, DIGIT)
  + everyOptional(
    anyCharMatching(LETTER_CLASS, DIGIT, escapeForRegex('-')))

const TOP_LEVEL_DOMAIN =
  atLeast(1, LETTER_CHAR)

const DOMAIN_PART_WITH_TOP_LEVEL_DOMAIN =
  atLeast(1, SUBDOMAIN + escapeForRegex('.')) + TOP_LEVEL_DOMAIN

const EXPLICIT_URL_PREFIX =
  either(
    URL_SCHEME,
    FORWARD_SLASH,
    HASH_MARK)

const SOLELY_URL_PREFIX_PATTERN =
  new RegExp(
    solely(EXPLICIT_URL_PREFIX))


// The patterns below exist purely for optimization.
//
// For more information, see the `bufferContentThatCannotOpenOrCloseAnyConventions` method. 

const BRACKET_START_PATTERNS =
  BRACKETS.map(bracket => bracket.startPattern)

const BRACKET_END_PATTERNS =
  BRACKETS.map(bracket => bracket.endPattern)

// The "h" is for the start of naked URLs. 
const CHAR_CLASSES_THAT_CAN_OPEN_OR_CLOSE_CONVENTIONS = [
  WHITESPACE_CHAR, 'h', '_', '`', '~',
  ...BRACKET_START_PATTERNS,
  ...BRACKET_END_PATTERNS,
  ...[ESCAPER_CHAR, '*', '+'].map(escapeForRegex)
]

const CONTENT_THAT_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN =
  regExpStartingWith(
    atLeast(1,
      either(
        anyCharNotMatching(...CHAR_CLASSES_THAT_CAN_OPEN_OR_CLOSE_CONVENTIONS),
        // An "h" can only trigger any tokenizer changes if it's the start of a naked URL scheme.
        'h' + notFollowedBy('ttp' + optional('s') + '://'))))

// This pattern matches all whitespace that isn't followed by an open bracket.
//
// If there's a chunk of whitespace followed by an open bracket, we don't want to match any of the
// chunk:
//
// [SPOILER: Gary battles Ash]   (http://bulbapedia.bulbagarden.net/wiki/Rival)
//
// To prevent our pattern from matching all but the last character of that whitespace, we make sure
// our match is followed by neither an open bracket nor by another whitespace character. 
const WHITESPACE_THAT_NORMALLY_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN =
  regExpStartingWith(
    SOME_WHITESPACE + notFollowedBy(
      anyCharMatching(...BRACKET_START_PATTERNS.concat(WHITESPACE_CHAR))))