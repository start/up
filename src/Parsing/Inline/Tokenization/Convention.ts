import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './TextConsumer'
import { TokenKind } from './TokenKind'
import { patternStartingWith, patternIgnoringCapitalizationAndStartingWith } from '../../PatternHelpers'


export class Convention {
  canOnlyOpenIfDirectlyFollowing: TokenKind[]
  startsWith: RegExp
  endsWith: RegExp
  isCutShortByWhitespace: boolean
  canConsistSolelyOfWhitespace: boolean
  flushesBufferToPlainTextTokenBeforeOpening: boolean
  whenOpening: OnTextMatch
  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningNormalConventionsWhileOpen: OnConventionEvent
  failsIfWhitespaceIsEnounteredBeforeClosing: boolean
  beforeClosingItFlushesNonEmptyBufferTo: TokenKind
  beforeClosingItAlwaysFlushesBufferTo: TokenKind
  whenClosingItAlsoClosesInnerConventions: boolean
  mustBeDirectlyFollowedBy: Convention[]
  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent

  constructor(
    args: {
      canOnlyOpenIfDirectlyFollowing?: TokenKind[]
      startsWith: string
      startPatternContainsATerm?: boolean
      endsWith?: string
      isCutShortByWhitespace?: boolean
      canConsistSolelyOfWhitespace?: boolean
      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken?: boolean
      whenOpening?: OnTextMatch
      insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
      insteadOfOpeningNormalConventionsWhileOpen?: OnConventionEvent
      failsIfWhitespaceIsEnounteredBeforeClosing?: boolean
      beforeClosingItAlwaysFlushesBufferTo?: TokenKind
      beforeClosingItFlushesNonEmptyBufferTo?: TokenKind
      whenClosingItAlsoClosesInnerConventions?: boolean
      mustBeDirectlyFollowedBy?: Convention[]
      whenClosing?: OnConventionEvent
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
    }
  ) {
    this.canOnlyOpenIfDirectlyFollowing = args.canOnlyOpenIfDirectlyFollowing

    const { startsWith, endsWith } = args

    this.startsWith =
      args.startPatternContainsATerm
        ? patternIgnoringCapitalizationAndStartingWith(startsWith)
        : patternStartingWith(startsWith)

    if (endsWith) {
      this.endsWith = patternStartingWith(endsWith)
    }

    this.isCutShortByWhitespace = args.isCutShortByWhitespace
    this.canConsistSolelyOfWhitespace = args.canConsistSolelyOfWhitespace
    this.flushesBufferToPlainTextTokenBeforeOpening = args.beforeOpeningItFlushesNonEmptyBufferToPlainTextToken
    this.whenOpening = args.whenOpening
    this.insteadOfClosingOuterConventionsWhileOpen = args.insteadOfClosingOuterConventionsWhileOpen
    this.insteadOfOpeningNormalConventionsWhileOpen = args.insteadOfOpeningNormalConventionsWhileOpen
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
