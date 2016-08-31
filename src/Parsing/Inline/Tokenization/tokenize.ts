import { EMPHASIS_CONVENTION, STRESS_CONVENTION, ITALIC_CONVENTION, BOLD_CONVENTION, HIGHLIGHT_CONVENTION, QUOTE_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, NORMAL_PARENTHETICAL_CONVENTION, SQUARE_PARENTHETICAL_CONVENTION } from '../RichConventions'
import { escapeForRegex, patternStartingWith, solely, everyOptional, either, optional, oneOrMore, multiple, followedBy, notFollowedBy, anyCharMatching, anyCharNotMatching, capture } from '../../../PatternHelpers'
import { SOME_WHITESPACE, ANY_WHITESPACE, WHITESPACE_CHAR, LETTER_CLASS, DIGIT, HASH_MARK, FORWARD_SLASH, LETTER_CHAR, URL_SCHEME } from '../../../PatternPieces'
import { NON_BLANK_PATTERN } from '../../../Patterns'
import { ESCAPER_CHAR } from '../../Strings'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from '../MediaConventions'
import { Config } from '../../../Config'
import { RichConvention } from './RichConvention'
import { tryToTokenizeCodeOrUnmatchedDelimiter } from './tryToTokenizeCodeOrUnmatchedDelimiter'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { last, concat, reversed } from '../../../CollectionHelpers'
import { Bracket } from './Bracket'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TextConsumer, OnTextMatch } from './TextConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { EncloseWithinConventionArgs } from './EncloseWithinConventionArgs'
import { Convention, OnConventionEvent } from './Convention'
import { InflectionHandler } from './InflectionHandler'
import { trimEscapedAndUnescapedOuterWhitespace } from './trimEscapedAndUnescapedOuterWhitespace'


// Returns a collection of tokens representing inline conventions and their components.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
// For more information about this process, see the comments in `nestOverlappingConventions.ts`.
export function tokenize(markup: string, config: Config): Token[] {
  return new Tokenizer(markup, config).tokens
}

// This function is identical to the `tokenize` function, except:
//
// 1. Footnotes are treated as normal parentheticals
// 2. The convention for referencing table of contents entries is ignored. The markup is instead treated
//    as a parenthetical of the appropriate bracket type.
export function tokenizeForInlineDocument(markup: string, config: Config): Token[] {
  return new Tokenizer(markup, config, true).tokens
}


const PARENTHESIS =
  new Bracket('(', ')')

const SQUARE_BRACKET =
  new Bracket('[', ']')

// Most of our conventions, including links and inline spoilers, incorporate brackets into their syntax.
// These conventions support both paretheses and square brackets, allowing either kind of bracket to be
// used interchangeably.
const PARENTHETICAL_BRACKETS = [
  PARENTHESIS,
  SQUARE_BRACKET
]


