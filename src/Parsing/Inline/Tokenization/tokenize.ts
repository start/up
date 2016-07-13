import { REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from '../RichConventions'
import { escapeForRegex, regExpStartingWith, solely, everyOptional, either, optional, atLeast, followedBy, notFollowedBy, anyCharMatching, anyCharNotMatching, capture } from '../../PatternHelpers'
import { SOME_WHITESPACE, ANY_WHITESPACE, WHITESPACE_CHAR, DIGIT } from '../../PatternPieces'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { ESCAPER_CHAR } from '../../Strings'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from '../MediaConventions'
import { UpConfig } from '../../../UpConfig'
import { RichConvention } from '../RichConvention'
import { tryToTokenizeInlineCodeOrUnmatchedDelimiter } from './tryToTokenizeInlineCodeOrUnmatchedDelimiter'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { last, concat, reversed } from '../../../CollectionHelpers'
import { Bracket } from './Bracket'
import { BRACKETS } from './Brackets'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineTextConsumer, OnTextMatch } from './InlineTextConsumer'
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
  // 3. Link URL conventions (explained below)
  private conventions: TokenizableConvention[]

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

  // Link URL conventions serve the same purpose as media URL conventions, but for links.  
  private linkUrlConventions = this.getLinkUrlConventions()

  // As a rule, when a convention containing a naked URL is closed, the naked URL gets closed first.
  //
  // Most of our conventions are just thrown in the `conventions` collection (and this one is, too), but we
  // keep a direct reference to the naked URL convention to help us determine whether another convention
  // contains a naked URL.
  private nakedUrlConvention = new TokenizableConvention({
    startsWith: 'http' + optional('s') + '://',
    isCutShortByWhitespace: true,

    beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

    whenOpening: urlScheme => {
      this.appendNewToken(TokenKind.NakedUrlSchemeAndStart, urlScheme)
    },

    insteadOfOpeningRegularConventionsWhileOpen: () => this.bufferRawText(),

    beforeClosingItAlwaysFlushesBufferTo: TokenKind.NakedUrlAfterSchemeAndEnd,
    whenClosingItAlsoClosesInnerConventions: true,

    insteadOfFailingWhenLeftUnclosed: () => this.flushBufferToNakedUrlEndToken()
  })

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

  // The most recent token isn't necessarily the last token in the `tokens` collection.
  //
  // 1. When a rich convention is "linkified", its entire contents are nested within a link, which
  //    itself is nested within the original convention. In that case, the most recent token would
  //    be a LinkUrlAndEnd token. For more information about "linkification", please see the
  //    `getLinkifyingUrlConventions` method.
  //    
  // 2. When a rich convention (one that can contain other conventions) closes, we move its end token
  //    before any overlapping end tokens. For more information, please see the `encloseWithin` method.
  private mostRecentToken: Token

  constructor(entireText: string, private config: UpConfig) {
    this.consumer = new InlineTextConsumer(entireText)
    this.configureConventions()

    this.tokenize()
  }

  private configureConventions(): void {
    this.conventions = [
      ...concat([
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
      ].map(args => this.getConventionsForRichBracketedTerm(args))),

      ...this.getMediaDescriptionConventions(),

      ...this.getFootnoteConventions(),

      ...this.getLinkifyingUrlConventions(),

      ...this.getLinkContentConventions(),

      ...[
        {
          richConvention: PARENTHESIZED_CONVENTION,
          startsWith: '(',
          endsWith: ')',
        }, {
          richConvention: SQUARE_BRACKETED_CONVENTION,
          startsWith: '[',
          endsWith: ']',
        }
      ].map(args => this.getConventionForRichBrackets(args)),

      ...[
        {
          richConvention: ACTION_CONVENTION,
          startsWith: '{',
          endsWith: '}',
          cannotStartWithWhitespace: true
        }, {
          richConvention: REVISION_DELETION_CONVENTION,
          startsWith: '~~',
          endsWith: '~~',
          isMeaningfulWhenItContainsOnlyWhitespace: true
        }, {
          richConvention: REVISION_INSERTION_CONVENTION,
          startsWith: '++',
          endsWith: '++',
          isMeaningfulWhenItContainsOnlyWhitespace: true
        }
      ].map(args => this.getRichConventionNotRequiringBacktracking(args)),

      this.nakedUrlConvention
    ]
  }

  private getFootnoteConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket =>
      this.getRichConvention({
        richConvention: FOOTNOTE_CONVENTION,
        startsWith: ANY_WHITESPACE + bracket.startPattern + escapeForRegex('^') + ANY_WHITESPACE,
        endsWith: bracket.endPattern
      }))
  }

  private getLinkContentConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket =>
      this.getRichConvention({
        richConvention: LINK_CONVENTION,
        startsWith: bracket.startPattern,
        endsWith: bracket.endPattern,
        mustBeDirectlyFollowedBy: this.linkUrlConventions,
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
      this.getRichConvention({
        richConvention,
        startsWith: this.getBracketedTermStartPattern(nonLocalizedTerm, bracket) + ANY_WHITESPACE,
        endsWith: bracket.endPattern,
        startPatternContainsATerm: true
      }))
  }

  private getBracketedTermStartPattern(nonLocalizedTerm: string, bracket: Bracket): string {
    return (
      bracket.startPattern
      + escapeForRegex(this.config.localizeTerm(nonLocalizedTerm)) + ':')
  }

  private getConventionForRichBrackets(
    args: {
      richConvention: RichConvention,
      startsWith: string
      endsWith: string
    }
  ): TokenizableConvention {
    const { richConvention, startsWith, endsWith } = args

    return this.getRichConvention({
      richConvention,
      startsWith: escapeForRegex(startsWith) + NOT_FOLLOWED_BY_WHITESPACE,
      endsWith: escapeForRegex(endsWith),

      whenOpening: () => { this.buffer += startsWith },
      whenClosing: () => { this.buffer += endsWith },

      insteadOfFailingWhenLeftUnclosed: (context) => { /*  Neither fail nor do anything special  */ }
    })
  }

  private getRichConventionNotRequiringBacktracking(
    args: {
      richConvention: RichConvention
      startsWith: string
      endsWith: string
      cannotStartWithWhitespace?: boolean
      isMeaningfulWhenItContainsOnlyWhitespace?: boolean
    }
  ): TokenizableConvention {
    const { richConvention, startsWith, endsWith, cannotStartWithWhitespace, isMeaningfulWhenItContainsOnlyWhitespace } = args

    return this.getRichConvention({
      richConvention,
      startsWith: escapeForRegex(startsWith) + (cannotStartWithWhitespace ? NOT_FOLLOWED_BY_WHITESPACE : ''),
      endsWith: escapeForRegex(endsWith),

      isMeaningfulWhenItContainsOnlyWhitespace,

      insteadOfFailingWhenLeftUnclosed: (context) => {
        this.insertPlainTextTokenAtContextStart(startsWith, context)
      }
    })
  }

  private getRichConvention(
    args: {
      richConvention: RichConvention
      startsWith: string
      endsWith: string
      startPatternContainsATerm?: boolean
      whenOpening?: OnTextMatch
      isMeaningfulWhenItContainsOnlyWhitespace?: boolean
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
      whenClosing?: OnConventionEvent
      mustBeDirectlyFollowedBy?: TokenizableConvention[]
    }
  ): TokenizableConvention {
    const { richConvention, startsWith, endsWith, startPatternContainsATerm, whenOpening, isMeaningfulWhenItContainsOnlyWhitespace, insteadOfFailingWhenLeftUnclosed, whenClosing, mustBeDirectlyFollowedBy } = args

    return new TokenizableConvention({
      // If a convention is totally empty, it's never applied. For example, this would-be NSFW convention is empty:
      //
      // (NSFW:)
      //
      // Therefore, we instead treat it as a parenthesized convention containing the text "NSFW:".
      //
      // When *most* conventions contain only whitespace, they aren't applied. For example, this would-be NSFW
      // convention contains only whitespace: 
      //
      // [NSFW:   ]
      //
      // Therefore, we instead treat it as a square bracketed convention containing the text "NSFW:   ".
      //
      // However, if `isMeaningfulWhenItContainsOnlyWhitespace` is true, we do apply the convention when it contains
      // only whitespace. This is the case for revision deletion/insertion.
      startsWith: startsWith + notFollowedBy((isMeaningfulWhenItContainsOnlyWhitespace ? '' : ANY_WHITESPACE) + endsWith),
      startPatternContainsATerm,

      endsWith,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,
      beforeClosingItFlushesNonEmptyBufferTo: TokenKind.PlainText,

      whenOpening,

      whenClosing: (context) => {
        if (whenClosing) {
          whenClosing(context)
        }

        this.encloseContextWithinRichConvention(richConvention, context)
      },

      insteadOfFailingWhenLeftUnclosed,
      mustBeDirectlyFollowedBy
    })
  }

  private getMediaDescriptionConventions(): TokenizableConvention[] {
    return concat(
      [IMAGE_CONVENTION, VIDEO_CONVENTION, AUDIO_CONVENTION].map(media =>
        BRACKETS.map(bracket => new TokenizableConvention({
          startsWith: this.getBracketedTermStartPattern(media.nonLocalizedTerm, bracket) + ANY_WHITESPACE,
          startPatternContainsATerm: true,
          endsWith: bracket.endPattern,

          beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,
          insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),

          beforeClosingItAlwaysFlushesBufferTo: media.descriptionAndStartTokenKind,
          whenClosingItAlsoClosesInnerConventions: true,
          mustBeDirectlyFollowedBy: this.mediaUrlConventions
        }))))
  }

  private getMediaUrlConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => new TokenizableConvention({
      startsWith: ANY_WHITESPACE + bracket.startPattern + notFollowedBy(
        anyCharMatching(WHITESPACE_CHAR, bracket.endPattern)),

      endsWith: bracket.endPattern,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        this.appendNewToken(TokenKind.MediaUrlAndEnd, url)
      }
    }))
  }

  // Link's bracketed URLs directly follow their bracketed content:
  //
  // You should try [Typescript](http://www.typescriptlang.org).
  //
  // If we're very sure that the author is intending to produce a link, we allow whitespace between
  // the link's bracketed content and its bracketed URL. For example:
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
  //    * Have a top-level domain
  //      
  // 2. Second, the URL must not contain any unescaped whitespace.
  //
  // 3. If the URL merely has a top-level domain:
  //    * The top-level domain must consist solely of letters
  //    * The URL must start with a number or a letter
  //    * There must not be consecutive periods anywhere in the domain part of the URL. However,
  //      consecutive periods are allowed in the resource path.
  private getLinkUrlConventions(): TokenizableConvention[] {
    return concat(BRACKETS.map(bracket => [
      this.getBracketedUrlConvention({
        bracket,
        whenClosing: url => this.closeLink(url)
      }),
      this.getConventionForWhitespaceFollowedByBracketedUrl({
        bracket,
        ifUrlIsValidWheClosing: url => this.closeLink(url)
      })
    ]))
  }

  private probablyWasNotIntendedToBeAUrl(url: string): boolean {
    return SOLELY_URL_PREFIX_PATTERN.test(url)
  }

  private closeLink(url: string) {
    this.mostRecentToken.value = url
  }

  // Certain conventions can be "linkified" if they're followed by a bracketed URL.
  // 
  // For a "linkifiable" rich convention (e.g. a footnote), its entire contents are nested within a
  // link, which itself is nested within the original convention.
  // 
  // On the other hand, when a media convention is linkified, it's simply placed inside a link.
  //
  // Like with link URLs, if we're sure the author intends to "linkfiy" a convention, we allow
  // whitespace between the linkifying URL and the original convention. For more information, see
  // `getConventionsForWhitespaceFollowedByLinkUrl`.
  private getLinkifyingUrlConventions(): TokenizableConvention[] {
    const KINDS_OF_END_TOKENS_FOR_LINKIFIABLE_RICH_CONVENTIONS = [
      SPOILER_CONVENTION,
      NSFW_CONVENTION,
      NSFL_CONVENTION,
      FOOTNOTE_CONVENTION
    ].map(richConvention => richConvention.endTokenKind)

    // All media conventions use the same end token
    const KINDS_OF_END_TOKENS_FOR_MEDIA_CONVENTIONS = [TokenKind.MediaUrlAndEnd]

    return concat(BRACKETS.map(bracket => [
      ...[
        {
          bracket,
          onlyOpenIfDirectlyFollowing: KINDS_OF_END_TOKENS_FOR_LINKIFIABLE_RICH_CONVENTIONS,
          whenClosing: (url: string) => this.closeLinkifyingUrlForRichConventions(url)
        }, {
          bracket,
          onlyOpenIfDirectlyFollowing: KINDS_OF_END_TOKENS_FOR_MEDIA_CONVENTIONS,
          whenClosing: (url: string) => this.closeLinkifyingUrlForMediaConventions(url)
        }
      ].map(args => this.getBracketedUrlConvention(args)),

      ...[
        {
          bracket,
          onlyOpenIfDirectlyFollowing: KINDS_OF_END_TOKENS_FOR_LINKIFIABLE_RICH_CONVENTIONS,
          ifUrlIsValidWheClosing: (url: string) => this.closeLinkifyingUrlForRichConventions(url)
        }, {
          bracket,
          onlyOpenIfDirectlyFollowing: KINDS_OF_END_TOKENS_FOR_MEDIA_CONVENTIONS,
          ifUrlIsValidWheClosing: (url: string) => this.closeLinkifyingUrlForMediaConventions(url)
        }
      ].map(args => this.getConventionForWhitespaceFollowedByBracketedUrl(args))
    ]
    ))
  }

  private getBracketedUrlConvention(
    args: {
      bracket: Bracket
      onlyOpenIfDirectlyFollowing?: TokenKind[]
      whenClosing: (url: string) => void
    }
  ): TokenizableConvention {
    const { bracket, onlyOpenIfDirectlyFollowing, whenClosing } = args

    return new TokenizableConvention({
      onlyOpenIfDirectlyFollowing,

      startsWith: bracket.startPattern + notFollowedBy(
        anyCharMatching(
          WHITESPACE_CHAR,
          bracket.endPattern,
          escapeForRegex(ESCAPER_CHAR))),

      endsWith: bracket.endPattern,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        whenClosing(url)
      }
    })
  }

  private getConventionForWhitespaceFollowedByBracketedUrl(
    args: {
      bracket: Bracket
      onlyOpenIfDirectlyFollowing?: TokenKind[]
      ifUrlIsValidWheClosing: (url: string) => void
    }
  ): TokenizableConvention {
    const { bracket, onlyOpenIfDirectlyFollowing, ifUrlIsValidWheClosing } = args

    return new TokenizableConvention({
      onlyOpenIfDirectlyFollowing,

      startsWith: SOME_WHITESPACE + bracket.startPattern + capture(
        either(
          EXPLICIT_URL_PREFIX,
          DOMAIN_PART_WITH_TOP_LEVEL_DOMAIN + either(
            // If we're using the presence of a top-level domain as evicence that we're looking at a bracketed
            // URL, then that top-level domain must either be followed by a forward slash...
            FORWARD_SLASH,
            // ... or be the end of the URL.
            followedBy(bracket.endPattern)))),

      endsWith: bracket.endPattern,

      whenOpening: (_1, _2, urlPrefix) => { this.buffer += urlPrefix },

      failsIfWhitespaceIsEnounteredBeforeClosing: true,
      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferRawText(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: (context) => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())

        if (this.probablyWasNotIntendedToBeAUrl(url)) {
          this.backtrackToBeforeContext(context)
        } else {
          ifUrlIsValidWheClosing(url)
        }
      }
    })
  }

  private closeLinkifyingUrlForRichConventions(url: string): void {
    const linkEndToken = new Token(LINK_CONVENTION.endTokenKind, url)
    const linkStartToken = new Token(LINK_CONVENTION.startTokenKind)
    linkStartToken.associateWith(linkEndToken)

    // We'll insert our new link end token right before the original end token, and we'll insert our new link
    // start token right after the original end token's corresponding start token.

    const indexOfOriginalEndToken = this.tokens.length - 1
    this.insertToken({ token: linkEndToken, atIndex: indexOfOriginalEndToken })

    const originalStartToken = last(this.tokens).correspondsToToken
    const indexAfterOriginalStartToken = this.tokens.indexOf(originalStartToken) + 1
    this.insertToken({ token: linkStartToken, atIndex: indexAfterOriginalStartToken })
  }

  private closeLinkifyingUrlForMediaConventions(url: string): void {
    // The media start token will always directly precede the media end token, which is currently the last token.
    const indexOfMediaStartToken = this.tokens.length - 2

    this.encloseWithin({
      richConvention: LINK_CONVENTION,
      startingBackAtIndex: indexOfMediaStartToken
    })

    // Now, the last token is a LinkUrlAndEnd token. Let's assign its URL!
    last(this.tokens).value = url
  }

  private getRawBracketConventions(): TokenizableConvention[] {
    return BRACKETS.map(bracket => new TokenizableConvention({
      startsWith: bracket.startPattern,
      endsWith: bracket.endPattern,

      whenOpening: () => { this.buffer += bracket.start },
      whenClosing: () => { this.buffer += bracket.end },

      insteadOfFailingWhenLeftUnclosed: () => { /* Neither fail nor do anything special */ }
    }))
  }

  private tokenize(): void {
    do {
      this.bufferContentThatCannotOpenOrCloseAnyConventions()
    } while (
      !this.isDone()
      && (
        this.tryToCollectEscapedChar()
        || this.tryToCloseAnyConvention()
        || this.performContextSpecificBehaviorInsteadOfTryingToOpenRegularConventions()
        || this.tryToOpenAnyConvention()
        || this.bufferCurrentChar()))

    this.tokens = nestOverlappingConventions(this.tokens)
  }

  private isDone(): boolean {
    return this.consumer.done() && this.tryToResolveUnclosedContexts()
  }

  private tryToResolveUnclosedContexts(): boolean {
    while (this.openContexts.length) {
      const context = this.openContexts.pop()

      if (!context.doInsteadOfFailingWhenLeftUnclosed()) {
        this.backtrackToBeforeContext(context)
        return false
      }
    }

    this.flushNonEmptyBufferToPlainTextToken()

    for (const raisedVoiceHandler of this.raisedVoiceHandlers) {
      raisedVoiceHandler.treatUnusedStartDelimitersAsPlainText()
    }

    return true
  }

  private tryToCollectEscapedChar(): boolean {
    if (this.consumer.currentChar === ESCAPER_CHAR) {
      this.consumer.advanceTextIndex(1)
      return this.consumer.done() || this.bufferCurrentChar()
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
    // by a start bracket. That's great news, because documents have whitespace all over the place! However,
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
      const context = this.openContexts[i]

      if (this.shouldClose(context)) {
        if (this.tryToCloseConvention({ belongingToContextAtIndex: i })) {
          return true
        }

        // Well, we couldn't successfully close the convention, so we've got to backtrack. For now, a
        // convention will only fail to close if:
        //
        // 1. It must be followed by one of a set of specific conventions, and
        // 2. None of those conventions could be opened        
        this.backtrackToBeforeContext(context)

        // We know for a fact that we won't be able to close any other conventions at our new (backtracked)
        // text index; we already tried to close all of them when we opened the now-failed convention. So
        // let's just return false and let the tokenizer continue at the next step.
        return false
      }

      if (context.convention.failsIfWhitespaceIsEnounteredBeforeClosing && this.isCurrentCharWhitespace()) {
        this.backtrackToBeforeContext(context)
        return true
      }

      if (context.doIsteadOfTryingToCloseOuterConventions()) {
        return true
      }
    }

    return this.tryToCloseAnyRaisedVoices()
  }

  private shouldClose(context: ConventionContext): boolean {
    const { convention } = context

    return (
      (convention.isCutShortByWhitespace && this.isCurrentCharWhitespace())
      || (
        convention.endsWith
        && this.consumer.consume({ pattern: convention.endsWith })))
  }

  private tryToCloseConvention(args: { belongingToContextAtIndex: number }): boolean {
    const contextIndex = args.belongingToContextAtIndex
    const context = this.openContexts[contextIndex]
    const { convention } = context

    // As a rule, if a convention enclosing a naked URL is closed, the naked URL gets closed first.
    this.closeNakedUrlContextIfOneIsOpen({ withinContextAtIndex: contextIndex })

    if (convention.beforeClosingItFlushesNonEmptyBufferTo != null) {
      this.flushNonEmptyBufferToTokenOfKind(convention.beforeClosingItFlushesNonEmptyBufferTo)
    }

    if (convention.beforeClosingItAlwaysFlushesBufferTo != null) {
      this.flushBufferToTokenOfKind(convention.beforeClosingItAlwaysFlushesBufferTo)
    }

    context.close()
    this.openContexts.splice(contextIndex, 1)

    if (convention.whenClosingItAlsoClosesInnerConventions) {
      // Since we just removed the context at `contextIndex`, its inner contexts will now start at
      // `contextIndex`.           
      this.openContexts.splice(contextIndex)
    }

    return (
      !convention.mustBeDirectlyFollowedBy
      || this.tryToOpenSubsequentConventionRequiredBy(context))
  }

  private isCurrentCharWhitespace(): boolean {
    return WHITESPACE_CHAR_PATTERN.test(this.consumer.currentChar)
  }

  private tryToOpenSubsequentConventionRequiredBy(closedContext: ConventionContext): boolean {
    const didOpenSubsequentRequiredConvention =
      closedContext.convention.mustBeDirectlyFollowedBy.some(convention => this.tryToOpen(convention))

    if (didOpenSubsequentRequiredConvention) {
      // If this new convention eventually fails, we need to backtrack to before the one we just closed.
      // To make that process easier, we give the snapshot of the old context to the new context.
      last(this.openContexts).snapshot = closedContext.snapshot
      return true
    }

    return false
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

  private closeNakedUrlContextIfOneIsOpen(args?: { withinContextAtIndex: number }): void {
    const { openContexts } = this

    const outermostIndexThatMayBeNakedUrl =
      args ? (args.withinContextAtIndex + 1) : 0

    for (let i = outermostIndexThatMayBeNakedUrl; i < openContexts.length; i++) {
      if (openContexts[i].convention === this.nakedUrlConvention) {
        this.flushBufferToNakedUrlEndToken()

        // We need to remove the naked URL's context, as well as the contexts of any raw text brackets
        // inside it.
        this.openContexts.splice(i)
        return
      }
    }
  }

  private encloseContextWithinRichConvention(richConvention: RichConvention, context: ConventionContext): void {
    this.encloseWithin({ richConvention, startingBackAtIndex: context.startTokenIndex })
  }

  private encloseWithin(args: EncloseWithinRichConventionArgs): void {
    const { richConvention } = args
    let startTokenIndex = args.startingBackAtIndex

    this.flushNonEmptyBufferToPlainTextToken()

    const startToken = new Token(richConvention.startTokenKind)
    const endToken = new Token(richConvention.endTokenKind)
    startToken.associateWith(endToken)

    this.insertToken({ token: startToken, atIndex: startTokenIndex })

    // We can avoid some superficial overalpping by inserting our new end token before any overlapping
    // end tokens.  For example:
    //
    // I've had enough! I hate this game! {softly curses [SPOILER: Professor Oak}]
    //
    // Normally, when conventions overlap, we split them into pieces to ensure each convention has
    // just a single parent. If splitting a convention produces an empty piece on one side, that empty
    // piece is discarded. This process is fully explained in `nestOverlappingConventions.ts`.
    //
    // *Anyway*, in the above example, the spoiler convention starts inside the action convention and
    // ends after the action convention. The two conventions overlap, but only by only their end tokens.
    // By inserting the end token for the spoiler before the end token of the action convention, we can
    // avoid having to split any conventions.
    //
    // This is more than just an optimization tactic, however! It actually improves the final abstract
    // syntax tree. How? Well...
    //
    // It's less disruptive to split certain conventions than to split others. We'd rather split an
    // action convention than a spoiler, and we'd rather split a spoiler than a footnote.
    //
    // Once our process for splitting overlapping conventions has determined that a convention is being
    // overlapped by one that we’d prefer to split, it splits the convention we’d rather split.
    // Because we’d rather split action conventions than spoilers, the action convention in the above
    // example would be split in two, with one hald outside the spoiler, and the other half inside the
    // spoiler. By moving the spoiler’s end token inside the action convention, we can avoid having to 
    // split the action convention.

    let endTokenIndex = this.tokens.length

    for (let i = endTokenIndex - 1; i > startTokenIndex; i--) {
      let previousToken = this.tokens[i]

      // We should only swap our end token with the previous token if...
      const shouldSwapEndTokenWithPreviousToken =
        // The previous token is a rich convention's end token...
        previousToken.correspondsToToken
        // ...and our start token (that we just added) is within the previous end token's convention. 
        && startTokenIndex > this.indexOfToken(previousToken.correspondsToToken)

      if (shouldSwapEndTokenWithPreviousToken) {
        // If all that applies, our end token should really be inside the previous end token's convention.
        endTokenIndex -= 1
      } else {
        // We've hit a token that we can't swap with! Let's add our end token. 
        break
      }
    }

    this.insertToken({ token: endToken, atIndex: endTokenIndex })
  }

  private indexOfToken(token: Token): number {
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      if (this.tokens[i] === token) {
        return i
      }
    }

    throw new Error(`Token not found. Kind: ${token.kind}, value: ${token.value}`)
  }

  private performContextSpecificBehaviorInsteadOfTryingToOpenRegularConventions(): boolean {
    return reversed(this.openContexts)
      .some(context => context.doInsteadOfTryingToOpenRegularConventions())
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.conventions.some(convention => this.tryToOpen(convention))
      || this.tryToHandleRaisedVoiceStartDelimiter()
      || this.tryToTokenizeInlineCodeOrUnmatchedDelimiter())
  }

  private tryToHandleRaisedVoiceStartDelimiter(): boolean {
    return this.raisedVoiceHandlers.some(handler =>
      this.consumer.consume({
        pattern: handler.delimiterPattern,

        thenBeforeAdvancingTextIndex: (delimiter, charAfterMatch) => {
          // For a delimiter to open any raiased voices, it must appear to be touching the beginning of some
          // content (i.e. it must be followed by a non-whitespace character).
          if (NON_BLANK_PATTERN.test(charAfterMatch)) {
            this.flushNonEmptyBufferToPlainTextToken()
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

  // Inline code is the only convention that:
  //
  // 1. Does not support escaped characters
  // 2. Cannot contain any other conventions
  //
  // Because inline code doesn't require any of the special machinery of this class, we keep its logic separate.  
  private tryToTokenizeInlineCodeOrUnmatchedDelimiter(): boolean {
    return tryToTokenizeInlineCodeOrUnmatchedDelimiter({
      text: this.consumer.remainingText,
      then: (resultToken, lengthConsumed) => {
        this.flushNonEmptyBufferToPlainTextToken()
        this.appendToken(resultToken)
        this.consumer.advanceTextIndex(lengthConsumed)
      }
    })
  }

  private appendToken(token: Token): void {
    this.tokens.push(token)
    this.mostRecentToken = token
  }

  // This method always returns true, allowing us to cleanly chain it with other boolean tokenizer methods. 
  private bufferCurrentChar(): boolean {
    this.buffer += this.consumer.currentChar
    this.consumer.advanceTextIndex(1)

    return true
  }

  private tryToOpen(convention: TokenizableConvention): boolean {
    const { startsWith, flushesBufferToPlainTextTokenBeforeOpening, whenOpening } = convention

    return (
      this.canTry(convention)

      && this.consumer.consume({
        pattern: startsWith,

        thenBeforeAdvancingTextIndex: (match, charAfterMatch, ...captures) => {
          if (flushesBufferToPlainTextTokenBeforeOpening) {
            this.flushNonEmptyBufferToPlainTextToken()
          }

          this.openContexts.push(new ConventionContext(convention, this.getCurrentSnapshot()))

          if (whenOpening) {
            whenOpening(match, charAfterMatch, ...captures)
          }
        }
      }))
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

  private canTry(conventionToOpen: TokenizableConvention): boolean {
    const textIndex = this.consumer.textIndex

    // If a convention must be followed by one of a set of specific conventions, then there are really
    // three ways that convention can fail:
    //
    // 1. It's missing its end delimiter (or was otherwise deemed invalid). This is the normal way for
    //    a convention to fail, and our `failedConventionTracker` easily takes care of this below.
    //
    // 2. None of the subsequent required conventions could be opened. This is handled elsewhere.
    //
    // 3. One of the required conventions was opened, but it was missing its end delimiter (or was
    //    otherwise deemed invalid).
    //
    // To handle that third case, we also check whether any of the subsequent required conventions have
    // failed. This is made easier by the fact that any subsequent required conventions inherit the
    // snapshot of their "parent", and therefore have their failure registered at parent's text index.
    //
    // If a subsequent required convention has failed, we consider the parent convention to have failed,
    // too, and we don't try opening it again. This logic is subject to change, but for now, because all
    // of the subsequent required conventions for a given parent have incompatible start patterns,
    // there's no point in trying again.
    const subsequentRequiredConventions =
      conventionToOpen.mustBeDirectlyFollowedBy

    const hasSubsequentRequiredConventionFailed =
      subsequentRequiredConventions
      && subsequentRequiredConventions.some(convention => this.failedConventionTracker.hasFailed(convention, textIndex))

    if (hasSubsequentRequiredConventionFailed) {
      return false
    }

    const { onlyOpenIfDirectlyFollowing } = conventionToOpen

    return (
      !this.failedConventionTracker.hasFailed(conventionToOpen, textIndex)
      && (!onlyOpenIfDirectlyFollowing || this.isDirectlyFollowing(onlyOpenIfDirectlyFollowing)))
  }

  private isDirectlyFollowing(tokenKinds: TokenKind[]): boolean {
    return (
      !this.buffer
      && this.mostRecentToken
      && tokenKinds.some(tokenKind => this.mostRecentToken.kind === tokenKind))
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
    this.appendToken(new Token(kind, value))
  }

  private flushBufferToNakedUrlEndToken(): void {
    this.flushBufferToTokenOfKind(TokenKind.NakedUrlAfterSchemeAndEnd)
  }

  private flushBuffer(): string {
    const buffer = this.buffer
    this.buffer = ''

    return buffer
  }

  private flushNonEmptyBufferToTokenOfKind(kind: TokenKind): void {
    if (this.buffer) {
      this.appendNewToken(kind, this.flushBuffer())
    }
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

    this.mostRecentToken = token
  }

  private flushNonEmptyBufferToPlainTextToken(): void {
    this.flushNonEmptyBufferToTokenOfKind(TokenKind.PlainText)
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

  private bufferRawText(): void {
    const didOpenConvention =
      this.rawBracketConventions.some(convention => this.tryToOpen(convention))

    if (!didOpenConvention) {
      this.bufferCurrentChar()
    }
  }
}


const WHITESPACE_CHAR_PATTERN =
  new RegExp(WHITESPACE_CHAR)

const NOT_FOLLOWED_BY_WHITESPACE =
  notFollowedBy(WHITESPACE_CHAR)


// Our URL patterns and associated string constants serve two purposes:
//
// 1. To apply URL config settings
// 2. To determine when bracketed text is intended to be a link URL. For more information, see the comments
//    for the `getConventionsForWhitespaceFollowedByLinkUrl` method.
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
