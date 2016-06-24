import { TokenizerSnapshot } from './TokenizerSnapshot'
import { ConventionContext } from './ConventionContext'
import { OnTextMatch } from './OnTextMatch'
import { TokenKind } from './TokenKind'
import { RichConvention } from '../RichConvention'


export interface TokenizableConvention {
  onlyOpenIfDirectlyFollowing?: RichConvention[]

  startPattern: RegExp
  endPattern?: RegExp

  isCutShortByWhitespace?: boolean
  
  flushesBufferToPlainTextTokenBeforeOpening?: boolean
  
  whenOpening?: OnTextMatch
  
  insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
  insteadOfOpeningUsualConventionsWhileOpen?: OnConventionEvent

  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean
  
  whenClosingItAlsoClosesInnerConventions?: boolean
  whenClosingItFailsIfItCannotTranformInto?: TokenizableConvention[]
  whenClosingItFlushesBufferTo?: TokenKind
  
  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
}


export interface OnConventionEvent {
  (context: ConventionContext): void
}
