export interface OnMatch {
  (
    match: string,
    isMatchTouchingWordStart: boolean,
    ...captures: string[]
  ): void
}
