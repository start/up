import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnMatch } from './OnMatch'
import { TokenKind } from './TokenKind'


export interface TokenizableConvention {
  onlyOpenIfDirectlyFollowingTokenOfKind?: TokenKind[]
  onlyOpenIfFollowingNonWhitespace?: boolean
  onlyOpenIfPrecedingNonWhitespace?: boolean

  startPattern: RegExp
  endPattern: RegExp
  
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  
  onOpen?: OnMatch
  
  insteadOfTryingToCloseOuterContexts?: PerformConventionSpecificTasks
  insteadOfTryingToOpenUsualConventions?: PerformConventionSpecificTasks
  
  leaveEndPatternForAnotherConventionToConsume?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFailIfCannotTranformInto?: TokenizableConvention[]
  onCloseFlushBufferTo?: TokenKind
  
  onClose?: OnConventionEvent
  resolveWhenLeftUnclosed?: OnConventionEvent
}


interface PerformConventionSpecificTasks {
  (): void
}

interface OnConventionEvent {
  (context: TokenizerContext): void
}
