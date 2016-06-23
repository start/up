import { TokenizerSnapshot } from './TokenizerSnapshot'
import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'


export interface TokenizableConvention {
  onlyOpenIfDirectlyFollowing?: RichConvention[]

  startPattern: RegExp
  endPattern: RegExp
  
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  
  onOpen?: OnTextMatch
  
  insteadOfTryingToCloseOuterContexts?: OnConventionEvent
  insteadOfTryingToOpenUsualConventions?: OnConventionEvent

  failIfWhitespaceIsEnounteredBeforeClosing?: boolean
  
  leaveEndPatternForAnotherConventionToConsume?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFailIfCannotTranformInto?: TokenizableConvention[]
  onCloseFlushBufferTo?: TokenKind
  
  onClose?: OnConventionEvent
  resolveWhenLeftUnclosed?: OnConventionEvent
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}
