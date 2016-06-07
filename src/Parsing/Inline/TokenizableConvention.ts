import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnTokenizerContextClose } from './OnTokenizerContextClose'
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
  onClose?: OnTokenizerContextClose
}