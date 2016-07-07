import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'
import { regExpStartingWith } from '../../PatternHelpers'


export interface TokenizableConventionArgs {
  onlyOpenIfDirectlyFollowing?: RichConvention[] | TokenKind[]

  startsWith: string
  startPatternContainsATerm?: boolean
  endsWith?: string

  isCutShortByWhitespace?: boolean

  beforeOpeningItFlushesNonEmptyBufferToPlainTextToken?: boolean
  whenOpening?: OnTextMatch
  afterOpeningIgnoreAnyLeadingWhitespace?: boolean

  insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen?: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean

  whenClosingItAlsoClosesInnerConventions?: boolean
  mustBeDirectlyFollowedBy?: TokenizableConvention[]
  beforeClosingItFlushesNonEmptyBufferTo?: TokenKind
  beforeClosingItAlwaysFlushesBufferTo?: TokenKind

  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export class TokenizableConvention {
  onlyOpenIfDirectlyFollowing: TokenKind[]

  startsWith: RegExp
  endsWith: RegExp

  isCutShortByWhitespace: boolean

  flushesBufferToPlainTextTokenBeforeOpening: boolean
  whenOpening: OnTextMatch
  afterOpeningIgnoreAnyLeadingWhitespace: boolean

  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing: boolean

  whenClosingItAlsoClosesInnerConventions: boolean
  mustBeDirectlyFollowedBy: TokenizableConvention[]
  beforeClosingItFlushesNonEmptyBufferTo: TokenKind
  beforeClosingItAlwaysFlushesBufferTo: TokenKind

  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent

  constructor(args: TokenizableConventionArgs) {
    const { onlyOpenIfDirectlyFollowing } = args

    this.onlyOpenIfDirectlyFollowing =  
      isAnArrayOfRichConventions(onlyOpenIfDirectlyFollowing)
        ? onlyOpenIfDirectlyFollowing.map(richConvention => richConvention.endTokenKind)
        : onlyOpenIfDirectlyFollowing

    this.startsWith = regExpStartingWith(args.startsWith, args.startPatternContainsATerm)
    this.endsWith = regExpStartingWith(args.endsWith)
    
    this.isCutShortByWhitespace = args.isCutShortByWhitespace

    this.flushesBufferToPlainTextTokenBeforeOpening = args.beforeOpeningItFlushesNonEmptyBufferToPlainTextToken
    this.whenOpening = args.whenOpening
    this.afterOpeningIgnoreAnyLeadingWhitespace = args.afterOpeningIgnoreAnyLeadingWhitespace

    this.insteadOfClosingOuterConventionsWhileOpen = args.insteadOfClosingOuterConventionsWhileOpen
    this.insteadOfOpeningRegularConventionsWhileOpen = args.insteadOfOpeningRegularConventionsWhileOpen

    this.failsIfWhitespaceIsEnounteredBeforeClosing = args.failsIfWhitespaceIsEnounteredBeforeClosing

    this.whenClosingItAlsoClosesInnerConventions = args.whenClosingItAlsoClosesInnerConventions
    this.mustBeDirectlyFollowedBy = args.mustBeDirectlyFollowedBy
    this.beforeClosingItFlushesNonEmptyBufferTo = args.beforeClosingItFlushesNonEmptyBufferTo
    this.beforeClosingItAlwaysFlushesBufferTo = args.beforeClosingItAlwaysFlushesBufferTo

    this.whenClosing = args.whenClosing
    this.insteadOfFailingWhenLeftUnclosed = args.insteadOfFailingWhenLeftUnclosed
  }
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}


function isAnArrayOfRichConventions(items: any): items is RichConvention[] {
  return items && items.length && (items[0].endTokenKind != null)
}