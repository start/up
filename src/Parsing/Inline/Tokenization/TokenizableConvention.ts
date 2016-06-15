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
  
  insteadOfTryingToCloseOuterContexts?: PerformConventionSpecificTasks
  insteadOfTryingToOpenUsualConventions?: PerformConventionSpecificTasks
  
  leaveEndPatternForAnotherConventionToConsume?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFailIfCannotTranformInto?: TokenizableConvention[]
  onCloseFlushBufferTo?: TokenKind
  
  onClose?: OnConventionClosingEvent
  resolveWhenLeftUnclosed?: OnConventionClosingEvent
}


interface PerformConventionSpecificTasks {
  (): void
}

export interface OnConventionClosingEvent {
  (context: ConventionContext): void
}