// The example input convention is the only convention enclosed within curly brackets. For more information
// about that convention, see the `getExampleInputConvention` method.
const CURLY_BRACKET =
  new Bracket('{', '}')


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

  // These bracket conventions don't produce special tokens, and they can only appear inside URLs (or a
  // few other contexts that ignore the typical conventions).
  //
  // They allow matching brackets to be included without having to escape closing brackets that would
  // otherwise cut short the URL (or media description, or reference to table of contents entry, etc.)
  private rawParentheticalBracketConventions = this.getRawParentheticalBracketConventions()

  // This convention is similar to `parentheticalRawBracketConventions`, but raw curly brackets are only
  // relevant inside of the example input convention.
  private rawCurlyBracketConvention = this.getRawCurlyBracketConvention()

  // When tokenizing media (i.e. audio, image, or video), we open a context for the description. Once the
  // description reaches its final bracket, we try to convert that media description context into a media URL
  // context.
  //
  // If that fails (either because there isn't an opening bracket for the media URL, or because there isn't a
  // closing bracket), we backtrack to the beginning of the media convention and try something else. 
  private mediaUrlConventions = this.getMediaUrlConventions()

  // Link URL conventions serve the same purpose as media URL conventions, but for links.  
  private linkUrlConventions = this.getLinkUrlConventions()

  // As a rule, when a convention containing a bare URL is closed, the bare URL gets closed first. Unlike
  // other conventions, bare URLs cannot overlap.
  //
  // This isn't a problem for bare URLs consisting only of a scheme and a hostname (e.g.
  // https://www.subdomain.example.co.uk). Any character that can close a convention will naturally
  // terminate the URL, too.
  //
  // However, for the path part of a URL (e.g. /some/page?search=pokemon#4), that's not the case, because
  // the path part of a URL can contain a wider variety of characters. We can no longer rely on the URL to
  // naturally terminate.
  //
  // We keep a direct reference to `nakedUrlPathConvention` to help us determine whether we have an active
  // bare URL that needs to be manually closed when an outer convention is closing.
  private nakedUrlPathConvention = this.getBareUrlPathConvention()

  // Inflection means any change of voice, which includes emphasis, stress, italic, bold, and quotes.
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
    }, {
      delimiterChar: '"',
      conventionForMinorInflection: QUOTE_CONVENTION
    }
  ].map(args => this.getInflectionHandler(args))

  // Speaking of inflection conventions...
  //
  // For a delimiter to close any inflection conventions, it must look like it's touching the end of
  // the content it's enclosing (i.e. it must be following a non-whitespace character).
  //
  // However, let's look at the following contrived eample:
  //
  //   Madam MeowMeow stood up. "I love my dog ("Bow-Wow" is his name), and you must rescue him!"
  //
  // Intuitively, the second quotation mark should open an inner quote around "Bow-Wow".
  //
  // However, that quotation mark is following a non-whitespace character!
  //
  // To get around this, we won't allow a delimiter to close an inflection convention if we have just
  // entered an outer convention.
  private markupIndexWeLastOpenedAConvention: number

  private get justEnteredAConvention(): boolean {
    return this.markupIndexWeLastOpenedAConvention === this.markupConsumer.index
  }

  private indicateWeJustOpenedAConvention(): void {
    this.markupIndexWeLastOpenedAConvention = this.markupConsumer.index
  }

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

  constructor(markup: string, private config: Config, isTokenizingInlineDocument = false) {
    const trimmedMarkup =
      trimEscapedAndUnescapedOuterWhitespace(markup)

    this.markupConsumer = new TextConsumer(trimmedMarkup)
    this.configureConventions(isTokenizingInlineDocument)

    this.tokenize()
  }

  private configureConventions(isTokenizingInlineDocument: boolean): void {
    this.conventions = [
      ...concat([
        {
          richConvention: HIGHLIGHT_CONVENTION,
          term: this.config.terms.markup.highlight
        }, {
          richConvention: SPOILER_CONVENTION,
          term: this.config.terms.markup.spoiler
        }, {
          richConvention: NSFW_CONVENTION,
          term: this.config.terms.markup.nsfw
        }, {
          richConvention: NSFL_CONVENTION,
          term: this.config.terms.markup.nsfl
        }
      ].map(args => this.getConventionsForLabeledRichBrackets(args))),

      ...this.getMediaDescriptionConventions(),

      ...(
        // If we're tokenizing an inline document...
        isTokenizingInlineDocument
          // We'll treat footnotes differently, because they don't really make sense in an inline document
          ? this.getFootnoteConventionsForInlineDocuments()
          // Otherwise, if we're tokenizing a regular document...
          : [
            // We'll support regular footnotes
            ...this.getFootnoteConventions(),
            // And we'll support references to table of contents entries!
            ...this.getReferenceToTableOfContentsEntryConventions()
          ]),

      ...this.getLinkifyingUrlConventions(),

      ...this.getLinkContentConventions(),

      ...[
        {
          richConvention: NORMAL_PARENTHETICAL_CONVENTION,
          bracket: PARENTHESIS
        }, {
          richConvention: SQUARE_PARENTHETICAL_CONVENTION,
          bracket: SQUARE_BRACKET
        }
      ].map(args => this.getParentheticalConvention(args)),

      this.getExampleInputConvention(),

      this.nakedUrlPathConvention
    ]
  }

  private getFootnoteConventions(): Convention[] {
    return PARENTHETICAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: FOOTNOTE_CONVENTION,
        // For regular footnotes (i.e. these), we collapse any leading whitespace.
        //
        // We don't do this for footnotes in inline documents, however. For more information about footnotes
        // in inline documents, see the `getFootnoteConventionsForInlineDocuments` method.
        startsWith: ANY_WHITESPACE + this.getFootnoteStartDelimiter(bracket),
        endsWith: this.getFootnotEndDelimiter(bracket)
      }))
  }

  // Footnotes, by definition, represent content that should not appear inline.
  //
  // In inline documents, this purpose can't be fulfilled, so we do the next best thing: we treat footnotes
  // as normal parentheticals.
  private getFootnoteConventionsForInlineDocuments(): Convention[] {
    return PARENTHETICAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: NORMAL_PARENTHETICAL_CONVENTION,
        startsWith: this.getFootnoteStartDelimiter(bracket),
        endsWith: this.getFootnotEndDelimiter(bracket),
        whenOpening: () => {
          this.buffer += '('
        },
        whenClosing: () => {
          this.buffer += ')'
        }
      }))
  }

  private getFootnoteStartDelimiter(bracket: Bracket): string {
    return bracket.startPattern + escapeForRegex('^') + ANY_WHITESPACE
  }

  private getFootnotEndDelimiter(bracket: Bracket): string {
    return bracket.endPattern
  }

  private getLinkContentConventions(): Convention[] {
    return PARENTHETICAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: LINK_CONVENTION,
        startsWith: bracket.startPattern,
        endsWith: bracket.endPattern,
        mustBeDirectlyFollowedBy: this.linkUrlConventions
      }))
  }

  // Labeled rich brackets take the following form:
  //
  //    After beating the Elite Four in Pokémon Red, [SPOILER: you *still* must face your rival].
  //
  // For all labeled rich bracket conventions:
  //
  // 1. The term preceding the colon is case-insensitive
  // 2. Whitespace after the colon is optional
  // 3. Parentheses can be used instead of square brackets
  private getConventionsForLabeledRichBrackets(
    args: {
      richConvention: RichConvention
      term: Config.Terms.FoundInMarkup
    }
  ): Convention[] {
    const { richConvention, term } = args

    return PARENTHETICAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention,
        startsWith: this.getLabeledBracketStartPattern(term, bracket),
        endsWith: bracket.endPattern,
        startPatternContainsATerm: true
      }))
  }

  private getLabeledBracketStartPattern(term: Config.Terms.FoundInMarkup, bracket: Bracket): string {
    return bracket.startPattern + either(...term.map(escapeForRegex)) + ':' + ANY_WHITESPACE
  }

  private getParentheticalConvention(
    args: {
      richConvention: RichConvention
      bracket: Bracket
    }
  ): Convention {
    const { richConvention, bracket } = args

    return this.getTokenizableRichConvention({
      richConvention,
      startsWith: bracket.startPattern + NOT_FOLLOWED_BY_WHITESPACE,
      endsWith: bracket.endPattern,

      whenOpening: () => { this.buffer += bracket.open },
      whenClosing: () => { this.buffer += bracket.close },

      insteadOfFailingWhenLeftUnclosed: () => { /*  Neither fail nor do anything special  */ }
    })
  }

  private getTokenizableRichConvention(
    args: {
      richConvention: RichConvention
      startsWith: string
      endsWith: string
      startPatternContainsATerm?: boolean
      whenOpening?: OnTextMatch
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
      whenClosing?: OnConventionEvent
      mustBeDirectlyFollowedBy?: Convention[]
    }
  ): Convention {
    const { richConvention, startsWith, endsWith, startPatternContainsATerm, whenOpening, insteadOfFailingWhenLeftUnclosed, whenClosing, mustBeDirectlyFollowedBy } = args

    return new Convention({
      // If a convention is totally empty, it's never applied. For example, this would-be inline NSFW convention
      // is empty:
      //
      // (NSFW:)
      //
      // Therefore, we instead treat it as a parenthesized convention containing the text "NSFW:".
      //
      // Additionally, when a convention contains only whitespace, it's never applied. For example, this would-be
      // inline NSFW convention contains only whitespace: 
      //
      // [NSFW:   ]
      //
      // Therefore, we instead treat it as a square bracketed convention containing the text "NSFW:   ".
      startsWith: startsWith + notFollowedBy(ANY_WHITESPACE + endsWith),
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

  private tryToTokenizeBareUrlSchemeAndHostname(): boolean {
    return this.markupConsumer.consume({
      pattern: NAKED_URL_SCHEME_AND_HOSTNAME,
      thenBeforeConsumingText: url => {
        this.flushNonEmptyBufferToPlainTextToken()
        this.appendNewToken(TokenKind.BareUrl, url)
      }
    })
  }

  // In the following url:
  //
  //  https://www.subdomain.example.co.uk/some/page?search=pokemon#4
  //
  // The path is "/some/page?search=pokemon#4"
  private getBareUrlPathConvention(): Convention {
    return new Convention({
      startsWith: FORWARD_SLASH,
      isCutShortByWhitespace: true,

      whenOpening: () => {
        this.buffer += FORWARD_SLASH
      },

      canOnlyOpenIfDirectlyFollowing: [TokenKind.BareUrl],
      insteadOfOpeningNormalConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),

      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => this.appendBufferedUlPathToCurrentBareUrl(),
      insteadOfFailingWhenLeftUnclosed: () => this.appendBufferedUlPathToCurrentBareUrl()
    })
  }

  // This convention's HTML equivalent is the `<kbd>` element. It represents an example of user input.
  //
  // Usage:
  //
  //   Press {esc} to quit.
  private getExampleInputConvention(): Convention {
    const EXAMPLE_INPUT_START_DELIMITER = CURLY_BRACKET.startPattern
    const EXAMPLE_INPUT_END_DELIMITER = CURLY_BRACKET.endPattern

    return new Convention({
      // Example input cannot be totally blank.
      startsWith: EXAMPLE_INPUT_START_DELIMITER + notFollowedBy(ANY_WHITESPACE + EXAMPLE_INPUT_END_DELIMITER),
      endsWith: EXAMPLE_INPUT_END_DELIMITER,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfOpeningNormalConventionsWhileOpen: () => {
        this.tryToOpen(this.rawCurlyBracketConvention)
          || this.tryToTokenizeTypographicalConvention()
          || this.bufferCurrentChar()
      },

      whenClosing: () => {
        const exampleInput = this.flushBuffer().trim()
        this.appendNewToken(TokenKind.ExampleInput, exampleInput)
      }
    })
  }

  // This convention represents a reference to a table of contents entry.
  //
  // Usage:
  //
  //   For more information, see [topic: shading]
  //
  // When rendered to an output format (e.g. HTML), it should serve as a link to that entry.
  private getReferenceToTableOfContentsEntryConventions(): Convention[] {
    return PARENTHETICAL_BRACKETS.map(bracket =>
      new Convention({
        startsWith: this.getLabeledBracketStartPattern(this.config.terms.markup.referenceToTableOfContentsEntry, bracket),
        startPatternContainsATerm: true,
        endsWith: bracket.endPattern,

        beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

        insteadOfOpeningNormalConventionsWhileOpen: () => this.handleTextAwareOfTypographyAndRawParentheticalBrackets(),

        whenClosing: () => {
          const snippetFromEntry = this.flushBuffer().trim()
          this.appendNewToken(TokenKind.ReferenceToTableOfContentsEntry, snippetFromEntry)
        }
      }))
  }

  private getMediaDescriptionConventions(): Convention[] {
    return concat(
      [IMAGE_CONVENTION, VIDEO_CONVENTION, AUDIO_CONVENTION].map(media =>
        PARENTHETICAL_BRACKETS.map(bracket => new Convention({
          startsWith: this.getLabeledBracketStartPattern(media.term(this.config.terms.markup), bracket),
          startPatternContainsATerm: true,
          endsWith: bracket.endPattern,

          beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,
          insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfTypographyAndRawParentheticalBrackets(),

          beforeClosingItAlwaysFlushesBufferTo: media.startAndDescriptionTokenKind,
          whenClosingItAlsoClosesInnerConventions: true,
          mustBeDirectlyFollowedBy: this.mediaUrlConventions
        }))))
  }

  private getMediaUrlConventions(): Convention[] {
    return PARENTHETICAL_BRACKETS.map(bracket => new Convention({
      startsWith: ANY_WHITESPACE + this.getStartPatternForBracketedUrlAssumedToBeAUrl(bracket),
      endsWith: bracket.endPattern,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.config.applySettingsToUrl(this.flushBuffer())
        this.appendNewToken(TokenKind.MediaEndAndUrl, url)
      }
    }))
  }

  // Links' bracketed URLs follow their bracketed content. For example:
  //
  //   You should try [Typescript](http://www.typescriptlang.org).
  //
  // If we're very sure that the author is intending to produce a link, we allow whitespace between
  // the link's bracketed URL and its bracketed content. For example:
  //
  //   You should try [Typescript] (http://www.typescriptlang.org).
  //
  // To verify the author actually intends to produce a link, we apply some extra rules (but only if 
  // there is whitespace between a link's content and its URL):
  //
  // 1. First, the URL must either:
  //    * Have a scheme (like "mailto:" or "https://")
  //    * Start with a slash
  //    * Start with a hash mark ("#")
  //    * Have a subdomain and a top-level domain
  //      
  // 2. Second, the URL must not contain any unescaped whitespace.
  //
  // 3. Lastly, if the URL had no scheme but did have a subdomain and a top-level domain:
  //    * The top-level domain must consist solely of letters
  //    * The URL must start with a number or a letter
  //    * There must not be consecutive periods anywhere in the domain part of the URL. However,
  //      consecutive periods are allowed in the resource path.
  private getLinkUrlConventions(): Convention[] {
    const whenClosing = (url: string) => {
      // When closing a link URL, we're (correctly) going to assume that the most recent token is a
      // `LinkEndToken`.
      this.mostRecentToken.value = url
    }

    return concat(PARENTHETICAL_BRACKETS.map(bracket => [
      this.getConventionForBracketedUrl({ bracket, whenClosing }),
      this.getConventionForBracketedUrlOffsetByWhitespace({ bracket, whenClosing })
    ]))
  }

  // Certain conventions can be "linkified" if they're followed by a bracketed URL.
  // 
  // When a rich convention is linkified, its content gets wrapped in a link. On the other hand,
  // when a media convention or example input convention is linkified, it gets placed inside a
  // link.
  //
  // Like with link URLs, if we're sure the author intends to linkfiy a convention, we allow
  // whitespace between the linkifying URL and the original convention. For more information,
  // see `getLinkUrlConventions`.
  private getLinkifyingUrlConventions(): Convention[] {
    const KINDS_OF_END_TOKENS_FOR_LINKIFIABLE_RICH_CONVENTIONS = [
      HIGHLIGHT_CONVENTION,
      SPOILER_CONVENTION,
      NSFW_CONVENTION,
      NSFL_CONVENTION,
      FOOTNOTE_CONVENTION
    ].map(richConvention => richConvention.endTokenKind)

    return concat(PARENTHETICAL_BRACKETS.map(bracket => {
      const argsForRichConventions = {
        bracket,
        canOnlyOpenIfDirectlyFollowing: KINDS_OF_END_TOKENS_FOR_LINKIFIABLE_RICH_CONVENTIONS,
        whenClosing: (url: string) => this.closeLinkifyingUrlForRichConventions(url)
      }

      const argsForMediaConentions = {
        bracket,
        canOnlyOpenIfDirectlyFollowing: [TokenKind.MediaEndAndUrl],
        whenClosing: (url: string) => this.closeLinkifyingUrlForMediaConventions(url)
      }

      const argsForExampleInput = {
        bracket,
        canOnlyOpenIfDirectlyFollowing: [TokenKind.ExampleInput],
        whenClosing: (url: string) => this.closeLinkifyingUrlForExampleInputConvention(url)
      }

      const allArgs = [
        argsForRichConventions,
        argsForMediaConentions,
        argsForExampleInput
      ]

      return concat(allArgs.map(args => ([
        this.getConventionForBracketedUrl(args),
        this.getConventionForBracketedUrlOffsetByWhitespace(args)
      ])))
    }))
  }

  private getConventionForBracketedUrl(
    args: {
      bracket: Bracket
      canOnlyOpenIfDirectlyFollowing?: TokenKind[]
      whenClosing: (url: string) => void
    }
  ): Convention {
    const { bracket, canOnlyOpenIfDirectlyFollowing, whenClosing } = args

    return new Convention({
      canOnlyOpenIfDirectlyFollowing,

      startsWith: this.getStartPatternForBracketedUrlAssumedToBeAUrl(bracket),

      endsWith: bracket.endPattern,

      insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.config.applySettingsToUrl(this.flushBuffer())
        whenClosing(url)
      }
    })
  }

  private getStartPatternForBracketedUrlAssumedToBeAUrl(bracket: Bracket): string {
    return bracket.startPattern + notFollowedBy(
      ANY_WHITESPACE
      + anyCharMatching(
        bracket.endPattern,
        escapeForRegex(ESCAPER_CHAR)))
  }

  private getConventionForBracketedUrlOffsetByWhitespace(
    args: {
      bracket: Bracket
      canOnlyOpenIfDirectlyFollowing?: TokenKind[]
      whenClosing: (url: string) => void
    }
  ): Convention {
    const { bracket, canOnlyOpenIfDirectlyFollowing, whenClosing } = args

    return new Convention({
      canOnlyOpenIfDirectlyFollowing,

      startsWith: SOME_WHITESPACE + bracket.startPattern + capture(
        either(
          EXPLICIT_URL_PREFIX,
          TOP_LEVEL_DOMAIN_WITH_AT_LEAST_ONE_SUBDOMAIN + either(
            // If we're using the presence a subdomain and top-level domain as evidence that we're
            // looking at a bracketed URL, then that top-level domain must either be followed by a
            // forward slash...
            FORWARD_SLASH,
            // ... or be the end of the URL.
            followedBy(bracket.endPattern)))),

      endsWith: bracket.endPattern,

      whenOpening: (_1, _2, urlPrefix) => { this.buffer += urlPrefix },

      failsIfWhitespaceIsEnounteredBeforeClosing: true,
      insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: (context) => {
        const url = this.config.applySettingsToUrl(this.flushBuffer())

        if (this.probablyWasNotIntendedToBeAUrl(url)) {
          this.backtrackToBeforeContext(context)
        } else {
          whenClosing(url)
        }
      }
    })
  }

  private probablyWasNotIntendedToBeAUrl(url: string): boolean {
    return URL_CONSISTING_SOLELY_OF_PREFIX.test(url)
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

    this.encloseWithinLink({ startingBackAtTokenIndex: indexOfMediaStartToken, url })
  }

  private closeLinkifyingUrlForExampleInputConvention(url: string): void {
    // We're going to (corretly) assume that the last token is `ExampleInput` 
    const indexOfExampleInputToken = this.tokens.length - 1

    this.encloseWithinLink({ startingBackAtTokenIndex: indexOfExampleInputToken, url })
  }

  private encloseWithinLink(args: { startingBackAtTokenIndex: number, url: string }): void {
    const { startingBackAtTokenIndex, url } = args

    this.encloseWithin({
      richConvention: LINK_CONVENTION,
      startingBackAtTokenIndex
    })

    // Now, the last token is a LinkEndAndUrl token. Let's assign its URL!
    last(this.tokens).value = url
  }

  private getRawParentheticalBracketConventions(): Convention[] {
    return PARENTHETICAL_BRACKETS.map(bracket => this.getRawBracketConvention(bracket))
  }

  private getRawCurlyBracketConvention(): Convention {
    return this.getRawBracketConvention(CURLY_BRACKET)
  }

  private getRawBracketConvention(bracket: Bracket): Convention {
    return new Convention({
      startsWith: bracket.startPattern,
      endsWith: bracket.endPattern,

      whenOpening: () => { this.buffer += bracket.open },
      whenClosing: () => { this.buffer += bracket.close },

      insteadOfFailingWhenLeftUnclosed: () => { /* Neither fail nor do anything special */ }
    })
  }

  private getInflectionHandler(
    args: {
      delimiterChar: string
      // The convention indicated by surrounding text with a single delimiter character on either side.
      conventionForMinorInflection: RichConvention
      // The convention (if any) indicated by surrounding text with double delimiter characters on either side.
      conventionForMajorInflection?: RichConvention
    }
  ): InflectionHandler {
    const { delimiterChar, conventionForMajorInflection, conventionForMinorInflection } = args

    return new InflectionHandler({
      delimiterChar,
      conventionForMinorInflection,
      conventionForMajorInflection,

      encloseWithinConvention: (args) => {
        this.closeBareUrlContextIfOneIsOpen()
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
      // The next character (if there is one) is preserved as plain text.
      //
      // If there are no more characters, we're done! We don't preserve the `ESCAPER_CHAR`,
      // because those are only preserved if they are themselves escaped.

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
    // - Are cut short by whitespace (bare URLs)
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
        if (this.tryToCloseConventionWhoseEndDelimiterWeAlreadyFound({ belongingToContextAtIndex: i })) {
          return true
        }

        // Well, we couldn't successfully close the convention, so we've got to backtrack. For now, a
        // convention can only fail to close if:
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

  private tryToCloseConventionWhoseEndDelimiterWeAlreadyFound(args: { belongingToContextAtIndex: number }): boolean {
    const contextIndex = args.belongingToContextAtIndex
    const context = this.openContexts[contextIndex]
    const { convention } = context

    // As a rule, if a convention enclosing a bare URL is closed, the bare URL gets closed first.
    this.closeBareUrlContextIfOneIsOpen({ withinContextAtIndex: contextIndex })

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
    if (this.justEnteredAConvention || !this.isPreviousCharacterNonwhitespace()) {
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

  private closeBareUrlContextIfOneIsOpen(args?: { withinContextAtIndex: number }): void {
    const { openContexts } = this

    const outermostIndexThatMayBeBareUrl =
      args ? (args.withinContextAtIndex + 1) : 0

    for (let i = outermostIndexThatMayBeBareUrl; i < openContexts.length; i++) {
      if (openContexts[i].convention === this.nakedUrlPathConvention) {
        this.appendBufferedUlPathToCurrentBareUrl()

        // We need to remove the bare URL's context, as well as the contexts of any raw text brackets
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
    //   I've had enough! **I hate [SPOILER: Professor Oak!**]
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
    //   *[Sadly*, Starcraft 2 is dead.] (reddit.com/r/starcraft)
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
      || this.tryToTokenizeBareUrlSchemeAndHostname()
      || this.tryToStartInflectingOrTreatDelimiterAsPlainText()
      || this.tryToTokenizeInlineCodeOrUnmatchedDelimiter()
      || this.tryToTokenizeTypographicalConvention())
  }

  private tryToStartInflectingOrTreatDelimiterAsPlainText(): boolean {
    const didOpen = this.inflectionHandlers.some(handler =>
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

    if (didOpen) {
      this.indicateWeJustOpenedAConvention()
    }

    return didOpen
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
    return (
      this.tryToTokenizeEnOrEmDash()
      || this.tryToTokenizePlusMinusSign()
      || this.tryToTokenizeEllipsis())
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

  private tryToTokenizeEllipsis(): boolean {
    return this.markupConsumer.consume({
      pattern: ELLIPSIS_PATTERN,
      thenBeforeConsumingText: () => {
        this.buffer += this.config.ellipsis
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

    const didOpen = (
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

    if (didOpen) {
      this.indicateWeJustOpenedAConvention()
    }

    return didOpen
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

    const { canOnlyOpenIfDirectlyFollowing } = conventionToOpen

    return (
      !this.failedConventionTracker.hasFailed(conventionToOpen, textIndex)
      && (!canOnlyOpenIfDirectlyFollowing || this.isDirectlyFollowing(canOnlyOpenIfDirectlyFollowing)))
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

  private appendBufferedUlPathToCurrentBareUrl(): void {
    if (this.mostRecentToken.kind === TokenKind.BareUrl) {
      this.mostRecentToken.value += this.flushBuffer()
    } else {
      throw new Error('Most recent token is not a bare URL token')
    }
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

  private insertPlainTextTokenAtContextStart(text: string, context: ConventionContext): void {
    this.insertToken({
      token: new Token(TokenKind.PlainText, text),
      atIndex: context.startTokenIndex
    })
  }

  private handleTextAwareOfRawBrackets(): void {
    this.tryToOpenRawParentheticalBracketConvention() || this.bufferCurrentChar()
  }

  private handleTextAwareOfTypographyAndRawParentheticalBrackets(): void {
    this.tryToOpenRawParentheticalBracketConvention()
      || this.tryToTokenizeTypographicalConvention()
      || this.bufferCurrentChar()
  }

  private tryToOpenRawParentheticalBracketConvention(): boolean {
    return this.rawParentheticalBracketConventions.some(convention => this.tryToOpen(convention))
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


const PERIOD =
  escapeForRegex('.')

const ELLIPSIS_PATTERN =
  patternStartingWith(multiple(PERIOD))

const EN_OR_EM_DASH_PATTERN =
  patternStartingWith(multiple('-'))

const PLUS_MINUS_SIGN_PATTERN =
  patternStartingWith(escapeForRegex('+-'))


// Our URL patterns (and associated string constants) are used to determine whether text was
// likely intended to be a URL.
//
// We aren't in the business of exhaustively excluding every invalid URL. Instead, we simply
// want to avoid surprising the author by producing a link when they probably didn't intend
// to produce one.

const HYPHEN =
  escapeForRegex('-')

const URL_SUBDOMAIN =
  anyCharMatching(LETTER_CLASS, DIGIT)
  + everyOptional(anyCharMatching(LETTER_CLASS, DIGIT, HYPHEN))
  + escapeForRegex('.')

const URL_TOP_LEVEL_DOMAIN =
  oneOrMore(LETTER_CHAR)

const TOP_LEVEL_DOMAIN_WITH_AT_LEAST_ONE_SUBDOMAIN =
  oneOrMore(URL_SUBDOMAIN) + URL_TOP_LEVEL_DOMAIN

const EXPLICIT_URL_PREFIX =
  either(
    URL_SCHEME,
    FORWARD_SLASH,
    HASH_MARK)

const URL_CONSISTING_SOLELY_OF_PREFIX =
  solely(EXPLICIT_URL_PREFIX)

const NAKED_URL_SCHEME =
  'http' + optional('s') + '://'

const NAKED_URL_SCHEME_AND_HOSTNAME =
  patternStartingWith(
    NAKED_URL_SCHEME
    + everyOptional(URL_SUBDOMAIN) + URL_TOP_LEVEL_DOMAIN)


// The patterns below exist purely for optimization.
//
// For more information, see the `bufferContentThatCannotOpenOrCloseAnyConventions` method.


const PARENTHETICAL_BRACKET_START_PATTERNS =
  PARENTHETICAL_BRACKETS.map(bracket => bracket.startPattern)

const ALL_BRACKETS =
  [PARENTHESIS, SQUARE_BRACKET, CURLY_BRACKET]

const BRACKET_START_PATTERNS =
  ALL_BRACKETS.map(bracket => bracket.startPattern)

const BRACKET_END_PATTERNS =
  ALL_BRACKETS.map(bracket => bracket.endPattern)

// The "h" is for the start of bare URLs. 
const CHAR_CLASSES_THAT_CAN_OPEN_OR_CLOSE_CONVENTIONS = [
  WHITESPACE_CHAR, HYPHEN, FORWARD_SLASH, PERIOD, 'h', '"', '_', '`',
  ...BRACKET_START_PATTERNS,
  ...BRACKET_END_PATTERNS,
  ...[ESCAPER_CHAR, '*', '+'].map(escapeForRegex)
]

const CONTENT_THAT_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN =
  patternStartingWith(
    oneOrMore(
      either(
        anyCharNotMatching(...CHAR_CLASSES_THAT_CAN_OPEN_OR_CLOSE_CONVENTIONS),
        // An "h" only has special meaning if it's the start of a bare URL scheme.
        'h' + notFollowedBy('ttp' + optional('s') + '://'),
        // Multiple periods produce ellipses, but single periods have no special meaning.
        PERIOD + notFollowedBy(PERIOD),
        // Multiple hyphens produce en/em dashes, but single hyphens have no special meaning.
        HYPHEN + notFollowedBy(HYPHEN)
      )))

// This pattern matches all whitespace that isn't followed by an open bracket.
//
// If there's a chunk of whitespace followed by an open bracket, we don't want to match any of the
// chunk:
//
//   [SPOILER: Gary battles Ash]   (http://bulbapedia.bulbagarden.net/wiki/Rival)
//
// To prevent our pattern from matching all but the last character of that whitespace, we make sure
// our match is followed by neither an open bracket nor by another whitespace character. 
const WHITESPACE_THAT_NORMALLY_CANNOT_OPEN_OR_CLOSE_ANY_CONVENTIONS_PATTERN =
  patternStartingWith(
    SOME_WHITESPACE + notFollowedBy(
      anyCharMatching(...PARENTHETICAL_BRACKET_START_PATTERNS, WHITESPACE_CHAR)))
