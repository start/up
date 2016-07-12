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
  canConsistSolelyOfWhitespace?: boolean

  beforeOpeningItFlushesNonEmptyBufferToPlainTextToken?: boolean
  whenOpening?: OnTextMatch

  insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen?: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean

  beforeClosingItAlwaysFlushesBufferTo?: TokenKind
  beforeClosingItFlushesNonEmptyBufferTo?: TokenKind
  whenClosingItAlsoClosesInnerConventions?: boolean
  mustBeDirectlyFollowedBy?: TokenizableConvention[]

  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export class TokenizableConvention {
  onlyOpenIfDirectlyFollowing: TokenKind[]

  startsWith: RegExp
  endsWith: RegExp

  isCutShortByWhitespace: boolean
  canConsistSolelyOfWhitespace: boolean

  flushesBufferToPlainTextTokenBeforeOpening: boolean
  whenOpening: OnTextMatch

  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing: boolean

  beforeClosingItFlushesNonEmptyBufferTo: TokenKind
  beforeClosingItAlwaysFlushesBufferTo: TokenKind
  whenClosingItAlsoClosesInnerConventions: boolean
  mustBeDirectlyFollowedBy: TokenizableConvention[]

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
    this.canConsistSolelyOfWhitespace = args.canConsistSolelyOfWhitespace

    this.flushesBufferToPlainTextTokenBeforeOpening = args.beforeOpeningItFlushesNonEmptyBufferToPlainTextToken
    this.whenOpening = args.whenOpening

    this.insteadOfClosingOuterConventionsWhileOpen = args.insteadOfClosingOuterConventionsWhileOpen
    this.insteadOfOpeningRegularConventionsWhileOpen = args.insteadOfOpeningRegularConventionsWhileOpen

    this.failsIfWhitespaceIsEnounteredBeforeClosing = args.failsIfWhitespaceIsEnounteredBeforeClosing

    this.beforeClosingItFlushesNonEmptyBufferTo = args.beforeClosingItFlushesNonEmptyBufferTo
    this.beforeClosingItAlwaysFlushesBufferTo = args.beforeClosingItAlwaysFlushesBufferTo
    this.whenClosingItAlsoClosesInnerConventions = args.whenClosingItAlsoClosesInnerConventions
    this.mustBeDirectlyFollowedBy = args.mustBeDirectlyFollowedBy

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