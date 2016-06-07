import { TokenizerContext } from './TokenizerContext'

export interface OnTokenizerContextClose {
  (context: TokenizerContext): void
}