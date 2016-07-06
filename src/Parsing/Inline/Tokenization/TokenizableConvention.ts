import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'
import { regExpStartingWith } from '../../PatternHelpers'



export class TokenizableConvention {
  onlyOpenIfDirectlyFollowing: TokenKind[]

  startsWith: RegExp
  endsWith: RegExp
  isCutShortByWhitespace: boolean

  flushesBufferToPlainTextTokenBeforeOpening: boolean

  whenOpening: OnTextMatch

  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing: boolean

  whenClosingItAlsoClosesInnerConventions: boolean
  mustBeDirectlyFollowedBy: TokenizableConvention[]
  whenClosingItFlushesBufferTo: TokenKind

  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent

  constructor(args: TokenizableConventionArgs) {
    const { onlyOpenIfDirectlyFollowing } = args

    this.onlyOpenIfDirectlyFollowing = (  
      areRichConventions(onlyOpenIfDirectlyFollowing)
        ? onlyOpenIfDirectlyFollowing.map(richConvention => richConvention.endTokenKind)
        : onlyOpenIfDirectlyFollowing
    )

    this.startsWith = regExpStartingWith(args.startsWith, args.startPatternContainsATerm)
    this.endsWith = regExpStartingWith(args.endsWith)
    this.isCutShortByWhitespace = args.isCutShortByWhitespace

    this.flushesBufferToPlainTextTokenBeforeOpening = args.flushesBufferToPlainTextTokenBeforeOpening

    this.whenOpening = args.whenOpening

    this.insteadOfClosingOuterConventionsWhileOpen = args.insteadOfClosingOuterConventionsWhileOpen
    this.insteadOfOpeningRegularConventionsWhileOpen = args.insteadOfOpeningRegularConventionsWhileOpen

    this.failsIfWhitespaceIsEnounteredBeforeClosing = args.failsIfWhitespaceIsEnounteredBeforeClosing

    this.whenClosingItAlsoClosesInnerConventions = args.whenClosingItAlsoClosesInnerConventions
    this.mustBeDirectlyFollowedBy = args.mustBeDirectlyFollowedBy
    this.whenClosingItFlushesBufferTo = args.whenClosingItFlushesBufferTo

    this.whenClosing = args.whenClosing
    this.insteadOfFailingWhenLeftUnclosed = args.insteadOfFailingWhenLeftUnclosed
  }
}


export interface TokenizableConventionArgs {
  onlyOpenIfDirectlyFollowing?: RichConvention[] | TokenKind[]

  startsWith: string
  startPatternContainsATerm?: boolean
  endsWith?: string

  isCutShortByWhitespace?: boolean

  flushesBufferToPlainTextTokenBeforeOpening?: boolean

  whenOpening?: OnTextMatch

  insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen?: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean

  whenClosingItAlsoClosesInnerConventions?: boolean
  mustBeDirectlyFollowedBy?: TokenizableConvention[]
  whenClosingItFlushesBufferTo?: TokenKind

  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}


function areRichConventions(items: any): items is RichConvention[] {
  return items && items.length && (items[0].endTokenKind != null)
}