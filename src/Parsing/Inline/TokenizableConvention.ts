import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnConventionClose } from './OnConventionClose'
import { ResolveUnclosedConvention } from './ResolveUnclosedConvention'
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
  whenLeftUnclosed?: ResolveUnclosedConvention
}