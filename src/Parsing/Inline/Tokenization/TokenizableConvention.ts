import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './InlineTextConsumer'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'
import { regExpStartingWith } from '../../PatternHelpers'


export interface TokenizableConventionArgs {
  onlyOpenIfDirectlyFollowing?: TokenKind[]

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
  onlyOpenIfDirectlyFollowing: TokenKind[] | undefined

  startsWith: RegExp
  endsWith: RegExp | undefined

  isCutShortByWhitespace: boolean | undefined
  canConsistSolelyOfWhitespace: boolean | undefined

  flushesBufferToPlainTextTokenBeforeOpening: boolean | undefined
  whenOpening: OnTextMatch | undefined

  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent | undefined
  insteadOfOpeningRegularConventionsWhileOpen: OnConventionEvent | undefined

  failsIfWhitespaceIsEnounteredBeforeClosing: boolean | undefined

  beforeClosingItFlushesNonEmptyBufferTo: TokenKind | undefined
  beforeClosingItAlwaysFlushesBufferTo: TokenKind | undefined
  whenClosingItAlsoClosesInnerConventions: boolean | undefined
  mustBeDirectlyFollowedBy: TokenizableConvention[] | undefined

  whenClosing: OnConventionEvent | undefined
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent | undefined

  constructor(args: TokenizableConventionArgs) {
    const { endsWith, onlyOpenIfDirectlyFollowing } = args

    this.onlyOpenIfDirectlyFollowing = args.onlyOpenIfDirectlyFollowing

    this.startsWith = regExpStartingWith(args.startsWith, args.startPatternContainsATerm)
    
    if (endsWith) {
      this.endsWith = regExpStartingWith(endsWith)
    }

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