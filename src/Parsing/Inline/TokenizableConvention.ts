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
  onlyOpenIf?: ShouldOpenConvention
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  onOpen?: OnMatch
  insteadOfTryingToCloseOuterContexts?: PerformConventionSpecificTasks
  insteadOfOpeningUsualContexts?: PerformConventionSpecificTasks
  doNotConsumeEndPattern?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFlushBufferTo?: TokenKind
  onClose?: OnConventionClose
  resolveWhenUnclosed?: ResolveUnclosedConvention
}

interface ResolveUnclosedConvention {
  (context: TokenizerContext): void
}

interface PerformConventionSpecificTasks {
  (): void
}

interface ShouldOpenConvention {
  (): boolean
}