import { TokenizerContext } from './TokenizerContext'


export interface OnConventionEvent {
  (context: TokenizerContext): void
}