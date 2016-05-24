import { OnTokenizerMatch } from './OnTokenizerMatch'

export interface TokenizerBehavior {
  onOpen: OnTokenizerMatch,
  onClose: OnTokenizerMatch,
  canBeClosedByEndOfText: boolean
}