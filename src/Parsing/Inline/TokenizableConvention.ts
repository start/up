import { TokenizerSnapshot } from './TokenizerSnapshot'
import { OnConventionClose } from './OnConventionClose'
import { TokenizerContext } from './TokenizerContext'
import { OnMatch } from './OnMatch'
import { TokenKind } from './TokenKind'

export interface TokenizableConvention {
  startPattern: RegExp
  endPattern: RegExp
  onlyOpenIf?: ShouldOpenConvention
  flushBufferToPlainTextTokenBeforeOpening?: boolean
  onOpen?: OnMatch
  insteadOfTryingToCloseOuterContexts?: PerformConventionSpecificTasks
  insteadOfTryingToOpenUsualConventions?: PerformConventionSpecificTasks
  doNotConsumeEndPattern?: boolean
  closeInnerContextsWhenClosing?: boolean
  onCloseFlushBufferTo?: TokenKind
  onClose?: OnConventionClose
  resolveWhenLeftUnclosed?: ResolveUnclosedConvention
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