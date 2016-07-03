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
  failsIfItCannotTransform: boolean  
  whenClosingItFlushesBufferTo: TokenKind
  afterClosingItCanTransformInto: TokenizableConvention[]

  whenClosing: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed: OnConventionEvent

  constructor(args: TokenizableConventionArgs) {
    this.onlyOpenIfDirectlyFollowing = args.onlyOpenIfDirectlyFollowing

    this.startsWith = regExpStartingWith(args.startsWith, args.startPatternContainsATerm)
    this.endsWith = regExpStartingWith(args.endsWith)
    this.isCutShortByWhitespace = args.isCutShortByWhitespace

    this.flushesBufferToPlainTextTokenBeforeOpening = args.flushesBufferToPlainTextTokenBeforeOpening

    this.whenOpening = args.whenOpening

    this.insteadOfClosingOuterConventionsWhileOpen = args.insteadOfClosingOuterConventionsWhileOpen
    this.insteadOfOpeningUsualConventionsWhileOpen = args.insteadOfOpeningUsualConventionsWhileOpen

    this.failsIfWhitespaceIsEnounteredBeforeClosing = args.failsIfWhitespaceIsEnounteredBeforeClosing

    this.whenClosingItAlsoClosesInnerConventions = args.whenClosingItAlsoClosesInnerConventions
    this.afterClosingItCanTransformInto = args.afterClosingItCanTransformInto || []
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
  failsIfItCannotTransform?: boolean
  whenClosingItFlushesBufferTo?: TokenKind
  afterClosingItCanTransformInto?: TokenizableConvention[]

  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}
