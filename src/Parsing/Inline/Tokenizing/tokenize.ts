import { EMPHASIS, STRESS, ITALIC, BOLD, HIGHLIGHT, QUOTE, SPOILER, NSFW, NSFL, FOOTNOTE, LINK, NORMAL_PARENTHETICAL, SQUARE_PARENTHETICAL } from '../RichConventions'
import { AUDIO, IMAGE, VIDEO } from '../MediaConventions'
import { escapeForRegex, patternStartingWith, solely, everyOptional, either, optional, oneOrMore, multiple, followedBy, notFollowedBy, anyCharMatching, anyCharNotMatching, capture } from '../../../PatternHelpers'
import { SOME_WHITESPACE, ANY_WHITESPACE, WHITESPACE_CHAR, LETTER_CLASS, DIGIT, HASH_MARK, FORWARD_SLASH, LETTER_CHAR, URL_SCHEME } from '../../../PatternPieces'
import { NON_BLANK_PATTERN, WHITESPACE_CHAR_PATTERN } from '../../../Patterns'
import { BACKSLASH } from '../../Strings'
import { Config } from '../../../Config'
import { RichConvention } from './RichConvention'
import { tryToTokenizeCodeOrUnmatchedDelimiter } from './tryToTokenizeCodeOrUnmatchedDelimiter'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { last, concat, reversed } from '../../../CollectionHelpers'
import { repeat } from '../../../StringHelpers'
import { Bracket } from './Bracket'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TextConsumer, OnTextMatch } from './TextConsumer'
import { TokenRole } from '../TokenRole'
import { Token } from './Token'
import { ParseableToken } from '../ParseableToken'
import { EncloseWithinConventionArgs } from './EncloseWithinConventionArgs'
import { Convention, OnConventionEvent } from './Convention'
import { InflectionHandler } from './InflectionHandler'
import { trimEscapedAndUnescapedOuterWhitespace } from './trimEscapedAndUnescapedOuterWhitespace'


// Returns a collection of tokens representing inline conventions and their components.
//
// Overlapping conventions are split into multiple pieces to ensure each piece has just a single parent.
// For more information about this process, see the comments in `nestOverlappingConventions.ts`.
export function tokenize(markup: string, config: Config): ParseableToken[] {
  return new Tokenizer(markup, config).result
}

// This function is identical to the `tokenize` function, except:
//
// 1. Footnotes are treated as normal parentheticals
// 2. The convention for referencing table of contents entries is ignored. The markup is instead treated
//    as a parenthetical of the appropriate bracket type.
export function tokenizeForInlineDocument(markup: string, config: Config): ParseableToken[] {
  const { result } =
    new Tokenizer(markup, config, { isTokenizingInlineDocument: true })

  return result
}


// Most of our conventions, including links and inline spoilers, incorporate brackets into their syntax.
// These conventions support both parentheses and square brackets, allowing either kind of bracket to be
// used interchangeably.
//
// TODO: Now that most of the conventions (handled within the tokenizer class) incorporate brackets, we
// should consider grouping conventions by their stems.

const PARENTHESIS =
  new Bracket('(', ')')

const SQUARE_BRACKET =
  new Bracket('[', ']')

const NORMAL_BRACKETS = [
  PARENTHESIS,
  SQUARE_BRACKET
]


// The example input convention is the only convention enclosed within curly brackets. For more information
// about that convention, see the `getExampleInputConvention` method.
const CURLY_BRACKET =
  new Bracket('{', '}')


class Tokenizer {
  // This is our result! A collection of tokens that the parser can use to generate syntax nodes.
  //
  // Yes, it's hackish, but this class is designed to be single-use, almost like a function.
  // 
  // The reason we use a class instead of a function is because of the scoping a class provides. Ultimately,
  // we shamefully hide this class behind the exported `tokenize` and `tokenizeForInlineDocument` functions.
  result: ParseableToken[]

  // We use this to keep track of where we are in the markup.
  private markupConsumer: TextConsumer

  // This buffer is for any text that isn't consumed by special delimiters. Eventually, the buffer gets
  // flushed to a token, usually a `PlainText` token.
  private bufferedContent = ''

