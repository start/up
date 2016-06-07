import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { OnConventionClose } from './OnConventionClose'
import { TokenizerContext } from './TokenizerContext'
import { OnMatch } from './OnMatch'
import { TokenKind } from './TokenKind'

export interface TokenizableConvention {
  goal: TokenizerGoal
  startPattern: RegExp
  endPattern: RegExp
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  onOpen?: OnMatch
  beforeTryingToCloseOuterContexts?: PerformContextSpecificTasks
  afterTryingToCloseOuterContexts?: PerformContextSpecificTasks
  doNotConsumeEndPattern?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFlushBufferTo?: TokenKind
  onClose?: OnConventionClose
  resolveWhenUnclosed?: ResolveUnclosedConvention
}

interface ResolveUnclosedConvention {
  (context: TokenizerContext): boolean
}

interface PerformContextSpecificTasks {
  (): boolean
}