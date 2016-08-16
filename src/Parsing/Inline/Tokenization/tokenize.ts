import { EMPHASIS_CONVENTION, STRESS_CONVENTION, ITALIC_CONVENTION, BOLD_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, HIGHLIGHT_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHETICAL_CONVENTION, SQUARE_BRACKET_PARENTHETICAL_CONVENTION } from '../RichConventions'
import { escapeForRegex, patternStartingWith, solely, everyOptional, either, optional, atLeastOne, atLeast, followedBy, notFollowedBy, anyCharMatching, anyCharNotMatching, capture } from '../../PatternHelpers'
import { SOME_WHITESPACE, ANY_WHITESPACE, WHITESPACE_CHAR, LETTER_CLASS, DIGIT } from '../../PatternPieces'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { ESCAPER_CHAR } from '../../Strings'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from '../MediaConventions'
import { Config } from '../../../Config'
import { RichConvention } from './RichConvention'
import { tryToTokenizeCodeOrUnmatchedDelimiter } from './tryToTokenizeCodeOrUnmatchedDelimiter'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { last, concat, reversed } from '../../../CollectionHelpers'
import { Bracket } from './Bracket'
import { BRACKETS } from './Brackets'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TextConsumer, OnTextMatch } from './TextConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { EncloseWithinConventionArgs } from './EncloseWithinConventionArgs'
import { Convention, OnConventionEvent } from './Convention'
import { InflectionHandler } from './InflectionHandler'


// Returns a collection of tokens representing inline conventions and their components.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
// For more information about this process, see the comments in `nestOverlappingConventions.ts`.
export function tokenize(markup: string, config: Config): Token[] {
  return new Tokenizer(markup, config).tokens
}

// This function is identical to the `tokenize` function, except footnotes are treated as parentheticals
// of the appropriate bracket type.
//
// In other words:
//
// 1. Footnotes produced by square brackets [^ like this] are treated as square-bracket parentheticals.
// 2. Footnotes produced by parentheses (^ like this) are treated as normal parentheticals.
export function tokenizeForInlineDocument(markup: string, config: Config): Token[] {
  return new Tokenizer(markup, config).tokens
}


class Tokenizer {
  tokens: Token[] = []

  private markupConsumer: TextConsumer

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
  private conventions: Convention[]

  // These bracket conventions don't produce special tokens, and they can only appear inside URLs or media
  // descriptions.
  //
  // They allow matching brackets to be included without having to escape closing brackets that would
  // otherwise cut short the URL or media description.
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
  private nakedUrlConvention = this.getNakedUrlConvention()

  // Inflection means emphasis, stress, italics, and bold.
  //
  // We handle inflection in a manner incompatible with the rest of our conventions, so we throw all that
  // special logic into the InflectionHandler class. More information can be found in comments within that
  // class.
  private inflectionHandlers = [
    {
      delimiterChar: '*',
      conventionForMinorInflection: EMPHASIS_CONVENTION,
      conventionForMajorInflection: STRESS_CONVENTION
    }, {
      delimiterChar: '_',
      conventionForMinorInflection: ITALIC_CONVENTION,
      conventionForMajorInflection: BOLD_CONVENTION
    }
  ].map(args => this.getInflectionHandler(args))

  // The most recent token isn't necessarily the last token in the `tokens` collection.
  //
  // 1. When a rich convention is "linkified", its entire contents are nested within a link, which
  //    itself is nested within the original convention. In that case, the most recent token would
  //    be a LinkEndAndUrl token. For more information about "linkification", please see the
  //    `getLinkifyingUrlConventions` method.
  //    
  // 2. When a rich convention (one that can contain other conventions) closes, we move its end token
  //    before any overlapping end tokens. For more information, please see the `encloseWithin` method.
  private mostRecentToken: Token

  constructor(markup: string, private config: Config) {
    this.markupConsumer = new TextConsumer(markup.trim())
    this.configureConventions()
    this.tokenize()
  }

