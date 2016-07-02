import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'


export class TokenizableConvention {
  onlyOpenIfDirectlyFollowing: RichConvention[]

  startPattern: RegExp
  endPattern: RegExp
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

    this.startPattern = args.startPattern
    this.endPattern = args.endPattern
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

  startPattern: RegExp
  endPattern?: RegExp

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
