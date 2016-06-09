import { TokenizerSnapshot } from './TokenizerSnapshot'
import { OnConventionClose } from './OnConventionClose'
import { TokenizerContext } from './TokenizerContext'
import { OnMatch } from './OnMatch'
import { TokenKind } from './TokenKind'

export interface TokenizableConvention {
  onlyOpenIf?: () => boolean

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
  
  onClose?: OnConventionClose

  resolveWhenLeftUnclosed?: (context: TokenizerContext) => void
}


interface PerformConventionSpecificTasks {
  (): void
}