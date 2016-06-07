import { TokenizerGoal } from './TokenizerGoal'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { PerformContextSpecificTasks } from './PerformContextSpecificTasks'
import { OnTokenizerContextClose } from './OnTokenizerContextClose'
import { TokenKind } from './TokenKind'

export interface TokenizableConvention {
  goal: TokenizerGoal
  beforeTryingToCloseOuterContexts: PerformContextSpecificTasks
  afterTryingToCloseOuterContexts: PerformContextSpecificTasks
  endPattern: RegExp
  doNotConsumeEndPattern: boolean
  closeInnerContextsWhenClosing: boolean
  onCloseFlushBufferTo: TokenKind
  onClose: OnTokenizerContextClose
}