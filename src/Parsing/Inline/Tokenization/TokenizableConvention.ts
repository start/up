import { TokenizerSnapshot } from './TokenizerSnapshot'
import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'


export interface TokenizableConvention {
  onlyOpenIfDirectlyFollowing?: RichConvention[]

  startPattern: RegExp
  endPattern?: RegExp

  isCutShortByWhitespace?: boolean
  
  flushesBufferToPlainTextTokenBeforeOpening?: boolean
  
  onOpen?: OnTextMatch
  
  insteadOfTryingToCloseOuterContexts?: OnConventionEvent
  insteadOfTryingToOpenUsualConventions?: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean
  
  whenItClosesItAlsoClosesInnerConventions?: boolean
  onCloseFailIfCannotTranformInto?: TokenizableConvention[]
  whenItClosesItFlushesBufferTo?: TokenKind
  
  onClose?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}
