import { TokenizerContext } from './TokenizerContext'

export interface OnConventionClose {
  (context: TokenizerContext): void
}