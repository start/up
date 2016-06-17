import { TokenizerSnapshot } from './TokenizerSnapshot'
import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'


export interface TokenizableConvention {
  onlyOpenIfDirectlyFollowingTokenOfKind?: TokenKind[]

  startPattern: RegExp
  endPattern: RegExp
  
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  
  onOpen?: OnTextMatch
  
  insteadOfTryingToCloseOuterContexts?: OnConventionEvent
  insteadOfTryingToOpenUsualConventions?: OnConventionEvent
  
  leaveEndPatternForAnotherConventionToConsume?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFailIfCannotTranformInto?: TokenizableConvention[]
  onCloseFlushBufferTo?: TokenKind
  
  onClose?: OnConventionEvent
  resolveWhenLeftUnclosed?: OnConventionEvent
}


interface OnConventionEvent {
  (context: ConventionContext): void
}
