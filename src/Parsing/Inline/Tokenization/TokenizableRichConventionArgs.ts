import { RichConvention } from './RichConvention'
import { OnTextMatch } from './TextConsumer'
import { Convention, OnConventionEvent } from './Convention'


export interface TokenizableRichConventionArgs {
  richConvention: RichConvention
  startsWith: string
  endsWith: string
  startPatternContainsATerm?: boolean
  whenOpening?: OnTextMatch
  isMeaningfulWhenItContainsOnlyWhitespace?: boolean
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent
  whenClosing?: OnConventionEvent
  mustBeDirectlyFollowedBy?: Convention[]
}
