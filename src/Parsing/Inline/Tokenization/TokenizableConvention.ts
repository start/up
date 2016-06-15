import { TokenizerSnapshot } from './TokenizerSnapshot'
import { TokenizerContext } from './TokenizerContext'
import { OnConventionEvent } from './OnConventionEvent'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'


export interface TokenizableConvention {
  onlyOpenIfDirectlyFollowingTokenOfKind?: TokenKind[]

  startPattern: RegExp
  endPattern: RegExp
  
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  
  onOpen?: OnTextMatch
  
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
