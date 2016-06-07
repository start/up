import { TokenizerContext } from './TokenizerContext'

export interface OnTokenizerContextClose {
  (
    context: TokenizerContext,
    match: string,
    isTouchingWordEnd: boolean,
    isTouchingWordStart: boolean,
    ...captures: string[]
  ): void
}