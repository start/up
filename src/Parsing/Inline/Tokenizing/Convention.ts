import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './TextConsumer'
import { TokenRole } from '../TokenRole'
import { patternStartingWith, patternIgnoringCapitalizationAndStartingWith } from '../../../PatternHelpers'


// Represents the rules for a single inline convention (e.g. an inline spoiler wrapped in square brackets).  
export class Convention {
  startsWith: RegExp
  endsWith: RegExp
  canOnlyOpenIfDirectlyFollowing: TokenRole[]
  isCutShortByWhitespace: boolean
  canConsistSolelyOfWhitespace: boolean
  flushesBufferToPlainTextTokenBeforeOpening: boolean
  whenOpening: OnTextMatch
  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen: OnConventionEvent
  failsIfWhitespaceIsEnounteredBeforeClosing: boolean
  beforeClosingItFlushesNonEmptyBufferTo: TokenRole
  beforeClosingItAlwaysFlushesBufferTo: TokenRole
  whenClosingItAlsoClosesInnerConventions: boolean
  mustBeDirectlyFollowedBy: Convention[]
  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent

  constructor(
    args: {
      startsWith: string
      endsWith?: string
      startPatternContainsATerm?: boolean
      canOnlyOpenIfDirectlyFollowing?: TokenRole[]
      isCutShortByWhitespace?: boolean
      canConsistSolelyOfWhitespace?: boolean
      beforeOpeningItFlushesNonEmptyBufferToPlainTextToken?: boolean
      whenOpening?: OnTextMatch
      insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
      insteadOfOpeningRegularConventionsWhileOpen?: OnConventionEvent
      failsIfWhitespaceIsEnounteredBeforeClosing?: boolean
      beforeClosingItAlwaysFlushesBufferTo?: TokenRole
      beforeClosingItFlushesNonEmptyBufferTo?: TokenRole
      whenClosingItAlsoClosesInnerConventions?: boolean
      mustBeDirectlyFollowedBy?: Convention[]
      whenClosing?: OnConventionEvent
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
    }
  ) {
    const { startsWith, endsWith } = args

    this.startsWith =
      args.startPatternContainsATerm
        ? patternIgnoringCapitalizationAndStartingWith(startsWith)
        : patternStartingWith(startsWith)

    if (endsWith) {
      this.endsWith = patternStartingWith(endsWith)
    }

    this.canOnlyOpenIfDirectlyFollowing = args.canOnlyOpenIfDirectlyFollowing
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