  private configureConventions(): void {
    this.conventions = [
      ...concat([
        {
          richConvention: HIGHLIGHT_CONVENTION,
          labels: this.config.terms.highlight
        }, {
          richConvention: SPOILER_CONVENTION,
          labels: this.config.terms.spoiler
        }, {
          richConvention: NSFW_CONVENTION,
          labels: this.config.terms.nsfw
        }, {
          richConvention: NSFL_CONVENTION,
          labels: this.config.terms.nsfl
        }
      ].map(args => this.getConventionsForLabeledRichBrackets(args))),

      ...this.getMediaDescriptionConventions(),

      ...this.getFootnoteConventions(),

      ...this.getLinkifyingUrlConventions(),

      ...this.getLinkContentConventions(),

      ...[
        {
          richConvention: PARENTHETICAL_CONVENTION,
          startsWith: '(',
          endsWith: ')'
        }, {
          richConvention: SQUARE_BRACKET_PARENTHETICAL_CONVENTION,
          startsWith: '[',
          endsWith: ']'
        }
      ].map(args => this.getConventionForActualBrackets(args)),

      ...[
        {
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

      this.nakedUrlConvention,

      this.getExampleInputConvention()
    ]
  }

  private getFootnoteConventions(): Convention[] {
    return BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: FOOTNOTE_CONVENTION,
        startsWith: ANY_WHITESPACE + bracket.startPattern + escapeForRegex('^') + ANY_WHITESPACE,
        endsWith: bracket.endPattern
      }))
  }

  private getLinkContentConventions(): Convention[] {
    return BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: LINK_CONVENTION,
        startsWith: bracket.startPattern,
        endsWith: bracket.endPattern,
        mustBeDirectlyFollowedBy: this.linkUrlConventions
      }))
  }

  // These conventions take the following form (for all brackets):
  //
  // [label: some *exciting* text with inline conventions]
  private getConventionsForLabeledRichBrackets(
    args: {
      richConvention: RichConvention
      labels: Config.Terms.FoundInMarkup
    }
  ): Convention[] {
    const { richConvention, labels } = args

    return BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention,
        startsWith: this.getLabeledBracketStartPattern(labels, bracket) + ANY_WHITESPACE,
        endsWith: bracket.endPattern,
        startPatternContainsATerm: true
      }))
  }

  private getLabeledBracketStartPattern(labels: Config.Terms.FoundInMarkup, bracket: Bracket): string {
    return bracket.startPattern + either(...labels.map(escapeForRegex)) + ':'
  }

  private getConventionForActualBrackets(
    args: {
      richConvention: RichConvention
      startsWith: string
      endsWith: string
    }
  ): Convention {
    const { richConvention, startsWith, endsWith } = args

    return this.getTokenizableRichConvention({
      richConvention,
      startsWith: escapeForRegex(startsWith) + NOT_FOLLOWED_BY_WHITESPACE,
      endsWith: escapeForRegex(endsWith),

      whenOpening: () => { this.buffer += startsWith },
      whenClosing: () => { this.buffer += endsWith },

      insteadOfFailingWhenLeftUnclosed: () => { /*  Neither fail nor do anything special  */ }
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
  ): Convention {
    const { richConvention, startsWith, endsWith, cannotStartWithWhitespace, isMeaningfulWhenItContainsOnlyWhitespace } = args

    return this.getTokenizableRichConvention({
      richConvention,
      startsWith: escapeForRegex(startsWith) + (cannotStartWithWhitespace ? NOT_FOLLOWED_BY_WHITESPACE : ''),
      endsWith: escapeForRegex(endsWith),

      isMeaningfulWhenItContainsOnlyWhitespace,

      insteadOfFailingWhenLeftUnclosed: (context) => {
        this.insertPlainTextTokenAtContextStart(startsWith, context)
      }
    })
  }

  private getTokenizableRichConvention(
    args: {
      richConvention: RichConvention
      startsWith: string
      endsWith: string
      startPatternContainsATerm?: boolean
      whenOpening?: OnTextMatch
      isMeaningfulWhenItContainsOnlyWhitespace?: boolean
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
      whenClosing?: OnConventionEvent
      mustBeDirectlyFollowedBy?: Convention[]
    }
  ): Convention {
    const { richConvention, startsWith, endsWith, startPatternContainsATerm, whenOpening, isMeaningfulWhenItContainsOnlyWhitespace, insteadOfFailingWhenLeftUnclosed, whenClosing, mustBeDirectlyFollowedBy } = args

    return new Convention({
      // If a convention is totally empty, it's never applied. For example, this would-be inline NSFW convention
      // is empty:
      //
      // (NSFW:)
      //
      // Therefore, we instead treat it as a parenthesized convention containing the text "NSFW:".
      //
      // For most conventions, when they contain only whitespace, they aren't applied. For example, this would-be
      // inline NSFW convention contains only whitespace: 
      //
      // [NSFW:   ]
      //
      // Therefore, we instead treat it as a square bracketed convention containing the text "NSFW:   ".
      //
      // However, if `isMeaningfulWhenItContainsOnlyWhitespace` is true, we do apply the convention when it
      // contains only whitespace. This is the case for revision deletion/insertion.
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

        this.encloseContextWithinConvention(richConvention, context)
      },

      insteadOfFailingWhenLeftUnclosed,
      mustBeDirectlyFollowedBy
    })
  }

  private getNakedUrlConvention(): Convention {
    return new Convention({
      startsWith: 'http' + optional('s') + '://',
      isCutShortByWhitespace: true,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      whenOpening: urlScheme => {
        this.appendNewToken(TokenKind.NakedUrlScheme, urlScheme)
      },

      insteadOfOpeningRegularConventionsWhileOpen: () => this.bufferTextAwareOfRawBrackets(),

      beforeClosingItAlwaysFlushesBufferTo: TokenKind.NakedUrlAfterScheme,
      whenClosingItAlsoClosesInnerConventions: true,

      insteadOfFailingWhenLeftUnclosed: () => this.flushBufferToNakedUrlEndToken()
    })
  }

  // This convention's HTML equivalent is the `<kbd>` element. It represents an example of user input.
  //
  // Usage: Press {esc} to quit.
  private getExampleInputConvention(): Convention {
    return new Convention({
      // Example input cannot be totally blank.
      startsWith: EXAMPLE_INPUT_START_DELIMITER + notFollowedBy(ANY_WHITESPACE + EXAMPLE_INPUT_END_DELIMITER),
      endsWith: EXAMPLE_INPUT_END_DELIMITER,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfOpeningRegularConventionsWhileOpen: () => {
        this.tryToTokenizeTypographicalConvention() || this.bufferCurrentChar()
      },

      whenClosing: () => {
        // As a rule, example input is always trimmed.
        const exampleInput = this.flushBuffer().trim()
        this.appendNewToken(TokenKind.ExampleInput, exampleInput)
      }
    })
  }

  private getMediaDescriptionConventions(): Convention[] {
    return concat(
      [IMAGE_CONVENTION, VIDEO_CONVENTION, AUDIO_CONVENTION].map(media =>
        BRACKETS.map(bracket => new Convention({
          startsWith: this.getLabeledBracketStartPattern(media.getTerms(this.config.terms), bracket) + ANY_WHITESPACE,
          startPatternContainsATerm: true,
          endsWith: bracket.endPattern,

          beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,
          insteadOfClosingOuterConventionsWhileOpen: () => this.bufferTextAwareOfRawBrackets(),

          beforeClosingItAlwaysFlushesBufferTo: media.startAndDescriptionTokenKind,
          whenClosingItAlsoClosesInnerConventions: true,
          mustBeDirectlyFollowedBy: this.mediaUrlConventions
        }))))
  }

  private getMediaUrlConventions(): Convention[] {
    return BRACKETS.map(bracket => new Convention({
      startsWith: ANY_WHITESPACE + this.getStartPatternForBracketedUrlAssumedToBeAUrl(bracket),
      endsWith: bracket.endPattern,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        this.appendNewToken(TokenKind.MediaEndAndUrl, url)
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
  private getLinkUrlConventions(): Convention[] {
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
  private getLinkifyingUrlConventions(): Convention[] {
    const KINDS_OF_END_TOKENS_FOR_LINKIFIABLE_RICH_CONVENTIONS = [
      HIGHLIGHT_CONVENTION,
      SPOILER_CONVENTION,
      NSFW_CONVENTION,
      NSFL_CONVENTION,
      FOOTNOTE_CONVENTION
    ].map(richConvention => richConvention.endTokenKind)

    // All media conventions use the same end token
    const KINDS_OF_END_TOKENS_FOR_MEDIA_CONVENTIONS = [TokenKind.MediaEndAndUrl]

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
  ): Convention {
    const { bracket, onlyOpenIfDirectlyFollowing, whenClosing } = args

    return new Convention({
      onlyOpenIfDirectlyFollowing,

      startsWith: this.getStartPatternForBracketedUrlAssumedToBeAUrl(bracket),

      endsWith: bracket.endPattern,

      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.applyConfigSettingsToUrl(this.flushBuffer())
        whenClosing(url)
      }
    })
  }

  private getStartPatternForBracketedUrlAssumedToBeAUrl(bracket: Bracket): string {
    return bracket.startPattern + notFollowedBy(
      ANY_WHITESPACE + anyCharMatching(
        bracket.endPattern,
        escapeForRegex(ESCAPER_CHAR)))
  }

  private getConventionForWhitespaceFollowedByBracketedUrl(
    args: {
      bracket: Bracket
      onlyOpenIfDirectlyFollowing?: TokenKind[]
      ifUrlIsValidWheClosing: (url: string) => void
    }
  ): Convention {
    const { bracket, onlyOpenIfDirectlyFollowing, ifUrlIsValidWheClosing } = args

    return new Convention({
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
      insteadOfClosingOuterConventionsWhileOpen: () => this.bufferTextAwareOfRawBrackets(),
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
    linkStartToken.enclosesContentBetweenItselfAnd(linkEndToken)

    // We'll insert our new link end token right before the original end token, and we'll insert our new link
    // start token right after the original end token's corresponding start token.

    const originalEndToken = this.mostRecentToken
    this.insertToken({ token: linkEndToken, atIndex: this.tokens.indexOf(originalEndToken) })

    const originalStartToken = originalEndToken.correspondingDelimiter
    const indexAfterOriginalStartToken = this.tokens.indexOf(originalStartToken) + 1
    this.insertToken({ token: linkStartToken, atIndex: indexAfterOriginalStartToken })
  }

  private closeLinkifyingUrlForMediaConventions(url: string): void {
    // The media start token will always directly precede the media end token, which is currently the last token.
    const indexOfMediaStartToken = this.tokens.length - 2

    this.encloseWithin({
      richConvention: LINK_CONVENTION,
      startingBackAtTokenIndex: indexOfMediaStartToken
    })

    // Now, the last token is a LinkEndAndUrl token. Let's assign its URL!
    last(this.tokens).value = url
  }

  private getRawBracketConventions(): Convention[] {
    return BRACKETS.map(bracket => new Convention({
      startsWith: bracket.startPattern,
      endsWith: bracket.endPattern,

      whenOpening: () => { this.buffer += bracket.start },
      whenClosing: () => { this.buffer += bracket.end },

      insteadOfFailingWhenLeftUnclosed: () => { /* Neither fail nor do anything special */ }
    }))
  }

  private getInflectionHandler(
    args: {
      delimiterChar: string
      // The convention indicated by surrounding text with a single delimiter character on either side.
      conventionForMinorInflection: RichConvention
      // The convention indicated by surrounding text with double delimiter characters on either side.
      conventionForMajorInflection: RichConvention
    }
  ): InflectionHandler {
    const { delimiterChar, conventionForMajorInflection, conventionForMinorInflection } = args

    return new InflectionHandler({
      delimiterChar,
      conventionForMinorInflection,
      conventionForMajorInflection,

      encloseWithinConvention: (args) => {
        this.closeNakedUrlContextIfOneIsOpen()
        this.encloseWithin(args)
      },

      insertPlainTextToken: (text, atIndex) => {
        this.insertToken({
          token: new Token(TokenKind.PlainText, text),
          atIndex: atIndex
        })
      }
    })
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
    return this.markupConsumer.done() && this.tryToResolveUnclosedContexts()
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

    for (const inflectionHandler of this.inflectionHandlers) {
      inflectionHandler.treatDanglingStartDelimitersAsPlainText()
    }

    return true
  }

  private tryToCollectEscapedChar(): boolean {
    if (this.markupConsumer.currentChar === ESCAPER_CHAR) {
      this.markupConsumer.index += 1
      return this.markupConsumer.done() || this.bufferCurrentChar()
    }

    return false
  }

  // This method exists purely for optimization.
  private bufferContentThatCannotOpenOrCloseAnyConventions(): void {
    const tryToBuffer = (pattern: RegExp) =>
      this.markupConsumer.consume({
        pattern,
        thenBeforeConsumingText: match => { this.buffer += match }
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
        // markup index; we already tried to close all of them when we opened the now-failed convention. So
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

    return this.tryToCloseAnyInflectionConventions()
  }

  private shouldClose(context: ConventionContext): boolean {
    const { convention } = context

    return (
      (convention.isCutShortByWhitespace && this.isCurrentCharWhitespace())
      || (
        convention.endsWith
        && this.markupConsumer.consume({ pattern: convention.endsWith })))
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
    return WHITESPACE_CHAR_PATTERN.test(this.markupConsumer.currentChar)
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

  private tryToCloseAnyInflectionConventions(): boolean {
    // For a delimiter to close any inflection conventions, it must look like it's touching the end of
    // some content (i.e. it must be following a non-whitespace character).
    if (!this.isPreviousCharacterNonwhitespace()) {
      return false
    }

    return this.inflectionHandlers.some(handler => {
      let didCloseAnyOpenDelimiters = false

      this.markupConsumer.consume({
        pattern: handler.delimiterPattern,

        thenBeforeConsumingText: delimiter => {
          didCloseAnyOpenDelimiters = handler.tryToCloseAnyOpenDelimiters(delimiter)

          if (!didCloseAnyOpenDelimiters) {
            // The delimiter we found didn't close anything! Let's put it back.
            this.markupConsumer.index -= delimiter.length
          }
        }
      })

      return didCloseAnyOpenDelimiters
    })
  }

  private isPreviousCharacterNonwhitespace(): boolean {
    return NON_BLANK_PATTERN.test(this.markupConsumer.previousChar)
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

  private encloseContextWithinConvention(richConvention: RichConvention, context: ConventionContext): void {
    this.encloseWithin({ richConvention, startingBackAtTokenIndex: context.startTokenIndex })
  }

  private encloseWithin(args: EncloseWithinConventionArgs): void {
    const { richConvention } = args
    let startTokenIndex = args.startingBackAtTokenIndex

    this.flushNonEmptyBufferToPlainTextToken()

    // Normally, when conventions overlap, we split them into pieces to ensure each convention has just a
    // single parent. If splitting a convention produces an empty piece on one side, that empty piece is
    // discarded. This process is fully explained in `nestOverlappingConventions.ts`.
    //
    // We can avoid some superficial overlapping by shifting our new end token past any overlapping end tokens
    // tokens (but not past any content!). For example:
    //
    // I've had enough! **I hate [SPOILER: Professor Oak!**]
    //
    // In the above example, the spoiler convention starts inside the stress convention and ends after the
    // stress convention. The two conventions overlap, but only by only their end tokens. By inserting the
    // end token for the spoiler before the end token of the stress convention, we can avoid having to split
    // any conventions.
    //
    // This is more than just an optimization tactic, however! It actually improves the final abstract
    // syntax tree. How? Well...
    //
    // It's less disruptive to split certain conventions than to split others. We'd rather split an
    // stress convention than an inline spoiler, and we'd rather split an inline spoiler than a footnote.
    //
    // Once our process for splitting overlapping conventions has determined that a convention is being
    // overlapped by one that we’d prefer to split, it splits the convention we’d rather split. Because we’d
    // rather split stress conventions than spoilers, the stress convention in the above example would be
    // split in two, with one half outside the spoiler, and the other half inside the spoiler. By moving the
    // spoiler’s end token inside the stress convention, we can avoid having to split the stress convention. 

    const startToken = new Token(richConvention.startTokenKind)
    const endToken = new Token(richConvention.endTokenKind)
    startToken.enclosesContentBetweenItselfAnd(endToken)

    // Rich conventions' start tokens aren't added until the convention closes (and that happens right here!).
    // If multiple rich conventions open consecutively, they will all try to insert their start token at the
    // same token index, which actually works to our advantage.
    //
    // For example:
    //
    // *[Sadly*, Starcraft 2 is dead.] (reddit.com/r/starcraft)
    //
    // All rich conventions save the current count of tokens at the time of their opening, treating that count
    // as a start token index. When a given convention closes, it inserts its start token back at that saved
    // token index. Only if any tokens were added at a *previous* index will that start token index be updated.
    //
    // In the above example, both the emphasis convention and the link will try to insert their start tokens
    // at the `0` index. Because the emphasis closes first, it inserts its token at the `0` index first. When
    // the link inserts its start token at the `0` index, it naturally bumps the emphasis index forward,
    // enclosing the emphasis convention within the link.
    this.insertToken({ token: startToken, atIndex: startTokenIndex })

    let endTokenIndex = this.tokens.length

    // Alright. It's time to insert our end token before any overlapping end tokens!
    for (let i = endTokenIndex - 1; i > startTokenIndex; i--) {
      let token = this.tokens[i]

      // If the current token has a `correspondingDelimiter`, it must be an end token. It cannot be a start
      // token, because:
      //
      // 1. Rich conventions' start tokens are added after the convention closes along with their end tokens
      //    (as explained above). If a rich convention has a start token, it has an end token, too. This
      //    brings us to the second reason...
      //
      // 2. Rich conventions cannot be totally empty. There will always be content between a rich convention's
      //    start token and its end token. 
      //
      // Below, we break from the loop if we encounter actual content, so we can't ever encounter a start
      // token here.
      const isCurrentTokenAnEndToken =
        token.correspondingDelimiter != null

      // We should insert our new end token before the current end token if...
      const shouldEndTokenAppearBeforeCurrentToken =
        // ...the current token is actually a rich convention's end token...
        isCurrentTokenAnEndToken
        // ...and our start token (that we just added) is inside the current end token's convention. 
        && startTokenIndex > this.tokens.indexOf(token.correspondingDelimiter)

      if (shouldEndTokenAppearBeforeCurrentToken) {
        // If all that applies, our end token should *also* be inside the current end token's convention.
        endTokenIndex -= 1
      } else {
        // We've hit a token that we can't swap with! Let's add our end token. 
        break
      }
    }

    this.insertToken({ token: endToken, atIndex: endTokenIndex })
  }

  private performContextSpecificBehaviorInsteadOfTryingToOpenRegularConventions(): boolean {
    return reversed(this.openContexts)
      .some(context => context.doInsteadOfTryingToOpenRegularConventions())
  }

  private tryToOpenAnyConvention(): boolean {
    return (
      this.conventions.some(convention => this.tryToOpen(convention))
      || this.tryToStartInflectingOrTreatDelimiterAsPlainText()
      || this.tryToTokenizeInlineCodeOrUnmatchedDelimiter()
      || this.tryToTokenizeTypographicalConvention())
  }

  private tryToStartInflectingOrTreatDelimiterAsPlainText(): boolean {
    return this.inflectionHandlers.some(handler =>
      this.markupConsumer.consume({
        pattern: handler.delimiterPattern,

        thenBeforeConsumingText: (delimiter, charAfterMatch) => {
          // For a delimiter to start "inflecting", it must appear to be touching the beginning of some content
          // (i.e. it must be followed by a non-whitespace character).
          if (NON_BLANK_PATTERN.test(charAfterMatch)) {
            this.flushNonEmptyBufferToPlainTextToken()
            handler.addOpenStartDelimiter(delimiter, this.tokens.length)
          } else {
            // Well, this delimiter wasn't followed by a non-whitespace character, so we'll just treat it as plain
            // text. We already learned the delimiter wasn't able to close any inflection start delimiters, and we
            // now know it can't open any, either.
            this.buffer += delimiter
          }
        }
      }))
  }

  // Inline code is the only convention that:
  //
  // 1. Does not support escaped characters
  // 2. Cannot contain any other conventions
  //
  // Because inline code doesn't require any of the special machinery of this class, we keep its logic separate.  
  private tryToTokenizeInlineCodeOrUnmatchedDelimiter(): boolean {
    return tryToTokenizeCodeOrUnmatchedDelimiter({
      markup: this.markupConsumer.remaining,
      then: (resultToken, lengthConsumed) => {
        this.flushNonEmptyBufferToPlainTextToken()
        this.appendToken(resultToken)
        this.markupConsumer.index += lengthConsumed
      }
    })
  }

  private tryToTokenizeTypographicalConvention(): boolean {
    return this.tryToTokenizeEnOrEmDash() || this.tryToTokenizePlusMinusSign()
  }

  private tryToTokenizeEnOrEmDash(): boolean {
    const EN_DASH = '–'
    const EM_DASH = '—'

    const COUNT_DASHES_PER_EM_DASH = 3

    return this.markupConsumer.consume({
      pattern: EN_OR_EM_DASH_PATTERN,
      thenBeforeConsumingText: dashes => {
        // 2 consecutive hyphens produce an en dash; 3 produce an em dash.
        //
        // 4 or more consecutive hyphens produce as many em dashes as they can "afford" (at 3 hyphens per em dash).
        // Any extra hyphens (naturally either 1 or 2) are ignored.
        this.buffer +=
          dashes.length >= COUNT_DASHES_PER_EM_DASH
            ? repeat(EM_DASH, Math.floor(dashes.length / COUNT_DASHES_PER_EM_DASH))
            : EN_DASH
      }
    })
  }

  private tryToTokenizePlusMinusSign(): boolean {
    return this.markupConsumer.consume({
      pattern: PLUS_MINUS_SIGN_PATTERN,
      thenBeforeConsumingText: () => {
        this.buffer += '±'
      }
    })
  }

  private appendToken(token: Token): void {
    this.tokens.push(token)
    this.mostRecentToken = token
  }

  // This method always returns true, allowing us to cleanly chain it with other boolean tokenizer methods. 
  private bufferCurrentChar(): boolean {
    this.buffer += this.markupConsumer.currentChar
    this.markupConsumer.index += 1

    return true
  }

  private tryToOpen(convention: Convention): boolean {
    const { startsWith, flushesBufferToPlainTextTokenBeforeOpening, whenOpening } = convention

    return (
      this.canTry(convention)

      && this.markupConsumer.consume({
        pattern: startsWith,

        thenBeforeConsumingText: (match, charAfterMatch, ...captures) => {
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
    return {
      markupIndex: this.markupConsumer.index,
      tokens: this.tokens.slice(),
      openContexts: this.openContexts.map(context => context.clone()),
      inflectionHandlers: this.inflectionHandlers.map(handler => handler.clone()),
      buffer: this.buffer
    }
  }

  private canTry(conventionToOpen: Convention): boolean {
    const textIndex = this.markupConsumer.index

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
    // snapshot of their "parent", and therefore have their failure registered at parent's markup index.
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
    this.markupConsumer.index = snapshot.markupIndex
    this.openContexts = snapshot.openContexts
    this.inflectionHandlers = snapshot.inflectionHandlers
  }

  private appendNewToken(kind: TokenKind, value?: string): void {
    this.appendToken(new Token(kind, value))
  }

  private flushBufferToNakedUrlEndToken(): void {
    this.flushBufferToTokenOfKind(TokenKind.NakedUrlAfterScheme)
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

    for (const inflectionHandler of this.inflectionHandlers) {
      inflectionHandler.registerTokenInsertion({ atIndex })
    }

    this.mostRecentToken = token
  }

  private flushNonEmptyBufferToPlainTextToken(): void {
    this.flushNonEmptyBufferToTokenOfKind(TokenKind.PlainText)
  }

  private applyConfigSettingsToUrl(url: string): string {
    // Due to the various URL conventions' rules, we don't need to worry about the URL being blank.
    // However, it might have some leading or trailing whitespace.
    url = url.trim()

    switch (url[0]) {
      case FORWARD_SLASH:
        return this.config.baseForUrlsStartingWithSlash + url

      case HASH_MARK:
        return this.config.baseForUrlsStartingWithHashMark + url
    }

    return (
      URL_SCHEME_PATTERN.test(url)
        ? url
        : this.config.defaultUrlScheme + url)
  }

  private insertPlainTextTokenAtContextStart(text: string, context: ConventionContext): void {
    this.insertToken({
      token: new Token(TokenKind.PlainText, text),
      atIndex: context.startTokenIndex
    })
  }

  private bufferTextAwareOfRawBrackets(): void {
    const didOpenConvention =
      this.rawBracketConventions.some(convention => this.tryToOpen(convention))

    if (!didOpenConvention) {
      this.bufferCurrentChar()
    }
  }
}


// `String.repeat` has very poor mobile support.
function repeat(text: string, count: number): string {
  return new Array(count + 1).join(text)
}


const WHITESPACE_CHAR_PATTERN =
  new RegExp(WHITESPACE_CHAR)

const NOT_FOLLOWED_BY_WHITESPACE =
  notFollowedBy(WHITESPACE_CHAR)


const EN_OR_EM_DASH_PATTERN =
  patternStartingWith(atLeast(2, '-'))

const PLUS_MINUS_SIGN_PATTERN =
  patternStartingWith(escapeForRegex('+-'))


const EXAMPLE_INPUT_START_DELIMITER =
  escapeForRegex('{')

const EXAMPLE_INPUT_END_DELIMITER =
  escapeForRegex('}')


// Our URL patterns and associated string constants serve two purposes:
//
// 1. To apply URL config settings
// 2. To determine when bracketed text is intended to be a link URL. For more information, see the comments
//    for the `getLinkUrlConventions` method.
//
// One important thing to note about that second point:
//
// We aren't in the business of exhaustively excluding every invalid URL. Instead, we simply want to avoid
// surprising the author by producing a link when they probably didn't intend to produce one.

export const LETTER_CHAR =
  anyCharMatching(LETTER_CLASS)

const URL_SCHEME_NAME =
  LETTER_CHAR + everyOptional(
    anyCharMatching(
      LETTER_CLASS, DIGIT, ...['-', '+', '.'].map(escapeForRegex)))

const URL_SCHEME =
  URL_SCHEME_NAME + ':' + everyOptional('/')

const URL_SCHEME_PATTERN =
  patternStartingWith(URL_SCHEME)

const FORWARD_SLASH =
  '/'

const HASH_MARK =
  '#'

const SUBDOMAIN =
  anyCharMatching(LETTER_CLASS, DIGIT)
  + everyOptional(
    anyCharMatching(LETTER_CLASS, DIGIT, escapeForRegex('-')))

const TOP_LEVEL_DOMAIN =
  atLeastOne(LETTER_CHAR)

const DOMAIN_PART_WITH_TOP_LEVEL_DOMAIN =
  atLeastOne(SUBDOMAIN + escapeForRegex('.')) + TOP_LEVEL_DOMAIN

const EXPLICIT_URL_PREFIX =
  either(
    URL_SCHEME,
    FORWARD_SLASH,
    HASH_MARK)

const SOLELY_URL_PREFIX_PATTERN =
  solely(EXPLICIT_URL_PREFIX)


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
  EXAMPLE_INPUT_START_DELIMITER,
  EXAMPLE_INPUT_END_DELIMITER,
  ...[ESCAPER_CHAR, '-', '*', '+'].map(escapeForRegex)
]

const CONTENT_THAT_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN =
  patternStartingWith(
    atLeastOne(
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
  patternStartingWith(
    SOME_WHITESPACE + notFollowedBy(
      anyCharMatching(...BRACKET_START_PATTERNS, WHITESPACE_CHAR)))
