import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './TextConsumer'
import { TokenRole } from '../TokenRole'
import { patternStartingWith, patternIgnoringCapitalizationAndStartingWith } from '../../../PatternHelpers'


// Represents the rules for a single variation of an inline convention (e.g. an inline spoiler
// wrapped in square brackets).  
export class Rules {
  startsWith: RegExp
  endsWith: RegExp
  canOnlyOpenIfDirectlyFollowing: TokenRole[]
  isCutShortByWhitespace: boolean
  canConsistSolelyOfWhitespace: boolean
  flushesBufferToTextTokenBeforeOpening: boolean
  whenOpening: OnTextMatch
  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen: OnConventionEvent
  failsIfWhitespaceIsEnounteredBeforeClosing: boolean
  beforeClosingItFlushesNonEmptyBufferTo: TokenRole
  beforeClosingItAlwaysFlushesBufferTo: TokenRole
  whenClosingItAlsoClosesInnerConventions: boolean
  mustBeDirectlyFollowedBy: Rules[]
  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent
  parsedContentIsEnclosedByText: TextThatEnclosesParsedContent

  constructor(
    args: {
      startsWith: string
      endsWith?: string
      startPatternContainsATerm?: boolean
      canOnlyOpenIfDirectlyFollowing?: TokenRole[]
      isCutShortByWhitespace?: boolean
      canConsistSolelyOfWhitespace?: boolean
      beforeOpeningItFlushesNonEmptyBufferToTextToken?: boolean
      whenOpening?: OnTextMatch
      insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
      insteadOfOpeningRegularConventionsWhileOpen?: OnConventionEvent
      failsIfWhitespaceIsEnounteredBeforeClosing?: boolean
      beforeClosingItAlwaysFlushesBufferTo?: TokenRole
      beforeClosingItFlushesNonEmptyBufferTo?: TokenRole
      whenClosingItAlsoClosesInnerConventions?: boolean
      mustBeDirectlyFollowedBy?: Rules[]
      whenClosing?: OnConventionEvent
      insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
      parsedContentIsEnclosedByText?: TextThatEnclosesParsedContent
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
    this.flushesBufferToTextTokenBeforeOpening = args.beforeOpeningItFlushesNonEmptyBufferToTextToken
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
    this.parsedContentIsEnclosedByText = args.parsedContentIsEnclosedByText
  }
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}

export interface TextThatEnclosesParsedContent {
  atStart: string
  atEnd: string
}