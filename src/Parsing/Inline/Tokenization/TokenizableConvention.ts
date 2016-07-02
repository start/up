import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'
import { regExpStartingWith } from '../../PatternHelpers'



export class TokenizableConvention {
  onlyOpenIfDirectlyFollowing: RichConvention[]

  startsWith: RegExp
  endsWith: RegExp
  isCutShortByWhitespace: boolean

  flushesBufferToPlainTextTokenBeforeOpening: boolean

  whenOpening: OnTextMatch

  insteadOfClosingOuterConventionsWhileOpen: OnConventionEvent
  insteadOfOpeningUsualConventionsWhileOpen: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing: boolean

  whenClosingItAlsoClosesInnerConventions: boolean
  whenClosingItFailsIfItCannotTranformInto: TokenizableConvention[]
  whenClosingItFlushesBufferTo: TokenKind

  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent

  constructor(args: TokenizableConventionArgs) {
    this.onlyOpenIfDirectlyFollowing = args.onlyOpenIfDirectlyFollowing

    // Some of our conventions use a localized term in their start pattern, and we want those
    // terms to be case-insensitive. No other start or end patterns need to be case-insensitive.
    this.startsWith = regExpStartingWith(args.startsWith, (args.startPatternContainsATerm ? 'i' : undefined))

    this.endsWith = regExpStartingWith(args.endsWith)
    this.isCutShortByWhitespace = args.isCutShortByWhitespace

    this.flushesBufferToPlainTextTokenBeforeOpening = args.flushesBufferToPlainTextTokenBeforeOpening

    this.whenOpening = args.whenOpening

    this.insteadOfClosingOuterConventionsWhileOpen = args.insteadOfClosingOuterConventionsWhileOpen
    this.insteadOfOpeningUsualConventionsWhileOpen = args.insteadOfOpeningUsualConventionsWhileOpen

    this.failsIfWhitespaceIsEnounteredBeforeClosing = args.failsIfWhitespaceIsEnounteredBeforeClosing

    this.whenClosingItAlsoClosesInnerConventions = args.whenClosingItAlsoClosesInnerConventions
    this.whenClosingItFailsIfItCannotTranformInto = args.whenClosingItFailsIfItCannotTranformInto
    this.whenClosingItFlushesBufferTo = args.whenClosingItFlushesBufferTo

    this.whenClosing = args.whenClosing
    this.insteadOfFailingWhenLeftUnclosed = args.insteadOfFailingWhenLeftUnclosed
  }
}


export interface TokenizableConventionArgs {
  onlyOpenIfDirectlyFollowing?: RichConvention[]

  startsWith: string
  startPatternContainsATerm?: boolean
  endsWith?: string

  isCutShortByWhitespace?: boolean

  flushesBufferToPlainTextTokenBeforeOpening?: boolean

  whenOpening?: OnTextMatch

  insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
  insteadOfOpeningUsualConventionsWhileOpen?: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean

  whenClosingItAlsoClosesInnerConventions?: boolean
  whenClosingItFailsIfItCannotTranformInto?: TokenizableConvention[]
  whenClosingItFlushesBufferTo?: TokenKind

  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}