  // Speaking of tokens, this is our collection! Unlike a `ParseableToken`, a `Token` knows when it's part of
  // a pair of tokens enclosing content. For example, an `EmphasisStart` token knows about its corresponding
  // `EmphasisEnd` token. 
  //
  // This additional information helps us nest overlapping conventions.
  private tokens: Token[] = []

  // When we open a new convention, we create a new context for it and add it to this collection.
  private openContexts: ConventionContext[] = []

  // When a convention is missing its closing delimiter, we backtrack and add the convention to our
  // `failedConventionTracker`.
  private failedConventionTracker: FailedConventionTracker = new FailedConventionTracker()

  // Most of our conventions are thrown in this collection. We try to open these conventions in order.
  //
  // The conventions not included in this collection are:
  //
  // 1. Media URL conventions
  // 2. Link URL conventions
  // 3. Raw bracket conventions
  // 4. Inflection convections
  //
  // Those exceptions are all explained below.
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
  // We keep a direct reference to `bareUrlPathConvention` to help us determine whether we have an active
  // bare URL that needs to be manually closed when an outer convention is closing.
  private bareUrlPathConvention = this.getBareUrlPathConvention()

  // Inflection means any change of voice, which includes emphasis, stress, italic, bold, and quotes.
  //
  // We handle inflection in a manner incompatible with the rest of our conventions, so we throw all that
  // special logic into the InflectionHandler class. More information can be found in comments within that
  // class.
  private inflectionHandlers = [
    {
      delimiterChar: '*',
      conventionForMinorInflection: EMPHASIS,
      conventionForMajorInflection: STRESS
    }, {
      delimiterChar: '_',
      conventionForMinorInflection: ITALIC,
      conventionForMajorInflection: BOLD
    }, {
      delimiterChar: '"',
      conventionForMinorInflection: QUOTE
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

  constructor(markup: string, private config: Config, options?: { isTokenizingInlineDocument: boolean }) {
    const trimmedMarkup =
      trimEscapedAndUnescapedOuterWhitespace(markup)

    this.markupConsumer = new TextConsumer(trimmedMarkup)
    this.configureConventions(options && options.isTokenizingInlineDocument)

    this.tokenize()
    this.result = nestOverlappingConventions(this.tokens)
  }

  private configureConventions(isTokenizingInlineDocument: boolean): void {
    this.conventions = [
      ...concat([
        {
          richConvention: HIGHLIGHT,
          term: this.config.terms.markup.highlight
        }, {
          richConvention: SPOILER,
          term: this.config.terms.markup.spoiler
        }, {
          richConvention: NSFW,
          term: this.config.terms.markup.nsfw
        }, {
          richConvention: NSFL,
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
            ...this.getInternalTopicLinkConventions()
          ]),

      ...this.getLinkifyingUrlConventions(),

      ...this.getLinkContentConventions(),

      ...[
        {
          richConvention: NORMAL_PARENTHETICAL,
          bracket: PARENTHESIS
        }, {
          richConvention: SQUARE_PARENTHETICAL,
          bracket: SQUARE_BRACKET
        }
      ].map(args => this.getParentheticalConvention(args)),

      this.getExampleInputConvention(),

      this.bareUrlPathConvention
    ]
  }

  private getFootnoteConventions(): Convention[] {
    return NORMAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: FOOTNOTE,
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
    return NORMAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: NORMAL_PARENTHETICAL,
        startsWith: this.getFootnoteStartDelimiter(bracket),
        endsWith: this.getFootnotEndDelimiter(bracket),
        whenOpening: () => {
          this.bufferedContent += '('
        },
        whenClosing: () => {
          this.bufferedContent += ')'
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
    return NORMAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention: LINK,
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

    return NORMAL_BRACKETS.map(bracket =>
      this.getTokenizableRichConvention({
        richConvention,
        startsWith: labeledBracketStartDelimiter(term, bracket),
        endsWith: bracket.endPattern,
        startPatternContainsATerm: true
      }))
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

      whenOpening: () => { this.bufferedContent += bracket.open },
      whenClosing: () => { this.bufferedContent += bracket.close },

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
      // Up never applies empty conventions, and that naturally applies for rich conventions, too.
      //
      // For example, this would-be inline NSFW convention is empty:
      //
      // (NSFW:)
      //
      // Therefore, we instead treat it as a parenthesized convention containing the text "NSFW:".
      //
      // Furthermore, Up never recognizes rich conventions if they contain only whitespace. For example,
      // this would-be inline NSFW convention contains only whitespace: 
      //
      // [NSFW:   ]
      //
      // Therefore, we instead treat it as a square bracketed convention containing the text "NSFW:   ".
      startsWith: startDelimiterNotFollowedByEndDelimiter(startsWith, endsWith),
      startPatternContainsATerm,

      endsWith,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,
      beforeClosingItFlushesNonEmptyBufferTo: TokenRole.PlainText,

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
      pattern: BARE_URL_SCHEME_AND_HOSTNAME,
      thenBeforeConsumingText: url => {
        this.flushNonEmptyBufferToPlainTextToken()
        this.appendNewToken(TokenRole.BareUrl, url)
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
        this.bufferedContent += FORWARD_SLASH
      },

      canOnlyOpenIfDirectlyFollowing: [TokenRole.BareUrl],
      insteadOfOpeningRegularConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),

      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => this.appendBufferedUrlPathToCurrentBareUrl(),
      insteadOfFailingWhenLeftUnclosed: () => this.appendBufferedUrlPathToCurrentBareUrl()
    })
  }

  // This convention's HTML equivalent is the `<kbd>` element. It represents an example of user input.
  //
  // Usage:
  //
  //   Press {esc} to quit.
  private getExampleInputConvention(): Convention {
    return new Convention({
      startsWith: startDelimiterNotFollowedByEndDelimiter(CURLY_BRACKET.startPattern, CURLY_BRACKET.endPattern),
      endsWith: CURLY_BRACKET.endPattern,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfOpeningRegularConventionsWhileOpen: () => {
        this.tryToOpen(this.rawCurlyBracketConvention)
          || this.tryToTokenizeTypographicalConvention()
          || this.addCurrentCharOrStreakOfWhitespaceToContentBuffer()
      },

      whenClosing: () => {
        const exampleInput = this.flushBufferedContent().trim()
        this.appendNewToken(TokenRole.ExampleInput, exampleInput)
      }
    })
  }

  // This convention represents a link to an item referenced by the table of contents.
  //
  // Usage:
  //
  //   For more information, see [topic: shading].
  private getInternalTopicLinkConventions(): Convention[] {
    const term =
      this.config.terms.markup.internalTopicLink

    return NORMAL_BRACKETS.map(bracket =>
      new Convention({
        startsWith: startDelimiterNotFollowedByEndDelimiter(labeledBracketStartDelimiter(term, bracket), bracket.endPattern),
        startPatternContainsATerm: true,
        endsWith: bracket.endPattern,

        beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

        insteadOfOpeningRegularConventionsWhileOpen: () => this.handleTextAwareOfTypographyAndRawParentheticalBrackets(),

        whenClosing: () => {
          const snippetFromEntry = this.flushBufferedContent().trim()
          this.appendNewToken(TokenRole.InternalTopicLink, snippetFromEntry)
        }
      }))
  }

  private getMediaDescriptionConventions(): Convention[] {
    return concat(
      [IMAGE, VIDEO, AUDIO].map(media => {
        const mediaTerm = media.term(this.config.terms.markup)

        return NORMAL_BRACKETS.map(bracket =>
          new Convention({
            startsWith: startDelimiterNotFollowedByEndDelimiter(labeledBracketStartDelimiter(mediaTerm, bracket), bracket.endPattern),
            startPatternContainsATerm: true,
            endsWith: bracket.endPattern,

            beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,
            insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfTypographyAndRawParentheticalBrackets(),

            beforeClosingItAlwaysFlushesBufferTo: media.startAndDescriptionTokenRole,
            whenClosingItAlsoClosesInnerConventions: true,
            mustBeDirectlyFollowedBy: this.mediaUrlConventions
          }))
      }))
  }

  private getMediaUrlConventions(): Convention[] {
    return NORMAL_BRACKETS.map(bracket => new Convention({
      startsWith: ANY_WHITESPACE + this.startPatternForBracketedUrlAssumedToBeAUrl(bracket),
      endsWith: bracket.endPattern,

      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken: true,

      insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.config.applySettingsToUrl(this.flushBufferedContent())
        this.appendNewToken(TokenRole.MediaEndAndUrl, url)
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
      // `LinkEnd` token.
      this.mostRecentToken.value = url
    }

    return concat(NORMAL_BRACKETS.map(bracket => [
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
    const LINKIFIABLE_RICH_CONVENTIONS = [
      HIGHLIGHT,
      SPOILER,
      NSFW,
      NSFL,
      FOOTNOTE
    ].map(richConvention => richConvention.endTokenRole)

    return concat(NORMAL_BRACKETS.map(bracket => {
      const argsForRichConventions = {
        bracket,
        canOnlyOpenIfDirectlyFollowing: LINKIFIABLE_RICH_CONVENTIONS,
        whenClosing: (url: string) => this.closeLinkifyingUrlForRichConventions(url)
      }

      const argsForMediaConentions = {
        bracket,
        canOnlyOpenIfDirectlyFollowing: [TokenRole.MediaEndAndUrl],
        whenClosing: (url: string) => this.closeLinkifyingUrlForMediaConventions(url)
      }

      const argsForExampleInput = {
        bracket,
        canOnlyOpenIfDirectlyFollowing: [TokenRole.ExampleInput],
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
      canOnlyOpenIfDirectlyFollowing?: TokenRole[]
      whenClosing: (url: string) => void
    }
  ): Convention {
    const { bracket, canOnlyOpenIfDirectlyFollowing, whenClosing } = args

    return new Convention({
      canOnlyOpenIfDirectlyFollowing,

      startsWith: this.startPatternForBracketedUrlAssumedToBeAUrl(bracket),

      endsWith: bracket.endPattern,

      insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: () => {
        const url = this.config.applySettingsToUrl(this.flushBufferedContent())
        whenClosing(url)
      }
    })
  }

  private startPatternForBracketedUrlAssumedToBeAUrl(bracket: Bracket): string {
    // The URL must not be blank, and its first character must not be escaped.
    return bracket.startPattern + notFollowedBy(
      ANY_WHITESPACE
      + anyCharMatching(
        bracket.endPattern,
        escapeForRegex(BACKSLASH)))
  }

  private getConventionForBracketedUrlOffsetByWhitespace(
    args: {
      bracket: Bracket
      canOnlyOpenIfDirectlyFollowing?: TokenRole[]
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

      whenOpening: (_1, _2, urlPrefix) => { this.bufferedContent += urlPrefix },

      failsIfWhitespaceIsEnounteredBeforeClosing: true,
      insteadOfClosingOuterConventionsWhileOpen: () => this.handleTextAwareOfRawBrackets(),
      whenClosingItAlsoClosesInnerConventions: true,

      whenClosing: (context) => {
        const url = this.config.applySettingsToUrl(this.flushBufferedContent())

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
    const linkEndToken = new Token(LINK.endTokenRole, url)
    const linkStartToken = new Token(LINK.startTokenRole)
    linkStartToken.enclosesContentBetweenItselfAnd(linkEndToken)

    // We'll insert our new link end token right before the original end token, and we'll insert our new link
    // start token right after the original end token's corresponding start token.

    const originalEndToken = this.mostRecentToken
    this.insertToken({ token: linkEndToken, atIndex: this.tokens.indexOf(originalEndToken) })

    const originalStartToken = originalEndToken.correspondingEnclosingToken
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
      richConvention: LINK,
      startingBackAtTokenIndex
    })

    // Now, the last token is a LinkEndAndUrl token. Let's assign its URL!
    last(this.tokens).value = url
  }

  private getRawParentheticalBracketConventions(): Convention[] {
    return NORMAL_BRACKETS.map(bracket => this.getRawBracketConvention(bracket))
  }

  private getRawCurlyBracketConvention(): Convention {
    return this.getRawBracketConvention(CURLY_BRACKET)
  }

  private getRawBracketConvention(bracket: Bracket): Convention {
    return new Convention({
      startsWith: bracket.startPattern,
      endsWith: bracket.endPattern,

      whenOpening: () => { this.bufferedContent += bracket.open },
      whenClosing: () => { this.bufferedContent += bracket.close },

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
          token: new Token(TokenRole.PlainText, text),
          atIndex: atIndex
        })
      }
    })
  }

  private tokenize(): void {
    while (true) {
      this.bufferContentThatCanNeverServeAsDelimiter()

      if (this.isDone()) {
        break
      }

      const didAnything =
        this.tryToEscapeCurrentChar()
        || this.tryToCloseAnyConvention()
        || this.performContextSpecificBehaviorInsteadOfTryingToOpenRegularConventions()
        || this.tryToOpenAnyConvention()

      if (!didAnything) {
        this.addCurrentCharOrStreakOfWhitespaceToContentBuffer()
      }
    }
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

  private tryToEscapeCurrentChar(): boolean {
    if (this.markupConsumer.currentChar !== BACKSLASH) {
      return false
    }

    // The next character (if there is one) is escaped, so we buffer it.
    //
    // If there are no more characters, we're done! We don't preserve the backslash,
    // because they are only preserved if they are themselves escaped.

    this.markupConsumer.index += 1

    if (!this.markupConsumer.done()) {
      this.addCurrentCharToContentBuffer()
    }

    return true
  }

  // This method exists solely for optimization.
  //
  // It buffers any leading content that can guarantee will never:
  //
  // 1. Open any conventions
  // 2. Close any conventions
  // 3. Serve as a delimiter of any sort
  private bufferContentThatCanNeverServeAsDelimiter(): void {
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
      this.buffer(CONTENT_WITH_NO_SPECIAL_MEANING)
    } while (
      // Next, if we can try to buffer whitespace...
      canTryToBufferWhitespace
      // ... then let's try! If we succeed, then we'll try to skip more non-whitespace characters. Otherwise,
      // we've got to bail, because the current character can't be skipped.     
      && this.tryToBufferWhitespaceGuaranteedToBeRegularContent())
  }

  // This method exists purely for optimization.
  //
  // In writing, spaces delimits words. Those spaces are meaningful to the author, but to our tokenizer,
  // those spaces are just regular content.
  //
  // However, not all whitespace represents regular content! For example, the (optional) whitespace between a
  // link's bracketed content and its bracketed URL doesn't actually represent any content:
  //
  //   You should try [Typescript] (http://www.typescriptlang.org).
  //
  // Same with the whitespace before a footnote.
  //
  // This method will buffer any regular whitespace content.
  //
  // Any special whitespace is left behind to be consumed by the appropriate convention, where it can have
  // special meaning. Please see the `getLinkUrlConventions` method for more information.
  private tryToBufferWhitespaceGuaranteedToBeRegularContent(): boolean {
    // As it turns out, special whitespace is always followed by an open bracket!
    //
    // That makes our job easy.
    //
    // Note: To avoid catastrophic slowdown, we don't use a single regular expression for this. For more
    // information, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016

    const remainingMarkup = this.markupConsumer.remaining
    const matchResult = LEADING_WHITESPACE.exec(remainingMarkup)

    if (!matchResult) {
      return false
    }

    const [leadingWhitespace] = matchResult

    const charFollowingLeadingWhitespace =
      remainingMarkup[leadingWhitespace.length]

    if (NORMAL_OPEN_BRACKET_PATTERN.test(charFollowingLeadingWhitespace)) {
      // Uh-oh. That whitespace might be special. Let's bail!
      return false
    }

    // Phew! Now we know that the leading whitespace is just regular content!

    // Let's buffer it and consume it.
    this.bufferedContent += leadingWhitespace
    this.markupConsumer.index += leadingWhitespace.length

    return true
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
      this.flushNonEmptyBufferToToken(convention.beforeClosingItFlushesNonEmptyBufferTo)
    }

    if (convention.beforeClosingItAlwaysFlushesBufferTo != null) {
      this.flushBufferToToken(convention.beforeClosingItAlwaysFlushesBufferTo)
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
      if (openContexts[i].convention === this.bareUrlPathConvention) {
        this.appendBufferedUrlPathToCurrentBareUrl()

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

    const startToken = new Token(richConvention.startTokenRole)
    const endToken = new Token(richConvention.endTokenRole)
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

      // If the current token has a `correspondingEnclosingToken`, it must be an end token. It cannot be a start
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
        token.correspondingEnclosingToken != null

      // We should insert our new end token before the current end token if...
      const shouldEndTokenAppearBeforeCurrentToken =
        // ...the current token is actually a rich convention's end token...
        isCurrentTokenAnEndToken
        // ...and our start token (that we just added) is inside the current end token's convention. 
        && startTokenIndex > this.tokens.indexOf(token.correspondingEnclosingToken)

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
            this.bufferedContent += delimiter
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
        this.bufferedContent +=
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
        this.bufferedContent += '±'
      }
    })
  }

  private tryToTokenizeEllipsis(): boolean {
    return this.markupConsumer.consume({
      pattern: ELLIPSIS_PATTERN,
      thenBeforeConsumingText: () => {
        this.bufferedContent += this.config.ellipsis
      }
    })
  }

  private appendToken(token: Token): void {
    this.tokens.push(token)
    this.mostRecentToken = token
  }

  private addCurrentCharOrStreakOfWhitespaceToContentBuffer(): void {
    // Due to Up's syntax, if a given whitespace character isn't part of a delimiter, then we
    // can guarantee the same is true for all consecutive whitespace characters. They're all
    // just regular content.
    //
    // As an optimization, if we're adding a whitespace character to our content buffer, we'll go
    // ahead and add any consecutive whitespace characters to our content buffer, too.
    //
    // For more information, see `bufferContentThatCanNeverServeAsDelimiter`.
    if (WHITESPACE_CHAR_PATTERN.test(this.markupConsumer.currentChar)) {
      this.buffer(LEADING_WHITESPACE)
    } else {
      this.addCurrentCharToContentBuffer()
    }
  }

  private buffer(pattern: RegExp): void {
    this.markupConsumer.consume({
      pattern,
      thenBeforeConsumingText: match => {
        this.bufferedContent += match
      }
    })
  }

  private addCurrentCharToContentBuffer(): void {
    this.bufferedContent += this.markupConsumer.currentChar
    this.markupConsumer.index += 1
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
      bufferedContent: this.bufferedContent
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

  private isDirectlyFollowing(tokenRoles: TokenRole[]): boolean {
    return (
      !this.bufferedContent
      && this.mostRecentToken
      && tokenRoles.some(tokenRole => this.mostRecentToken.role === tokenRole))
  }

  private backtrackToBeforeContext(context: ConventionContext): void {
    this.failedConventionTracker.registerFailure(context)

    const { snapshot } = context

    this.tokens = snapshot.tokens
    this.bufferedContent = snapshot.bufferedContent
    this.markupConsumer.index = snapshot.markupIndex
    this.openContexts = snapshot.openContexts
    this.inflectionHandlers = snapshot.inflectionHandlers
  }

  private appendNewToken(role: TokenRole, value?: string): void {
    this.appendToken(new Token(role, value))
  }

  private appendBufferedUrlPathToCurrentBareUrl(): void {
    if (this.mostRecentToken.role !== TokenRole.BareUrl) {
      throw new Error('Most recent token is not a bare URL token')
    }

    this.mostRecentToken.value += this.flushBufferedContent()
  }

  private flushBufferedContent(): string {
    const buffer = this.bufferedContent
    this.bufferedContent = ''

    return buffer
  }

  private flushNonEmptyBufferToToken(role: TokenRole): void {
    if (this.bufferedContent) {
      this.appendNewToken(role, this.flushBufferedContent())
    }
  }

  private flushBufferToToken(role: TokenRole): void {
    this.appendNewToken(role, this.flushBufferedContent())
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
    this.flushNonEmptyBufferToToken(TokenRole.PlainText)
  }

  private handleTextAwareOfRawBrackets(): void {
    this.tryToOpenRawParentheticalBracketConvention() || this.addCurrentCharOrStreakOfWhitespaceToContentBuffer()
  }

  private handleTextAwareOfTypographyAndRawParentheticalBrackets(): void {
    this.tryToOpenRawParentheticalBracketConvention()
      || this.tryToTokenizeTypographicalConvention()
      || this.addCurrentCharOrStreakOfWhitespaceToContentBuffer()
  }

  private tryToOpenRawParentheticalBracketConvention(): boolean {
    return this.rawParentheticalBracketConventions.some(convention => this.tryToOpen(convention))
  }
}


function labeledBracketStartDelimiter(term: Config.Terms.FoundInMarkup, bracket: Bracket): string {
  return bracket.startPattern + either(...term.map(escapeForRegex)) + ':' + ANY_WHITESPACE
}

function startDelimiterNotFollowedByEndDelimiter(startDelimiter: string, endDelimiter: string): string {
  return startDelimiter + notFollowedBy(ANY_WHITESPACE + endDelimiter)
}


const NOT_FOLLOWED_BY_WHITESPACE =
  notFollowedBy(WHITESPACE_CHAR)


const PERIOD =
  escapeForRegex('.')

const HYPHEN =
  escapeForRegex('-')

const PLUS_SIGN =
  escapeForRegex('+')


const ELLIPSIS_PATTERN =
  patternStartingWith(multiple(PERIOD))

const EN_OR_EM_DASH_PATTERN =
  patternStartingWith(multiple(HYPHEN))

const PLUS_MINUS_SIGN_PATTERN =
  patternStartingWith(PLUS_SIGN + HYPHEN)


// Our URL patterns (and associated string constants) are used to determine whether text was
// likely intended to be a URL.
//
// We aren't in the business of exhaustively excluding every invalid URL. Instead, we simply
// want to avoid surprising the author by producing a link when they probably didn't intend
// to produce one.


const URL_SUBDOMAIN =
  anyCharMatching(LETTER_CLASS, DIGIT)
  + everyOptional(anyCharMatching(LETTER_CLASS, DIGIT, HYPHEN))
  + PERIOD

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

const BARE_URL_SCHEME =
  'http' + optional('s') + '://'

const BARE_URL_SCHEME_AND_HOSTNAME =
  patternStartingWith(
    BARE_URL_SCHEME
    + everyOptional(URL_SUBDOMAIN) + URL_TOP_LEVEL_DOMAIN)


// The patterns below exist purely for optimization.
//
// For more information, see the `bufferContentThatCanNeverServeAsDelimiter` method.

const NORMAL_OPEN_BRACKET_PATTERN =
  patternStartingWith(
    anyCharMatching(
      ...NORMAL_BRACKETS.map(bracket => bracket.startPattern)))

const ALL_BRACKETS =
  [PARENTHESIS, SQUARE_BRACKET, CURLY_BRACKET]

const OPEN_BRACKET_PATTERNS =
  ALL_BRACKETS.map(bracket => bracket.startPattern)

const CLOSE_BRACKET_PATTERNS =
  ALL_BRACKETS.map(bracket => bracket.endPattern)

const CHARACTERS_WITH_POTENTIAL_SPECIAL_MEANING = [
  // The "h" is for the start of bare URLs. 
  WHITESPACE_CHAR, FORWARD_SLASH, HYPHEN, PERIOD, PLUS_SIGN, 'h', '"', '_', '`',
  ...OPEN_BRACKET_PATTERNS,
  ...CLOSE_BRACKET_PATTERNS,
  ...[BACKSLASH, '*'].map(escapeForRegex)
]

const CONTENT_WITH_NO_SPECIAL_MEANING =
  patternStartingWith(
    oneOrMore(
      either(
        anyCharNotMatching(...CHARACTERS_WITH_POTENTIAL_SPECIAL_MEANING),
        // An "h" only has special role if it's the start of a bare URL scheme.
        'h' + notFollowedBy('ttp' + optional('s') + '://'),
        // Multiple periods produce ellipses, but single periods have no special role.
        PERIOD + notFollowedBy(PERIOD),
        // Multiple hyphens produce en/em dashes, but single hyphens have no special role.
        HYPHEN + notFollowedBy(HYPHEN),
        // A plus sign followed by a minus sign produces a plus-minus sign, but otherwise, plus
        // signs don't have any special role.
        PLUS_SIGN + notFollowedBy(HYPHEN)
      )))

const LEADING_WHITESPACE =
  patternStartingWith(SOME_WHITESPACE)
